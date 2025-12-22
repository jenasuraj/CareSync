import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    const transaction_option = searchParams.get("transaction_option"); // charts
    const range =
       transaction_option === "today"
        ? 0
        :  transaction_option === "week"
        ? 7
        :  transaction_option === "month"
        ? 30
        :  transaction_option === "threemonth"
        ? 90
        : null;

    /* -------------------- CHART DATA (TIME SERIES) -------------------- */
    if (transaction_option && range !== null) {
      const appointments = await sql`
        SELECT 
          date::date AS date,
          COUNT(*)::int AS appointments
        FROM appointments
        WHERE date >= CURRENT_DATE - (${range} * INTERVAL '1 day')
        GROUP BY date
        ORDER BY date
      `;

      const admissions = await sql`
        SELECT 
          date::date AS date,
          COUNT(*)::int AS admission
        FROM rooms
        WHERE status = 'unavailable'
        AND date >= CURRENT_DATE - (${range} * INTERVAL '1 day')
        GROUP BY date
        ORDER BY date
      `;

      /* -------- MERGE BY DATE (SERVER-SIDE) -------- */
      const map = new Map<string, any>();

      appointments.forEach((row) => {
        map.set(row.date, {
          date: row.date,
          appointments: row.appointments,
          admission: 0,
        });
      });

      admissions.forEach((row) => {
        if (map.has(row.date)) {
          map.get(row.date).admission = row.admission;
        } else {
          map.set(row.date, {
            date: row.date,
            appointments: 0,
            admission: row.admission,
          });
        }
      });

      const chartData = Array.from(map.values());

      return NextResponse.json(
        {
          success: true,
          data: chartData,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid query parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching hospital analytics:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
