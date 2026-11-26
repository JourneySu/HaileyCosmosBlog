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

## v2.0.202611261542（2026-11-26）

主題：第一篇正式文章上線，新增書籍封面合成工具。

### 更改重點

- **第一篇正式文章**：《為什麼立場不同的人，總是很難被說服？》，網址 `/blog/elephant-and-rider/`；範本與測試文章全部刪除
- **新增 `/combine-cover` 指令**：把 AI 產的背景圖和書封合成文章封面，放進 vault 的 `99_assets`，確認後自動同步
- **換行跟 Obsidian 一致**：按一次 Enter 就換行，不再被併成同一行
- **素材資料夾 `_素材/`**：合成用的原始素材只留在本機，不推上遠端、不上網站
- **不採用原作者的 4 條規範**：記錄在 `CLAUDE.md` 和使用手冊
- **文件**：使用手冊新增工具總覽、封面合成、原作者規範三節

---

### 1. 第一篇正式文章

| 檔案 | 改動 |
|---|---|
| `src/data/posts/zh/elephant-and-rider.md`（新增） | 從 vault 同步的第一篇正式文章 |
| `src/assets/covers/elephant-and-rider.webp`（新增） | 合成的封面，1600 x 1067，141 KB |
| `src/data/posts/zh/sample-01.md` 到 `sample-08`、`test1.md` | v1.2 放的範本與測試文章，刪除 |

- 檔名原本是中文標題，網址會變成一長串編碼（`%E7%82%BA...`），改用英文檔名 `elephant-and-rider` 後重新發布
- 封面尺寸依網站實際用到的大小決定：文章頁最大用到 1440 寬，列表卡會裁成 16:9，所以用 3:2、1600 寬，主體放中間

### 2. 書籍封面合成（`/combine-cover`）

| 檔案 | 改動 |
|---|---|
| `scripts/combine-cover.mjs`（新增） | 找素材、合成、寫入 `99_assets`。用法 `pnpm combine-cover <名稱>` |
| `.claude/commands/combine-cover.md`（新增） | Claude Code 指令：執行腳本 → 開圖給使用者看、Claude 也檢查一次 → 確認後執行 `pnpm sync-content` |
| `package.json` | 新增 `combine-cover` 指令 |

**合成規則**：背景縮放裁切成 1600 x 1067；書封高度占 75%，中心在畫面寬度 70% 的位置，右下加陰影；輸出 WebP。

**對 vault 的保護（寫在程式裡）**：

- 只在 `99_assets` 新增一個原本不存在的檔案，不覆蓋、不刪除、不建資料夾
- 名稱只允許英數字、`-`、`_`，擋掉 `../` 這類路徑
- 素材少一張、同名素材有兩張、成品已存在，都會停下來，什麼都不寫

測試：失敗的情況直接執行；成功與「成品已存在」用臨時副本輸出到暫存資料夾測試，沒有碰真實 vault。第一次正式執行（`elephant-and-rider`）成功。

### 3. 換行修正

**原本的問題**：Markdown 標準規則下，只按一次 Enter 會被併成一個空白，所以 Obsidian 裡一行一行寫的文章，在網站上變成一整段，中文之間還多出空格。

| 檔案 | 改動 |
|---|---|
| `package.json`、`pnpm-lock.yaml` | 新增 `remark-breaks` 4.0.0（MIT，remark 官方套件） |
| `astro.config.mjs` | 加進 Markdown 外掛清單 |
| `THIRD-PARTY.md` | 登記這個套件 |

所有文章都套用，寫作習慣不用改。

### 4. 素材資料夾 `_素材/`

- `.gitignore` 新增 `_素材/`：合成用的背景、書封原圖放這裡，不會推上遠端
- 原本放在 `public/素材照片/` 的素材移到這裡：`public/` 的檔案會被原封不動放上網站，任何人都能下載

### 5. 不採用原作者的規範

`AGENTS.md:133-137` 的 4 條規則不採用：檔案開頭一行說明、400 行上限、禁用 em dash／en dash、程式註解用法文。這些規則不影響網站運作，也不會擋部署。

- `CLAUDE.md`：在 `@AGENTS.md` 下方加一行例外，讓 Claude 不再把這些當成問題修正
- `pnpm lint:house` 在 Windows 上會當掉（`scripts/house.mjs:32` 的路徑多一個開頭斜線），決定不修
- 色票、`tv()` 字級順序兩條有技術上的理由，仍然保留

