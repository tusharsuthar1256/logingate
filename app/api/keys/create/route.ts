import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ApiKey } from "@/model/ApiKey.model";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { keyName, userId } = body;
        console.log("CREATING KEY FOR USER:", userId);

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required to create an API key" },
                { status: 400 }
            );
        }

        // Generate a secure API Key
        const currentKeys = await ApiKey.countDocuments({ userId });
        if (currentKeys >= 3) {
            return NextResponse.json(
                { error: "Maximum limit of 3 API keys reached for this user." },
                { status: 403 }
            );
        }

        const rawKey = crypto.randomBytes(32).toString("hex");
        const generatedKey = `lg_${rawKey}`;

        const apiKey = await ApiKey.create({
            key: generatedKey,
            name: keyName || "Default API Key",
            userId: userId,
            status: "active",
        });

        return NextResponse.json(
            { message: "API Key created successfully", data: apiKey },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("API KEY CREATE ERROR:", error);
        return NextResponse.json(
            { error: "Failed to create API Key", details: error.message },
            { status: 500 }
        );
    }
}
