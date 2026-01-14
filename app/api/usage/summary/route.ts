//This route gives the summary of the usage of the apis

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "gives summary by usage" },
    { status: 501 }
  );
}
