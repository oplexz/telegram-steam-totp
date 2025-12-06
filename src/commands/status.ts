import dayjs from 'dayjs';
import os from 'os';
import process from 'process';
import { execSync } from 'child_process';
import { Command } from '../utils/commandLoader';

export const name = 'status';
export const description = 'Get system and process status information';
export const restricted = false;

export const execute: Command['execute'] = async (ctx): Promise<void> => {
    const userInfo = os.userInfo();
    const hostname = os.hostname();

    const systemStartTime = dayjs().subtract(os.uptime(), 'seconds');
    const processStartTime = dayjs().subtract(process.uptime(), 'seconds');

    let gitCommit = 'unknown';
    try {
        gitCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' })
            .trim()
            .substring(0, 8);
    } catch {
        // Git not available or not in a git repository
    }

    let output = `Running as <code>${userInfo.username}</code> on <code>${hostname}</code>\n`;
    output += `System up since: <code>${systemStartTime.format(
        'YYYY-MM-DD HH:mm:ss'
    )}</code>\n`;
    output += `Process up since: <code>${processStartTime.format(
        'YYYY-MM-DD HH:mm:ss'
    )}</code>\n`;
    output += `Git commit: <code>${gitCommit}</code>`;

    await ctx.reply(output, {
        parse_mode: 'HTML',
    });
};
