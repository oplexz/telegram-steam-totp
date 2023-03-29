import Command from "./Command";
import { Context, Markup } from "telegraf";

export default class Test extends Command {
    constructor() {
        super("test", "Ping command");
    }

    async call(ctx: Context): Promise<void> {
        ctx.reply("Keyboard Test Message", {
            ...Markup.inlineKeyboard([
                Markup.button.callback("Button1", "action1"),
                Markup.button.callback("Button2", "action2")
            ])
        });
    }
}

/*
bot.action(/action\d/, ctx => {
	return ctx.answerCbQuery(`Inline keyboard button pressed: ${ctx.match[0]}`);
});
*/
