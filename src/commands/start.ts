import { Command } from '../utils/commandLoader';

export const name = 'start';
export const description = 'Start the bot and get a welcome message';
export const restricted = false;

export const execute: Command['execute'] = async (ctx, steamService) => {
    const accountCount = steamService.getAccountNames().length;
    const message = `Hello! 👋\n\nI'm your Steam 2FA bot. I have ${accountCount} Steam account${
        accountCount !== 1 ? 's' : ''
    } loaded.\n\nUse /code to get your Steam Guard codes.`;

    await ctx.reply(message);
};
