import { expect } from '@playwright/test';
import BasePage from './BasePage.js'
import { ASSERTION_TEXTS, URL_PATHS } from '../support/constants.js'
import users from '../fixtures/users.json'

class CartPage extends BasePage {
  constructor(page) {
    super(page)
    this.url = '/view_cart'
    
    // Page elements
    this.elements = {
      // Page header
      cartTitle: '#cart_info .cart_description h4 a',
      
      // Cart table
      cartTable: '#cart_info_table',
      cartRows: '#cart_info_table tbody tr',
      cartPrice: '.cart_price',
      cartQuantity: '.cart_quantity',
      cartTotal: '.cart_total',
      cartTotalPrice: '.cart_total_price',
      cartDeleteButton: '.cart_delete a',
      cartEmptyMessage: 'Cart is empty!',
      cartSubscribeInput: '#susbscribe_email',
      cartSubscribeButton: '#subscribe',
      cartSubscribeSuccess: 'You have been successfully subscribed!',
      
      // Product actions
      removeButton: '.cart_quantity_delete',
      updateQuantity: 'quantity',
      updateCartButton: 'update-cart',
      
      // Cart summary
      subtotal: '.cart_total_price .cart_total',
      tax: '.cart_total_price .cart_total_tax',
      total: '.cart_total_price .cart_total_amount',
      
      // Checkout
      proceedToCheckoutButton: '.btn.btn-default.check_out',
      continueShoppingButton: 'continue-shopping',
      
      // Checkout form
      checkoutForm: '.checkout-form',
      name: 'name',
      email: 'email',
      address: 'address',
      city: 'city',
      state: 'state',
      zipcode: 'zipcode',
      mobileNumber: 'mobile_number',
      country: 'country',
      
      // Payment
      cardName: '[data-qa="name-on-card"]',
      cardNumber: '[data-qa="card-number"]',
      cvc: '[data-qa="cvc"]',
      expiryMonth: '[data-qa="expiry-month"]',
      expiryYear: 'input[name="expiry_year"]',
      payAndConfirmButton: '#submit',
      
      // Order confirmation
      orderConfirmation: '.order-confirmation',
      orderNumber: '.order-number',
      orderSuccess: '#success_message .alert-success',
      
      // Messages
      cartUpdatedMessage: '.cart-updated',
      
      // Navigation
      homeButton: 'home',
      productsButton: 'products',
      cartInfoTable: '#cart_info_table',
      breadcrumb: '.breadcrumb'
    }
  }

  // Navigate to cart page
  async navigateToCart() {
    await this.visit(this.url)
  }

  // Cart item management
  async getCartItems() {
    return this.page.getByRole('row', { name: 'Product Name Price Quantity Total' })
  }

  async getCartItemCount() {
    return this.page.getByRole('row', { name: 'Product Name Price Quantity Total' }).count()
  }

  async getCartItemRow(productName) {
    return this.page.getByRole('row', { name: productName })
  }

  async removeItem(productName) {
    await this.page.getByRole('row', { name: productName }).locator('.cart_delete a').click()
    return this
  }

  async updateItemQuantity(productName, quantity) {
    await this.page.getByRole('row', { name: productName }).locator('.cart_quantity_input').clear()
    await this.page.getByRole('row', { name: productName }).locator('.cart_quantity_input').type(quantity);
    return this;
  }

  async updateCart() {
    await this.page.getByRole('button', { name: 'Update Cart' }).click()
    return this
  }

  // Cart information
  async getProductPrice(productName) {
    return this.page.getByRole('row', { name: productName }).locator('.cart_price').textContent()
  }

  async getProductQuantity(productName) {
    return this.page.getByRole('row', { name: productName }).locator('.cart_quantity_input').textContent()
  }

  async getProductTotal(productName) {
    return this.page.getByRole('row', { name: productName }).locator('.cart_total').textContent()
  }

  // Cart totals
  async getSubtotal() {
    return this.page.locator('.cart_total_price .cart_total').textContent()
  }

  async getTax() {
    return this.page.locator('.cart_total_price .cart_total_tax').textContent()
  }

  async getTotal() {
    return this.page.locator('.cart_total_price .cart_total_amount').textContent()
  }

  // Navigation
  async proceedToCheckout() {
    await this.page.getByRole('button', { name: 'Proceed To Checkout' }).click()
    return this
  }

  async continueShopping() {
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click()
    return this
  }

  // Checkout form
  async fillCheckoutForm(checkoutData) {
    await this.page.locator(`[name="${this.elements.name}"]`).fill(checkoutData.name)
    await this.page.locator(`[name="${this.elements.email}"]`).fill(checkoutData.email)
    await this.page.locator(`[name="${this.elements.address}"]`).fill(checkoutData.address)
    await this.page.locator(`[name="${this.elements.city}"]`).fill(checkoutData.city)
    await this.page.locator(`[name="${this.elements.state}"]`).fill(checkoutData.state)
    await this.page.locator(`[name="${this.elements.zipcode}"]`).fill(checkoutData.zipcode)
    await this.page.locator(`[name="${this.elements.mobileNumber}"]`).fill(checkoutData.mobileNumber)
    await this.page.locator(`[name="${this.elements.country}"]`).selectOption(checkoutData.country)
    return this
  }

