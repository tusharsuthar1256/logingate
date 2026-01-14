//Change the password of the account securely !!!



import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "change the passsword of ac" },
    { status: 501 }
  );
}