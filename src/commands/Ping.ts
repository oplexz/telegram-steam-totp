import { Context } from "telegraf";
import Command from "./Command";

export default class Ping extends Command {
    constructor() {
        super("ping", "Ping command");
    }

    async call(ctx: Context): Promise<void> {
        ctx.reply("Pong!");
    }
}
