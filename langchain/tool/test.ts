import { testDialog } from "@/service/test";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const testDialogTool = tool((content: string) => testDialog(content), {
  name: "testDialog",
  description: "use this tool to test dialog",
  schema: z.string().describe("content in the user's request"),
});

export const testTools = [testDialogTool];
