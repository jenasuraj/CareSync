import { NextResponse,NextRequest } from "next/server";
      import { neon } from '@neondatabase/serverless';
      
      
      export async function GET(req: NextRequest) {
        try {
          const sql = neon(process.env.POSTGRES_URL!);
          const { searchParams } = new URL(req.url);
          const id:number = Number(searchParams.get("id"))
          //fetch appointment data joined with doctors from today onwards...
          if(id){
            const response = await sql`
                                SELECT *
                                FROM rooms
                                WHERE p_id = ${id}
                                LIMIT 1;
                                `;
            if(response.length==0){
                            const all_rooms = await sql`
                                SELECT *
                                FROM rooms WHERE status = 'available'
                                `;
         return NextResponse.json(
            { message: "room ain't booked, so take all rooms", success: true, data: all_rooms,admitted:false},
            { status: 200 }
            );
            }                                            
            return NextResponse.json(
            { message: "room data ", success: true, data: response,admitted:true},
            { status: 200 }
          );
          }

        } catch (error) {
          return NextResponse.json(
            { message: "Server error", success: false,data:error},
            { status: 500 }
          );
        }
      }

export async function DELETE(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { patientId } = await req.json();

    if (!patientId) {
      return NextResponse.json(
        { success: false, message: "patientId missing" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE rooms
      SET p_id = NULL,
          status = 'available',date = CURRENT_DATE
      WHERE p_id = ${patientId};
    `;

    return NextResponse.json({
      updation_data:result,
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error", data:err },
      { status: 500 }
    );
  }
}

//{room_no:selectedRoom,p_id:slug}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {room_no,p_id,mode} = body
  const reason:string = 'admit'
  const amount:number = 1000

  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const response_admit = await sql`
      UPDATE rooms
      SET p_id = ${p_id},
          status = 'unavailable',date = CURRENT_DATE
      WHERE room_no = ${room_no};`;
    
    const response_transaction = await sql `INSERT INTO transactions (p_id,money_type,reason,amount) VALUES (${p_id},${mode},${reason},${amount}) RETURNING *;`;
    return NextResponse.json(
      { success: true, message: "patient admitted", admit_data:response_admit, transaction_data:response_transaction},
      { status: 200 }
    );

  } catch (err) {
    console.error("server error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
