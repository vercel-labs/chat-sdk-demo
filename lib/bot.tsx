import { Card, CardLink, CardText, Chat, Divider } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createRedisState } from "@chat-adapter/state-redis";
import { agent } from "./agent";
import { ModelMessage } from "ai";

export const bot = new Chat({
  userName: "mybot",
  adapters: {
    slack: createSlackAdapter(),
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
  const result = await agent.generate({ messages: [userMessage] });
  await thread.post(
    <Card>
      <CardText>{result.output.answer}</CardText>
      {result.output.sources.length > 0 && <Divider />}
      <CardText>Sources:</CardText>
      {result.output.sources.map((source) => (
        <CardLink key={source.url} url={source.url}>
          {source.title}
        </CardLink>
      ))}
    </Card>,
  );
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
  const result = await agent.generate({ messages });
  await thread.post(
    <Card>
      <CardText>{result.output.answer}</CardText>
      {result.output.sources.length > 0 && <Divider />}
      <CardText>Sources:</CardText>
      {result.output.sources.map((source) => (
        <CardLink key={source.url} url={source.url}>
          {source.title}
        </CardLink>
      ))}
    </Card>,
  );
});
