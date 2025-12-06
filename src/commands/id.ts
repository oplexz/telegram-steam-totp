import { Command } from '../utils/commandLoader';

export const name = 'id';
export const description = 'Get your Telegram user/chat ID';
export const restricted = false;

export const execute: Command['execute'] = async (ctx): Promise<void> => {
    await ctx.reply(`Your ID is <code>${ctx.chat?.id}</code>`, {
        parse_mode: 'HTML',
    });
};
