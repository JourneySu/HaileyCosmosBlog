# Release Note

## 版號規則

格式：`v{大更動版號}.{小更動版號}.{yyyyMMddHHmm}`

| 欄位 | 說明 |
|---|---|
| 大更動版號 | 架構或整體方向的重大改變時遞增（例如更換主題、改變部署方式） |
| 小更動版號 | 功能增減、版面調整等一般改動時遞增；大更動版號遞增時歸零 |
| `yyyyMMddHHmm` | 該版本定版的日期時間（24 小時制），例如 `202611051341` = 2026-11-05 13:41 |

新版本寫在最上面。

---

## v1.2.202611051341（2026-11-05）

主題：恢復訂閱功能，並修正與 Reef 官方 demo 的比例差異。

### 1. 恢復「訂閱」功能（不含 RSS）

先前的 AI 已經把訂閱功能移除。經查，它沒有用註解保留，而是直接刪除程式碼；只有首頁的訂閱區塊元件和字典文案還留著。原版 GitHub repo 已無法下載，這次改以官方 demo（`https://reef.alohapixel.app/`）建置出來的 HTML 為準，照原樣補回以下 4 處：

| 位置 | 檔案 | 內容 |
|---|---|---|
| 首頁最下方的訂閱區塊 | `src/pages/[...locale]/index.astro` | 重新引用原本就留著的 `NewsletterInvite`，放在 `TopicStrip` 之後、頁尾之前 |
| 導覽列右側的「訂閱」按鈕 | `src/components/Sections/Global/Navbar.astro` | 在寬度 640px 以上顯示，連到 `#newsletter` |
| 手機選單底部的「訂閱」大按鈕 | `src/components/Sections/Global/Navbar.astro` | 連到 `#newsletter` |
| 頁尾的訂閱小表單 | `src/components/Sections/Global/Footer.astro` | 新增 `newsletter` 參數（預設顯示）。首頁已經有大區塊，所以首頁傳入 `newsletter={false}` 不顯示，確保每頁只有一個 `id="newsletter"` |

- 按鈕和輸入框沿用專案既有的 `Button`、`Input` 元件，尺寸對應 demo 的 class。
- 文案沿用字典 `src/i18n/ui/zh/reading.ts` 現成的 `newsletter` 段落，內容這次不改。
- **刻意不補回的部分**：
  - 訂閱區塊右邊的「Prefer a feed? / RSS feed」卡片、頁尾的 RSS 圖示和連結：網站不提供 RSS。
  - demo 訂閱區塊的光暈效果（`scene-lumiere`）、跑馬燈邊框（`border-beam`），以及輸入框的 `user-invalid:border-primary`：這些在本機版本中完全找不到，應該是 demo 後來才新增的功能，所以不補。
- 訂閱區塊維持單欄版面（左邊文字和表單，右邊露出背景照片），不恢復原版的 7/12 欄寬。
- **表單仍是示範用**：沒有 `action`，送不出任何東西。要真的收到訂閱，之後得接上電子報服務；接法寫在 `Footer.astro` 開頭的註解。

### 2. 移除文案中的 RSS 字眼

| 檔案 | 原文 | 改為 |
|---|---|---|
| `src/i18n/ui/zh/reading.ts`（`archive.emptyLede`） | 文章庫大約每隔幾週會更新，RSS 訂閱會通知你。 | 文章庫大約每隔幾週會更新。 |
| `src/i18n/ui/zh/pages.ts`（主題頁 `emptyLede`） | 這個主題已經開放，但第一篇文章還是草稿。RSS 訂閱會在文章上線時通知你。 | 這個主題已經開放，但第一篇文章還是草稿。訂閱後會定時整理文章通知您。 |

另外修正了 `NewsletterInvite.astro` 開頭的程式註解：原本寫「右邊是 RSS」，已改成符合現況的說明。

### 3. 比例大小修正（對齊官方 demo）

在同一個瀏覽器、100% 縮放下，網站整體看起來比 demo 大，首頁第一屏的面板也比較長。查證後原因有兩個：

**(1) 根字級**：`src/styles/global.css`

- 原本：`clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`，寬螢幕上最大 18px，所有用 `rem` 寫的尺寸都會放大 12.5%。
- 改為：`100%`（固定 16px），和 demo 相同。

**(2) 大標題字級**：`src/styles/tokens.css`

先前的 AI 曾為中文把原版字級乘上 0.85，但 demo 之後自己縮小了大標題，所以改成以 demo「現在」的數值乘 0.85。中文用的行高和字距（行高 1.2 到 1.35、字距 0）維持不變。

