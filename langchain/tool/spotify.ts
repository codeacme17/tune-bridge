import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { spotifyService } from "@/service";

const loginSpotifyTool = tool(() => spotifyService.login(), {
  name: "spotify_loginSpotifyTool",
  description: "Sptify - Login to Spotify and get the access token",
});

const getCurrentUserProfileSpotifyTool = tool(
  (token: string) => spotifyService.getCurrentUserProfile(token),
  {
    name: "spotify_fetCurrentUserProfile",
    description: "Sptify - Get the current user's profile",
    schema: z.string().describe("The user's access token"),
  }
);

const getAvailableDevicesSpotifyTool = tool(
  (token: string) => spotifyService.getAvailableDevices(token),
  {
    name: "spotify_getAvailableDevices",
    description: "Sptify - Get available devices",
    schema: z.string().describe("The user's access token"),
  }
);

const playUriSpotifyTool = tool(
  ({ uri, deviceId }: { uri: string; deviceId: string }) => spotifyService.playUri(uri, deviceId),
  {
    name: "spotify_playUri",
    description: "Sptify - Play a song by uri",
    schema: z.object({
      uri: z.string().describe("The song uri"),
      deviceId: z.string().describe("The device id"),
    }),
  }
);

const skipNextSpotifyTool = tool((deviceId: string) => spotifyService.skipNext(deviceId), {
  name: "spotify_skipNext",
  description: "Sptify - Skip to the next song",
  schema: z.string().describe("The device id"),
});

const findUriByNameSpotifyTool = tool((input: string) => spotifyService.findSongByName(input), {
  name: "spotify_findSongByName",
  description: "Sptify - Use a song name to find a song uri",
  schema: z.string(),
});

const getUserPlaylistsSpotifyTool = tool(
  (userId: string) => spotifyService.getUserPlaylists(userId),
  {
    name: "spotify_getUserPlaylists",
    description: "Sptify - Get the user's playlists",
  }
);

const getPlayListSpotifyTool = tool((userId: string) => spotifyService.getPlaylist(userId), {
  name: "spotify_getPlaylist",
  description: "Sptify - Get a playlist by id",
});

export const spotifyTools = [
  loginSpotifyTool,
  getCurrentUserProfileSpotifyTool,
  getAvailableDevicesSpotifyTool,
  playUriSpotifyTool,
  findUriByNameSpotifyTool,
  getUserPlaylistsSpotifyTool,
  getPlayListSpotifyTool,
  skipNextSpotifyTool,
];
