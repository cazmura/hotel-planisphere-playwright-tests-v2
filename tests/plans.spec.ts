import { test, expect } from '@playwright/test';
import { PlansPage } from '../pages/PlansPage';

test.describe('宿泊予約', () => {
  // TC3: 宿泊予約ページにアクセスするとおすすめプランが表示される
  test('TC3: shows the recommended plan on the plans page', async ({ page }) => {
    const plansPage = new PlansPage(page);

    await test.step('宿泊予約ページにアクセスする', async () => {
      await plansPage.goto();
    });

    await test.step('おすすめプランが表示されることを確認する', async () => {
      await expect(plansPage.recommendedPlanHeading).toBeVisible();
      await expect(plansPage.recommendedPlanName).toBeVisible();
    });
  });
});