### 6. 文件更新

| 文件 | 更新內容 |
|---|---|
| `部落格使用手冊.md` | 第 1 節補換行規則；第 4 節路徑表加 `_素材/`；新增第 8 節「工具與指令總覽」、第 9 節「書籍封面合成」、第 10 節「主題原作者的規範（不採用）」 |
| `Obsidian寫作SOP.md` | 新增「換行」一節；封面圖一節加上書籍封面改用 `/combine-cover` |
| `Release_Note.md` | 新增本版本 |

---

## v1.4.202611251513（2026-11-25）

主題：網站名稱改為「迴圈外的海莉」，並重新設計分享卡。

### 更改重點

- **網站名稱改為「迴圈外的海莉」**：取代「海莉閱讀宇宙」；英文名稱「Hailey Cosmos」不變
- **分享卡改版**：小標改為「HAILEY COSMOS」，大標題改為「Outside the loop／迴圈外的海莉」，取代原本的英文標語（例如「Outside the loop, one page at a time.」）
- **分享卡標題可手動換行**：`scripts/og.mjs` 支援 `\n`，修正中文標題超出圖片右側被切掉的問題
- **分享卡替代文字同步更新**

---

### 1. 網站名稱

| 檔案 | 項目 | 改動 |
|---|---|---|
| `src/config/siteData.json.ts` | `name` | 「海莉閱讀宇宙」改為「迴圈外的海莉」：用於每頁標題後綴（例如「所有文章 \| 迴圈外的海莉」）、`og:site_name`、結構化資料 |
| `src/i18n/ui/zh/pages.ts` | `metaTitle` | 迴圈外的海莉 Hailey Cosmos｜閱讀筆記與生活隨想 |
| `src/i18n/ui/zh/pages.ts` | `heroTitle` | 首頁主標題第二行改為「迴圈外的海莉」：`"Outside the Loop\n迴圈外的海莉"` |

### 2. 分享卡改版

| 卡片 | 小標 | 大標題 |
|---|---|---|
| `default` | HAILEY COSMOS | Outside the loop／迴圈外的海莉 |
| `blog` | HAILEY COSMOS · 文章 | Outside the loop／迴圈外的海莉 · 文章 |
| `topics` | HAILEY COSMOS · 主題 | Outside the loop／迴圈外的海莉 · 主題 |
| `about` | HAILEY COSMOS · 關於 | Outside the loop／迴圈外的海莉 · 關於 |

- 已執行 `pnpm og` 重新產生 `public/og/*.png`。**這四張圖要一起 commit**：`pnpm build` 不會重新產生它們
- `src/config/siteData.json.ts` 的分享卡替代文字（`defaultImage.alt`）改為「Hailey Cosmos: Outside the loop 迴圈外的海莉」，和圖片一致
- 社群平台會快取分享預覽，部署後可能要等一段時間才更新，或用平台的除錯工具（例如 Facebook Sharing Debugger）重新抓取

### 3. 分享卡標題換行修正

**原本的問題**：`scripts/og.mjs` 的 `twoLines` 只看字數決定要不要換行，26 個字以內就排成一行。但中文字的寬度約是英文的兩倍，「Outside the loop 迴圈外的海莉」只有 23 個字，卻排不下一行，最後的「莉」被切掉。

**修正**：`twoLines` 遇到標題裡有 `\n` 時，固定照 `\n` 分成兩行；沒有 `\n` 時維持原本依字數自動換行。

---

## v1.3.202611061456（2026-11-06）

主題：訂閱表單串接 Buttondown 電子報。

### 更改重點

- **訂閱表單真的能訂閱了**：首頁和頁尾的表單串接 Buttondown，按下「訂閱」後**不會離開部落格**，結果直接顯示在表單下方
- **新增 Worker**：表單送到網站自己的 `/api/subscribe`，由 Worker 用 API key 呼叫 Buttondown。Astro 維持純靜態，沒有加 adapter
- **API key 不在程式碼裡**：設在 Cloudflare 後台的機密 `BUTTONDOWN_API_KEY`，使用只開 Subscribers 權限的專用 key
- **防垃圾**：隱藏陷阱欄位、同一個 IP 1 分鐘最多 3 次、把訪客 IP 交給 Buttondown 防火牆判斷；Turnstile 先不做
- **友善的結果訊息**：新訂閱、已訂閱過、格式錯誤、太頻繁、失敗、網路斷線各有中文訊息；失敗時附上 Buttondown 官方訂閱頁當備用
- **待完成**：Buttondown 帳號審核中，確認信暫停寄送，審核通過後再做完整實測
- **照片全部進版控，不再依賴 Pexels**：建置時不再從 Pexels 下載照片，網站用到的照片都 commit 在 repo 裡；你自己的封面圖也會被 commit，修正了「有自己封面圖的文章會部署失敗」的問題
- **About 頁隱藏手機截圖**：右欄留白，排版不變
- **網站名稱與 SEO**：網站名稱改為「海莉閱讀宇宙」，英文別名「Hailey Cosmos」；導覽列與頁尾顯示「Hailey Cosmos」；首頁標題、結構化資料、`llms.txt`、分享卡片同步更新

