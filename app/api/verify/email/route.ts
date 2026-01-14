//The most important end-point this will check the email id fake or spammy or Not !!!

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "vip end-point" },
    { status: 501 }
  );
}