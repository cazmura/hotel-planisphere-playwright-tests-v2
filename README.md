# hotel-planisphere-playwright-tests-v2

[![Playwright Tests](https://github.com/cazmura/hotel-planisphere-playwright-tests-v2/actions/workflows/playwright.yml/badge.svg)](https://github.com/cazmura/hotel-planisphere-playwright-tests-v2/actions/workflows/playwright.yml)

[HOTEL PLANISPHERE](https://hotel-example-site.takeyaqa.dev/ja/index.html) を対象にした手動テストケースと、その自動化（Playwright + Page Object Model）のサンプルです。

このリポジトリは [hotel-planisphere-playwright-tests](https://github.com/cazmura/hotel-planisphere-playwright-tests)（ベースライン実装）での学びを踏まえ、デザインパターンとCIパイプラインを改善したバージョンです。主な変更点:

- Page Object Model（`pages/LoginPage.ts`, `MyPage.ts`, `PlansPage.ts`）を導入し、セレクタをテストコードから分離
- テストファイルを機能単位（`login.spec.ts`, `plans.spec.ts`）に分割
- ESLint・TypeScriptの型チェックをCIに追加
- Chromium / Firefox / WebKit のマルチブラウザ実行
- 依存パッケージ・Playwrightブラウザのキャッシュによる実行時間の短縮
- READMEへのCIステータスバッジ追加

## 対象サイト

- https://hotel-example-site.takeyaqa.dev/ja/index.html
- テスト自動化の学習用に公開されているホテル予約デモサイトです。

## 手動テストケース

### TC1: 正しい認証情報でログインできる

| 項目 | 内容 |
| --- | --- |
| 前提条件 | ログインページ（`/ja/login.html`）にアクセスしている |
| 手順 | 1. メールアドレスに `ichiro@example.com` を入力する<br>2. パスワードに `password` を入力する<br>3. ログインボタンをクリックする |
| 期待結果 | マイページ（`/ja/mypage.html`）に遷移し、メールアドレス「ichiro@example.com」と氏名「山田一郎」が表示される |

### TC2: 誤った認証情報でログインするとエラーが表示される

| 項目 | 内容 |
| --- | --- |
| 前提条件 | ログインページ（`/ja/login.html`）にアクセスしている |
| 手順 | 1. メールアドレスに `wrong@example.com` を入力する<br>2. パスワードに `wrongpass` を入力する<br>3. ログインボタンをクリックする |
| 期待結果 | ログインに失敗してログインページに留まり、「メールアドレスまたはパスワードが違います。」というエラーメッセージが表示される |

### TC3: 宿泊予約ページにアクセスするとおすすめプランが表示される

| 項目 | 内容 |
| --- | --- |
| 前提条件 | 未ログイン状態である |
| 手順 | 1. 「宿泊予約」ページ（`/ja/plans.html`）にアクセスする |
| 期待結果 | 「⭐おすすめプラン⭐」の見出しと「お得な特典付きプラン」のプランカードが表示される |

## 自動化（Playwright + Page Object Model）

### ディレクトリ構成

```
pages/           画面ごとのPage Object（セレクタと操作をまとめる）
  LoginPage.ts
  MyPage.ts
  PlansPage.ts
fixtures/        テストデータ（アカウント情報など）をテストコードから分離
  users.ts
tests/           テストケース（画面/機能単位でファイルを分割）
  login.spec.ts    TC1, TC2
  plans.spec.ts    TC3
```

### なぜ Page Object Model を採用したか

テストコードからセレクタ（`#email` や `getByLabel(...)` など）を直接書かず、`pages/` 配下のクラスに閉じ込めています。これにより、

- テスト本体は「何を確認したいか」だけを記述でき、可読性が上がる
- サイトのHTML構造が変わった場合、修正箇所がPage Object側の1箇所に閉じる
- 同じ操作（ログインなど）を複数のテストで再利用しやすい

というメリットがあります。今回はテストケース数自体は少ないですが、今後テストが増えてもこの構造のまま拡張できるようにしています。

### セットアップ

```bash
npm install
npx playwright install --with-deps
```

### 実行

```bash
npm test
```

Chromium / Firefox / WebKit の3ブラウザで実行されます（`playwright.config.ts`の`projects`設定）。

### Lint・型チェック

```bash
npm run lint
npm run typecheck
```

### レポート

```bash
npm run test:report
```

## CI での実行

`.github/workflows/playwright.yml` に GitHub Actions 用のワークフローを用意しています。

- `main`へのpush・PR作成時に加えて、`workflow_dispatch`で手動実行も可能
- 依存パッケージとPlaywrightブラウザをキャッシュし、実行時間を短縮
- `lint` → `typecheck` → `test` の順にチェックし、テスト失敗だけでなくコード品質も可視化
- 実行結果は`playwright-report`・`test-results`（スクリーンショット・トレース含む）としてアーティファクトに保存（30日間保持）

内部では`npm ci`や`npx playwright install`などの標準npmコマンドのみを呼び出しているため、GitHub Actions以外（GitLab CI、CircleCI、Jenkinsなど）でも同じコマンドをそのまま移植して利用できます。
