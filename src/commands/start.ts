import { Command } from '../utils/commandLoader';

export const name = 'start';
export const description = 'Welcome message';
export const restricted = false;

export const execute: Command['execute'] = async (ctx) => {
    const message = `Hello! 👋\n\nUse /code to get your Steam Guard codes.`;

    await ctx.reply(message);
};
