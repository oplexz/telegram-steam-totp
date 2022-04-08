module.exports = {
    data: {
        name: "creds",
        restricted: true
    },

    run(ctx) {
        const fs = require("fs");

        fs.readFile("credentials.txt", "utf8", (err, data) => {
            if (err) {
                ctx.reply("Something went wrong while fetching credentials.");
                console.log(err);
            }

            // TODO: Add account picker? (will require rewriting accountPicker in Steam.js)
            ctx.reply(data);
        });
    }
}
