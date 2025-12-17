import { NextResponse,NextRequest } from "next/server";
import { neon } from '@neondatabase/serverless';


export async function GET(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const id = searchParams.get("id")
    console.log("id is",)
    if(id){
      console.log("called ...")
      const response = await sql`SELECT * FROM patients WHERE id = ${id}`;
      console.log("response is",response)
      return NextResponse.json(
        { message: "Patient is provided", data: response, success: true },
        { status: 200 }
      );
    }

    // 🔹 CASE 1: Fetch all patients (page load)
    if (!name) {
      const response = await sql`SELECT * FROM patients ORDER BY id DESC`;
      return NextResponse.json(
        { message: "All patients", data: response, success: true },
        { status: 200 }
      );
    }

    // 🔹 CASE 2: Search by name
    const search = name.toLowerCase() + "%";
    const response = await sql`
      SELECT * FROM patients
      WHERE LOWER(name) LIKE ${search}
    `;

    if (response.length > 0) {
      return NextResponse.json(
        { message: "Patients found", data: response, success: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "No patient found", success: false },
      { status: 404 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error", success: false },
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