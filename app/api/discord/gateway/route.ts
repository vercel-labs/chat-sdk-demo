import { after } from "next/server";
import { bot } from "@/lib/bot";

export const maxDuration = 800;

export async function GET(request: Request): Promise<Response> {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return new Response("CRON_SECRET not configured", { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const durationMs = 600 * 1000;
  const webhookUrl = `https://${process.env.VERCEL_URL}/api/webhooks/discord`;

  await bot.initialize();

  return bot.getAdapter("discord").startGatewayListener(
    { waitUntil: (task: Promise<unknown>) => after(() => task) },
    durationMs,
    undefined,
    webhookUrl,
  );
}
