import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Missing Spotify client ID or client secret");
}

const sdk = SpotifyApi.withClientCredentials(CLIENT_ID, CLIENT_SECRET, [
  "playlist-modify-public",
  "user-modify-playback-state",
]);

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
    return "No song found";
  }
};
