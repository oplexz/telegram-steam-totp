module.exports = {
    data: {
        name: "status",
        restricted: false
    },

    run(ctx) {
        const process = require("process");
        const os = require("os");
        const humanize = require("humanize-duration");

        ctx.reply(`User: <code>${os.userInfo().username}@${os.hostname}</code>\n` +
            `System uptime: <code>${humanize(os.uptime * 1e3, { round: true })}</code>\n` +
            `Process uptime: <code>${humanize(process.uptime() * 1e3, { round: true })}</code>\n` +
            `Node version: <code>${process.version}</code>`, {
            parse_mode: "HTML"
        });
    }
}
