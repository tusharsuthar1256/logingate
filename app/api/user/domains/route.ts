import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User.model";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        await dbConnect();
        const clerkUser = await currentUser();
        if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await User.findOne({ clerkId: clerkUser.id });
        return NextResponse.json({
            success: true,
            data: user?.customDomains || []
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const clerkUser = await currentUser();
        if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { domain } = await req.json();
        if (!domain || !domain.includes(".")) {
            return NextResponse.json({ error: "Invalid domain format" }, { status: 400 });
        }

        const cleanDomain = domain.toLowerCase().trim();

        // 1. Update User's personal list in MongoDB
        await User.findOneAndUpdate(
            { clerkId: clerkUser.id },
            { $addToSet: { customDomains: cleanDomain } }
        );

        // 2. Call the deployed API to add to global blacklist
        try {
            const apiBase = process.env.NEXT_API_SUB_DOMAIN;
            if (apiBase) {
                // Ensure we don't have double slashes
                const apiUrl = `${apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase}/api/v1/verify/blacklist`;
                console.log("Calling Backend API:", apiUrl, "with domain:", cleanDomain);

                const res = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ domain: cleanDomain }),
                });

                const resData = await res.json();
                console.log("Backend Response Status:", res.status, resData);
            } else {
                console.warn("NEXT_API_SUB_DOMAIN is not defined in environment");
            }
        } catch (apiErr) {
            console.error("Failed to update deployed blocklist:", apiErr);
            // We still return success because the user's private list was updated in DB
        }

        return NextResponse.json({
            success: true,
            message: "Domain added to blocklist"
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const clerkUser = await currentUser();
        if (!clerkUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { domain } = await req.json();
        if (!domain) {
            return NextResponse.json({ error: "Domain is required" }, { status: 400 });
        }

        const cleanDomain = domain.toLowerCase().trim();

        // Remove from User's personal list in MongoDB
        await User.findOneAndUpdate(
            { clerkId: clerkUser.id },
            { $pull: { customDomains: cleanDomain } }
        );

        return NextResponse.json({
            success: true,
            message: "Domain removed from your blocklist"
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
