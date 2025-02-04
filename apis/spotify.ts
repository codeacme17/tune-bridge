import { KEYS, REDIRECT_URI } from "@/lib/constants";

export const spotify = {
  async fetchAccessToken() {
    const codeVerifier = localStorage.getItem("spotify_code_verifier") || "";
    const authCode = localStorage.getItem("spotify_authCode") || "";

    if (!codeVerifier) {
      throw new Error("Missing code_verifier");
    }

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: KEYS.SPOTIFY_CLIENT_ID as string,
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        `Spotify API Error: ${res.status} - ${JSON.stringify(data)}`
      );
    }

    localStorage.setItem("spotify_access_token", data.access_token);
    localStorage.setItem("spotify_refresh_token", data.refresh_token);

    return data;
  },

  async getCurrentProfile(accessToken: string) {
    try {
      if (localStorage.getItem("spotify_access_token")) {
        accessToken = localStorage.getItem("spotify_access_token") || "";
      }

      const res = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          `Spotify API Error: ${res.status} - ${JSON.stringify(data)}`
        );
      }

      return data;
    } catch (error) {
      console.error("Spotify get current user error:", error);
      throw error;
    }
  },

  async getAvailableDevices(accessToken: string) {
    if (localStorage.getItem("spotify_access_token")) {
      accessToken = localStorage.getItem("spotify_access_token") || "";
    }

    const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        `Spotify API Error: ${res.status} - ${JSON.stringify(data)}`
      );
    }

    const activeDevice = data.devices.find((device: any) => device.is_active);
    if (activeDevice) {
      localStorage.setItem("spotify_active_device", activeDevice.id);
    }
    return activeDevice;
  },

  async skipNext(deviceId: string) {
    try {
      const accessToken = localStorage.getItem("spotify_access_token") || "";

      const res = await fetch(
        `https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("skip next", res);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          `Spotify API Error: ${res.status} - ${JSON.stringify(data)}`
        );
      }

      return "Skipped to next song successfully";
    } catch (error) {
      console.error("Spotify skip next error:", error);
      throw error;
    }
  },
};
