import { test, expect } from '@playwright/test';

test.describe('Free Security Tools Page', () => {
    test('TC01 – Page Load', async ({ page }) => {
        const response = await page.goto('https://s4e.io/free-security-tools');
        expect(response?.status()).toBe(200);
        await expect(page).toHaveTitle(/Online Free Security Tools/i);
        await expect(page.locator('h1')).toBeVisible();
    });

    test('TC02 – Hero Section Content', async ({ page }) => {
        await page.goto('https://s4e.io/free-security-tools');
        const heading = page.locator('h1');
        await expect(heading).toHaveText('Online Free Security Tools');
        const subheading = page.locator('h1 + h6');
        await expect(subheading).toContainText("The world's largest collection");
        const heroImg = page.locator('img').first();
        await expect(heroImg).toBeVisible();
    });

    test('TC03 – Start 1-Week Trial CTA', async ({ page }) => {
        await page.goto('https://s4e.io/free-security-tools');
        await page.click('text=Start 1-Week Trial');
        await expect(page).toHaveURL(/app\.s4e\.io\/sign-?up/);
    });

    test('TC04 – Start Full Scan Text Presence', async ({ page }) => {
        await page.goto('https://s4e.io/free-security-tools');
        const scanLinks = page.locator('text=Start Full Scan');
        await expect(scanLinks).toHaveCount(2);
    });

    test('TC05 – Filter Panel Toggles Visible', async ({ page }) => {
        await page.goto('https://s4e.io/free-security-tools');
        await expect(page.getByRole('tab', { name: 'All' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Asset Owner' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Everyone' })).toBeVisible();
    });

    test('TC06 – Footer Links Href Attributes', async ({ page }) => {
        await page.goto('https://s4e.io/free-security-tools');
        const footerLinks = page.locator('footer a');
        const count = await footerLinks.count();
        expect(count).toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const href = await footerLinks.nth(i).getAttribute('href');
            expect(href).toBeTruthy();
        }
    });

    test('TC07 – Responsive Layout No Horizontal Scroll on Desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto('https://s4e.io/free-security-tools');
        const hasScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(hasScroll).toBeFalsy();
    });

    test('TC08 – JavaScript Disabled Graceful Degradation', async ({ browser }) => {
        const context = await browser.newContext({ javaScriptEnabled: false });
        const page = await context.newPage();
        await page.goto('https://s4e.io/free-security-tools');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('TC09 – Broken Links Scan (Internal Only, limited)', async ({ page, request }) => {
        await page.goto('https://s4e.io/free-security-tools');
        const urls = await page.$$eval('a[href]', els =>
            els.map(el => el.href).filter(h => new URL(h).hostname.endsWith('s4e.io'))
        );
        expect(urls.length).toBeGreaterThan(0);
        // Limit to first 5 internal links for performance
        const testUrls = urls.slice(0, 5);
        for (const url of testUrls) {
            const resp = await request.head(url);
            expect(resp.status()).toBeLessThan(500);
        }
    });

    test('TC10 – Accessibility Snapshot', async ({ page }) => {
        await page.goto('https://s4e.io/free-security-tools');
        const snapshot = await page.accessibility.snapshot();
        expect(snapshot).toBeTruthy();
    });

    test('TC11 – SEO Meta Tags Present', async ({ page }) => {
        await page.goto('https://s4e.io/free-security-tools');
        const desc = await page.locator('head meta[name="description"]').getAttribute('content');
        const viewport = await page.locator('head meta[name="viewport"]').getAttribute('content');
        expect(desc).toBeTruthy();
        expect(viewport).toBeTruthy();
    });
});
