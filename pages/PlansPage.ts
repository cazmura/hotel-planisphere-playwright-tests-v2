import type { Locator, Page } from '@playwright/test';

export class PlansPage {
  readonly page: Page;
  readonly recommendedPlanHeading: Locator;
  readonly recommendedPlanName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.recommendedPlanHeading = page.getByText('⭐おすすめプラン⭐');
    this.recommendedPlanName = page.getByText('お得な特典付きプラン');
  }

  async goto() {
    await this.page.goto('/ja/plans.html');
  }
}
