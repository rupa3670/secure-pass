import { NextResponse } from "next/server";

// Proxies the image to ImgBB from the server so IMGBB_API_KEY
// never reaches the browser. Keep this key WITHOUT the NEXT_PUBLIC_
// prefix in your .env so Next.js never bundles it client-side.
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const imgbbForm = new FormData();
    imgbbForm.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: "POST",
        body: imgbbForm,
      }
    );

    const data = await res.json();

    if (!res.ok || !data?.data?.url) {
      return NextResponse.json(
        { error: "Image upload failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: data.data.url });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong during upload" },
      { status: 500 }
    );
  }
}