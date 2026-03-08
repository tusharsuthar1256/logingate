import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ApiKey } from "@/model/ApiKey.model";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // For Next.js App Router dynamic params
) {
    try {
        await dbConnect();
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const body = await req.json();
        const { keyName } = body;

        if (!keyName) {
            return NextResponse.json(
                { error: "keyName is required to update" },
                { status: 400 }
            );
        }

        const updatedKey = await ApiKey.findByIdAndUpdate(
            id,
            { name: keyName },
            { new: true, runValidators: true }
        );

        if (!updatedKey) {
            return NextResponse.json({ error: "API Key not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "API Key updated successfully", data: updatedKey },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to update API Key", details: error.message },
            { status: 500 }
        );
    }
}
