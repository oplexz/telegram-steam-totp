// TODO: Fix this mess

require("dotenv").config();

const fs = require("fs");
const moment = require("moment");
const chalk = require("chalk");
const humanize = require("humanize-duration");

const log = (...args) => {
    fs.appendFileSync("log.txt", `${moment().format()} ${require("util").inspect(args).toString()}\n`)
    console.log(chalk.gray(moment().format()), ...args);
}

const SteamTotp = require("steam-totp");

process.env.NTBA_FIX_319 = true;
const TelegramBot = require("node-telegram-bot-api");

const getAccounts = () => {
    let accounts = {};
    try {
        fs.readdirSync("accounts")
            .filter(filename => filename.startsWith("Steamguard-"))
            .forEach(file => {
                const obj = JSON.parse(fs.readFileSync(`accounts/${file}`, "utf8"));
                accounts[obj.account_name] = obj;
            });
    } catch (err) {
        log(err);
        process.exit(1);
    }

    return accounts;
}

log("Hello World!");

// smh... fix.
const accountPicker = (opts = {}) => {
    const inline_keyboard = [];

    const accounts = getAccounts();

    Object.keys(accounts).forEach(name => {
        const account = accounts[name];
        inline_keyboard.push([{
            text: account.account_name,
            callback_data: account.account_name
        }])
    })

    return [`Pick an account below:`, {
        reply_markup: JSON.stringify({
            inline_keyboard: inline_keyboard
        }),
        ...opts
    }]
}

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
    polling: true
});

bot.on("polling_error", (error) => {
    log(error); // => "EFATAL" (?)
});

bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const reply = (...args) => bot.sendMessage(chatId, ...args);

    // This only lets bot_command entities pass
    if (msg.entities == undefined || msg.entities[0].type != "bot_command") {
        // log(`[ignored] Message from ${msg.chat.username} (${chatId})`, msg);
        // reply("I can only understand commands :(\nPlease send a valid command!");
        return;
    };

    const isAllowed = (id) => process.env.ALLOWED_IDS.split(" ").map(x => Number(x)).includes(id);

    const text = msg.text;

    if (!text.startsWith("/")) return;

    log(`${msg.chat.username || msg.chat.first_name} (${chatId}): ${text}`);

    const cmd = text.substring(1, msg.entities[0].length);
    const argStr = text.substring(msg.entities[0].length + 1, text.length);

    switch (cmd) {
        case "start":
            reply("Hi!");
            break;

        case "status":
            const process = require("process");
            const os = require("os");
            reply(`User: <code>${os.userInfo().username}@${os.hostname}</code>\n` +
                `System uptime: <code>${humanize(os.uptime*1e3, { round: true })}</code>\n` +
                `Process uptime: <code>${humanize(process.uptime()*1e3, { round: true })}</code>\n` +
                `Node version: <code>${process.version}</code>`, {
                    parse_mode: "HTML"
                });
            break;

        case "id":
            reply(chatId);
            break;

        case "test":
            reply("Test message with a button", {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{
                                text: "X1Y1",
                                callback_data: "example"
                            },
                            {
                                text: "X2Y1",
                                callback_data: "example"
                            }
                        ],
                        [{
                                text: "X1Y2",
                                callback_data: "example"
                            },
                            {
                                text: "X2Y2",
                                callback_data: "example"
                            }
                        ]
                    ]
                })
            });
            break;

        case "code":
            if (!isAllowed(chatId)) {
                reply("Sorry, you're not whitelisted!");
                return;
            }

            reply(...accountPicker());

            // https://steamcommunity.com/profiles/${steamData.steamid}
            // steamData.account_name
            // SteamTotp.getAuthCode(steamData.shared_secret)

            break;

        case "creds":
            if (isAllowed(chatId)) {
                reply("Sorry, you're not whitelisted!");
                return;
            }
            reply("WIP, come back later!");
            break;

        case "eval":
            if (isAllowed(chatId)) {
                reply("Sorry, you're not whitelisted!");
                return;
            }

            let out;
            try {
                out = require("util").inspect(eval(argStr)).toString();
            } catch (e) {
                out = e.toString();
            }
            reply(out);
            break;
    }
});

bot.on("callback_query", onCallbackQuery = (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;

    const accounts = getAccounts();

    if (Object.keys(accounts).includes(action)) {
        account = accounts[action];

        const text = `Account: <a href="https://steamcommunity.com/profiles/${account.steamid}">${account.account_name}</a>\n` +
            `Code: <code>${SteamTotp.getAuthCode(account.shared_secret)}</code>\n\n` +
            `Updated on ` + moment().format("lll") + ` (${Math.floor(Math.random()*1000)})`;
            // API returns weird stuff when you're updating message with same content, cba to handle => add random number

        const opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
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
        bot.editMessageText(...accountPicker({
            chat_id: msg.chat.id,
            message_id: msg.message_id
        }));
    }
});

process.on("SIGINT", function () {
    log("SIGINT receieved, goodbye :)");

    process.exit();
});
