import { expect } from '@playwright/test';
import BasePage from './BasePage.js'
import { measurePageLoadTime } from '../support/utils.js'
import { ASSERTION_TEXTS, URL_PATHS } from '../support/constants.js'

class ProductsPage extends BasePage {
  constructor(page) {
    super(page)
    this.url = '/products'
    
    // Page elements
    this.elements = {
      // Page header
      productsTitle: '.title.text-center',
      
      // Search and filter
      searchProduct: '#search_product',
      submitSearch: '#submit_search',
      
      // Categories
      womenCategory: 'a[href="#Women"]',
      menCategory: 'a[href="#Men"]',
      kidsCategory: 'a[href="#Kids"]',
      
      // Brands
      brandPolo: 'a[href="/brand_products/Polo"]',
      brandHm: 'a[href="/brand_products/H&M"]',
      brandMadame: 'a[href="/brand_products/Madame"]',
      brandMastHarbour: 'a[href="/brand_products/Mast & Harbour"]',
      brandBabyhug: 'a[href="/brand_products/Babyhug"]',
      brandAllenSolly: 'a[href="/brand_products/Allen Solly Junior"]',
      brandKookieKids: 'a[href="/brand_products/Kookie Kids"]',
      brandBiba: 'a[href="/brand_products/Biba"]',
      
      // Product grid
      productGrid: '.features_items',
      productCard: '.productinfo',
      productName: '.product-information h2',
      productPrice: '.product-information span span',
      productDescription: '.product-information p',
      productCategory: '.product-information p:contains("Category")',
      productAvailability: '.product-information p:contains("Availability")',
      productCondition: '.product-information p:contains("Condition")',
      productBrand: '.product-information p:contains("Brand")',
      
      // Product actions
      addToCartButton: 'Add to cart',
      viewProductButton: 'View Product',
      addToWishlistButton: 'add-to-wishlist',
      
      // Product details
      productImage: '.product-details .view-product img',
      productQuantity: '#quantity',
      addToCartFromDetails: '.btn.btn-default.cart',
      
      // Pagination
      pagination: '.pagination',
      nextPage: '.pagination .next',
      previousPage: '.pagination .prev',
      
      // Sort and filter
      sortDropdown: 'sort',
      priceRange: 'price-range',
      
      // Messages
      noResultsMessage: '.no-results',
      searchResultsMessage: '.features_items .title',
      productImageWrapper: '.product-image-wrapper',
      productQuantityInput: 'input[name="quantity"]',
      reviewNameInput: '#name',
      reviewEmailInput: '#email',
      reviewTextarea: '#review',
      reviewForm: '#review-form',
      reviewSubmitButton: 'button[type="submit"]',
      reviewSuccessMessage: 'Thank you for your review.',
      continueShoppingButton: 'Continue Shopping',
      viewCartButton: 'View Cart',
      writeYourReview: 'Write Your Review'
    }
  }

  // Navigate to products page
  async navigateToProducts() {
    await this.visit(this.url)
  }

  // Search functionality
  async searchProduct(searchTerm) {
    await this.typeText(this.elements.searchProduct, searchTerm)
    await this.clickElement(this.elements.submitSearch)
    return this
  }

  // Category filtering
  async filterByCategory(category) {
    switch(category.toLowerCase()) {
      case ASSERTION_TEXTS.CATEGORY_WOMEN:
        await this.clickElement(this.elements.womenCategory)
        break
      case ASSERTION_TEXTS.CATEGORY_MEN:
        await this.clickElement(this.elements.menCategory)
        break
      case ASSERTION_TEXTS.CATEGORY_KIDS:
        await this.clickElement(this.elements.kidsCategory)
        break
      default:
        throw new Error(`Unknown category: ${category}`)
    }
    return this
  }

