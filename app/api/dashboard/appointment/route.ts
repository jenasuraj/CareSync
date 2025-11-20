import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const body = await req.json();
    const { name, phone, date, address, doctorId, p_id, symptoms } = body;
    console.log("in server",name,phone,date,address,doctorId,p_id,symptoms)
    if(!name || !phone || !date || !address || !doctorId ||symptoms.length == 0 ){
      return NextResponse.json(
      {
        message: "Server error missing details.",
        success: false,
      },
      { status: 400 }
    );
    }
    else{
    const money_type:string = "appointment"
    const money: number = 200
  await sql`INSERT INTO amount(money_type,amount) VALUES(${money_type},${money})`    
  const formattedSymptoms = `{${symptoms.join(',')}}`; // → "{fever}" or "{fever,cold}"
  await sql`
    INSERT INTO appointments (name, phone, date, address, d_id, p_id, symptoms)
    VALUES (${name}, ${phone}, ${date}, ${address}, ${doctorId}, ${p_id}, ${formattedSymptoms});
  `;
    return NextResponse.json(
      {
        message: "Appointment booked successfully.",
        success: true,
      },
      { status: 201 }
    );
    }

  } catch (error) {
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
    console.log("appointment is",appointment)
    if(appointment){
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Add 1 for human-readable month
    const day = currentDate.getDate();
    const today = `${year}-${month}-${day}`       
     const response = await sql`SELECT name,phone FROM appointments WHERE d_id = ${appointment} AND date = ${today}`
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
