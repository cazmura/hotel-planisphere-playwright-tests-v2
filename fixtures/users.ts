// 登録済みユーザー（サイトのトップページに公開されているテスト用アカウント）
export const users = {
  premium: { email: 'ichiro@example.com', password: 'password' },
  invalid: { email: 'wrong@example.com', password: 'wrongpass' },
} as const;
