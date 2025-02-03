import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const multiply = tool(
  ({ a, b }: { a: number; b: number }): string => {
    return `${a * b}`;
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  }
);