| 等級 | 原本 | 改為 | 寬螢幕最大值 |
|---|---|---|---|
| `sm` | `clamp(1.49rem, 1.19rem + 1.19vw, 2rem)` | `clamp(1.38rem, 1.1rem + 1.15vw, 1.91rem)` | 約 31px |
| `md` | `clamp(1.79rem, 1.32rem + 1.96vw, 2.72rem)` | `clamp(1.49rem, 1.15rem + 1.4vw, 2.13rem)` | 約 34px |
| `lg` | `clamp(2.08rem, 1.4rem + 2.89vw, 3.7rem)` | `clamp(1.81rem, 0.85rem + 2.34vw, 2.98rem)` | 約 48px |
| `xl` | `clamp(2.3rem, 1.4rem + 3.74vw, 4.68rem)` | `clamp(1.81rem, 0.85rem + 2.34vw, 2.98rem)` | 約 48px |

效果：首頁主標題從約 84px 降到約 48px。第一屏面板不再被標題撐長，下方會和 demo 一樣露出主題跑馬燈的空隙。

### 4. 首頁主標題固定換行

- `src/i18n/ui/zh/pages.ts`：`heroTitle` 改為 `"Outside the Loop\n迴圈外的海莉"`。
- `src/components/Sections/Home/Hero.astro`：標題文字中的 `\n` 會換行。
- 之後要調整換行位置，只需要改字典裡 `\n` 的位置；拿掉 `\n` 就會恢復依寬度自動換行。

### 5. 首頁介紹文字字級調小一級

`src/components/Sections/Home/Hero.astro`：主標題右邊的介紹文字從 `md:text-lg lg:text-xl` 改為 `lg:text-lg`。

| 螢幕寬度 | 原本 | 改為 |
|---|---|---|
| 1024px 以上 | 20px | 18px |
| 768 到 1023px | 18px | 16px |
| 手機 | 16px | 16px（不變） |

### 6. 修正網站網址設定

部署時網址換了，但 `site` 沒跟著改，canonical、OG 分享卡、sitemap、`robots.txt`、`llms.txt` 都還指向舊站 `mythinkingblog.ton-yuan-su.workers.dev`。

| 檔案 | 改動 |
|---|---|
| `astro.config.mjs` | `site` 改為實際上線網址 `https://haileycosmosblog.ton-yuan-su.workers.dev` |
| `scripts/og.mjs` | 分享卡右下角的網址原本寫死在程式裡，改為自動從 `astro.config.mjs` 的 `site` 讀取，以後換網址不用再改這支腳本。開頭註解原本寫「PNG 不進版控、build 時自動產生」，和實際相反，也一併改正 |
| `public/og/*.png` | 執行 `pnpm og` 重新產生四張分享卡，右下角已改印新網址。**這四張圖要一起 commit**：`pnpm build` 不會重新產生它們，部署時直接用 repo 裡的檔案 |
| `wrangler.jsonc` | `name` 從 `haileycosmos` 改成 `haileycosmosblog`，跟 Cloudflare 後台的 Worker 名稱一致，避免自動部署失敗或另外建出新的 Worker |

換網址時要改哪些地方，已整理成 `Reef主題套用_交接文件.md` 裡的「更換網址檢查清單」。

### 驗證

- `pnpm check`：0 errors、0 warnings、0 hints
- 網址修正後重新建置：`dist/` 裡找不到任何舊網址，canonical、`og:url`、`og:image`、sitemap、`robots.txt`、`llms.txt` 都已經是新網址
- `pnpm build`：成功，共 8 頁
- 比對建置出來的 HTML：首頁、`/blog/`、`/about/` 各只有一個 `id="newsletter"`，所有頁面都沒有 RSS 連結
- 使用者已在瀏覽器上和 demo 並排確認，比例可以接受

---

## v1.1.202609301649（2026-09-30）

主題：Reef 主題套用完成，首次部署上線。

本版本之前的完整過程記錄在 `Reef主題套用_交接文件.md`（C 到 G 項），這裡只列重點：

- 移除雙語架構，只保留繁體中文（`zh`），移除語言切換 UI
- 移除多作者系統、Contact 導覽連結、首頁「Who writes here」區塊、訂閱功能、RSS、Legal 頁面、文章底部分享按鈕
- 網站識別資訊改為 Hailey／Hailey Cosmos，重新產生 OG 分享卡
- 搬遷 Obsidian 自動化：Wikilink、Callout、`pnpm sync-content`（含封面圖）
- 分類定為「閱讀」、「個人」兩個；範本文章和範本分類全部刪除
- 連接 GitHub 和 Cloudflare Workers，正式部署上線
