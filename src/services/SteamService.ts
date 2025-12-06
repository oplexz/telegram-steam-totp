import fs from 'fs';
import path from 'path';
import { getAuthCode } from 'steam-totp';
import { InlineKeyboard } from 'grammy';
import { SteamAccount, SteamAccounts } from '../types/steam';
import { logger } from '../utils/logger';

export class SteamService {
    private accounts: SteamAccounts = {};

    constructor() {
        this.loadAccounts();
    }

    private loadAccounts(): void {
        try {
            const accountsDir = 'accounts';

            if (!fs.existsSync(accountsDir)) {
                logger.warn('Accounts directory not found. Creating it...');
                fs.mkdirSync(accountsDir, { recursive: true });
                return;
            }

            const files = fs
                .readdirSync(accountsDir)
                .filter((filename) => filename.startsWith('Steamguard-'));

            if (files.length === 0) {
                logger.warn('No Steam Guard files found in accounts directory');
                return;
            }

            for (const file of files) {
                try {
                    const filePath = path.join(accountsDir, file);
                    const data = JSON.parse(
                        fs.readFileSync(filePath, 'utf8')
                    ) as SteamAccount;

                    if (data.account_name && data.shared_secret) {
                        this.accounts[data.account_name] = data;
                        logger.info(`Loaded account: ${data.account_name}`);
                    } else {
                        logger.warn(`Invalid account data in file: ${file}`);
                    }
                } catch (error) {
                    logger.error(`Error loading account file ${file}:`, error);
                }
            }

            logger.info(
                `Loaded ${Object.keys(this.accounts).length} Steam accounts`
            );
        } catch (error) {
            logger.error('Error loading Steam accounts:', error);
            throw new Error('Failed to load Steam accounts');
        }
    }

    public getAuthCode(sharedSecret: string): string {
        return getAuthCode(sharedSecret);
    }

    public getAccount(accountName: string): SteamAccount | undefined {
        return this.accounts[accountName];
    }

    public getAllAccounts(): SteamAccounts {
        return { ...this.accounts };
    }

    public getAccountNames(): string[] {
        return Object.keys(this.accounts);
    }

    public createAccountPicker(): InlineKeyboard {
        const keyboard = new InlineKeyboard();

        const accountNames = this.getAccountNames();

        if (accountNames.length === 0) {
            return keyboard;
        }

        for (const accountName of accountNames) {
            keyboard.text(accountName, accountName).row();
        }

        return keyboard;
    }

    public hasAccounts(): boolean {
        return Object.keys(this.accounts).length > 0;
    }
}
