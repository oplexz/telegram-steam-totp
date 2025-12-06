import dayjs from 'dayjs';
import { Command } from '../utils/commandLoader';
import { Context } from 'grammy';
import { SteamService } from '../services/SteamService';

export const name = 'code';
export const description = 'Get Steam Guard codes for your accounts';
export const restricted = true;

export const execute: Command['execute'] = async (ctx, steamService) => {
    if (!steamService.hasAccounts()) {
        await ctx.reply(
            'No Steam accounts found. Please add your Steam Guard files to the accounts directory.'
        );
        return;
    }

    const keyboard = steamService.createAccountPicker();
    await ctx.reply('Pick an account below:', { reply_markup: keyboard });
};

export const handleCallback = async (
    ctx: Context,
    steamService: SteamService,
    accountName: string
): Promise<void> => {
    const account = steamService.getAccount(accountName);

    if (!account) {
        await ctx.answerCallbackQuery('Account not found!');
        return;
    }

    const code = steamService.getAuthCode(account.shared_secret);
    const text =
        `Account: <a href="https://steamcommunity.com/profiles/${account.steamid}">${account.account_name}</a>\n` +
        `Code: <code>${code}</code>\n\n` +
        `Updated on ${dayjs().format('YYYY-MM-DD HH:mm:ss')} (${Math.floor(
            Math.random() * 1000
        )})`;

    // Create refresh keyboard
    const keyboard = {
        inline_keyboard: [
            [
                { text: 'Back', callback_data: 'accounts' },
                { text: 'Refresh', callback_data: accountName },
            ],
        ],
    };

    try {
        await ctx.editMessageText(text, {
            parse_mode: 'HTML',
            reply_markup: keyboard,
        });
        await ctx.answerCallbackQuery();
    } catch {
        // If edit fails, send new message
        await ctx.reply(text, { parse_mode: 'HTML' });
        await ctx.answerCallbackQuery();
    }
};
