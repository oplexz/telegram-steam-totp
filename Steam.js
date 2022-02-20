const Steam = {
    accounts: {},
    getAuthCode: (shared_secret) => require("steam-totp").getAuthCode(shared_secret),
    accountPicker: () => {
        const inline_keyboard = [];

        Object.keys(Steam.accounts).forEach(name => {
            const account = Steam.accounts[name];
            inline_keyboard.push([{
                text: account.account_name,
                callback_data: account.account_name
            }])
        });

        return {
            reply_markup: JSON.stringify({
                inline_keyboard: inline_keyboard
            })
        };
    }
};

try {
    const fs = require("fs");

    fs.readdirSync("accounts")
        .filter(filename => filename.startsWith("Steamguard-"))
        .forEach(file => {
            const data = JSON.parse(fs.readFileSync(`accounts/${file}`, "utf8"));
            Steam.accounts[data.account_name] = data;
        });
} catch (err) {
    console.error(err);
    process.exit(1);
}

module.exports = Steam;
