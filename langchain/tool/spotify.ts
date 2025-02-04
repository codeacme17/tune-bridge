import { DynamicTool } from "langchain/tools";
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { spotifyService } from "@/service";

const fetchAccessTokenTool = tool(() => spotifyService.fetchAccessToken(), {
  name: "fetchAccessTokenTool",
  description: "Get access token",
});

const getCurrentUserProfileTool = tool(
  (token: string) => spotifyService.getCurrentUserProfile(token),
  {
    name: "getCurrentUserProfile",
    description: "Get the current user's profile",
    schema: z.string().describe("The user's access token"),
  }
);

const skipNextTool = new DynamicTool({
  name: "skipNext",
  description: "Skip to the next song",
  func: () => spotifyService.skipNext(),
  returnDirect: true,
});

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
  findUriByNametool,
  getUserPlaylistsTool,
  getPlayListTool,
];