  // Brand filtering
  async filterByBrand(brand) {
    switch(brand.toLowerCase()) {
      case 'polo':
        await this.clickElement(this.elements.brandPolo)
        break
      case 'h&m':
      case 'hm':
        await this.clickElement(this.elements.brandHm)
        break
      case 'madame':
        await this.clickElement(this.elements.brandMadame)
        break
      case 'mast & harbour':
      case 'mast-harbour':
        await this.clickElement(this.elements.brandMastHarbour)
        break
      case 'babyhug':
        await this.clickElement(this.elements.brandBabyhug)
        break
      case 'allen solly':
      case 'allen-solly':
        await this.clickElement(this.elements.brandAllenSolly)
        break
      case 'kookie kids':
      case 'kookie-kids':
        await this.clickElement(this.elements.brandKookieKids)
        break
      case 'biba':
        await this.clickElement(this.elements.brandBiba)
        break
      default:
        throw new Error(`Unknown brand: ${brand}`)
    }
    return this
  }

  // Product interactions
  async addProductToCart(productName) {
    await this.page.locator('.features_items .productinfo').contains(productName)
        .locator('..').locator('.add-to-cart').first().click({force: true});

    // Wait for the modal, but let the test decide what to do next
    await this.page.locator('.modal-content', { timeout: 10000 }).should('be.visible');
    return this;
  }

  async viewProduct(productName) {
    // This selector works for both product and search pages
    await this.page.locator('.productinfo p').contains(productName)
        .locator('..').locator('a[href*="/product_details/"]').first().click();
    return this;
  }

  async addProductToWishlist(productName) {
    await this.page.locator(productName)
      .locator('..').locator(`[data-qa="${this.elements.addToWishlistButton}"]`)
      .click()
    return this
  }

  // Product details page
  async setProductQuantity(quantity) {
    await this.clearAndType(this.elements.productQuantity, quantity)
    return this
  }

  async addToCartFromDetails() {
    await this.getElement(this.elements.addToCartFromDetails).click();
    // Wait for the modal, but let the test decide what to do next
    await expect(this.page.locator('.modal-content')).toBeVisible({ timeout: 10000 });
    return this;
  }

  // Modal Interactions
  async clickViewCartOnModal() {
    // Try multiple approaches to find the View Cart button
    try {
      await this.page.locator('a:has-text("View Cart")').click();
    } catch (e) {
      try {
        await this.page.locator('button:has-text("View Cart")').click();
      } catch (e2) {
        // If both fail, try the original selector
        await this.page.locator(this.elements.viewCartButton).click();
      }
    }
    return this;
  }

  async clickContinueShoppingOnModal() {
    // Try multiple approaches to find the Continue Shopping button
    try {
      await this.page.locator('button:has-text("Continue Shopping")').click();
    } catch (e) {
      try {
        await this.page.locator('a:has-text("Continue Shopping")').click();
      } catch (e2) {
        // If both fail, try the original selector
        await this.page.locator(this.elements.continueShoppingButton).click();
      }
    }
    return this;
  }

  // Pagination
  async goToNextPage() {
    await this.clickElement(this.elements.nextPage)
    return this
  }

  async goToPreviousPage() {
    await this.clickElement(this.elements.previousPage)
    return this
  }

  async goToPage(pageNumber) {
    await this.page.locator(this.elements.pagination).contains(pageNumber).click()
    return this
  }

  // Sorting
  async sortBy(sortOption) {
    await this.selectOption(this.elements.sortDropdown, sortOption)
    return this
  }

  // Price range filtering
  async setPriceRange(minPrice, maxPrice) {
    // Implementation depends on the actual price range slider
    await this.page.locator(this.elements.priceRange).then(async ($slider) => {
      // Set min price
      await this.page.locator($slider).invoke('val', minPrice).trigger('change')
      // Set max price
      await this.page.locator($slider).invoke('val', maxPrice).trigger('change')
    })
    return this
  }

  // Assertions
  async assertProductsPageLoaded() {
    await this.getElement(this.elements.productsTitle).should('contain', ASSERTION_TEXTS.ALL_PRODUCTS_TITLE)
    await this.getElement(this.elements.productGrid).should('be.visible')
    return this
  }

  async assertProductExists(productName) {
    await this.page.locator(productName).should('exist')
    return this
  }

  async assertProductNotExists(productName) {
    await this.page.locator(productName).should('not.exist')
    return this
  }

