import { APP_URL, TELEGRAM_TOKEN } from "./constants";
import express, { Application } from "express";
import { Bot } from "grammy";

const bot = new Bot(TELEGRAM_TOKEN);
const app: Application = express();

app.use(express.static("static"));
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello World");
});

bot.command("start", (ctx) => {
  if (ctx.from) {
  if (ctx.from.is_bot) return;
  return ctx.reply(`Play 1xmm!`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `Play Game`,
            web_app: { url: `${APP_URL}/` },
          },
        ],
      ],
    },
  });
  }
});

bot.on("pre_checkout_query", (ctx) => {
  return ctx.answerPreCheckoutQuery(true).catch(() => {
    console.error("answerPreCheckoutQuery failed");
  });
});

bot.start();

export default app;