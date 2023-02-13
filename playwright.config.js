/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	reporter: [['list'], ['html']],
	use: { trace: 'retain-on-failure' },
    // testMatch: '**/*e2e.js',
	testDir: 'tests',
	timeout: 2000
};

export default config;