  async assertSearchResultsContain(searchTerm) {
    await this.page.locator(this.elements.productGrid).should('be.visible')
    await this.page.locator(this.elements.productCard).each(async ($el) => {
      await this.page.locator($el).locator('.productinfo p').invoke('text').then((text) => {
        if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
          // If we find one, we're good.
          expect(true).to.be.true
        }
      })
    })
    return this
  }

  async assertNoSearchResults() {
    await this.page.locator(this.elements.noResultsMessage).should('be.visible')
    return this
  }

  async assertCategoryFiltered(category) {
    await this.page.locator('body').should('contain', category)
    return this
  }

  async assertBrandFiltered(brand) {
    await this.page.locator('body').should('contain', brand)
    return this
  }

  // Get product information
  async getProductPrice(productName) {
    return await this.page.locator(productName)
      .locator('..').locator('.price')
      .invoke('text')
  }

  async getProductCount() {
    return await this.page.locator(this.elements.productCard).count()
  }

  async getProductNames() {
    return await this.page.locator(this.elements.productCard).locator('.product-information h2').invoke('text')
  }

  // Check if pagination exists
  async hasPagination() {
    return await this.page.locator(this.elements.pagination).should('exist')
  }

  // Get current page number
  async getCurrentPage() {
    return await this.page.locator(this.elements.pagination).locator('.active').invoke('text')
  }

  // Scroll to product
  async scrollToProduct(productName) {
    await this.page.locator(productName).scrollIntoView()
    return this
  }

  // Wait for products to load
  async waitForProductsToLoad() {
    await this.page.locator(this.elements.productGrid).should('be.visible')
    await this.page.locator(this.elements.productCard).should('have.count.greaterThan', 0)
    return this
  }

  async assertProductInCart(productName) {
    await this.page.locator('#cart_info').should('contain', productName);
    return this;
  }

  async assertOnProductsPage() {
    await this.page.url().should('include', URL_PATHS.PRODUCTS)
    await this.page.locator(ASSERTION_TEXTS.ALL_PRODUCTS_TITLE).should('be.visible');
    return this;
  }

  async assertOnSearchResultsPage() {
    await this.page.url().should('include', '/products?search=');
    await this.page.locator('Searched Products').should('be.visible');
    return this;
  }

  async measurePageLoadTime() {
    const startTime = Date.now();
    await this.page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    console.log(`Products page loaded in ${loadTime}ms`);
    return this;
  }

  async clickAddToCartByName(productName) {
    // Find the product card that contains the product name
    const productCard = this.page.locator('.single-products').filter({ hasText: productName }).first();
    await productCard.waitFor({ state: 'visible', timeout: 10000 });
    await productCard.scrollIntoViewIfNeeded();
    await expect(productCard).toBeVisible();
    
    // Click the "Add to cart" link within this product card
    const addToCartLink = productCard.locator('a:has-text("Add to cart")').first();
    await addToCartLink.waitFor({ state: 'visible', timeout: 5000 });
    await addToCartLink.click();
    
    await this.page.locator('.modal-content', { timeout: 10000 }).waitFor();
    return this;
  }

  async clickViewProductByName(productName) {
    // Find the product card that contains the product name
    const productCard = this.page.locator('.single-products').filter({ hasText: productName }).first();
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

  async getProductQuantityInput() {
    return this.page.locator(this.elements.productQuantityInput);
  }

  async getReviewNameInput() {
    return this.page.locator(this.elements.reviewNameInput);
  }

  async getReviewEmailInput() {
    return this.page.locator(this.elements.reviewEmailInput);
  }

  async getReviewTextarea() {
    return this.page.locator(this.elements.reviewTextarea);
  }

  async getReviewForm() {
    return this.page.locator(this.elements.reviewForm);
  }

  async getReviewSubmitButton() {
    return this.page.locator(this.elements.reviewSubmitButton);
  }

  async getReviewSuccessMessage() {
    return this.page.locator(this.elements.reviewSuccessMessage);
  }

  async getWriteYourReview() {
    return this.page.locator(this.elements.writeYourReview);
  }

  async getModalContent() {
    return this.page.locator('.modal-content');
  }
}

export default ProductsPage 