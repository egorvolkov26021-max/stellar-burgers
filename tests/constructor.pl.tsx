import { test, expect, type Page } from '@playwright/test';

const bun = 'Тестовая булка';
const filling = 'Тестовая котлета';

async function addIngredient(page: Page, name: string) {
  await page.getByText(name, { exact: true }).first().locator('..').locator('..').getByText('Добавить').click();
}

test.beforeEach(async ({ page }, testInfo) => {
  const harFile = testInfo.title === 'submits burger, shows order number, clears constructor and closes modal'
    ? 'tests/hars/order.har'
    : 'tests/hars/auth-guest.har';

  await page.routeFromHAR(harFile, {
    url: '**/api/**',
    notFound: 'abort'
  });
  await page.goto('/');
  await expect(page.getByText(bun, { exact: true })).toBeVisible();
});

test.describe('burger constructor', () => {
  test('adds bun and fillings', async ({ page }) => {
    await addIngredient(page, bun);
    await addIngredient(page, filling);
    await expect(page.getByTestId('constructor-bun-1')).toContainText(bun);
    await expect(page.getByTestId('constructor-bun-2')).toContainText(bun);
    await expect(page.getByTestId('constructor-ingredients')).toContainText(filling);
  });
});

test.describe('ingredient modal', () => {
  test('opens with selected ingredient and closes using cross', async ({ page }) => {
    await page.getByText(filling, { exact: true }).first().click();
    await expect(page).toHaveURL(/\/ingredients\/test-main$/);
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(page.getByRole('heading', { name: filling })).toBeVisible();
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('Детали ингредиента')).toHaveCount(0);
  });
  test('closes using overlay', async ({ page }) => {
    await page.getByText(bun, { exact: true }).first().click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(page.getByText('Детали ингредиента')).toHaveCount(0);
  });
});

test.describe('order creation', () => {
  test('submits burger, shows order number, clears constructor and closes modal', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
      document.cookie = 'accessToken=fake-access-token; path=/';
    });
    await page.reload();
    await expect(page.getByText(bun, { exact: true })).toBeVisible();
    await addIngredient(page, bun);
    await addIngredient(page, filling);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(page.getByTestId('order-number')).toHaveText('123456');
    await expect(page.getByTestId('constructor-ingredients')).toContainText('Выберите начинку');
    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByTestId('order-number')).toHaveCount(0);
  });
});
