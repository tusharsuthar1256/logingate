//The most important end-point this will check the IP fake or spammy or Not !!!
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "vip api for IP's" },
    { status: 501 }
  );
}