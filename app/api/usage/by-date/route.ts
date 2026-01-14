//GET: gives summary by date !!!

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "get gives summary by date" },
    { status: 501 }
  );
}
