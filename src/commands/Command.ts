import { Context } from "telegraf";

export default abstract class Command {
    name: string;
    description: string;

    constructor(name: string, description: string) {
        this.name = name.toLocaleLowerCase();
        this.description = description;
    }

    abstract call(ctx: Context): void;
}
