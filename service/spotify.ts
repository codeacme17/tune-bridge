import { apis } from "@/apis";
import { KEYS } from "@/lib/constants";
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
    // if (localStorage.getItem("spotify_token"))
    //   return localStorage.getItem("spotify_token");

    const res = await apis.spotify.authorize();
    console.log("spotify authorize", res);
    localStorage.setItem("spotify_token", res.access_token);
    return JSON.stringify(res.access_token);
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
