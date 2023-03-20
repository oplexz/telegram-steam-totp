import { Telegraf } from "telegraf";
import { Logger } from "tslog";

const logger = new Logger();
logger.silly("Hello World!");

import * as dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN as string);

bot.use(Telegraf.log());

bot.command("start", async (ctx) => {
    await ctx.reply(`Hello ${ctx.update.message.from.first_name}!`);
});

logger.info("Starting the Telegram bot instance...");
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
