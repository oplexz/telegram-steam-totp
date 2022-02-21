module.exports = {
    data: {
        name: "status",
        restricted: false
    },

    run(ctx) {
        const process = require("process");
        const os = require("os");
        const humanize = require("humanize-duration");

        const output = [`User: <code>${os.userInfo().username}@${os.hostname}</code>`,
        `System uptime: <code>${humanize(os.uptime * 1e3, { round: true })}</code>`,
        `Process uptime: <code>${humanize(process.uptime() * 1e3, { round: true })}</code>`,
        `Node version: <code>${process.version}</code>`]

        ctx.reply(output.join("\n"), {
            parse_mode: "HTML"
        });
    }
}
