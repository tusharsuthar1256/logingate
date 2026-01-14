// GET or PUT(update) the details of the user !!!  

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Display the logs !!!" },
    { status: 501 }
  );
}