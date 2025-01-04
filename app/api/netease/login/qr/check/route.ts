import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const urlQuery = new URLSearchParams(req.url?.split("?")[1]);
  const key = urlQuery.get("key");

  try {
    const res = await fetch(
      `https://apis.netstart.cn/music/login/qr/check?key=${key}&timestamp=${Date.now()}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) throw new Error(`[netease login GET] Error: ${res.status}`);
    const data = await res.json();
    const response = new NextResponse(JSON.stringify(data));
    response.headers.append("Set-Cookie", data.cookie);
    return response;
  } catch (error) {
    console.log("[netease login GET] Error: ", error);
    return new NextResponse(error as string, { status: 500 });
  }
};
