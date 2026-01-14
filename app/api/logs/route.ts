//Display the all calls did to the api by USER !!!

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Display the logs !!!" },
    { status: 501 }
  );
}
