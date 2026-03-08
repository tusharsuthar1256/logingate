import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ApiKey } from "@/model/ApiKey.model";
import ApiLog from "@/model/ApiLog.model";

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
        const backendResponse = await fetch("http://localhost:4000/api/v1/verify/email", {
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
            // Heuristics based on standard verification responses
            riskScore = data.data.risk_score || 0;
            verdict = data.data.verdict || (riskScore > 60 ? "block" : "allow");

            if (!data.data.format_valid) {
                threatType = "Invalid Format";
            } else if (data.data.disposable) {
                threatType = "Disposable Email";
            } else if (!data.data.mx_found) {
                threatType = "MX Record Missing";
            } else if (data.data.dns && !data.data.dns.success) {
                threatType = "DNS Failure";
            } else if (riskScore > 60) {
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
