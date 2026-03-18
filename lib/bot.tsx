/** @jsxImportSource chat */
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createDiscordAdapter } from "@chat-adapter/discord";
import { createRedisState } from "@chat-adapter/state-redis";
import { agent } from "./agent";
import { createGitHubAdapter } from "@chat-adapter/github";

export const bot = new Chat({
  userName: "Chat SDK Bot",
  adapters: {
    slack: createSlackAdapter(),
    discord: createDiscordAdapter(),
    github: createGitHubAdapter(),
  },
  state: createRedisState(),
});

bot.onNewMention(async (thread, message) => {
  await thread.startTyping();
  const result = await agent.stream({ prompt: message.text });
  await thread.post(result.fullStream);
});

bot.onDirectMessage(async (thread, message) => {
  await thread.startTyping();
  const result = await agent.stream({ prompt: message.text });
  await thread.post(result.fullStream);
});
