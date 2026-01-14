import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";


export async function GET(req: NextRequest) {
  try {
    const sql = neon(process.env.POSTGRES_URL!);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")
    const response = await sql `SELECT calorieburnt,caloriegained,exercise FROM card WHERE p_id = ${id} AND date = CURRENT_DATE ORDER BY id DESC`
    if(response.length>0){
    const cardData = Object.entries(response[0]).map(([key, value]) => ({
    name: key,
    value: value,
    }))
    console.log("returning")
    return NextResponse.json(
      { message: "the following data.", success: true,cardData:cardData},
      { status: 200 }
    );
    }
    else{
      const response = { calorieburnt: '00', caloriegained: '00', exercise: '00:00'}
    const cardData = Object.entries(response).map(([key, value]) => ({
    name: key,
    value: value,
    }))
     console.log("returning")
      return NextResponse.json(
      { message: "the following data.", success: true,cardData:cardData},
      { status: 200 }
    );
    }

  } catch (error) {
     console.log("error")
    return NextResponse.json(
      { message: "Server error. Please try again later.", success: false,data:error},
      { status: 500 }
    );
  }
}