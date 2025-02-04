import { apis } from "@/apis";
import { KEYS, REDIRECT_URI } from "@/lib/constants";
import { generateCodeChallenge, generateRandomString } from "@/lib/utils";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

if (!KEYS.SPOTIFY_CLIENT_ID || !KEYS.SPOTIFY_CLIENT_SECRET) {
  throw new Error("Missing Spotify client ID or client secret");
}

const sdk = SpotifyApi.withClientCredentials(
  KEYS.SPOTIFY_CLIENT_ID,
  KEYS.SPOTIFY_CLIENT_SECRET,
  ["playlist-modify-public", "user-modify-playback-state"]
);

export const authorize = async () => {
  try {
    const SCOPES = "user-read-private user-read-email";

    async function handleSpotifyCallback() {
      const authCode = localStorage.getItem("spotify_authCode") || "";
      if (authCode) {
        await apis.spotify.fetchAccessToken(authCode);
      }
    }

    async function redirectToSpotifyLogin(): Promise<void> {
      const codeVerifier = generateRandomString(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      localStorage.setItem("spotify_code_verifier", codeVerifier);

      const authUrl = new URL("https://accounts.spotify.com/authorize");
      authUrl.searchParams.append(
        "client_id",
        KEYS.SPOTIFY_CLIENT_ID as string
      );
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
      authUrl.searchParams.append("scope", SCOPES);
      authUrl.searchParams.append("code_challenge_method", "S256");
      authUrl.searchParams.append("code_challenge", codeChallenge);

      const popup = window.open(
        authUrl.toString(),
        "Spotify Login",
        "popup,width=600,height=600"
      );

      return new Promise<void>((resolve, reject) => {
        const interval = setInterval(() => {
          if (popup?.closed) {
            clearInterval(interval);
            handleSpotifyCallback()
              .then((res) => {
                console.log("resolve", res), resolve(res);
              })
              .catch(reject);
          }
        }, 1000);
      });
    }

    const res = await redirectToSpotifyLogin();

    return res;
  } catch (error) {
    console.error(error);
    return `${error}`;
  }
};

export const getCurrentUserProfile = async (token: string) => {
  try {
    const res = await apis.spotify.getCurrentProfile(token);
    console.log("spotify current user", res);
    return JSON.stringify(res);
  } catch (error) {
    console.error(error);
    return `${error}`;
  }
};

export const findSongByName = async (name: string) => {
  const res = await sdk.search(name, ["track"]);
  return res.tracks.items[0].uri;
};

export const playUri = async (uri: string) => {};

export const skipNext = async () => {
  const res = await sdk.player.skipToNext("Bearer");
  return "Skipped to next song";
};

export const findUriByLyrics = async (lyrics: string) => {
  try {
    const res = await sdk.search(`lyrics:${lyrics}`, ["track"]);
    console.log(res.tracks.items[0].uri);
    return res.tracks.items[0].uri;
  } catch (error) {
    console.error(error);
    return `${error}`;
  }
};

export const getUserPlaylists = async (userId: string) => {
  if (!userId) return "please let user enter their user id";

  try {
    const res = await sdk.playlists.getUsersPlaylists(userId);
    return JSON.stringify(res.items);
  } catch (error) {
    console.error(error);
    return `${error}`;
  }
};

export const getPlaylist = async (playlistId: string) => {
  try {
    const res = await sdk.playlists.getPlaylist(playlistId);
    return JSON.stringify(res);
  } catch (error) {
    console.error(error);
    return `${error}`;
  }
};
