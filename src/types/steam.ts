export interface SteamAccount {
    account_name: string;
    steamid: string;
    shared_secret: string;
    identity_secret?: string;
    revocation_code?: string;
    uri?: string;
    server_time?: number;
    account_name_encrypted?: boolean;
    device_id?: string;
    secret_1?: string;
    status?: number;
    token_gid?: string;
}

export interface SteamAccounts {
    [accountName: string]: SteamAccount;
}
