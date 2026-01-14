// Create the API KEY and GET the API KEY

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "GET the api key !!!" },
    { status: 501 }
  );
}
