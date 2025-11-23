import { NextResponse, NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function DELETE(req: NextRequest) {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const currentPage = searchParams.get("currentPage"); // optional
    const table  = currentPage?.toLocaleLowerCase()
    console.log("table is",table,"id is",id)
    if(table == 'doctors'){
    const employeeLists = await sql `DELETE FROM doctors WHERE id = ${id}`;
    console.log(employeeLists)
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
    console.log(employeeLists)
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
    console.log(employeeLists)
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
    console.log(employeeLists)
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
  console.log("in dest", employeeName, table);
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

export async function POST(req:NextRequest) {
    const body = await req.json()
    const experience: string = body?.formData?.experience
    const parsedExperience: number = Number(experience) 
    const sql = neon(process.env.POSTGRES_URL!);

    try{
      if(body?.currentPage == "Doctors")
    {    
    const isUserExists = await sql`SELECT * FROM doctors WHERE email =${body?.formData?.email} OR phone = ${body?.formData?.ph_no}`;
    if(isUserExists.length>0){
     return NextResponse.json({message:"The Email/Phone is already taken",success:false},{status:404})
    }
    const response = await sql`
      INSERT INTO doctors (name, email, phone,department,image,experience)
      VALUES (${body?.formData.name}, ${body?.formData.email}, ${body?.formData?.ph_no},${body?.formData?.department},${body?.formData?.file},${parsedExperience})
      RETURNING *;`;
    return NextResponse.json({ success: true, message: "Doctor registered successfully",data:response[0]},{status:200});
    }

    else if(body?.currentPage == "Others")
    {  
    const isUserExists = await sql`SELECT * FROM others WHERE email =${body?.formData?.email} OR phone = ${body?.formData?.ph_no}`;
    if(isUserExists.length>0){
     return NextResponse.json({message:"The Email/phone is already taken",success:false},{status:404})
    }
    const response = await sql`
      INSERT INTO others (name, email, phone,department,image,experience)
      VALUES (${body?.formData.name}, ${body?.formData.email}, ${body?.formData?.ph_no},${body?.formData?.department},${body?.formData?.file},${parsedExperience})
      RETURNING *;`;
    return NextResponse.json({ success: true, message: `${body?.formData?.department} registered successfully`,data:response[0]},{status:201});
    }

    else if(body?.currentPage == "Pharmacists")
    {
    console.log("i am in pharma post section...")    
    const isUserExists = await sql`SELECT * FROM pharmacists WHERE email =${body?.formData?.email} OR phone = ${body?.formData?.ph_no}`;
    if(isUserExists.length>0){
     return NextResponse.json({message:"The email/phone is already taken",success:false},{status:404})
    }
    const response = await sql`
      INSERT INTO pharmacists (name, email, phone,image,experience)
      VALUES (${body?.formData.name}, ${body?.formData.email}, ${body?.formData?.ph_no},${body?.formData?.file},${parsedExperience})
      RETURNING *;`;
    return NextResponse.json({ success: true, message: `pharmacists registered successfully`,data:response[0]},{status:201});
    }
    else if(body?.currentPage == "Nurses")
    {
    console.log("i am in nurse post section...")    
    const isUserExists = await sql`SELECT * FROM nurses WHERE email =${body?.formData?.email} OR phone = ${body?.formData?.ph_no}`;
    if(isUserExists.length>0){
     return NextResponse.json({message:"The Email/phone is already taken",success:false},{status:409})
    }
    const response = await sql`
      INSERT INTO nurses (name, email, phone,image,experience)
      VALUES (${body?.formData.name}, ${body?.formData.email}, ${body?.formData?.ph_no},${body?.formData?.file},${parsedExperience})
      RETURNING *;`;
    return NextResponse.json({ success: true, message: `Nurse registered successfully`,data:response[0]},{status:201});
    }
    }
    catch(err){
      console.log(err)
      return NextResponse.json({ success: false, message: `Server Error`,data:err},{status:500});
    }
} 

export async function PUT(req:NextRequest) {
    console.log("hello i am here !")
 const body = await req.json()
 console.log("id",body?.id) 
 const sql = neon(process.env.POSTGRES_URL!);
 if(body?.id && body?.target == 'inactive'){
 const response = await sql`UPDATE doctors SET status = 'inactive' WHERE id = ${body?.id}`
 return NextResponse.json({ success: true, message: `updated successfully`,data:response[0]},{status:201});
 }
 const response = await sql`UPDATE doctors SET status = 'active' WHERE id = ${body?.id}`
 return NextResponse.json({ success: true, message: `updated successfully`,data:response[0]},{status:201});
}