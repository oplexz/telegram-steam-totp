module.exports = {
    apps: [{
        name: "tg-steam-2fa",
        script: "./index.js",
        watch_delay: 1000,
        ignore_watch: ["log.txt"]
    }]
}
