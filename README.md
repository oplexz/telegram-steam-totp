# tg-steam-2fa

A simple bot that allows you to receive Steam Guard codes via Telegram

### Usage:
- Clone the repository
- Rename `.env.example` to `.env` and fill the fields
- Add accounts to the `accounts` directory (files should start with `Steamguard-`)
- Install the packages (`npm i`)
- Install pm2 (`npm i -g pm2`)
- Run `npm start`

### TODO:
- Refine

### Problems:
- pm2 seems to start the process twice? causes error 409
