import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    const option = searchParams.get("option"); // dashboard cards

    const range =
      option  === "today"
        ? 0
        : option  === "week"
        ? 7
        : option  === "month"
        ? 30
        : option === "threemonth"
        ? 90
        : null;

    /* -------------------- DASHBOARD COUNTS -------------------- */
    if (option) {
      console.log("came",range)
      const appointment_count = await sql`
        SELECT COUNT(*)::int AS count
        FROM appointments
        WHERE date >= CURRENT_DATE - (${range} * INTERVAL '1 day')
      `;

      const admit_count = await sql`
        SELECT COUNT(*)::int AS count
        FROM rooms
        WHERE status = 'unavailable'
        AND date >= CURRENT_DATE - (${range} * INTERVAL '1 day')
      `;

      const money_count = await sql`
        SELECT COALESCE(SUM(amount), 0)::int AS total
        FROM transactions
        WHERE date >= CURRENT_DATE - (${range} * INTERVAL '1 day')
      `;

      const users_count = await sql`
        SELECT COUNT(*)::int AS count
        FROM users
      `;
      return NextResponse.json(
        {
          success: true,
          appointment_count: appointment_count[0],
          admit_count: admit_count[0],
          money_count: money_count[0],
          users_count: users_count[0],
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching hospital analytics:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
