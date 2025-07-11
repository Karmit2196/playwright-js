import { expect } from '@playwright/test';

/**
 * Base Page Object Model class
 * Provides common functionality for all page objects
 */
class BasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL || 'https://www.automationexercise.com';
  }

  async visit(path = '') {
    await this.page.goto(this.baseUrl + path);
    return this;
  }

  async waitForPageLoad() {
    await expect(this.page.locator('body')).toBeVisible();
    return this;
  }

  getElement(selector) {
    return this.page.locator(selector);
  }

  async clickElement(selector) {
    await this.page.click(selector);
    return this;
  }

  async typeText(selector, text) {
    await this.page.fill(selector, text);
    return this;
  }

  async clearAndType(selector, text) {
    await this.page.fill(selector, '');
    await this.page.fill(selector, text);
    return this;
  }

  async selectOption(selector, option) {
    await this.page.selectOption(selector, option);
    return this;
  }

  async isElementVisible(selector) {
    await expect(this.page.locator(selector)).toBeVisible();
    return this;
  }

  async elementExists(selector) {
    await expect(this.page.locator(selector)).toHaveCount(1);
    return this;
  }

  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
    return this;
  }

  async waitForElement(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
    return this;
  }

  async getElementText(selector) {
    return await this.page.textContent(selector);
  }

  async assertElementContainsText(selector, text) {
    await expect(this.page.locator(selector)).toContainText(text);
    return this;
  }

  async assertElementHasValue(selector, value) {
    await expect(this.page.locator(selector)).toHaveValue(value);
    return this;
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    return this;
  }

  getRandomEmail() {
    return `user_${Date.now()}@example.com`;
  }

  getRandomName() {
    return `User${Math.floor(Math.random() * 10000)}`;
  }
}

export default BasePage; 