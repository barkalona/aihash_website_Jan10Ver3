import { test, expect } from '@playwright/test';

test.describe('Marketplace', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth');
    await page.getByPlaceholderText('Email').fill('test@example.com');
    await page.getByPlaceholderText('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/');
    
    await page.goto('/marketplace');
  });

  test('displays marketplace components', async ({ page }) => {
    await expect(page.getByText('Hash Power Marketplace')).toBeVisible();
    await expect(page.getByRole('button', { name: /create listing/i })).toBeVisible();
    await expect(page.getByPlaceholderText(/search/i)).toBeVisible();
  });

  test('filters listings', async ({ page }) => {
    await page.getByPlaceholderText(/search/i).fill('SHA-256');
    await expect(page.getByText(/sha-256/i)).toBeVisible();
  });

  test('creates new listing', async ({ page }) => {
    await page.getByRole('button', { name: /create listing/i }).click();
    
    await page.getByLabel(/algorithm/i).selectOption('SHA-256');
    await page.getByLabel(/hash power/i).fill('100');
    await page.getByLabel(/price per th/i).fill('2.5');
    await page.getByLabel(/minimum purchase/i).fill('10');
    await page.getByLabel(/maximum purchase/i).fill('1000');
    
    await page.getByRole('button', { name: /create listing/i }).click();
    
    await expect(page.getByText(/listing created successfully/i)).toBeVisible();
  });

  test('purchases hash power', async ({ page }) => {
    await page.getByRole('button', { name: /buy now/i }).first().click();
    
    await page.getByLabel(/hash power/i).fill('50');
    await expect(page.getByText(/total price/i)).toBeVisible();
    
    await page.getByRole('button', { name: /purchase hash power/i }).click();
    
    await expect(page.getByText(/purchase successful/i)).toBeVisible();
  });
});