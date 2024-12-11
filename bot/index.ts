import { APP_URL, PORT, TELEGRAM_TOKEN } from "./constants";
import express, { Application } from "express";
import { Telegraf } from "telegraf";

const bot = new Telegraf(TELEGRAM_TOKEN);
const app: Application = express();

app.use(express.static("static"));
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});

bot.command("start", (ctx) => {
  if (ctx.from.is_bot) return;
  const chatId = ctx.chat.id;
  const userId = ctx.from.id;

  saveUserChatId(userId, chatId);

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
});

function saveUserChatId(userId: number, chatId: number) {
  fetch(`https://${APP_URL}:${PORT}/auth/user_session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({telegram_id: userId, chat_id: chatId })
  });
}

bot.launch();

export default app;