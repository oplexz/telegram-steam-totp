import dayjs from 'dayjs';

export const logger = {
    info: (...args: unknown[]) => {
        console.log(dayjs().format(), '[INFO]', ...args);
    },

    error: (...args: unknown[]) => {
        console.error(dayjs().format(), '[ERROR]', ...args);
    },

    warn: (...args: unknown[]) => {
        console.warn(dayjs().format(), '[WARN]', ...args);
    },

    debug: (...args: unknown[]) => {
        console.debug(dayjs().format(), '[DEBUG]', ...args);
    },
};
