import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MyPage } from '../pages/MyPage';

const VALID_EMAIL = 'ichiro@example.com';
const VALID_PASSWORD = 'password';

test.describe('ログイン', () => {
  // TC1: 正しい認証情報でログインできる
  test('TC1: logs in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const myPage = new MyPage(page);

    await test.step('正しい認証情報でログインする', async () => {
      await loginPage.goto();
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    });

    await test.step('マイページに会員情報が表示されることを確認する', async () => {
      await expect(page).toHaveURL(/mypage\.html/);
      await expect(myPage.emailValue(VALID_EMAIL)).toBeVisible();
      await expect(myPage.nameValue).toBeVisible();
    });
  });

  // TC2: 誤った認証情報でログインするとエラーが表示される
  test('TC2: shows an error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('誤った認証情報でログインする', async () => {
      await loginPage.goto();
      await loginPage.login('wrong@example.com', 'wrongpass');
    });

    await test.step('エラーメッセージが表示されることを確認する', async () => {
      await expect(loginPage.emailErrorMessage).toHaveText('メールアドレスまたはパスワードが違います。');
      await expect(loginPage.passwordErrorMessage).toHaveText('メールアドレスまたはパスワードが違います。');
      await expect(page).toHaveURL(/login\.html/);
    });
  });
});
