/** @jsxImportSource chat */
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createDiscordAdapter } from "@chat-adapter/discord";
import { createRedisState } from "@chat-adapter/state-redis";
import { agent } from "./agent";
import { ModelMessage } from "ai";

export const bot = new Chat({
  userName: "mybot",
  adapters: {
    slack: createSlackAdapter(),
    discord: createDiscordAdapter(),
  },
  state: createRedisState(),
});

bot.onNewMention(async (thread, message) => {
  await thread.subscribe();
  await thread.startTyping();
  const userMessage = {
    role: "user" as const,
    content: message.text,
  };
  const result = await agent.stream({ messages: [userMessage] });
  await thread.post(result.fullStream);
});

bot.onSubscribedMessage(async (thread) => {
  await thread.startTyping();
  const messages: ModelMessage[] = [];
  for await (const msg of thread.allMessages) {
    messages.push({
      role: msg.author.isBot ? ("assistant" as const) : ("user" as const),
      content: msg.text,
    });
  }
  const result = await agent.stream({ messages });
  await thread.post(result.fullStream);
});
