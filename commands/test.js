module.exports = {
    data: {
        name: "test",
        restricted: true
    },

    run(ctx) {
        ctx.reply("Test message with a button", {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{
                        text: "X1Y1",
                        callback_data: "example"
                    },
                    {
                        text: "X2Y1",
                        callback_data: "example"
                    }
                    ],
                    [{
                        text: "X1Y2",
                        callback_data: "example"
                    },
                    {
                        text: "X2Y2",
                        callback_data: "example"
                    }
                    ]
                ]
            })
        });
    }
}
