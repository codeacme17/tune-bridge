import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const urlQuery = new URLSearchParams(req.url?.split("?")[1]);
  const key = urlQuery.get("key");

  console.log("[/login/qr/create] key ====>", key);

  try {
    const res = await fetch(
      `https://apis.netstart.cn/music/login/qr/create?key=${key}&qrimg=true`,
      {
        method: "GET",
      }
    );

    if (!res.ok) throw new Error(`[netease login GET] Error: ${res.status}`);
    const data = await res.json();
    console.log("[/login/qr/key] data ====>", data);
    return new NextResponse(JSON.stringify(data));
  } catch (error) {
    console.log("[netease login GET] Error: ", error);
    return new NextResponse(error as string, { status: 500 });
  }
};
