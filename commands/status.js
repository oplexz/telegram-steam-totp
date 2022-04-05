module.exports = {
    data: {
        name: "status",
        restricted: false
    },

    run(ctx) {
        const process = require("process");
        const os = require("os");
        const humanize = require("humanize-duration");

        const output = `User: <code>${os.userInfo().username}@${os.hostname}</code>\n` +
            `System uptime: <code>${humanize(os.uptime * 1e3, { round: true })}</code>\n` +
            `Process uptime: <code>${humanize(process.uptime() * 1e3, { round: true })}</code>\n` +
            (process.platform != "win32" ? `Load average: ${os.loadavg().join(", ")}\n` : "") +
            `Node version: <code>${process.version}</code>`

        ctx.reply(output, {
            parse_mode: "HTML"
        });
    }
}
