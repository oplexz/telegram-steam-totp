import { readdirSync, readFileSync } from "fs";

export class SteamAccountData {
    shared_secret: string;
    serial_number: number;
    revocation_code: string;
    uri: string;
    server_time: number;
    account_name: string;
    token_gid: string;
    identity_secret: string;
    secret_1: string;
    status: null;
    steamguard_scheme: number;
    steamid: number;

    constructor(data: {
        shared_secret: string;
        serial_number: number;
        revocation_code: string;
        uri: string;
        server_time: number;
        account_name: string;
        token_gid: string;
        identity_secret: string;
        secret_1: string;
        status: null;
        steamguard_scheme: number;
        steamid: number;
    }) {
        this.shared_secret = data.shared_secret;
        this.serial_number = data.serial_number;
        this.revocation_code = data.revocation_code;
        this.uri = data.uri;
        this.server_time = data.server_time;
        this.account_name = data.account_name;
        this.token_gid = data.token_gid;
        this.identity_secret = data.identity_secret;
        this.secret_1 = data.secret_1;
        this.status = data.status;
        this.steamguard_scheme = data.steamguard_scheme;
        this.steamid = data.steamid;
    }
}

export async function getAccounts() {
    let accounts = new Map<string, SteamAccountData>();

    try {
        readdirSync("accounts")
            .filter((filename) => filename.startsWith("Steamguard-"))
            .forEach((file) => {
                const data: SteamAccountData = JSON.parse(readFileSync(`accounts/${file}`, "utf8"));
                accounts.set(data.account_name, data);
            });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    return accounts;
}
