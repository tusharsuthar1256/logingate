import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ApiKey } from "@/model/ApiKey.model";
import ApiLog from "@/model/ApiLog.model";
import { User } from "@/model/User.model";
import { WebhookLog } from "@/model/WebhookLog.model";
import { sendAlertEmail } from "@/lib/mailservice";

export async function POST(req: Request) {
    const start = Date.now();
    try {
        await dbConnect();

        // 1. Verify Authorization Header
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "API Key is missing or incorrectly formatted!" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        // 2. Lookup API Key in Database
        const apiKeyRecord = await ApiKey.findOne({ key: token, status: "active" });
        if (!apiKeyRecord) {
            return NextResponse.json(
                { error: "Invalid or revoked API Key!" },
                { status: 401 }
            );
        }

        // Update last used timestamp (Optional but good for analytics context)
        apiKeyRecord.lastUsedAt = new Date();
        await apiKeyRecord.save();

        // 3. Extract payload
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required to perform verification." },
                { status: 400 }
            );
        }

        // 4. Call the external Express Backend
        // Adjusting localhost:4000 to the running environment
        const apiBase = process.env.NEXT_API_SUB_DOMAIN || "http://localhost:4000/";
        const apiUrl = `${apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase}/api/v1/verify/email`;

        const backendResponse = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await backendResponse.json();
        const durationMs = Date.now() - start;

        let verdict = "allow";
        let riskScore = 0;
        let threatType = "none";

        if (data && data.success && data.data) {
            // Mapping: 100 is Perfect/Safe, 0 is High Risk
            riskScore = data.data.score ?? 100;
            verdict = data.data.verdict || (riskScore < 50 ? "block" : "allow");

            if (!data.data.format_valid) {
                threatType = "Invalid Format";
            } else if (data.data.disposable) {
                threatType = "Disposable Email";
            } else if (!data.data.mx_found) {
                threatType = "MX Record Missing";
            } else if (riskScore < 50) {
                threatType = "High Risk Level";
            }
        }

        // Try to log the data asynchronously so it doesn't block response
        ApiLog.create({
            userId: apiKeyRecord.userId,
            endpoint: "/api/verify-email",
            method: "POST",
            requestPayload: { email },
            responsePayload: data,
            statusCode: backendResponse.status,
            durationMs,
            verdict,
            riskScore,
            threatType
        }).catch(err => console.error("ApiLog error:", err));

        // --- WEBHOOK & EMAIL TRIGGERING ---
        if (verdict === "block" || riskScore < 50) {
            triggerWebhook(apiKeyRecord.userId, {
                event: "fraud.detected",
                email,
                verdict,
                riskScore,
                threatType,
                timestamp: new Date().toISOString()
            }).catch(err => console.error("Webhook trigger failed:", err));

            // Send Security Alert Email if score < 40 (High Risk)
            if (riskScore < 40) {
                User.findOne({ clerkId: apiKeyRecord.userId }).then(user => {
                    if (user && user.email) {
                        sendAlertEmail(user.email, { email, riskScore, threatType });
                    }
                }).catch(err => console.error("Alert email lookup failed:", err));
            }
        }

        // 5. Send back exactly what the Express backend says
        return NextResponse.json(data, {
            status: backendResponse.status,
        });
    } catch (error: any) {
        console.error("Verification proxy error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}

async function triggerWebhook(userId: string, payload: any) {
    try {
        const user = await User.findOne({ clerkId: userId });

        if (!user || !user.webhookUrl || !user.webhookEnabled) return;

        console.log(`Triggering webhook for user ${userId} to ${user.webhookUrl}`);

        const res = await fetch(user.webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-MailVex-Event": payload.event,
                "X-MailVex-Signature": user.webhookSecret || "no-secret"
            },
            body: JSON.stringify(payload),
        });

        const responseText = await res.text();

        // Log the delivery
        await WebhookLog.create({
            userId: userId,
            url: user.webhookUrl,
            event: payload.event,
            payload: payload,
            responseStatus: res.status,
            responseBody: responseText.substring(0, 500),
            status: res.ok ? 'success' : 'failed'
        });

    } catch (error) {
        console.error("Webhook execution error:", error);
    }
}
