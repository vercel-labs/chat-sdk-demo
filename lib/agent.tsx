import { Output, ToolLoopAgent } from "ai";
import { openai } from "@ai-sdk/openai";
import z from "zod";

export const agent = new ToolLoopAgent({
  model: "openai/gpt-5.2-chat",
  instructions:
    "You are a helpful assistant. You are given a question and you need to answer it using the tools provided. Provide very brief answers. DO NOT inline links to your sources.",
  tools: {
    web_search: openai.tools.webSearch({
      searchContextSize: "high",
    }),
  },
  output: Output.object({
    schema: z.object({
      title: z.string().describe("The title of the answer"),
      sources: z
        .array(
          z.object({
            title: z.string().describe("The title of the source"),
            url: z.string().describe("The URL of the source"),
          }),
        )
        .describe("The sources of the answer"),
      answer: z.string().describe("The answer to the question"),
    }),
  }),
});
