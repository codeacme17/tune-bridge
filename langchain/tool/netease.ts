import { tool } from "@langchain/core/tools";
import { neteaseService } from "@/service";

const loginNeteaseTool = tool(() => neteaseService.login(), {
  name: "netease_loginTool",
  description: "Netease - Login to netease and get the access token",
});

export const neteaseTools = [loginNeteaseTool];
