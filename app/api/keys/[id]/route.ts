//DELETE the API KEY !!!


import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "DELETE the api key" },
    { status: 501 }
  );
}
