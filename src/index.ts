import { Context, Telegraf } from "telegraf";
import { Logger } from "tslog";
import * as dotenv from "dotenv";
import { globSync } from "glob";

const logger = new Logger({
    prettyLogTemplate: "{{dateIsoStr}}\t{{logLevelName}}\t[{{filePathWithLine}}{{name}}]\t"
});
logger.silly("Hello World!");
logger.info("Starting up");

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN as string);

async function registerCommands() {
    let commandsInfo = new Map<string, string>();

    const path = `${__dirname}/commands`;

    globSync("*", { cwd: path, ignore: ["Command.*"] }).forEach((fileName) => {
        const command = new (require(`${path}/${fileName}`).default)();

        bot.command(command.name, (command.call as (ctx: Context) => void).bind(command));

        commandsInfo.set(command.name, command.description);
    });

    bot.command("start", async (ctx) => {
        await ctx.reply(`Hello ${ctx.update.message.from.first_name}!`);
    });

    logger.info(`${commandsInfo.size} commands loaded (${Array.from(commandsInfo.keys()).join(", ")})`);
}

registerCommands();

logger.info("Starting the Telegram bot instance...");
bot.launch();

// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
