import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const urlQuery = new URLSearchParams(req.url?.split("?")[1]);
  const phone = urlQuery.get("phone");
  const password = urlQuery.get("password");

  if (!phone || !password) {
    return new NextResponse("Missing phone or password", { status: 400 });
  }

  try {
    const res = await fetch(`https://apis.netstart.cn/music/login/qr/key`, {
      method: "GET",
    });

    if (!res.ok) throw new Error(`[netease login GET] Error: ${res.status}`);
    const data = await res.json();
    console.log("[/login/qr/key] data ====>", data);
    return new NextResponse(JSON.stringify(data));
  } catch (error) {
    console.log("[netease login GET] Error: ", error);
    return new NextResponse(error as string, { status: 500 });
  }
};
