import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ApiKey } from "@/model/ApiKey.model";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const resolvedParams = await params;
        const { id } = resolvedParams;

        const deletedKey = await ApiKey.findByIdAndDelete(id);

        if (!deletedKey) {
            return NextResponse.json({ error: "API Key not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "API Key deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to delete API Key", details: error.message },
            { status: 500 }
        );
    }
}
