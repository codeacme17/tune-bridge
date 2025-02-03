import { KEYS } from "@/lib/constants";

export const spotify = {
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
