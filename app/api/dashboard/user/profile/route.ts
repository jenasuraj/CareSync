import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import cloudinary from "@/lib/Cloudinary";

const sql = neon(process.env.POSTGRES_URL!);

/* ---------------- GET USER ---------------- */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    const result = await sql`
      SELECT 
        name,
        email,
        about,
        profile_img AS "profileImg",
        banner_img AS "bannerImg",
        address,
        phone
      FROM patients
      WHERE id = ${Number(id)}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/* ---------------- POST UPDATE USER ---------------- */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const userId = formData.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const about = formData.get("about") as string;

    const profileFile = formData.get("profile");
    const bannerFile = formData.get("banner");

    let profileUrl: string | null = null;
    let bannerUrl: string | null = null;

    /* -------- CLOUDINARY UPLOAD HELPER -------- */
    const uploadToCloudinary = async (file: File) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "users", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!.secure_url);
          }
        );
        stream.end(buffer);
      });
    };

    if (profileFile instanceof File && profileFile.size > 0) {
      profileUrl = await uploadToCloudinary(profileFile);
    }

    if (bannerFile instanceof File && bannerFile.size > 0) {
      bannerUrl = await uploadToCloudinary(bannerFile);
    }

    /* -------- UPDATE QUERY -------- */
    const result = await sql`
      UPDATE patients
      SET
        name = ${name},
        email = ${email},
        about = ${about},
        profile_img = COALESCE(${profileUrl}, profile_img),
        banner_img = COALESCE(${bannerUrl}, banner_img)
      WHERE id = ${Number(userId)}
      RETURNING 
        name,
        email,
        about,
        profile_img AS "profileImg",
        banner_img AS "bannerImg",
        address,
        phone
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Update failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error while updating" },
      { status: 500 }
    );
  }
}