---

### 1. 運作方式

讀者按「訂閱」→ 前端程式攔下表單，在背景送到 `/api/subscribe` → Worker 檢查後呼叫 Buttondown API（`POST https://api.buttondown.com/v1/subscribers`）→ 回傳結果代碼 → 前端在表單下方顯示對應訊息。

- 靜態頁面照舊由 Cloudflare 直接提供，不會經過 Worker；只有 `/api/subscribe` 這個網址由 Worker 處理
- 沒有指定訂閱者類型，Buttondown 會建立 `unactivated`（待確認）的訂閱者並寄出確認信，維持雙重確認
- 錯誤細節只會記在 Cloudflare 的 Observability 紀錄裡（搜尋 `subscribe:`），不會傳到前端

### 2. 新增與修改的檔案

| 檔案 | 改動 |
|---|---|
| `worker/index.js`（新增） | 處理 `POST /api/subscribe`：陷阱欄位 → email 格式 → IP 頻率限制 → 呼叫 Buttondown → 回傳代碼（`success`、`already`、`invalid`、`limited`、`failed`）；其他網址交給靜態資源 |
| `wrangler.jsonc` | 加入 `main`（Worker 程式）、`assets.binding`、頻率限制 `SUBSCRIBE_LIMITER`（每個 IP 60 秒 3 次）、開啟 Observability |
| `src/components/Sections/Global/_newsletter.ts`（新增） | 前端送出程式：在 document 層級監聽，換頁後不用重新綁定；送出時按鈕顯示「送出中…」並停用，避免重複送出 |
| `NewsletterInvite.astro`、`Footer.astro` | 表單加上 `action="/api/subscribe"`、`method="post"`、`data-astro-reload`、隱藏陷阱欄位 `website`、結果顯示區（`role="status"`，螢幕閱讀器也會唸出）；外觀不變 |
| `src/i18n/ui/zh/reading.ts` | 新增結果訊息：`sending`、`already`、`limited`、`failed`、`failedLink`、`offline`；`error` 改成用在信箱格式錯誤 |
| `src/config/siteData.json.ts`、`configDataTypes.ts` | 新增 `newsletterPage`（備用訂閱頁 `https://buttondown.com/haileycosmos`） |
| `.gitignore` | 加入 `.dev.vars`（本機測試用的金鑰檔案） |
| `THIRD-PARTY.md` | 新增「External services」，記錄 Buttondown |

### 3. 讀者會看到的訊息

| 情況 | 訊息 |
|---|---|
| 新訂閱成功 | 快完成了。請點擊我們剛剛寄出的確認信。 |
| 已經訂閱過 | 這個信箱已經在訂閱名單上了，謝謝你！如果還沒收到確認信，請檢查垃圾信件匣。 |
| 信箱格式錯誤 | 這個信箱格式看起來不太對，請檢查後再試一次。 |
| 送出太頻繁 | 送出次數有點多，請過一分鐘再試一次。 |
| 其他失敗 | 訂閱沒有成功。你可以稍後再試，或到這裡訂閱。（連到 Buttondown 官方訂閱頁） |
| 網路斷線 | 目前無法送出，請確認網路連線後再試。 |

### 4. 刻意不做的部分

- **Turnstile**：先用陷阱欄位、IP 頻率限制和 Buttondown 防火牆。之後如果 Buttondown 後台出現大量未確認的陌生信箱，再加上
- **瀏覽器關閉 JavaScript 的情況**：不另外處理。這時表單會直接送出，畫面會顯示程式回傳的文字，但訂閱一樣會成功

### 5. 帳號與部署設定

