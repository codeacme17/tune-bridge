import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { spotifyService } from "@/service";

const fetchAccessTokenTool = tool(() => spotifyService.fetchAccessToken(), {
  name: "loginSpotifyTool",
  description: "Login to Spotify and get the access token",
});

const getCurrentUserProfileTool = tool(
  (token: string) => spotifyService.getCurrentUserProfile(token),
  {
    name: "getCurrentUserProfile",
    description: "Get the current user's profile",
    schema: z.string().describe("The user's access token"),
  }
);

const getAvailableDevicesTool = tool(
  (token: string) => spotifyService.getAvailableDevices(token),
  {
    name: "getAvailableDevices",
    description: "Get available devices",
    schema: z.string().describe("The user's access token"),
  }
);

const playUriTool = tool(
  ({ uri, deviceId }: { uri: string; deviceId: string }) =>
    spotifyService.playUri(uri, deviceId),
  {
    name: "playUri",
    description: "Play a song by uri",
    schema: z.object({
      uri: z.string().describe("The song uri"),
      deviceId: z.string().describe("The device id"),
    }),
  }
);

const skipNextTool = tool(
  (deviceId: string) => spotifyService.skipNext(deviceId),
  {
    name: "skipNext",
    description: "Skip to the next song",
    schema: z.string().describe("The device id"),
  }
);

const findUriByNametool = tool(
  (input: string) => spotifyService.findSongByName(input),
  {
    name: "findSongByName",
    description: "Use a song name to find a song uri",
    schema: z.string(),
  }
);

const getUserPlaylistsTool = tool(
  (userId: string) => spotifyService.getUserPlaylists(userId),
  {
    name: "getUserPlaylists",
    description: "Get the user's playlists",
  }
);

const getPlayListTool = tool(
  (userId: string) => spotifyService.getPlaylist(userId),
  {
    name: "getPlaylist",
    description: "Get a playlist by id",
  }
);

export const spotifyTools = [
  fetchAccessTokenTool,
  getCurrentUserProfileTool,
  getAvailableDevicesTool,
  playUriTool,
  findUriByNametool,
  getUserPlaylistsTool,
  getPlayListTool,
  skipNextTool,
];
