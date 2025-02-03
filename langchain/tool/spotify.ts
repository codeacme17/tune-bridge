import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { DynamicStructuredTool, DynamicTool } from "langchain/tools";
import { spotifyService } from "@/service";

const authorizeTool = tool(() => spotifyService.authorize(), {
  name: "getToken",
  description: "Get access token",
});

const getCurrentUserProfileTool = tool(
  (token: string) => spotifyService.getCurrentUserProfile(token),
  {
    name: "getCurrentUserProfile",
    description: "Get the current user's profile",
    schema: z.string().describe("The user token"),
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

const findUriByNameTool = new DynamicTool({
  name: "findSongByName",
  description: "Use a song name to find a song uri",
  func: (input: string) => spotifyService.findSongByName(input),
  returnDirect: true,
});

const findUriByLyricsTool = new DynamicStructuredTool({
  name: "findUriByLyrics",
  description: "Use lyrics to find a song uri",
  schema: z.object({
    lyrics: z.string().describe("lyrics in the user's request"),
  }),
  returnDirect: true,
  func: ({ lyrics }) => spotifyService.findUriByLyrics(lyrics),
});

export const spotifyTools = [
  authorizeTool,
  getCurrentUserProfileTool,
  findUriByNametool,
  getUserPlaylistsTool,
  getPlayListTool,
];