- Buttondown 另外建立專用 API key，只開 **Subscribers：Read & write**，其他權限全部關閉；原本不小心貼在對話裡的 Primary Key 已重新產生作廢
- Cloudflare 後台 → `haileycosmosblog` → 設定 → 變數與機密 → 機密 `BUTTONDOWN_API_KEY`
- 只有靜態資源的 Worker 不能設定機密，所以要先 push 含 Worker 程式的版本，再到後台新增

### 6. 文件更新

| 文件 | 更新內容 |
|---|---|
| `部落格使用手冊.md` | 新增第 7 節「電子報訂閱」：運作方式、訊息、設定位置、出問題時看哪裡、本機測試方法 |
| `Reef主題套用_交接文件.md` | H 項更新串接狀態與待辦；已知陷阱新增第 10 條（只有靜態資源的 Worker 不能設定機密） |

### 7. 目前狀態與待辦

- 已確認：網站送出後顯示成功訊息，Buttondown 後台出現狀態為 `unactivated` 的測試信箱，代表網站到 Buttondown 的串接正常
- Buttondown 帳號目前在人工審核中（通常 1 到 3 個工作天），確認信暫停寄送
- 審核通過後要實測：收確認信、重複訂閱是否顯示「已經在訂閱名單上」、換頁後表單仍可用、手機版

### 8. 照片全部進版控，不再依賴 Pexels

**原本的問題**：`.gitignore` 排除了 `src/assets/covers/` 和 `src/assets/*.webp`。主題的範本照片原本是在每次建置時由 `scripts/covers.mjs` 從 Pexels 下載的，但同步腳本也把你自己的封面圖放在 `src/assets/covers/`，這些圖不會被 commit。文章只要用了自己的封面圖，Cloudflare 建置就會因為找不到圖片而失敗。另外，網站的照片取決於 Pexels 能不能正常下載，不在自己掌控中。

| 檔案 | 改動 |
|---|---|
| `.gitignore` | 移除排除 `src/assets/` 圖片的規則，所有圖片都會被 commit |
| `package.json` | `build` 拿掉 `node scripts/covers.mjs`；移除 `covers` 指令，避免誤跑時用 Pexels 的版本覆蓋 repo 裡的圖片 |
| `scripts/covers.mjs` | 保留給 `pnpm test` 的自我檢查使用，開頭註解標明「這個網站已經不再執行它」 |
| `src/assets/` | 首頁大圖 1 張、範本封面 9 張，共約 2.6 MB，第一次 commit 進 repo |
| `src/assets/covers/Pasted image 20260929153637.png` | 9/29 測試留下、沒有任何文章使用，已刪除 |

- 建置時唯一的外部下載已經拿掉。字型、OG 分享卡、favicon 本來就不需要連網。`FilmScene.astro` 裡的 Pexels 影片網址只在讀者瀏覽時才會載入，而且這個區塊已經隱藏，不會被載入。
- 之後刪除範本文章時，9 張範本封面可以一起刪；`src/assets/reef-hero-vague.webp` 是首頁大圖，要保留。

### 9. About 頁隱藏手機截圖

- `about.astro`：註解掉 `<PhoneShot />` 和它的 import，保留兩欄排版、右欄留白，分隔線長度不變
- 元件、截圖檔 `public/reef-iphone-poster.webp`、`pnpm poster` 指令都保留；之後要恢復或刪除，記在交接文件的「未來優化構想」

### 10. 網站名稱與 SEO

| 項目 | 結果 |
|---|---|
| 網站名稱（`siteData.name`） | 「Hailey」改為「海莉閱讀宇宙」：用於每頁標題後綴（例如「所有文章 \| 海莉閱讀宇宙」）、`og:site_name`、結構化資料 |
| 英文別名（新增 `siteData.alternateName`） | 「Hailey Cosmos」：導覽列、手機選單、頁尾的品牌文字；結構化資料的 `alternateName` |
| 首頁標題 | 海莉閱讀宇宙 Hailey Cosmos｜閱讀筆記與生活隨想 |
| 結構化資料 | `schema.ts` 的 WebSite、Organization 支援 `alternateName`，自我檢查補 2 項 |
| `llms.txt` | 標題改為「海莉閱讀宇宙 (Hailey Cosmos)」；刪除不存在的 `/authors/`；首頁、關於頁描述改成符合現況；語言說明改為單一語言 |
| 分享卡片 | 小標改為「海莉閱讀宇宙」，並重新產生 `public/og/*.png`；`blog` 卡片標語的 em dash 改為逗號 |

作者名稱維持「Hailey」，沒有變動。

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
