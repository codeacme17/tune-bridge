import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const res = await fetch(
      `https://apis.netstart.cn/music/login/qr/key?&timestamp=${Date.now()}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) throw new Error(`[netease login GET] Error: ${res.status}`);
    const data = await res.json();
    return new NextResponse(JSON.stringify(data));
  } catch (error) {
    console.log("[netease login GET] Error: ", error);
    return new NextResponse(error as string, { status: 500 });
  }
};
