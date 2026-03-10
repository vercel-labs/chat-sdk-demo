import { ToolLoopAgent } from "ai";
import { openai } from "@ai-sdk/openai";

export const agent = new ToolLoopAgent({
  model: "openai/gpt-5.2-chat",
  instructions:
    "You are a helpful assistant. You are given a question and you need to answer it using the tools provided. Provide very brief answers.",
  tools: {
    web_search: openai.tools.webSearch({
      searchContextSize: "high",
    }),
  },
});
