/** @jsxImportSource chat */
import { Actions, Button, Card, CardText, Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createDiscordAdapter } from "@chat-adapter/discord";
import { createRedisState } from "@chat-adapter/state-redis";

export const bot = new Chat({
  userName: "mybot",
  adapters: {
    slack: createSlackAdapter(),
    discord: createDiscordAdapter(),
  },
  state: createRedisState(),
});

bot.onNewMention(async (thread) => {
  await thread.post(
    <Card>
      <CardText>Hello, world!</CardText>
      <Actions>
        <Button id="continue" style="primary">
          Continue
        </Button>
        <Button id="cancel" style="danger">
          Cancel
        </Button>
      </Actions>
    </Card>,
  );
});
