import Command from "./Command";
import { Context } from "telegraf";

import { getAccounts } from "../Steam";
import { getAuthCode } from "steam-totp";

export default class Code extends Command {
    constructor() {
        super("code", "Generates Steam Guard codes");
    }

    async call(ctx: Context): Promise<void> {
        const accounts = await getAccounts();

        let replyMessage = "";
        if (accounts.size < 1) {
            ctx.reply("No accounts found!");
        }

        accounts.forEach(
            (account) => (replyMessage += `${account.account_name} -- ${getAuthCode(account.shared_secret)}\n`)
        );
        ctx.reply(replyMessage.length > 0 ? replyMessage : "Something went wrong!");
    }
}
