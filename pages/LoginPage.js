import BasePage from './BasePage.js'
import users from '../fixtures/users.json';
import { generateRandomEmail, generateRandomName } from '../support/utils.js';
import { ASSERTION_TEXTS, URL_PATHS } from '../support/constants.js';
import { expect } from '@playwright/test';

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/login'
    
    // Page elements (confirmed from inspection)
    this.elements = {
      // Login form
      loginEmail: '[data-qa="login-email"]',
      loginPassword: '[data-qa="login-password"]',
      loginButton: '[data-qa="login-button"]',
      loginFormContainer: '.login-form',
      loginFormTitle: '.login-form h2',
      loginErrorMessage: '.login-form p',
      
      // Signup form
      signupName: '[data-qa="signup-name"]',
      signupEmail: '[data-qa="signup-email"]',
      signupButton: '[data-qa="signup-button"]',
      signupFormContainer: '.signup-form',
      signupFormTitle: '.signup-form h2',
      signupErrorMessage: '.signup-form p',
      
      // Registration form (to be updated if needed)
      password: 'input[name="password"]',
      firstName: 'input[name="first_name"]',
      lastName: 'input[name="last_name"]',
      address: 'input[name="address1"]',
      country: 'select[name="country"]',
      state: 'input[name="state"]',
      city: 'input[name="city"]',
      zipcode: 'input[name="zipcode"]',
      mobileNumber: 'input[name="mobile_number"]',
      createAccountButton: 'button[type="submit"]',
      
      // Messages (to be updated after inspecting error/success messages)
      accountCreatedMessage: 'h2:has-text("Account Created!")', // Placeholder
      
      // Navigation
      continueButton: 'a[data-qa="continue-button"], .btn-success',
      deleteAccountButton: 'a[href="/delete_account"], .btn-danger',
    }
  }

  // Navigate to login page
  async navigateToLogin() {
    await this.page.goto(this.url)
  }

  // Login functionality
  async login(email, password) {
    if (email) {
      await this.page.fill(this.elements.loginEmail, email)
    } else {
      await this.page.fill(this.elements.loginEmail, '')
    }
    if (password) {
      await this.page.fill(this.elements.loginPassword, password)
    } else {
      await this.page.fill(this.elements.loginPassword, '')
    }
    await this.page.click(this.elements.loginButton)
    return this
  }

  // Signup functionality
  async signup(name, email) {
    if (name) {
      await this.page.fill(this.elements.signupName, name)
    } else {
      await this.page.fill(this.elements.signupName, '')
    }
    if (email) {
      await this.page.fill(this.elements.signupEmail, email)
    } else {
      await this.page.fill(this.elements.signupEmail, '')
    }
    await this.page.click(this.elements.signupButton)
    return this
  }

  // Complete registration (update selectors based on Automation Exercise registration page)
  async completeRegistration(userData) {
    // The registration form after signup uses these selectors:
    // input[name="password"], input[name="first_name"], input[name="last_name"], input[name="address1"], select[name="country"], input[name="state"], input[name="city"], input[name="zipcode"], input[name="mobile_number"]
    // Ensure all selectors are defined in this.elements
    await this.page.fill(this.elements.password, userData.password)
    await this.page.fill(this.elements.firstName, userData.firstName)
    await this.page.fill(this.elements.lastName, userData.lastName)
    await this.page.fill(this.elements.address, userData.address)
    await this.page.selectOption(this.elements.country, userData.country)
    await this.page.fill(this.elements.state, userData.state)
    await this.page.fill(this.elements.city, userData.city)
    await this.page.fill(this.elements.zipcode, userData.zipcode)
    await this.page.fill(this.elements.mobileNumber, userData.mobileNumber)
    await this.page.click(this.elements.createAccountButton)
    return this
  }

  // Quick registration with default data
  async quickRegistration(name, email, password) {
    const defaultUserData = users.validUser;
    
    await this.signup(name, email)
    await this.completeRegistration(defaultUserData)
    return this
  }

  // Continue after account creation
  async continueAfterAccountCreation() {
    await this.page.click(this.elements.continueButton)
    return this
  }

  // Delete account
  async deleteAccount() {
    await this.page.click(this.elements.deleteAccountButton)
    return this
  }

  // Clear form fields
  async clearLoginForm() {
    await this.page.fill(this.elements.loginEmail, '')
    await this.page.fill(this.elements.loginPassword, '')
    return this
  }

  async clearSignupForm() {
    await this.page.fill(this.elements.signupName, '')
    await this.page.fill(this.elements.signupEmail, '')
    return this
  }

  // Assertions
  async assertLoginPageLoaded() {
    await this.page.waitForSelector(this.elements.loginFormTitle)
    await this.page.waitForSelector(this.elements.signupFormTitle)
    return this
  }

  async assertLoginAndSignupFormsVisible() {
    await this.page.waitForSelector(this.elements.loginEmail)
    await this.page.waitForSelector(this.elements.loginPassword)
    await this.page.waitForSelector(this.elements.loginButton)
    await this.page.waitForSelector(this.elements.signupName)
    await this.page.waitForSelector(this.elements.signupEmail)
    await this.page.waitForSelector(this.elements.signupButton)
    return this
  }

  async assertLoginSuccessful() {
    await this.page.waitForURL(this.baseUrl + '/');
    await this.page.waitForSelector('body', { timeout: 10000, state: 'visible' });
    await this.page.waitForTimeout(500); // Give time for UI to update
    // Check for Logout button as login indicator
    await expect(this.page.locator('a:has-text("Logout")')).toBeVisible();
    return this;
  }

  async assertLoginFailed() {
    await this.page.waitForSelector(this.elements.loginErrorMessage)
    return this
  }

  async assertSignupSuccessful() {
    await this.page.waitForSelector(this.elements.signupEmail, { hidden: true })
    await this.page.waitForSelector('body', { visible: true })
    return this
  }

  async assertSignupFailed() {
    await this.page.waitForSelector(this.elements.signupErrorMessage)
    return this
  }

  async assertAccountCreated() {
    await expect(this.page.getByText('Account Created!')).toBeVisible();
    return this;
  }

  async assertAccountDeleted() {
    await this.page.waitForURL(URL_PATHS.DELETE_ACCOUNT)
    return this
  }

  // Validation methods
  async assertEmailFieldValidation() {
    await this.page.waitForSelector(this.elements.loginEmail, { hasAttribute: 'type', attribute: 'email' })
    return this
  }

  async assertPasswordFieldValidation() {
    await this.page.waitForSelector(this.elements.loginPassword, { hasAttribute: 'type', attribute: 'password' })
    return this
  }

  // Get form values
  async getLoginEmailValue() {
    return await this.page.inputValue(this.elements.loginEmail)
  }

  async getSignupEmailValue() {
    return await this.page.inputValue(this.elements.signupEmail)
  }

  // Check if user is logged in
  async isUserLoggedIn() {
    const body = await this.page.$('body')
    const text = await body.textContent()
    return text.includes(ASSERTION_TEXTS.LOGGED_IN_AS)
  }

  // Logout if logged in
  async logoutIfLoggedIn() {
    const loggedIn = await this.isUserLoggedIn()
    if (loggedIn) {
      await this.page.click('a[href="/logout"]')
    }
    return this
  }

  async assertEmailExistsError() {
    await this.page.waitForSelector('text=Email Address already exist!')
    return this;
  }

  generateRandomUser() {
    const randomString = Math.random().toString(36).substring(2, 10);
    return {
      name: generateRandomName(),
      email: generateRandomEmail(),
      password: `password_${randomString}`,
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      country: 'United States',
      state: 'California',
      city: 'Los Angeles',
      zipcode: '90001',
      mobileNumber: '1234567890'
    };
  }
}

export default LoginPage 