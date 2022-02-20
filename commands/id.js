module.exports = {
    data: {
        name: "id",
        restricted: false
    },

    run(ctx) {
        ctx.reply(`Your ID is <code>${ctx.chat.id}</code>`, { parse_mode: "HTML" });
    }
}
