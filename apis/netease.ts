const NETEASE_HOST = "https://apis.netstart.cn/music";

export const netease = {
  getUserAccount: async (cookie: string) => {
    try {
      const res = await fetch(
        `${NETEASE_HOST}/user/account?&timestamp=${Date.now()}`,
        {
          method: "POST",
          body: JSON.stringify({ cookie }),
        }
      );

      if (!res.ok) throw new Error(`[netease login POST] Error: ${res.status}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("[netease login GET] Error: ", error);
      return error;
    }
  },

  login: async (phone: string, password: string) => {
    try {
      const res = await fetch(
        `${NETEASE_HOST}/login?phone=${phone}&password=${password}`,
        {
          method: "GET",
        }
      );
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }
  },

  loginStatus: async () => {
    try {
      const res = await fetch(
        `${NETEASE_HOST}/login/status?&timestamp=${Date.now()}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) throw new Error(`[netease login GET] Error: ${res.status}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("[netease login GET] Error: ", error);
      return error;
    }
  },

  queryQrStatus: async (unikey: string) => {
    try {
      const res = await fetch(
        `${NETEASE_HOST}/login/qr/check?key=${unikey}&timestamp=${Date.now()}`,
        {
          method: "GET",
        }
      );
      if (!res.ok) throw new Error(`[netease login GET] Error: ${res.status}`);
      const { code, cookie } = await res.json();
      return { code, cookie };
    } catch (error) {
      console.log("error", error);
      return error;
    }
  },

  createQRCode: async () => {
    try {
      const keyRes = await fetch(
        `${NETEASE_HOST}/login/qr/key?timestamp=${Date.now()}`,
        {
          method: "GET",
        }
      );

      if (!keyRes.ok)
        throw new Error(`[netease login GET] Error: ${keyRes.status}`);
      const { data: keyData } = await keyRes.json();
      const { unikey: key } = keyData || {};

      const createRes = await fetch(
        `${NETEASE_HOST}/login/qr/create?key=${key}&qrimg=true`,
        {
          method: "GET",
        }
      );

      if (!createRes.ok)
        throw new Error(`[netease login GET] Error: ${createRes.status}`);
      const { data: createData } = await createRes.json();
      const { qrimg } = createData || {};

      return { qrimg, unikey: key };
    } catch (error) {
      console.log("error", error);
      return error;
    }
  },
};
