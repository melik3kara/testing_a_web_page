// playwright.config.js
/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
    testDir: './tests',
    retries: 0,
    use: {
        headless: true,
        baseURL: 'https://s4e.io',
    },
};
