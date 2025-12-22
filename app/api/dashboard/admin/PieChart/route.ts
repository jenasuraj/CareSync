import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: NextRequest) {
    console.log("hit")
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);

    const transaction_option = searchParams.get("transaction_option");

    const range =
      transaction_option === "today"
        ? 0
        : transaction_option === "week"
        ? 7
        : transaction_option === "month"
        ? 30
        : transaction_option === "threemonth"
        ? 90
        : null;

    if (range === null) {
      return NextResponse.json(
        { success: false, message: "Invalid range" },
        { status: 400 }
      );
    }

    /* ---------------- PIE CHART DATA ---------------- */
    const rows = await sql`
      SELECT
        reason,
        COUNT(*)::int AS count
      FROM transactions
      WHERE date >= CURRENT_DATE - (${range} * INTERVAL '1 day')
      GROUP BY reason
      ORDER BY count DESC
    `;

    console.log("row",rows)

    const total = rows.reduce((sum, r) => sum + r.count, 0);

    const pieData = rows.map((row) => ({
      type: row.reason,
      value: row.count,
      percent: Number(((row.count / total) * 100).toFixed(2)),
    }));

    console.log("pie data is ",pieData)

    return NextResponse.json(
      {
        success: true,
        total,
        data: pieData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Pie chart analytics error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
