# Release Note

## 版號規則

格式：`v{大更動版號}.{小更動版號}.{yyyyMMddHHmm}`

| 欄位 | 說明 |
|---|---|
| 大更動版號 | 架構或整體方向的重大改變時遞增（例如更換主題、改變部署方式） |
| 小更動版號 | 功能增減、版面調整等一般改動時遞增；大更動版號遞增時歸零 |
| `yyyyMMddHHmm` | 該版本定版的日期時間（24 小時制），例如 `202611051341` = 2026-11-05 13:41 |

新版本寫在最上面。每個版本開頭先列「更改重點」（一眼看完這版改了什麼），下面再寫詳細內容。

---

## v1.2.202611051341（2026-11-05）

主題：恢復訂閱功能，並修正與 Reef 官方 demo 的比例差異。

### 更改重點

- **恢復訂閱功能（不含 RSS）**：首頁訂閱區塊、導覽列按鈕、手機選單按鈕、頁尾表單共 4 處，外觀照原版；表單仍是示範用，還沒接電子報服務
- **移除 RSS 字眼**：字典裡兩句提到 RSS 的文案已改寫
- **比例對齊官方 demo**：根字級改為固定 16px，大標題字級縮小（首頁主標題約 84px → 48px）
- **首頁主標題固定換行**：「Outside the Loop」和「迴圈外的海莉」分成兩行
- **首頁介紹文字調小一級**：寬螢幕 20px → 18px
- **修正網站網址**：`site` 改為實際上線網址，分享卡圖片重新產生，`wrangler.jsonc` 的 Worker 名稱改成和 Cloudflare 後台一致
- **隱藏首頁「關於」區塊**：先改成固定照片，再依指示從首頁隱藏，程式碼保留可恢復
- **同步腳本支援 `featured`**：在 Obsidian 設 `featured: true` 就能指定首頁「本月精選」
- **刪除 GitHub Actions 檢查**：`verifier.yml` 從第一次 push 起就一直失敗，對本站沒有作用，已刪除
- **文件**：部落格使用手冊新增「首頁區塊顯示規則」，並更新部署步驟
- **暫時的測試內容**：線上有 8 篇範本／測試文章，之後會刪除

---

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

### 7. 隱藏首頁「關於」區塊

原本這個區塊是「捲動控制影片播放」的設計，高度有 3 個螢幕高，要捲很多下才能離開。分兩步調整：

| 步驟 | 檔案 | 改動 |
|---|---|---|
| 1. 改成固定照片 | `src/components/Sections/Home/_film.ts` | 讓 `animated()` 固定回傳 false，區塊一律進入原本內建的備用模式：一張固定照片（首頁第一屏那張浪花照）加文字，高度一個螢幕，影片不會下載 |
| | `src/components/Sections/Home/FilmScene.astro` | 在 HTML 直接加上 `film--flat`，避免 script 載入前區塊先撐成 3 個螢幕高 |
| 2. 從首頁隱藏 | `src/pages/[...locale]/index.astro` | 把 `<FilmScene />` 和它的 import 註解掉。原設計沒有開關可以隱藏這個區塊，只能改程式碼 |

- 元件檔都保留，兩處程式碼裡都有註解寫明恢復方法。
- 現在首頁的區塊順序：主視覺 → 主題跑馬燈 → 本月精選 → 最新筆記 → 主題列表 → 訂閱區塊。

### 8. 同步腳本支援 `featured`

`scripts/sync-content.mjs` 原本只會輸出固定幾個欄位，`featured` 會被丟掉，所以無法從 Obsidian 指定首頁「本月精選」要放哪一篇。

| Obsidian 裡寫的 | 同步後 |
|---|---|
| `featured: true`（大小寫不拘，Obsidian 勾選框也可以） | 寫入 `featured: true` |
| `featured: false` 或沒填 | 不寫入，網站預設就是 false |
| 其他值，例如 `featured: yes` | 印出警告，文章照常同步，當作 false |

用暫存的假 vault 測過上面 5 種寫法（true／false／不填／`yes`／`TRUE`），沒有碰真實 vault。

### 9. 刪除 GitHub Actions 檢查

- 刪除 `.github/workflows/verifier.yml`：這是 Reef 內建的自動檢查，其中一個步驟呼叫的腳本已經跟著後台功能一起被刪掉，所以從第一次 push（2026-09-30）起每次都失敗。
- 這個檢查失敗不會影響 Cloudflare 部署，所以網站一直正常上線。
- 要找回時，最後一個包含它的 commit 是 `a138aa1`；找回後要先修的問題，記錄在交接文件「已刪除的 GitHub Actions 檢查」一節。
- 另外，這次 Cloudflare 沒有自動部署，是因為 Cloudflare 和 GitHub 的連線中斷了，跟這個檢查和 `wrangler.jsonc` 都無關。使用者重新連線後已經恢復。

### 10. 文件更新

| 文件 | 更新內容 |
|---|---|
| `部落格使用手冊.md` | 新增第 6 節「首頁區塊顯示規則」：本月精選和最新筆記怎麼挑文章；frontmatter 欄位表與第 5 節補上 `featured`；第 1 節的部署步驟改成實際流程（push 後 Cloudflare 自動部署）；移除 em dash |
| `Reef主題套用_交接文件.md` | 更正錯誤資訊（授權、預設佈景、網址等），新增「更換網址檢查清單」、「已刪除的 GitHub Actions 檢查」，以及 H 項（v1.2 調整與待辦） |
| `Release_Note.md` | 新增本文件 |

### 11. 暫時的測試內容（之後會刪除）

為了確認首頁「本月精選」和「最新筆記」兩個區塊都有文章時的版面，線上暫時放了以下文章，使用者確認後會再刪除：

- `src/data/posts/zh/sample-01.md` 到 `sample-07.md`：7 篇範本文章，封面沿用專案原有的範本圖片
- `src/data/posts/zh/test1.md`：測試 Cloudflare 自動部署用的文章

---

## v1.1.202609301649（2026-09-30）

主題：Reef 主題套用完成，首次部署上線。

本版本之前的完整過程記錄在 `Reef主題套用_交接文件.md`（C 到 G 項），這裡只列重點。

### 更改重點

- 移除雙語架構，只保留繁體中文（`zh`），移除語言切換 UI
- 移除多作者系統、Contact 導覽連結、首頁「Who writes here」區塊、訂閱功能、RSS、Legal 頁面、文章底部分享按鈕
- 網站識別資訊改為 Hailey／Hailey Cosmos，重新產生 OG 分享卡
- 搬遷 Obsidian 自動化：Wikilink、Callout、`pnpm sync-content`（含封面圖）
- 分類定為「閱讀」、「個人」兩個；範本文章和範本分類全部刪除
- 連接 GitHub 和 Cloudflare Workers，正式部署上線
