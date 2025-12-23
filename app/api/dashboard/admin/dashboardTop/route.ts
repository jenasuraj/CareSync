
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name"); // dashboard cards
    if(name == 'doctor'){
    const response = await sql`
                                SELECT 
                                    d.image AS image,
                                    d.name AS name,
                                    d.department AS department,
                                    d.experience AS experience,
                                    COUNT(a.id) AS appointment_counts
                                FROM doctors d
                                INNER JOIN appointments a
                                    ON d.id = a.d_id
                                GROUP BY 
                                    d.id, 
                                    d.image, 
                                    d.name, 
                                    d.department, 
                                    d.experience
                                ORDER BY appointment_counts DESC LIMIT 3;
                                `;
    return NextResponse.json(
      { success: true, message: "response",data:response },
      { status: 200 }
    );
    }
    else if(name == 'patient'){
            const response = await sql`SELECT name,phone,address FROM patients ORDER BY id DESC LIMIT 3`;
    return NextResponse.json(
      { success: true, message: "response",data:response },
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
