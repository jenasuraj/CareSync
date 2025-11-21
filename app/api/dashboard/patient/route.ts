import { NextResponse,NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { neon } from '@neondatabase/serverless';


export async function GET(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    let name: string | null = searchParams.get("name");
    if(name){
      name = name.toLowerCase() + '%'
      console.log("in server",name)
      const response = await sql `SELECT * FROM patients WHERE name LIKE ${name}`
      console.log("response is",response)
      if(response.length>0){
        return NextResponse.json({message:"all patients are here",data:response,success:true},{status:200})
      }
      else{
        return NextResponse.json({message:"No any patient is here with this name",success:false},{status:404})
      }
    }
    
    // Extract email from JWT or NEXT-AUTH
    const token = req.cookies.get("token")?.value;
    const nextAuthToken = req.cookies.get("next-auth.session-token")?.value;

    let email: string | null = null;

    if (token) {
      const decoded: any = jwtDecode(token);
      email = decoded?.email || null;
    } 
    else if (nextAuthToken) {
      const session = await getServerSession(authOptions);
      email = session?.user?.email || null;
    }

    // No email found → not authenticated
    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized", success: false }, 
        { status: 401 }
      );
    }

    // 1️⃣ Check if patient exists
    const patientRows = await sql`
      SELECT * FROM patients WHERE email = ${email}
    `;

    if (patientRows.length === 0) {
      return NextResponse.json(
        { message: "patient is not present", success: false },
        { status: 404 }
      );
    }

    const patient = patientRows[0];

    // 2️⃣ Check if p_id is missing → link with users table
    if (patient.p_id == null) {

      const userRows = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;

      if (userRows.length === 0) {
        return NextResponse.json(
          { message: "User exists but has no patient record", success: false },
          { status: 400 }
        );
      }

      const user = userRows[0];

      const updated = await sql`
        UPDATE patients SET p_id = ${user.id}
        WHERE email = ${email}
        RETURNING *
      `;

      return NextResponse.json({
        message: "patient updated",
        success: true,
        data: updated[0],
      });
    }

    // 3️⃣ Already exists
    return NextResponse.json({
      message: "patient is already present",
      success: true,
      data: patient,
    });

  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "server error", success: false, error },
      { status: 500 }
    );
  }
}




export async function POST(req:NextRequest) {
    const body = await req.json()
    const sql = neon(process.env.POSTGRES_URL!);
    const token = req.cookies.get("token")?.value;
    const gtoken = req.cookies?.get("next-auth.session-token")?.value;
    console.log(body?.formData)
    try{
        if(token){
        const decoded = jwtDecode(token);
        console.log("mannual decoded jwt is",decoded?.email)
        const response = await sql `SELECT * FROM users WHERE email = ${decoded?.email}`
        console.log("response ",response)
        const patient_response = await sql`
        INSERT INTO patients (name, email,phone,address,p_id)
        VALUES (${response[0]?.name}, ${response[0]?.email}, ${body?.formData?.phone},${body?.formData?.address},${response[0]?.id})
        RETURNING *;`;
        console.log("patient response is",patient_response)
        if(patient_response.length>0){
            return NextResponse.json({message:"patient added successfully",success:true,data:patient_response[0]},{status:200})
        }
    }
    else if(gtoken){
        const session = await getServerSession(authOptions);
        console.log("google decoded jwt is",session?.user?.email)
        const response = await sql `SELECT * FROM users WHERE email = ${session?.user?.email}`
        console.log("response",response)
        const patient_response = await sql`
        INSERT INTO patients (name, email,phone,address,p_id)
        VALUES (${response[0]?.name}, ${response[0]?.email}, ${body?.formData?.phone},${body?.formData?.address},${response[0]?.id})
        RETURNING *;`;
        console.log("patient info is",patient_response)
        if(patient_response.length>0){
            return NextResponse.json({message:"patient added successfully",success:true,data:patient_response[0]},{status:200})
        }
    } 
    }
    catch(error){
        console.log("i am in catch",error)
        return NextResponse.json({message:"server error",success:false,data:error},{status:500})
    }
    
}