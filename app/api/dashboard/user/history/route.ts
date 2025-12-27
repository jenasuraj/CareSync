import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";


export async function GET(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    console.log("id is",userId)
    const response = await sql `SELECT money_type,reason,date,amount FROM transactions WHERE p_id = ${userId} ORDER BY date DESC`
    console.log(response)
    return NextResponse.json(
    { message: "History of yours", success: true, data:response},
    { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Server error. Please try again later.", success: false,data:error},
      { status: 500 }
    );
  }
}