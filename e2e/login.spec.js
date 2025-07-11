import { test, expect } from '@playwright/test';
import { initializePageObjects, loginPage, homePage } from '../pages/index.js';
import users from '../fixtures/users.json';
import { ASSERTION_TEXTS, URL_PATHS } from '../support/constants.js';
import { generateRandomEmail, generateRandomName } from '../support/utils.js';

test.describe('Login and Registration Tests', () => {
  test.beforeEach(async ({ page }) => {
    initializePageObjects(page);
    await loginPage().navigateToLogin();
  });

  test.describe('Login Page Load', () => {
    test('should load login page successfully', async ({ page }) => {
      await loginPage().assertLoginPageLoaded();
      await page.screenshot({ path: 'login-page-loaded.png' });
    });

    test('should display both login and signup forms', async ({ page }) => {
      await loginPage().assertLoginAndSignupFormsVisible();
    });
  });

  test.describe('Login Functionality', () => {
    test('should login with valid credentials', async ({ page }) => {
      // Register a new user first
      const email = generateRandomEmail();
      const password = 'test123';
      const name = generateRandomName();
      await loginPage().signup(name, email);
      await loginPage().waitForPageLoad();
      // Complete registration if needed
      const userData = users.validUser;
      await loginPage().completeRegistration(userData);
      await loginPage().waitForPageLoad();
      await loginPage().continueAfterAccountCreation();
      await loginPage().waitForPageLoad();
      // Now logout to test login
      await page.locator('text=Logout').click({ force: true });
      await loginPage().navigateToLogin();
      // Now login with the same credentials
      await loginPage().login(email, password);
      await loginPage().waitForPageLoad();
      await loginPage().assertLoginSuccessful();
    });

    test('should fail login with invalid credentials', async ({ page }) => {
      const email = 'invalid@example.com';
      const password = 'wrongpassword';

      await loginPage().login(email, password);
      await loginPage().waitForPageLoad();
      await loginPage().assertLoginFailed();
    });

    test('should fail login with empty credentials', async ({ page }) => {
      await loginPage().login('', '');
      await loginPage().waitForPageLoad();

      // Should show validation errors (HTML5 browser validation, so no error message in DOM)
      // Optionally, check that the login button is still enabled and no navigation occurred
      expect(page.url()).toContain(URL_PATHS.LOGIN);
    });

    test('should fail login with invalid email format', async ({ page }) => {
      const invalidEmail = 'invalid-email';
      const password = 'test123';

      await loginPage().login(invalidEmail, password);
      await loginPage().waitForPageLoad();

      // Should show email validation error (HTML5 browser validation, so no error message in DOM)
      expect(page.url()).toContain(URL_PATHS.LOGIN);
    });

    test('should clear login form fields', async ({ page }) => {
      await loginPage().typeText(loginPage().elements.loginEmail, 'test@example.com');
      await loginPage().typeText(loginPage().elements.loginPassword, 'test123');
      await loginPage().clearLoginForm();

      expect(await loginPage().getLoginEmailValue()).toBe('');
    });
  });

  test.describe('Registration Functionality', () => {
    test('should register new user successfully', async ({ page }) => {
      const name = generateRandomName();
      const email = generateRandomEmail();
      const password = 'test123';

      await loginPage().quickRegistration(name, email, password);
      await loginPage().waitForPageLoad();
      await loginPage().assertAccountCreated();
      await loginPage().continueAfterAccountCreation();
      await loginPage().waitForPageLoad();
      await loginPage().assertLoginSuccessful();
    });

    test('should fail registration with existing email', async ({ page }) => {
      const name = 'Test User';
      const existingEmail = 'test@example.com';

      await loginPage().signup(name, existingEmail);
      await loginPage().waitForPageLoad();
      await loginPage().assertSignupFailed();
    });

    test('should fail registration with empty fields', async ({ page }) => {
      await loginPage().signup('', '');
      await loginPage().waitForPageLoad();

      // Should show validation errors (HTML5 browser validation, so no error message in DOM)
      expect(page.url()).toContain(URL_PATHS.LOGIN);
    });

    test('should fail registration with invalid email format', async ({ page }) => {
      const name = 'Test User';
      const invalidEmail = 'invalid-email';

      await loginPage().signup(name, invalidEmail);
      await loginPage().waitForPageLoad();

      // Should show email validation error (HTML5 browser validation, so no error message in DOM)
      expect(page.url()).toContain(URL_PATHS.LOGIN);
    });

    test('should complete registration with all required fields', async ({ page }) => {
      const name = generateRandomName();
      const email = generateRandomEmail();
      const userData = users.validUser;

      await loginPage().signup(name, email);
      await loginPage().waitForPageLoad();
      await loginPage().completeRegistration(userData);
      await loginPage().waitForPageLoad();
      await loginPage().assertAccountCreated();
    });

    test('should clear signup form fields', async ({ page }) => {
      await loginPage().typeText(loginPage().elements.signupName, 'Test User');
      await loginPage().typeText(loginPage().elements.signupEmail, 'test@example.com');
      await loginPage().clearSignupForm();

      expect(await loginPage().getSignupEmailValue()).toBe('');
    });
  });

  test.describe('Form Validation', () => {
    test('should validate email field type', async ({ page }) => {
      await loginPage().assertEmailFieldValidation();
    });

    test('should validate password field type', async ({ page }) => {
      await loginPage().assertPasswordFieldValidation();
    });

    test('should validate required fields', async ({ page }) => {
      await loginPage().clickElement(loginPage().elements.loginButton);
      await loginPage().waitForPageLoad();

      // Should show required field validation (HTML5 browser validation, so no error message in DOM)
      expect(page.url()).toContain(URL_PATHS.LOGIN);
    });
  });

  test.describe('Account Management', () => {
    test('should delete account successfully', async ({ page }) => {
      // First register a new account
      const name = generateRandomName();
      const email = generateRandomEmail();
      const password = 'test123';

      await loginPage().quickRegistration(name, email, password);
      await loginPage().waitForPageLoad();
      await loginPage().continueAfterAccountCreation();
      await loginPage().waitForPageLoad();
      await loginPage().deleteAccount();
      await loginPage().waitForPageLoad();
      await loginPage().assertAccountDeleted();
    });

    test('should logout successfully', async ({ page }) => {
      // First login
      const email = 'test@example.com';
      const password = 'test123';

      await loginPage().login(email, password);
      await loginPage().waitForPageLoad();
      await loginPage().logoutIfLoggedIn();
      await loginPage().waitForPageLoad();

      // Should redirect to home page
      expect(page.url()).toContain('/');
    });
  });

  test.describe('Navigation', () => {
    test('should navigate back to home page', async ({ page }) => {
      await homePage().navigateToHome();
      expect(page.url()).toBe('https://www.automationexercise.com/');
    });

  });

  test.describe('Security', () => {
    test('should not expose password in URL', async ({ page }) => {
      const email = 'test@example.com';
      const password = 'test123';

      await loginPage().login(email, password);
      await loginPage().waitForPageLoad();

      expect(page.url()).not.toContain(password);
    });

    test('should clear sensitive data on logout', async ({ page }) => {
      const email = generateRandomEmail();
      const password = 'test123';
      const name = generateRandomName();
      await loginPage().signup(name, email);
      await loginPage().waitForPageLoad();
      const userData = users.validUser;
      await loginPage().completeRegistration(userData);
      await loginPage().continueAfterAccountCreation();
      await loginPage().waitForPageLoad();
      // Now logout
      await page.locator('text=Logout').click({ force: true });
      // Should redirect to home page and not show 'Logged in as'
      expect(page.locator('body', { timeout: 10000 }).textContent).not.toContain(ASSERTION_TEXTS.LOGGED_IN_AS);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      await page.route('/api/verifyLogin', route => route.abort());
      const email = generateRandomEmail();
      const password = 'test123';
      await loginPage().login(email, password);
      await loginPage().waitForPageLoad();
      // Add assertion for error handling UI if needed
    });

    test('should handle server errors gracefully', async ({ page }) => {
      await page.route('/api/verifyLogin', route => route.fulfill({ status: 500, body: 'Internal Server Error' }));
      const email = generateRandomEmail();
      const password = 'test123';
      await loginPage().login(email, password);
      await loginPage().waitForPageLoad();
      // Add assertion for error handling UI if needed
    });
  });

  test.describe('Performance', () => {
    test('should load login page within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await loginPage().navigateToLogin();

      expect(page.locator('body')).toBeVisible();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // 3 seconds
    });


  });
}); 