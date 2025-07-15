# 🧪 Playwright Automation Framework

A robust, industry-standard Playwright testing framework for the [AutomationExercise](https://www.automationexercise.com/) website, featuring enterprise-grade practices, maintainability, and comprehensive CI/CD integration.

## 🚀 Features

### **Core Framework**
- **Page Object Model (POM)** with industry-standard implementations
- **Data-driven Testing** with JSON fixtures and dynamic data generation
- **Cross-browser & Responsive Testing** (Chrome, Firefox, Safari, Edge, Mobile)
- **Comprehensive UI, API, and E2E coverage**
- **Advanced Error Handling** with retry mechanisms and detailed logging
- **Performance Testing** with built-in timing and load time measurements

### **Quality Assurance**
- **ESLint & Prettier** for code quality and formatting
- **Comprehensive Test Reports** (HTML, JSON, JUnit)
- **Screenshot & Video Capture** on failures
- **Trace Viewer** for debugging complex scenarios
- **Accessibility Testing** with WCAG compliance checks

### **CI/CD Integration**
- **GitHub Actions** with parallel test execution
- **Automated Testing** on push, PR, and scheduled runs
- **Artifact Management** with test results and reports
- **PR Comments** with test summary and links
- **Smoke & Regression** test suites

## 📁 Project Structure

```
playwright-framework/
├── .github/workflows/     # CI/CD configurations
├── e2e/                   # Test specifications
│   ├── login.spec.js      # Authentication tests
│   ├── home.spec.js       # Home page tests
│   └── e2e.spec.js        # End-to-end workflows
├── fixtures/              # Test data
│   ├── users.json         # User test data
│   ├── products.json      # Product test data
│   └── apiEndpoints.json  # API endpoint data
├── pages/                 # Page Object Models
│   ├── BasePage.js        # Base page with common methods
│   ├── LoginPage.js       # Login page interactions
│   ├── HomePage.js        # Home page interactions
│   ├── ProductsPage.js    # Products page interactions
│   ├── CartPage.js        # Cart page interactions
│   └── index.js           # Page object factory
├── support/               # Framework utilities
│   ├── constants.js       # Test constants and configurations
│   └── utils.js           # Utility functions
├── screenshots/           # Test screenshots
├── test-results/          # Test execution results
├── playwright-report/     # HTML test reports
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── playwright.config.js   # Playwright configuration
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## 🛠️ Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm 9+
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

### **Running Tests**

#### **Basic Commands**
```bash
# Run all tests
npm test

# Run tests in headed mode (browser visible)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

#### **Test Suites**
```bash
# Smoke tests (critical functionality)
npm run test:smoke

# Regression tests (full test suite)
npm run test:regression

# Browser-specific tests
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Parallel execution
npm run test:parallel
```

#### **Code Quality**
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Pre-commit checks
npm run pre-commit
```

### **Viewing Reports**
```bash
# Show HTML report
npm run test:report

# Open last report
npx playwright show-report
```

### **Allure Reporting**
After running your tests, you can generate and view the Allure report:

```bash
# Generate the Allure report
npm run allure:generate

# Open the Allure report in your browser
npm run allure:open
```

Allure results are automatically generated in the `allure-results/` directory after each test run.

## 🏗️ Architecture

### **Page Object Model (POM)**
The framework follows the Page Object Model pattern for maintainable and reusable test code:

```javascript
// Example: LoginPage.js
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.elements = {
      email: '[data-qa="login-email"]',
      password: '[data-qa="login-password"]',
      loginButton: '[data-qa="login-button"]'
    };
  }

  async login(email, password) {
    await this.typeText(this.elements.email, email);
    await this.typeText(this.elements.password, password);
    await this.clickElement(this.elements.loginButton);
    return this;
  }
}
```

### **Test Structure**
Tests are organized by functionality with clear naming conventions:

```javascript
// Example: login.spec.js
test.describe('Login and Registration Tests', () => {
  test.beforeEach(async ({ page }) => {
    initializePageObjects(page);
    await loginPage().navigateToLogin();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage().login('test@example.com', 'password');
    await loginPage().assertLoginSuccessful();
  });
});
```

## 🔧 Configuration

### **Environment Variables**
```bash
# Base URL for testing
BASE_URL=https://www.automationexercise.com

# Browser configuration
HEADLESS=true
SLOW_MO=0

# Debug mode
DEBUG=false

# CI environment
CI=true
```

### **Playwright Configuration**
The framework supports multiple browser configurations and environments:

```javascript
// playwright.config.js
module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: process.env.BASE_URL || 'https://www.automationexercise.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

## 📊 CI/CD Pipeline

### **GitHub Actions Workflow**
The framework includes a comprehensive CI/CD pipeline:

- **Parallel Test Execution**: Tests run in parallel across 4 shards
- **Multiple Triggers**: Push, PR, scheduled, and manual runs
- **Artifact Management**: Screenshots, videos, and reports
- **PR Integration**: Automatic comments with test results
- **Quality Gates**: Linting and formatting checks

### **Pipeline Stages**
1. **Lint & Format**: Code quality checks
2. **Smoke Tests**: Critical functionality validation
3. **Full Test Suite**: Comprehensive regression testing
4. **Report Generation**: Merged test results and artifacts

## 🎯 Best Practices

### **Test Design**
- Use descriptive test names that explain the scenario
- Follow the AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated
- Use data-driven testing for multiple scenarios
- Implement proper cleanup in test teardown

### **Page Objects**
- Encapsulate page-specific logic in page objects
- Use meaningful element selectors with data attributes
- Implement fluent interfaces for method chaining
- Add comprehensive error handling and logging
- Keep page objects focused and single-purpose

### **Data Management**
- Store test data in JSON fixtures
- Use dynamic data generation for unique scenarios
- Implement proper data cleanup strategies
- Separate test data from test logic

### **Error Handling**
- Implement retry mechanisms for flaky elements
- Add detailed error messages and logging
- Use proper timeout configurations
- Handle network issues and page load failures

## 🐛 Troubleshooting

### **Common Issues**

**Tests failing intermittently**
- Increase timeouts for slow elements
- Add explicit waits for dynamic content
- Use retry mechanisms for flaky interactions

**Browser compatibility issues**
- Check browser-specific configurations
- Verify element selectors across browsers
- Test responsive behavior on different viewports

**CI/CD pipeline failures**
- Check artifact upload permissions
- Verify Node.js and browser versions
- Review test timeout configurations

### **Debugging Tools**
```bash
# Run tests with trace
npx playwright test --trace on

# Open trace viewer
npx playwright show-trace trace.zip

# Debug specific test
npx playwright test --debug

# Generate code for new test
npx playwright codegen
```

## 📈 Performance

### **Optimization Strategies**
- Use parallel test execution
- Implement test sharding for large suites
- Optimize element selectors for speed
- Minimize network requests in tests
- Use headless mode in CI environments

### **Monitoring**
- Track test execution times
- Monitor flaky test rates
- Analyze test coverage metrics
- Review CI/CD pipeline performance

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### **Code Standards**
- Follow ESLint and Prettier configurations
- Write comprehensive test documentation
- Add appropriate error handling
- Maintain backward compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) for the excellent testing framework
- [AutomationExercise](https://www.automationexercise.com/) for the test application
- The open-source community for best practices and tools

---

**Built with ❤️ for robust test automation**
