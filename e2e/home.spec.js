import { test, expect } from '@playwright/test';
import { initializePageObjects, homePage } from '../pages/index.js';
import { ASSERTION_TEXTS, URL_PATHS } from '../support/constants.js'
import { generateRandomEmail } from '../support/utils.js';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    initializePageObjects(page);
    await homePage().navigateToHome();
  });

  test('should load home page successfully', async ({ page }) => {
    await homePage().assertHomePageLoaded();
    await homePage().takeScreenshot && await homePage().takeScreenshot('home-page-loaded');
  });

  test('should display all navigation links', async ({ page }) => {
    await homePage().assertNavigationLinksVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await homePage().clickProducts();
    await expect(page).toHaveURL(URL_PATHS.PRODUCTS);
  });

  test('should navigate to cart page', async ({ page }) => {
    await homePage().clickCart();
    await expect(page).toHaveURL(URL_PATHS.CART);
  });

  test('should navigate to login page', async ({ page }) => {
    await homePage().clickSignupLogin();
    await expect(page).toHaveURL(URL_PATHS.LOGIN);
  });

  test('should search for existing product', async ({ page }) => {
    const searchTerm = 'dress';
    await homePage().searchProduct(searchTerm);
    await homePage().assertSearchResultsContain(searchTerm);
  });

  test('should handle search with no results', async ({ page }) => {
    const searchTerm = 'nonexistentproduct';
    await homePage().searchProduct(searchTerm);
    await homePage().assertNoSearchResults();
  });

  test('should handle empty search', async ({ page }) => {
    await homePage().searchProduct('');
    // Should stay on products page for empty search
    await expect(page).toHaveURL(URL_PATHS.PRODUCTS);
  });

  test('should navigate to women category', async ({ page }) => {
    await homePage().clickWomenCategory();
    await expect(page).toHaveURL('https://www.automationexercise.com/category_products/1');
    await expect(page.locator('body')).toContainText(ASSERTION_TEXTS.CATEGORY_WOMEN);
  });

  test('should navigate to men category', async ({ page }) => {
    await homePage().clickMenCategory();
    await expect(page).toHaveURL('https://www.automationexercise.com/category_products/3');
    await expect(page.locator('body')).toContainText(ASSERTION_TEXTS.CATEGORY_MEN);
  });

  test('should navigate to kids category', async ({ page }) => {
    await homePage().clickKidsCategory();
    await expect(page).toHaveURL('https://www.automationexercise.com/category_products/4');
    await expect(page.locator('body')).toContainText(ASSERTION_TEXTS.CATEGORY_KIDS);
  });

  test('should display featured products', async ({ page }) => {
    const count = await homePage().getFeaturedProductsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should add product to cart from home page', async ({ page }) => {
    const productName = 'Blue Top';
    await homePage().addProductToCart(productName);
    // Should show success message (modal appears)
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('.modal-content')).toContainText('Added!');
    // Close modal - try different possible close button selectors
    try {
      await page.locator('.modal-content .btn-success').click();
    } catch (e) {
      // If the above doesn't work, try alternative close methods
      await page.locator('.modal-content .close').click();
    }
  });

  test('should view product details', async ({ page }) => {
    const productName = 'Blue Top';
    await homePage().viewProduct(productName);
    await expect(page).toHaveURL(/\/product_details\//);
    await expect(page.locator('body')).toContainText(productName);
  });

  test('should display product prices', async ({ page }) => {
    const price = await homePage().getProductPrice('Blue Top');
    expect(price).toContain('Rs.');
  });

  test('should subscribe to newsletter with valid email', async ({ page }) => {
    const email = generateRandomEmail();
    await homePage().scrollToBottom();
    await homePage().subscribeToNewsletter(email);
    await homePage().assertSubscriptionSuccess();
  });

  test('should handle subscription with invalid email', async ({ page }) => {
    const invalidEmail = 'invalid-email';
    await homePage().scrollToBottom();
    await homePage().subscribeToNewsletter(invalidEmail);
    await homePage().assertSubscriptionError();
  });

  test('should scroll to bottom and show scroll up button', async ({ page }) => {
    await homePage().scrollToBottom();
    await expect(page.locator('a[href="#top"] i.fa.fa-angle-up')).toBeVisible();
    await page.locator('a[href="#top"]').click();
    // Wait for scroll to top
    await page.waitForTimeout(1000);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(50);
  });

  test('should scroll to specific product', async ({ page }) => {
    const productName = 'Stylish Dress';
    await homePage().page.locator(homePage().selectors.productCard).filter({ hasText: productName }).first().scrollIntoViewIfNeeded();
    await homePage().productExists(productName, true);
  });

  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveURL(URL_PATHS.HOME);
    await homePage().assertHomePageLoaded();
    await homePage().takeScreenshot && await homePage().takeScreenshot('home-page-mobile');
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveURL(URL_PATHS.HOME);
    await homePage().assertHomePageLoaded();
    await homePage().takeScreenshot && await homePage().takeScreenshot('home-page-tablet');
  });

  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await homePage().navigateToHome();
    
    await expect(page.locator('body')).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // 5 seconds
  });

  test('should have all images loaded', async ({ page }) => {
    await homePage().navigateToHome();
    const images = await page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      await expect(img).toHaveAttribute('src');
    }
  });

  test('should have proper alt text for images', async ({ page }) => {
    await homePage().navigateToHome();
    const images = await page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
  });

  test('should have proper heading structure', async ({ page }) => {
    await homePage().navigateToHome();
    // Check that at least one heading is visible
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    let foundVisible = false;
    for (let i = 0; i < count; i++) {
      if (await headings.nth(i).isVisible()) {
        foundVisible = true;
        break;
      }
    }
    expect(foundVisible).toBe(true);
  });
}); 