  // Payment form
  async fillPaymentForm(paymentData) {
    await this.page.locator(`[data-qa="${this.elements.cardName}"]`).fill(paymentData.cardName)
    await this.page.locator(`[data-qa="${this.elements.cardNumber}"]`).fill(paymentData.cardNumber)
    await this.page.locator(`[data-qa="${this.elements.cvc}"]`).fill(paymentData.cvc)
    await this.page.locator(`[data-qa="${this.elements.expiryMonth}"]`).selectOption(paymentData.expiryMonth)
    await this.page.locator(`[name="${this.elements.expiryYear}"]`).selectOption(paymentData.expiryYear)
    return this
  }

  async payAndConfirm() {
    await this.page.getByRole('button', { name: 'Pay and Confirm Order' }).click()
    return this
  }

  // Quick checkout with default data
  async quickCheckout() {
    const defaultCheckoutData = {
      name: 'Test User',
      email: 'test@example.com',
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      zipcode: '12345',
      mobileNumber: '1234567890',
      country: 'United States'
    }

    const defaultPaymentData = {
      cardName: 'Test User',
      cardNumber: '4111111111111111',
      cvc: '123',
      expiryMonth: '12',
      expiryYear: '2025'
    }

    await this.proceedToCheckout()
    await this.fillCheckoutForm(defaultCheckoutData)
    await this.fillPaymentForm(defaultPaymentData)
    await this.payAndConfirm()
    return this
  }

  // Assertions
  async assertCartPageLoaded() {
    await this.page.getByRole('link', { name: 'Shopping Cart' }).should('have.text', 'Shopping Cart')
    return this
  }

  async assertCartIsEmpty() {
    await this.page.getByText('Cart is empty!').should('be.visible')
    return this
  }

  async assertCartHasItems() {
    await this.getCartItemCount().should('be.greaterThan', 0)
    return this
  }

  async assertProductInCart(productName) {
    await this.page.getByText(productName).should('be.visible')
    return this
  }

  async assertProductNotInCart(productName) {
    await this.page.getByText(productName).should('not.be.visible')
    return this
  }

  async assertCartUpdated() {
    await this.page.getByText('Cart updated!').should('be.visible')
    return this
  }

  async assertOrderConfirmation() {
    await this.page.getByText('Order Confirmation').should('be.visible')
    return this
  }

  async assertOrderSuccess() {
    await this.page.getByText('Your order has been placed successfully!').should('be.visible')
    return this
  }

  // Validation
  async assertProductQuantity(productName, expectedQuantity) {
    await this.getProductQuantity(productName).should('eq', expectedQuantity)
    return this
  }

  async assertProductPrice(productName, expectedPrice) {
    await this.getProductPrice(productName).should('contain', expectedPrice)
    return this
  }

  async assertTotalCalculation() {
    // Get subtotal, tax, and total
    const subtotal = await this.getSubtotal()
    const tax = await this.getTax()
    const total = await this.getTotal()
    
    // Convert to numbers and validate calculation
    this.getSubtotal().then((subtotal) => {
      this.getTax().then((tax) => {
        this.getTotal().then((total) => {
          // Convert to numbers and validate calculation
          const subtotalNum = parseFloat(subtotal.replace(/[^0-9.]/g, ''))
          const taxNum = parseFloat(tax.replace(/[^0-9.]/g, ''))
          const totalNum = parseFloat(total.replace(/[^0-9.]/g, ''))
          
          expect(totalNum).to.equal(subtotalNum + taxNum)
        })
      })
    })
    return this
  }

  // Utility methods
  async clearCart() {
    const items = this.page.locator(this.elements.cartRows);
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      await items.nth(i).locator(`[data-qa="${this.elements.removeButton}"]`).click();
    }
    return this;
  }

  async waitForCartToLoad() {
    return this.page.locator(this.elements.cartTable).waitFor({ state: 'visible' });
  }

  // Get order number
  getOrderNumber() {
    return this.getElement(this.elements.orderNumber).invoke('text')
  }

  getCartItemQuantity(productName) {
    return this.getCartItemRow(productName).find('.cart_quantity_input');
  }

  removeItemFromCart(productName) {
    this.getCartItemRow(productName).find('.cart_delete a').click();
    return this;
  }

  getCartTable() {
    return this.page.locator(this.elements.cartTable);
  }

  getCartRows() {
    return this.page.locator(this.elements.cartRows);
  }

  getCartPrice() {
    return this.page.locator(this.elements.cartPrice);
  }

  getCartQuantity() {
    return this.page.locator(this.elements.cartQuantity);
  }

  getCartTotal() {
    return this.page.locator(this.elements.cartTotal);
  }

  getCartTotalPrice() {
    return this.page.locator(this.elements.cartTotalPrice).first();
  }

  getCartDeleteButton() {
    return this.page.locator(this.elements.cartDeleteButton);
  }

  getCartSubscribeInput() {
    return this.page.locator(this.elements.cartSubscribeInput);
  }

  getCartSubscribeButton() {
    return this.page.locator(this.elements.cartSubscribeButton);
  }

  getCartSubscribeSuccess() {
    return this.page.locator('p:has-text("You have been successfully subscribed!")');
  }

  getCartEmptyMessage() {
    return this.page.locator('p:has-text("Cart is empty!")');
  }
}

export default CartPage 