import { NextResponse,NextRequest } from "next/server";
import { neon } from '@neondatabase/serverless';


export async function GET(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    let name: string | null = searchParams.get("name");
    if(name){
      name = name.toLowerCase() + '%'
      console.log("in server",name)
      const response = await sql `SELECT * FROM patients WHERE Lower(name) LIKE ${name}`
      console.log("response is",response)
      if(response.length>0){
        return NextResponse.json({message:"all patients are here",data:response,success:true},{status:200})
      }
      else{
        return NextResponse.json({message:"No any patient is here with this name",success:false},{status:404})
      }
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "server error", success: false, error },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, address } = body;
    console.log(name,email,phone,address)
    const sql = neon(process.env.POSTGRES_URL!);

    // 1. Check if patient already exists
    const existing = await sql`
      SELECT *
      FROM patients
      WHERE LOWER(email) = LOWER(${email})
         OR phone = ${phone}
    `;
    console.log(existing)
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        { status: 404 } // correct status
      );
    }

    // 2. Insert new patient
    const inserted = await sql`
      INSERT INTO patients (name, email, phone, address)
      VALUES (${name}, ${email}, ${phone}, ${address})
      RETURNING *
    `;

    return NextResponse.json(
      {
        message: "Data registered successfully",
        success: true,
        data: inserted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error", success: false },
      { status: 500 }
    );
  }
}