// DELETE : remove email or ip from blacklist
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "delete the blacklist" },
    { status: 501 }
  );
}
