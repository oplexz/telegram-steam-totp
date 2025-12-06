import fs from 'fs';
import path from 'path';
import { Command } from '../utils/commandLoader';

export const name = 'commands';
export const description = 'List all available commands';
export const restricted = false;

export const execute: Command['execute'] = async (ctx): Promise<void> => {
    const commandsDir = __dirname;
    // eslint-disable-next-line no-undef
    const currentFile = path.basename(__filename);

    try {
        const commandFiles = fs
            .readdirSync(commandsDir)
            .filter((file) => file.endsWith('.ts') && file !== currentFile);

        const commands = commandFiles
            .map((file) => {
                const commandPath = path.join(commandsDir, file);
                const commandModule = require(commandPath) as Partial<Command>;

                if (commandModule.name) {
                    return {
                        name: commandModule.name,
                        description:
                            commandModule.description ??
                            'No description provided',
                    };
                }

                return null;
            })
            .filter(Boolean)
            .sort((a, b) => a!.name.localeCompare(b!.name)) as {
            name: string;
            description: string;
        }[];

        if (commands.length === 0) {
            await ctx.reply('No commands available.');
            return;
        }

        const list = commands
            .map((cmd) => `${cmd.name} - ${cmd.description}`)
            .join('\n');

        await ctx.reply(list);
    } catch (error) {
        await ctx.reply('Failed to load command list.');
        throw error;
    }
};
