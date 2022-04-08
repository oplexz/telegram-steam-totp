module.exports = {
    data: {
        name: "exec",
        restricted: true
    },

    run(ctx) {
        let out;

        try {
            out = require("child_process").execSync(ctx.argStr).toString();
        } catch (e) {
            out = e.toString();
        }

        ctx.reply(out);
    }
}
