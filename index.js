require("dotenv").config();

const fs = require("fs");
const moment = require("moment");

const log = (...args) => {
    fs.appendFileSync("log.txt", `${moment().format()} ${require("util").inspect(args).toString()}\n`)
    console.log(require("chalk").gray(moment().format()), ...args);
}

const Steam = require("./Steam");

log("Hello World!");

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.commands = new Map();

try {
    const commandFiles = fs.readdirSync("commands").filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        bot.commands.set(command.data.name, command);
    }
} catch (error) {
    log("There was an error during command loading:", error);
}

bot.on("polling_error", (error) => log(error)); // Can apparently return EFATAL?

bot.on("message", (ctx) => {
    // This only lets bot_command entities pass
    if (ctx.entities == undefined || ctx.entities[0].type != "bot_command") return;

    const chatId = ctx.chat.id;
    const reply = (...args) => bot.sendMessage(chatId, ...args);
    const text = ctx.text;

    const command = bot.commands.get(text.substring(1, ctx.entities[0].length));

    if (!command) return;

    log(`${ctx.chat.username || ctx.chat.first_name} (${chatId}): ${text}`);

    ctx.bot = bot;
    ctx.reply = (text, options = {}) => bot.sendMessage(ctx.chat.id, text, options);
    ctx.argStr = text.substring(ctx.entities[0].length + 1, text.length);

    if (command.data.restricted && !process.env.ALLOWED_IDS.split(" ").map(x => Number(x)).includes(ctx.chat.id)) {
        ctx.reply("Sorry, you are not allowed to run this command!");
        return;
    }

    try {
        command.run(ctx);
    } catch (error) {
        log(error);
        ctx.reply("There was an error while executing this command!");
    }
});

bot.on("callback_query", onCallbackQuery = (callbackQuery) => {
    const action = callbackQuery.data;
    const ctx = callbackQuery.message;

    const accounts = Steam.accounts;

    if (Object.keys(accounts).includes(action)) {
        account = accounts[action];

        const text = `Account: <a href="https://steamcommunity.com/profiles/${account.steamid}">${account.account_name}</a>\n` +
            `Code: <code>${Steam.getAuthCode(account.shared_secret)}</code>\n\n` +
            `Updated on ` + moment().format("lll") + ` (${Math.floor(Math.random() * 1000)})`;
        // API returns weird stuff when you're updating message with same content, cba to handle => add random number

        const opts = {
            chat_id: ctx.chat.id,
            message_id: ctx.message_id,
            parse_mode: "HTML",
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{
                        text: "Back",
                        callback_data: "accounts"
                    },
                    {
                        text: "Refresh",
                        callback_data: action
                    }
                    ]
                ]
            })
        };


        bot.editMessageText(text, opts);
    } else if (action == "accounts") {
        bot.editMessageText("Pick an account below:", {
            ...Steam.accountPicker(),
            chat_id: ctx.chat.id,
            message_id: ctx.message_id
        });
    }
});

process.on("SIGINT", function () {
    log("SIGINT receieved, goodbye :)");

    process.exit();
});
