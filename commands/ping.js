module.exports = {
    data: {
        name: "ping",
        restricted: false
    },

    run(ctx) {
        const start = Date.now();

        ctx.reply("Pong!")
            .then(ctx2 => {
                const end = Date.now();

                ctx.bot.editMessageText(`${ctx2.text} (${end - start}ms)`, {
                    chat_id: ctx2.chat.id,
                    message_id: ctx2.message_id
                });
            })
            .catch(err => console.error(err));
    }
}
