import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const body = await req.json();
    const { mode, date, d_id, p_id } = body;
    const appointment_amount:number = 200
    const money_reason: string = "appointment"
    console.log("in server",date,d_id,mode,p_id)
    if(!p_id || !date || !mode || !d_id){
      return NextResponse.json(
      {
        message: "Server error missing details.",
        success: false,
      },
      { status: 404 }
    );
    }
    const response = await sql `INSERT INTO appointments (d_id,p_id,date) VALUES (${d_id},${p_id},${date})`
    const response2 = await sql `INSERT INTO transactions (p_id,money_type,reason,amount) VALUES (${p_id},${mode},${money_reason},${appointment_amount})` 
        return NextResponse.json(
      {
        message: "Appointment booked ",
        success: true,
      },
      { status: 200 }
    );
  }
 catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json(
      {
        message: "Server error. Please try again later.",
        success: false,
      },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    const currentDate = searchParams.get("date");
    const appointment = searchParams.get("appointment");
    console.log("doctor id is",appointment)
    if(appointment){      
    const response = await sql`
      SELECT patients.name, patients.phone
      FROM appointments
      JOIN patients ON appointments.p_id = patients.id
      WHERE appointments.d_id = ${appointment}
        AND appointments.date = CURRENT_DATE`;
    console.log(response)                            
     if(response.length == 0){
      return NextResponse.json(
        { message: "No appointments present for today", success: true },
        { status: 200 }
      );
     }
    return NextResponse.json(
        { message: "The appointments are further", success: true ,data:response},
        { status: 200 }
      );
    }
        if (!currentDate) {
      return NextResponse.json(
        { message: "Date query parameter is required.", success: false },
        { status: 400 }
      );
    }

    const availableDoctors = await sql`
      SELECT doctors.id,
             doctors.name,
             doctors.department,
             doctors.phone,
             doctors.image,
             doctors.experience,
             COALESCE(appt_count.total_appointments, 0) AS total_appointments
      FROM doctors
      LEFT JOIN (
        SELECT d_id, COUNT(*) AS total_appointments
        FROM appointments
        WHERE date = ${currentDate}
        GROUP BY d_id
      ) AS appt_count
      ON doctors.id = appt_count.d_id
      WHERE doctors.status = 'active'
        AND COALESCE(appt_count.total_appointments, 0) < 3;
    `;

    if (availableDoctors.length === 0) {
      return NextResponse.json(
        {
          message: `No available doctors on ${currentDate}.`,
          success: true,
          data: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: `Available doctors for ${currentDate}.`,
        success: true,
        data: availableDoctors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching available doctors:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later.", success: false },
      { status: 500 }
    );
  }
}
