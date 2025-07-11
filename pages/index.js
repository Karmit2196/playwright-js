import HomePage from './HomePage.js';
import ProductsPage from './ProductsPage.js';
import CartPage from './CartPage.js';
import LoginPage from './LoginPage.js';
import BasePage from './BasePage.js';

// Create page object instances
let homePageInstance = null;
let productsPageInstance = null;
let cartPageInstance = null;
let loginPageInstance = null;
let basePageInstance = null;

// Function to initialize page objects with page instance
export const initializePageObjects = (page) => {
  homePageInstance = new HomePage(page);
  productsPageInstance = new ProductsPage(page);
  cartPageInstance = new CartPage(page);
  loginPageInstance = new LoginPage(page);
  basePageInstance = new BasePage(page);
};

// Export page objects as getters
export const homePage = () => homePageInstance;
export const productsPage = () => productsPageInstance;
export const cartPage = () => cartPageInstance;
export const loginPage = () => loginPageInstance;
export const basePage = () => basePageInstance;


