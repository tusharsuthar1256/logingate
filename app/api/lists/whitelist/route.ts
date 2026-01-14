// create or get Whitelist emails or ips 
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "create the whitelist" },
    { status: 501 }
  );
}
