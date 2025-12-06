module.exports = {
    title: 'tg-steam-2fa',
    script: 'src/index.ts',
    interpreter: 'bun',
    env: {
        PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
    },
};
