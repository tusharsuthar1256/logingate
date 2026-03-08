import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import DomainList from "@/model/DomainList.model";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await dbConnect();
    const lists = await DomainList.find({ userId, listType: "blacklist" }).sort({ createdAt: -1 });
    return NextResponse.json({ data: lists });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { domain, userId } = await request.json();

    if (!domain || !userId) {
      return NextResponse.json({ error: "domain and userId are required" }, { status: 400 });
    }

    await dbConnect();

    // Clean up domain (to lowercase and trim if it was an email)
    // Though frontend already extracts domain, we just cleanly store it.
    let cleanDomain = domain.toLowerCase().trim();

    const existing = await DomainList.findOne({ userId, domain: cleanDomain, listType: "blacklist" });
    if (existing) {
      return NextResponse.json({ error: "Domain is already in your blacklist" }, { status: 400 });
    }

    const newList = await DomainList.create({ userId, domain: cleanDomain, listType: "blacklist" });
    return NextResponse.json({ data: newList }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { domain, userId } = await request.json();

    if (!domain || !userId) {
      return NextResponse.json({ error: "domain and userId are required" }, { status: 400 });
    }

    await dbConnect();
    await DomainList.findOneAndDelete({ userId, domain: domain.toLowerCase().trim(), listType: "blacklist" });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
