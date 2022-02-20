module.exports = {
    data: {
        name: "eval",
        restricted: true
    },

    run(ctx) {
        let out;

        try {
            out = require("util").inspect(eval(ctx.argStr)).toString();
        } catch (e) {
            out = e.toString();
        }

        ctx.reply(out);
    }
}
