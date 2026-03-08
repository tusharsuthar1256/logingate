import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ApiKey } from "@/model/ApiKey.model";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await dbConnect();
        const resolvedParams = await params;
        const { userId } = resolvedParams;

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required to list API keys" },
                { status: 400 }
            );
        }

        const keys = await ApiKey.find({ userId }).select("-__v");

        return NextResponse.json(
            { message: "API Keys retrieved successfully", data: keys },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to retrieve API Keys", details: error.message },
            { status: 500 }
        );
    }
}
