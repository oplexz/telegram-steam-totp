import Command from "./Command";
import { Context } from "telegraf";

export default class Ping extends Command {
    constructor() {
        super("ping", "Ping command");
    }

    async call(ctx: Context): Promise<void> {
        ctx.reply("Pong!");
    }
}
