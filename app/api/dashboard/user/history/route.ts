import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";


export async function GET(req: NextRequest) {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    console.log("id is",userId)
    const transaction = searchParams.get("transaction")
    const appointment = searchParams.get("appointment")
    if(transaction){
    const response = await sql `SELECT money_type,reason,date AT TIME ZONE ${timeZone} as date,amount FROM transactions WHERE p_id = ${userId} ORDER BY date DESC`
    return NextResponse.json(
    { message: "data of transactions", success: true, data:response},
    { status: 200 }
    )
    }
    else if(appointment){
      const response = await sql `SELECT doctors.name AS name
                                ,doctors.department AS department
                                ,doctors.experience AS experience
                                ,appointments.date AT TIME ZONE ${timeZone} AS date 
                                FROM doctors INNER JOIN appointments
                                ON doctors.id = appointments.d_id
                                WHERE appointments.p_id = ${userId}
                                ORDER BY appointments.date DESC`
                                console.log(response)
    return NextResponse.json(
    { message: "data of appointments", success: true, data:response},
    { status: 200 }
    )                          
    }
    
  } catch (error) {
    return NextResponse.json(
      { message: "Server error. Please try again later.", success: false,data:error},
      { status: 500 }
    );
  }
}