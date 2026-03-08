import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ApiLog from "@/model/ApiLog.model";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await dbConnect();

    // Get Total API Checks
    const totalChecks = await ApiLog.countDocuments({ userId });

    // Threats Blocked where we assigned a threatType other than "none"
    const threatsBlocked = await ApiLog.countDocuments({ userId, threatType: { $ne: "none" } });

    // Average latency
    const latencyResult = await ApiLog.aggregate([
      { $match: { userId } },
      { $group: { _id: null, avgLatency: { $avg: "$durationMs" } } }
    ]);
    const avgLatency = latencyResult.length > 0 ? Math.round(latencyResult[0].avgLatency) : 0;

    // Threat Distribution
    const threatDist = await ApiLog.aggregate([
      { $match: { userId, threatType: { $ne: "none" } } },
      { $group: { _id: "$threatType", count: { $sum: 1 } } }
    ]);

    // Total Threats for percentage
    const totalThreats = threatDist.reduce((acc, curr) => acc + curr.count, 0);

    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-purple-500", "bg-gray-500"];
    const distribution = threatDist.map((item, index) => ({
      label: item._id,
      percent: totalThreats > 0 ? Math.round((item.count / totalThreats) * 100) : 0,
      count: item.count,
      color: colors[index % colors.length]
    })).sort((a, b) => b.percent - a.percent);

    // Activity over last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const chartDataRaw = await ApiLog.aggregate([
      { $match: { userId, createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            verdict: "$verdict"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format chart data for past 7 days specifically filling in empty days
    const chartData = [];
    const safeData = [];
    const fakeData = [];

    let maxChartRequest = 1;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const displayLabel = d.toLocaleString('en-US', { weekday: 'short' });
      const displayTime = d.toLocaleDateString();

      let safeCount = 0;
      let fakeCount = 0;

      chartDataRaw.forEach(c => {
        if (c._id.date === dayStr) {
          if (c._id.verdict === 'allow') safeCount += c.count;
          else fakeCount += c.count;
        }
      });

      const reqs = safeCount + fakeCount;
      if (reqs > maxChartRequest) maxChartRequest = reqs;

      chartData.push({ day: displayLabel, requests: reqs, fullDate: dayStr });
      safeData.push({ label: displayLabel, value: safeCount, timestamp: displayTime });
      fakeData.push({ label: displayLabel, value: fakeCount, timestamp: displayTime });
    }

    const maxChartHeightValue = maxChartRequest > 0 ? maxChartRequest : 100;

    return NextResponse.json({
      success: true,
      data: {
        totalChecks,
        threatsBlocked,
        avgLatency,
        distribution,
        chartData,
        safeData,
        fakeData,
        maxChartHeightValue
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
