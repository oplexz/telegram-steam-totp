import 'dotenv/config';
import { Bot } from 'grammy';
import { SteamService } from './services/SteamService';
import { loadCommands } from './utils/commandLoader';
import { logger } from './utils/logger';
import { handleCallback } from './commands/code';

const bot = new Bot(process.env.TELEGRAM_TOKEN!);
const steamService = new SteamService();

loadCommands(bot, steamService);

bot.on('callback_query:data', async (ctx) => {
    const action = ctx.callbackQuery.data;

    if (action === 'accounts') {
        const keyboard = steamService.createAccountPicker();
        await ctx.editMessageText('Pick an account below:', {
            reply_markup: keyboard,
        });
        await ctx.answerCallbackQuery();
    } else if (steamService.getAccount(action)) {
        await handleCallback(ctx, steamService, action);
    } else {
        await ctx.answerCallbackQuery('Unknown action');
    }
});

bot.catch((err) => {
    logger.error('Bot error:', err);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully...');
    await bot.stop();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    await bot.stop();
    process.exit(0);
});

try {
    logger.info('Starting bot...');
    bot.start();
    logger.info('Bot started successfully!');
} catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
}
