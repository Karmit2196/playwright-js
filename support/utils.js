// Playwright utility functions

export function generateRandomEmail() {
  return `user_${Date.now()}@example.com`;
}

export function generateRandomName() {
  return `User${Math.floor(Math.random() * 10000)}`;
}

// Add more Playwright test utilities as needed 