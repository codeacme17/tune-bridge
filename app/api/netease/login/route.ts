import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  console.log("[netease login GET] Request: ", req);

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`[netease login GET] Error: ${res.status}`);
    }

    const data = await res.json();
    console.log("[netease login GET] Data: ", data);

    return new NextResponse(JSON.stringify(data));
  } catch (error) {
    console.log("[netease login GET] Error: ", error);
    return new NextResponse(error as string, { status: 500 });
  }
};
