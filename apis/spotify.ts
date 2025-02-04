import { KEYS, REDIRECT_URI } from "@/lib/constants";

export const spotify = {
  async fetchAccessToken(authCode: string) {
    const codeVerifier = localStorage.getItem("spotify_code_verifier");
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

  async authorize() {
    try {
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              KEYS.SPOTIFY_CLIENT_ID + ":" + KEYS.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          `Spotify API Error: ${res.status} - ${JSON.stringify(data)}`
        );
      }

      return data;
    } catch (error) {
      console.error("Spotify authorization error:", error);
      throw error;
    }
  },

  async getCurrentProfile(token: string) {
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
};
