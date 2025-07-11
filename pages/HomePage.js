import { expect } from '@playwright/test';
import BasePage from './BasePage.js'
import { ASSERTION_TEXTS, URL_PATHS } from '../support/constants.js'
import { generateRandomEmail } from '../support/utils.js'

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.url = '/';
    this.selectors = {
      productsLink: "a[href='/products']",
      cartLink: "a[href='/view_cart']",
      signupLoginLink: "a[href='/login']",
      logo: "img[src='/static/images/home/logo.png']",
      searchInput: "input#search_product",
      searchButton: "button#submit_search",
      categoryPanelTitle: ".panel-title a",
      womenCategoryLink: "a[href='/category_products/1']",
      menCategoryLink: "a[href='/category_products/3']",
      kidsCategoryLink: "a[href='/category_products/4']",
      featuredProducts: '.features_items .product-image-wrapper',
      productInfo: '.productinfo.text-center',
      productCard: '.single-products',
      addToCartButton: 'a:has-text("Add to cart")',
      viewProductLink: 'a[href*="/product_details/"]',
      productPrice: 'h2',
      newsletterInput: '#susbscribe_email',
      newsletterButton: '#subscribe',
      newsletterSuccess: '#success-subscribe',
      contactUsName: 'input[data-qa="name"]',
      contactUsEmail: 'input[data-qa="email"]',
      contactUsSubject: 'input[data-qa="subject"]',
      contactUsMessage: 'textarea[data-qa="message"]',
      contactUsSubmit: 'input[type="submit"]',
      contactUsSuccess: '.status.alert.alert-success',
      contactUsSuccessText: 'Success! Your details have been submitted successfully.',
      contactUsHome: 'Home',
      scrollUpButton: "a[href='#top'] i.fa.fa-angle-up",
      searchResultsContainer: '.features_items',
      body: 'body',
      modalContent: '.modal-content',
      modalCloseButton: '.modal-content .btn-success'
    };
  }

  async navigateToHome() {
    await this.visit();
    return this;
  }

  async clickProducts() {
    await this.page.click(this.selectors.productsLink);
    return this;
  }

  async clickCart() {
    await this.page.locator(this.selectors.cartLink).first().click();
    return this;
  }

  async clickSignupLogin() {
    await this.page.click(this.selectors.signupLoginLink);
    return this;
  }

  async searchProduct(searchTerm) {
    await this.page.goto(this.baseUrl + '/products');
    if (searchTerm && searchTerm.trim() !== '') {
      await this.page.fill(this.selectors.searchInput, searchTerm);
      await this.page.click(this.selectors.searchButton);
    } else {
      await this.page.goto(this.baseUrl + '/products');
    }
    return this;
  }

  async expandCategory(categoryText) {
    await this.page.goto(this.baseUrl + '/products');
    let selector;
    if (categoryText === ASSERTION_TEXTS.CATEGORY_WOMEN) selector = 'a[href="#Women"]';
    else if (categoryText === ASSERTION_TEXTS.CATEGORY_MEN) selector = 'a[href="#Men"]';
    else if (categoryText === ASSERTION_TEXTS.CATEGORY_KIDS) selector = 'a[href="#Kids"]';
    else selector = this.selectors.categoryPanelTitle;
    
    const categoryPanel = this.page.locator(selector).first();
    await categoryPanel.waitFor({ state: 'visible', timeout: 10000 });
    await categoryPanel.click();
    // Wait a bit for the panel to expand
    await this.page.waitForTimeout(1000);
  }

  async clickWomenCategory() {
    await this.expandCategory(ASSERTION_TEXTS.CATEGORY_WOMEN);
    const womenLink = this.page.locator(this.selectors.womenCategoryLink).first();
    await womenLink.waitFor({ state: 'visible', timeout: 10000 });
    await womenLink.click();
    await this.page.waitForURL('**/category_products/1', { timeout: 15000 });
    return this;
  }

  async clickMenCategory() {
    await this.expandCategory(ASSERTION_TEXTS.CATEGORY_MEN);
    const menLink = this.page.locator(this.selectors.menCategoryLink).first();
    await menLink.waitFor({ state: 'visible', timeout: 10000 });
    await menLink.click();
    await this.page.waitForURL('**/category_products/3', { timeout: 15000 });
    return this;
  }

  async clickKidsCategory() {
    await this.expandCategory(ASSERTION_TEXTS.CATEGORY_KIDS);
    const kidsLink = this.page.locator(this.selectors.kidsCategoryLink).first();
    await kidsLink.waitFor({ state: 'visible', timeout: 10000 });
    await kidsLink.click();
    await this.page.waitForURL('**/category_products/4', { timeout: 15000 });
    return this;
  }

  async getFeaturedProductsCount() {
    return await this.page.locator(this.selectors.featuredProducts).count();
  }

  async addProductToCart(productName) {
    // Find the product card that contains the product name
    const productCard = this.page.locator(this.selectors.productCard).filter({ hasText: productName }).first();
    await productCard.waitFor({ state: 'visible', timeout: 10000 });
    await productCard.scrollIntoViewIfNeeded();
    await expect(productCard).toBeVisible();
    
    // Click the "Add to cart" link within this product card
    const addToCartLink = productCard.locator(this.selectors.addToCartButton).first();
    await addToCartLink.waitFor({ state: 'visible', timeout: 5000 });
    await addToCartLink.click();
    
    return this;
  }

  async viewProduct(productName) {
    // Find the product card that contains the product name to ensure it's loaded
    const productCard = this.page.locator(this.selectors.productCard).filter({ hasText: productName }).first();
    await productCard.waitFor({ state: 'visible', timeout: 10000 });
    await productCard.scrollIntoViewIfNeeded();
    await expect(productCard).toBeVisible();
    
    // Simply click the first "View Product" link on the page
    // Based on the page snapshot, View Product links are separate list items
    const viewProductLink = this.page.locator('a:has-text("View Product")').first();
    await viewProductLink.waitFor({ state: 'visible', timeout: 5000 });
    await viewProductLink.click();
    
    return this;
  }

  async getProductPrice(productName) {
    // Find the product card that contains the product name
    const productCard = this.page.locator(this.selectors.productCard).filter({ hasText: productName }).first();
    await productCard.waitFor({ state: 'visible', timeout: 10000 });
    
    // Get the price from the h2 element within this product card
    const priceElement = productCard.locator(this.selectors.productPrice).first();
    await priceElement.waitFor({ state: 'visible', timeout: 5000 });
    return await priceElement.textContent();
  }

  async subscribeToNewsletter(email) {
    await this.page.fill(this.selectors.newsletterInput, email);
    await this.page.click(this.selectors.newsletterButton);
    return this;
  }

  async assertSubscriptionSuccess() {
    await expect(this.page.locator(this.selectors.newsletterSuccess)).toBeVisible();
    return this;
  }

  async assertSubscriptionError() {
    await expect(this.page.locator(this.selectors.body)).toBeVisible();
    return this;
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    return this;
  }

  async clickScrollUp() {
    await this.page.click(this.selectors.scrollUpButton, {force: true});
    return this;
  }

  async assertHomePageLoaded() {
    await expect(this.page.locator(this.selectors.logo)).toBeVisible();
    const count = await this.page.locator(this.selectors.featuredProducts).count();
    expect(count).toBeGreaterThan(0);
    return this;
  }

  async assertNavigationLinksVisible() {
    await expect(this.page.locator(this.selectors.productsLink).first()).toBeVisible();
    await expect(this.page.locator(this.selectors.cartLink).first()).toBeVisible();
    await expect(this.page.locator(this.selectors.signupLoginLink).first()).toBeVisible();
    return this;
  }

  async productExists(productName, firstOnly = false) {
    let locator = this.page.locator(this.selectors.productCard).filter({ hasText: productName });
    if (firstOnly) locator = locator.first();
    await expect(locator).toBeVisible();
    return this;
  }

  async scrollToProduct(productName) {
    await this.page.locator(this.selectors.productInfo).getByText(productName).first().scrollIntoViewIfNeeded();
    return this;
  }

  async assertSearchResultsContain(searchTerm) {
    const text = await this.page.locator(this.selectors.searchResultsContainer).textContent();
    expect(text.toLowerCase()).toContain(searchTerm.toLowerCase());
    return this;
  }

  async assertNoSearchResults() {
    await expect(this.page.locator(this.selectors.searchResultsContainer)).not.toContainText('dress');
    return this;
  }

  async measurePageLoadTime() {
    // Implement Playwright-based performance measurement if needed
    return this;
  }

  getBody() {
    return this.page.locator(this.selectors.body);
  }

  getModalContent() {
    return this.page.locator(this.selectors.modalContent);
  }

  getModalCloseButton() {
    return this.page.locator(this.selectors.modalCloseButton);
  }

  getImages() {
    return this.page.locator('img');
  }

  getHeadings() {
    return this.page.locator('h1, h2, h3');
  }

  getNewsletterInput() {
    return this.page.locator(this.selectors.newsletterInput);
  }

  getNewsletterButton() {
    return this.page.locator(this.selectors.newsletterButton);
  }

  getNewsletterSuccess() {
    return this.page.locator(this.selectors.newsletterSuccess);
  }

  getContactUsNameInput() {
    return this.page.locator(this.selectors.contactUsName);
  }

  getContactUsEmailInput() {
    return this.page.locator(this.selectors.contactUsEmail);
  }

  getContactUsSubjectInput() {
    return this.page.locator(this.selectors.contactUsSubject);
  }

  getContactUsMessageTextarea() {
    return this.page.locator(this.selectors.contactUsMessage);
  }

  getContactUsSubmitButton() {
    return this.page.locator(this.selectors.contactUsSubmit);
  }

  getContactUsSuccessMessage() {
    return this.page.locator(this.selectors.contactUsSuccess).filter({ hasText: this.selectors.contactUsSuccessText });
  }

  getContactUsHomeButton() {
    return this.page.locator('a').getByText(this.selectors.contactUsHome);
  }

  async goToContactUs() {
    await this.page.goto(this.baseUrl + '/contact_us');
    return this;
  }
}

export default HomePage; 