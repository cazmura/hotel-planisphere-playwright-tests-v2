import type { Locator, Page } from '@playwright/test';

export class MyPage {
  readonly page: Page;
  readonly nameValue: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameValue = page.getByText('山田一郎');
  }

  emailValue(email: string): Locator {
    return this.page.getByText(email);
  }
}
