import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ApiLog from "@/model/ApiLog.model";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const search = searchParams.get("search");
    const timeline = searchParams.get("timeline");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await dbConnect();

    const query: any = { userId };

    if (search) {
      query["requestPayload.email"] = { $regex: search, $options: "i" };
    }

    if (timeline && timeline !== "All") {
      const now = new Date();
      let startDate = new Date();

      switch (timeline) {
        case "Today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "Yesterday":
          startDate.setDate(now.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          now.setHours(0, 0, 0, 0);
          query.createdAt = { $gte: startDate, $lt: now };
          break;
        case "7 Days":
          startDate.setDate(now.getDate() - 7);
          break;
        case "Month":
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      if (timeline !== "Yesterday") {
        query.createdAt = { $gte: startDate };
      }
    }

    const logs = await ApiLog.find(query).sort({ createdAt: -1 }).limit(100);

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
