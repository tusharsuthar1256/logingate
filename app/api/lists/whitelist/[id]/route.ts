// DELETE : remove email or ip from whitelist
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "delete the whitelist" },
    { status: 501 }
  );
}
