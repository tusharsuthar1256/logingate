import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User.model";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        await dbConnect();
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = clerkUser.primaryEmailAddress?.emailAddress;
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                webhookUrl: user.webhookUrl || "",
                webhookEnabled: user.webhookEnabled || false,
                webhookSecret: user.webhookSecret || ""
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { webhookUrl, webhookEnabled } = body;

        const email = clerkUser.primaryEmailAddress?.emailAddress;

        // Generate a secret if not present
        const secret = `mv_wh_sk_${Math.random().toString(36).substring(2, 15)}`;

        const user = await User.findOneAndUpdate(
            { email },
            {
                webhookUrl,
                webhookEnabled,
                $setOnInsert: { webhookSecret: secret }
            },
            { new: true, upsert: true }
        );

        if (!user.webhookSecret) {
            user.webhookSecret = secret;
            await user.save();
        }

        return NextResponse.json({
            success: true,
            message: "Settings updated successfully",
            data: {
                webhookUrl: user.webhookUrl,
                webhookEnabled: user.webhookEnabled,
                webhookSecret: user.webhookSecret
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
