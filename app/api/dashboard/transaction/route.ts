import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";




export async function POST(req: NextRequest) {
    const body = await req.json()
    const {p_id,amount,money_type,reason} = body
    const sql = neon(process.env.POSTGRES_URL!);
    //{money_type:mode,reason:admit_type,amount:amount,p_id:patients?.id})
    console.log("in desti",money_type,reason,amount,p_id)
  try {
        const response = await sql `INSERT INTO transactions (p_id,money_type,reason,amount) VALUES (${p_id},${money_type},${reason},${amount}) RETURNING *;`;
        if(response.length == 0){
    return NextResponse.json(
      { message: "Error submitting money", success: false },
      { status: 404 }
    );
        }
    return NextResponse.json(
      { message: "Test confirmed", success: true },
      { status: 200 }
    );
  }catch (error) {
    console.error("Error fetching available doctors:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later.", success: false },
      { status: 500 }
    );
  }
}
