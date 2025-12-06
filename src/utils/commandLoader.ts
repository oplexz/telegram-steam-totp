import fs from 'fs';
import path from 'path';
import { Bot, Context } from 'grammy';
import { SteamService } from '../services/SteamService';
import { logger } from './logger';

export interface Command {
    name: string;
    description?: string;
    restricted: boolean;
    execute: (ctx: Context, steamService: SteamService) => Promise<void> | void;
}

export function loadCommands(bot: Bot, steamService: SteamService): void {
    try {
        const commandsDir = path.join(__dirname, '../commands');

        if (!fs.existsSync(commandsDir)) {
            logger.warn('Commands directory not found');
            return;
        }

        const commandFiles = fs
            .readdirSync(commandsDir)
            .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
            .filter((file) => !file.endsWith('.d.ts'));

        for (const file of commandFiles) {
            try {
                const commandPath = path.join(commandsDir, file);
                const command = require(commandPath) as Command;

                if (command.name && command.execute) {
                    bot.command(command.name, async (ctx) => {
                        // Check if command is restricted
                        if (command.restricted) {
                            const allowedIds =
                                process.env.ALLOWED_IDS?.split(' ').map((id) =>
                                    parseInt(id)
                                ) || [];
                            if (!allowedIds.includes(ctx.from?.id || 0)) {
                                await ctx.reply(
                                    'Sorry, you are not allowed to run this command!'
                                );
                                return;
                            }
                        }

                        logger.info(
                            `${ctx.from?.username || ctx.from?.first_name} (${
                                ctx.from?.id
                            }): /${command.name}`
                        );

                        try {
                            await command.execute(ctx, steamService);
                        } catch (error) {
                            logger.error(
                                `Error executing command ${command.name}:`,
                                error
                            );
                            await ctx.reply(
                                'There was an error while executing this command!'
                            );
                        }
                    });

                    logger.info(`Loaded command: ${command.name}`);
                } else {
                    logger.warn(`Invalid command file: ${file}`);
                }
            } catch (error) {
                logger.error(`Error loading command file ${file}:`, error);
            }
        }
    } catch (error) {
        logger.error('Error loading commands:', error);
    }
}
