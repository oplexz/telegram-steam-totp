const { accountPicker } = require("../Steam");

module.exports = {
    data: {
        name: "code",
        restricted: true
    },

    run(ctx) {
        ctx.reply("Pick an account below:", { ...accountPicker() });
    }
}
