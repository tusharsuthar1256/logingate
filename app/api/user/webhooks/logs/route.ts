import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { WebhookLog } from "@/model/WebhookLog.model";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        await dbConnect();
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const logs = await WebhookLog.find({ userId: clerkUser.id })
            .sort({ createdAt: -1 })
            .limit(10);

        return NextResponse.json({
            success: true,
            data: logs
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
