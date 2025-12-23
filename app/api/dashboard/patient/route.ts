import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { neon } from "@neondatabase/serverless";

/* =========================
   JWT PAYLOAD TYPE (FIX)
========================= */
interface MyJwtPayload {
  email?: string;
}

/* =========================
   HELPER: GET EMAIL
========================= */
async function getEmail(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("token")?.value;
  if (token) {
    const decoded = jwtDecode<MyJwtPayload>(token);
    return decoded.email ?? null;
  }

  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

/* =========================
   GET PATIENT
========================= */
export async function GET(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);

    /* 🔍 SEARCH BY NAME */
    let name = searchParams.get("name");
    if (name) {
      name = name.toLowerCase() + "%";

      const response = await sql`
        SELECT * FROM patients WHERE name ILIKE ${name}
      `;

      if (response.length > 0) {
        return NextResponse.json(
          { message: "Patients found", success: true, data: response },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: "No patient found", success: false },
        { status: 404 }
      );
    }

    /* 🔐 AUTH */
    const email = await getEmail(req);
    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    /* 🧑 PATIENT CHECK */
    const patientRows = await sql`
      SELECT * FROM patients WHERE email = ${email}
    `;

    if (patientRows.length === 0) {
      return NextResponse.json(
        { message: "Patient not found", success: false },
        { status: 404 }
      );
    }

    const patient = patientRows[0];

    /* 🔗 LINK USER ID IF MISSING */
    if (patient.p_id == null) {
      const userRows = await sql`
        SELECT id FROM users WHERE email = ${email}
      `;

      if (userRows.length === 0) {
        return NextResponse.json(
          { message: "User exists but no record", success: false },
          { status: 400 }
        );
      }

      const updated = await sql`
        UPDATE patients
        SET p_id = ${userRows[0].id}
        WHERE email = ${email}
        RETURNING *
      `;

      return NextResponse.json(
        { message: "Patient linked", success: true, data: updated[0] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Patient already exists", success: true, data: patient },
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

/* =========================
   CREATE PATIENT
========================= */
export async function POST(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const body = await req.json();

    const email = await getEmail(req);
    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const userRows = await sql`
      SELECT id, name, email FROM users WHERE email = ${email}
    `;

    if (userRows.length === 0) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const user = userRows[0];

    const patientResponse = await sql`
      INSERT INTO patients (name, email, phone, address, p_id)
      VALUES (
        ${user.name},
        ${user.email},
        ${body?.formData?.phone},
        ${body?.formData?.address},
        ${user.id}
      )
      RETURNING *
    `;

    return NextResponse.json(
      {
        message: "Patient added successfully",
        success: true,
        data: patientResponse[0],
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
