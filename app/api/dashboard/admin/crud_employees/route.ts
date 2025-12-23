import { NextResponse, NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function DELETE(req: NextRequest) {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const currentPage = searchParams.get("currentPage"); // optional
    const table  = currentPage?.toLocaleLowerCase()
    if(table == 'doctors'){
    const employeeLists = await sql `DELETE FROM doctors WHERE id = ${id}`;
    return NextResponse.json(
        {
        message: `Deleted doctor successfully.`,
        success: true,
        data: employeeLists,
        },
        { status: 200 }
    );
    }
    else if(table == 'nurses'){
    const employeeLists = await sql `DELETE FROM nurses WHERE id = ${id}`;
    return NextResponse.json(
        {
        message: `Deleted Nurses successfully.`,
        success: true,
        data: employeeLists,
        },
        { status: 200 }
    );
    }
    else if(table == 'pharmacists'){
    const employeeLists = await sql `DELETE FROM pharmacists WHERE id = ${id}`;
    return NextResponse.json(
        {
        message: `Deleted pharmacists successfully.`,
        success: true,
        data: employeeLists,
        },
        { status: 200 }
    );
    }
    else{
    const employeeLists = await sql `DELETE FROM others WHERE id = ${id}`;
    return NextResponse.json(
        {
        message: `Deleted others successfully.`,
        success: true,
        data: employeeLists,
        },
        { status: 200 }
    );
    }
}

export async function GET(req: NextRequest) {
  const sql = neon(process.env.POSTGRES_URL!);
  const { searchParams } = new URL(req.url);
  const current = searchParams.get("currentPage");
  const employeeName = searchParams.get("employeeName");
  const table = current?.toLowerCase()

if (table === 'doctors') {
  const query = !employeeName
    ? sql`SELECT * FROM doctors ORDER BY experience DESC LIMIT 5`
    : sql`SELECT * FROM doctors WHERE LOWER(name) LIKE ${'%' + employeeName.toLowerCase() + '%'}`;

  const employeeLists = await query;

  return NextResponse.json(
    {
      message: `List of doctors from server.`,
      success: true,
      data: employeeLists,
    },
    { status: 200 }
  );
}

else if (table === 'nurses') {
  const query = !employeeName
    ? sql`SELECT * FROM nurses ORDER BY experience DESC LIMIT 5`
    : sql`SELECT * FROM nurses WHERE LOWER(name) LIKE ${'%' + employeeName.toLowerCase() + '%'}`;

  const employeeLists = await query;

  return NextResponse.json(
    {
      message: `List of nurses from server.`,
      success: true,
      data: employeeLists,
    },
    { status: 200 }
  );
}

else if (table === 'pharmacists') {
  const query = !employeeName
    ? sql`SELECT * FROM pharmacists ORDER BY experience DESC LIMIT 5`
    : sql`SELECT * FROM pharmacists WHERE LOWER(name) LIKE ${'%' + employeeName.toLowerCase() + '%'}`;

  const employeeLists = await query;

  return NextResponse.json(
    {
      message: `List of pharmacists from server.`,
      success: true,
      data: employeeLists,
    },
    { status: 200 }
  );
}

else { // others
  const query = !employeeName
    ? sql`SELECT * FROM others ORDER BY experience DESC LIMIT 5`
    : sql`SELECT * FROM others WHERE LOWER(name) LIKE ${'%' + employeeName.toLowerCase() + '%'}`;

  const employeeLists = await query;

  return NextResponse.json(
    {
      message: `List of other employees from server.`,
      success: true,
      data: employeeLists,
    },
    { status: 200 }
  );
}

}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sql = neon(process.env.POSTGRES_URL!);

  const {
    currentPage,
    updateBTN,
    formData: {
      name,
      email,
      ph_no,
      department,
      file,
      experience
    }
  } = body;

  const parsedExperience = Number(experience);

  try {
    // --------------------------------------
    // 1. DOCTORS
    // --------------------------------------
    if (currentPage === "Doctors") {
      if (updateBTN !== 0) {
        const updation = await sql`
          UPDATE doctors 
          SET 
            name = ${name},
            email = ${email},
            phone = ${ph_no},
            department = ${department},
            image = ${file},
            experience = ${parsedExperience}
          WHERE id = ${updateBTN}
          RETURNING *;
        `;
        return NextResponse.json(
          { success: true, message: "Doctor updated", data: updation[0] },
          { status: 200 }
        );
      }

      // INSERT
      const isUserExists = await sql`
        SELECT * FROM doctors 
        WHERE email = ${email} OR phone = ${ph_no};
      `;

      if (isUserExists.length > 0) {
        return NextResponse.json(
          { success: false, message: "The Email/Phone is already taken" },
          { status: 409 }
        );
      }

      const inserted = await sql`
        INSERT INTO doctors (name, email, phone, department, image, experience)
        VALUES (${name}, ${email}, ${ph_no}, ${department}, ${file}, ${parsedExperience})
        RETURNING *;
      `;

      return NextResponse.json(
        { success: true, message: "Doctor registered successfully", data: inserted[0] },
        { status: 201 }
      );
    }

    // --------------------------------------
    // 2. OTHERS
    // --------------------------------------
    if (currentPage === "Others") {
      if (updateBTN !== 0) {
        const updation = await sql`
          UPDATE others
          SET 
            name = ${name},
            email = ${email},
            phone = ${ph_no},
            department = ${department},
            image = ${file},
            experience = ${parsedExperience}
          WHERE id = ${updateBTN}
          RETURNING *;
        `;
        return NextResponse.json(
          { success: true, message: "Others updated", data: updation[0] },
          { status: 200 }
        );
      }

      // INSERT
      const isUserExists = await sql`
        SELECT * FROM others 
        WHERE email = ${email} OR phone = ${ph_no};
      `;

      if (isUserExists.length > 0) {
        return NextResponse.json(
          { success: false, message: "The Email/phone is already taken" },
          { status: 409 }
        );
      }

      const inserted = await sql`
        INSERT INTO others
        (name, email, phone, department, image, experience)
        VALUES (${name}, ${email}, ${ph_no}, ${department}, ${file}, ${parsedExperience})
        RETURNING *;
      `;

      return NextResponse.json(
        {
          success: true,
          message: `${department} registered successfully`,
          data: inserted[0]
        },
        { status: 201 }
      );
    }

    // --------------------------------------
    // 3. PHARMACISTS
    // --------------------------------------
    if (currentPage === "Pharmacists") {
      if (updateBTN !== 0) {
        const updation = await sql`
          UPDATE pharmacists
          SET 
            name = ${name},
            email = ${email},
            phone = ${ph_no},
            image = ${file},
            experience = ${parsedExperience}
          WHERE id = ${updateBTN}
          RETURNING *;
        `;
        return NextResponse.json(
          { success: true, message: "Pharmacist updated", data: updation[0] },
          { status: 200 }
        );
      }

      // INSERT
      const isUserExists = await sql`
        SELECT * FROM pharmacists 
        WHERE email = ${email} OR phone = ${ph_no};
      `;

      if (isUserExists.length > 0) {
        return NextResponse.json(
          { success: false, message: "The Email/phone is already taken" },
          { status: 409 }
        );
      }

      const inserted = await sql`
        INSERT INTO pharmacists (name, email, phone, image, experience)
        VALUES (${name}, ${email}, ${ph_no}, ${file}, ${parsedExperience})
        RETURNING *;
      `;

      return NextResponse.json(
        { success: true, message: "Pharmacist registered successfully", data: inserted[0] },
        { status: 201 }
      );
    }

    // --------------------------------------
    // 4. NURSES
    // --------------------------------------
    if (currentPage === "Nurses") {
      if (updateBTN !== 0) {
        const updation = await sql`
          UPDATE nurses
          SET 
            name = ${name},
            email = ${email},
            phone = ${ph_no},
            image = ${file},
            experience = ${parsedExperience}
          WHERE id = ${updateBTN}
          RETURNING *;
        `;
        return NextResponse.json(
          { success: true, message: "Nurse updated", data: updation[0] },
          { status: 200 }
        );
      }

      // INSERT
      const isUserExists = await sql`
        SELECT * FROM nurses 
        WHERE email = ${email} OR phone = ${ph_no};
      `;

      if (isUserExists.length > 0) {
        return NextResponse.json(
          { success: false, message: "The Email/phone is already taken" },
          { status: 409 }
        );
      }

      const inserted = await sql`
        INSERT INTO nurses (name, email, phone, image, experience)
        VALUES (${name}, ${email}, ${ph_no}, ${file}, ${parsedExperience})
        RETURNING *;
      `;

      return NextResponse.json(
        { success: true, message: "Nurse registered successfully", data: inserted[0] },
        { status: 201 }
      );
    }

    // fallback
    return NextResponse.json(
      { success: false, message: "Invalid page type" },
      { status: 400 }
    );

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: "Server Error", data: err },
      { status: 500 }
    );
  }
}

export async function PUT(req:NextRequest) {
 const body = await req.json()
 const sql = neon(process.env.POSTGRES_URL!);
 if(body?.id && body?.target == 'inactive'){
 const response = await sql`UPDATE doctors SET status = 'inactive' WHERE id = ${Number(body?.id)}`
 return NextResponse.json({ success: true, message: `updated successfully`,data:response[0]},{status:201});
 }
 else if(body?.target == 'active'){
 const response = await sql`UPDATE doctors SET status = 'active' WHERE id = ${Number(body?.id)} RETURNING *`
 return NextResponse.json({ success: true, message: `updated successfully`,data:response[0]},{status:201});
 }

}