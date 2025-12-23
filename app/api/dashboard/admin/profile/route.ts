
import { NextResponse,NextRequest } from "next/server";
import { neon } from '@neondatabase/serverless';


export async function GET(req: NextRequest) {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    const id:number = Number(searchParams.get("id"))
    const appointmentData:boolean = Boolean(searchParams.get("appointmentData"))
    const transactionData:boolean = Boolean(searchParams.get("transactionData"))
    if(id && appointmentData){
      const response = await sql  `SELECT doctors.name, doctors.experience,doctors.department,appointments.date AT TIME ZONE ${timeZone},appointments.id
                                  FROM appointments INNER JOIN doctors
                                  ON appointments.d_id = doctors.id WHERE appointments.date>=CURRENT_DATE AND appointments.p_id = ${id}`                           
      return NextResponse.json(
      { message: "list of appointment data for a single profile", success: true, data: response},
      { status: 200 }
    );
    }
   

    if(id && transactionData){
      const response = await sql `SELECT money_type, reason,date AT TIME ZONE ${timeZone},amount FROM transactions WHERE p_id=${id}`                          
      return NextResponse.json(
      { message: "list of transaction data for a single profile", success: true, data: response},
      { status: 200 }
    );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error", success: false },
      { status: 500 }
    );
  }
}
