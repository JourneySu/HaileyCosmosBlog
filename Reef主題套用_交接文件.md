# Reef 主題套用作業 — AI Agent 交接文件

> **目前版本：v1.2.202611051341（2026-11-05）**。每個版本實際改了什麼，請看 `Release_Note.md`；這份文件記錄專案背景、使用者的決策和已知陷阱。

## 專案背景

使用者正在建置一個個人部落格，技術棧為 Astro + Obsidian + GitHub + Cloudflare（Workers 靜態資產）。目前有一個**已上線、運作正常**的舊版部落格專案（`my-thinking`），現在要換成新的視覺主題（Reef），並沿用先前已驗證過的 Obsidian 自動化功能。

## 現有環境資訊

| 項目 | 內容 |
|---|---|
| 作業系統 | Windows（PowerShell，注意與CMD指令差異，如 `Remove-Item -Recurse -Force` 而非 `rmdir /s /q`） |
| Node.js | v24.16.0 |
| 舊專案路徑 | `D:\File\my-thinking`（已上線，勿直接破壞性修改，除非確認新專案已完全就緒） |
| 舊專案 GitHub repo | JourneySu/myThinkingBlog |
| 舊專案上線網址 | `mythinkingblog.ton-yuan-su.workers.dev`（Cloudflare Workers 靜態資產部署） |
| Obsidian vault 路徑 | `D:\File\Books` |
| Vault 發布用文章資料夾 | `D:\File\Books\11_haileyCosmos\posted` |
| Vault 附件（圖片）資料夾 | `D:\File\Books\99_assets` |
| 新主題測試專案路徑 | `D:\File\reef-blog`（獨立資料夾，與 my-thinking、vault 皆分開） |
| 新主題套件管理工具 | pnpm（非 npm，語法：`pnpm install`、`pnpm dev`、`pnpm build`） |

## 新主題資訊：Reef

- 來源：`https://github.com/alohapixelcom-hash/reef`
  - **2026-11-05 確認：這個 repo 已經無法存取**（GitHub 回應 404），本機也沒有其他原版副本。要對照原版時，改用官方 demo `https://reef.alohapixel.app/` 建置出來的 HTML（class 和結構都看得到，但看不到 `.astro` 原始碼和註解）
  - **注意：demo 比本機版本新**。原作者在你下載之後還有更新，例如縮小大標題字級、根字級改成 `100%`、訂閱區塊加了光暈和跑馬燈邊框特效、強調字拿掉波浪底線。所以拿 demo 對照時，要先分清楚哪些是「先前 AI 改的」、哪些是「demo 後來才改的」
- 技術棧：Astro 7 + Tailwind CSS 4，幾乎不用JavaScript（原生 `<dialog>`/`<details>` 元素）
- **授權**：MIT（見專案根目錄 `LICENSE`、`package.json` 的 `license` 欄位）。*舊版文件曾寫成「Commercial license」，2026-11-05 查證後更正*
- 預設**淺色**模式：`ThemeInit.astro` 會先讀 `localStorage` 的 `reef-theme`，沒有存過就用淺色，不跟隨系統設定。*舊版文件曾寫成「預設深色」，2026-11-05 更正*
- 原版內建雙語架構（英/法），**已在 v1.1 移除**，目前只有繁體中文（`zh`）
- 目前實測 Astro 版本為 7.3.1

### Reef 專案結構重點

> 下面是**原版** Reef 的結構。套用後的差異：`en/`、`fr/` 都已經改成只剩 `zh/`（`src/data/*/zh/`、`src/i18n/ui/zh/`）；`legal`、`rss` 頁面已刪除；`contact.astro` 頁面檔案還在，但已經不在導覽列和頁尾連結裡。

```text
src/
  components/
    ui/           36個基礎元件（button, dialog, tabs等）
    Sections/     24個區塊，依頁面分組（Home/, Post/, Archive/, Search/, Global/, Legal/）
  config/
    siteData.json.ts    網站識別資訊（name, title, description, author）— 必改檔案
    navData.json.ts     導覽選單、頁尾連結結構設定（文字來自i18n字典，此檔只管結構與路徑）
    legalData.json.ts   法律聲明相關資料
  content.config.ts     posts, authors, topics 三個content collection的zod schema定義
  data/                 實際內容
    posts/en/、posts/fr/     文章（Markdown/MDX），同一slug需要中英/法雙語各一份
    authors/en/、authors/fr/  作者資料（JSON檔）
    topics/               主題分類資料
  i18n/                  雙語字典層：config, helpers, en/ 和 fr/ 字典
  layouts/               BaseLayout + BaseHead
  pages/
    [...locale]/         動態路由：index, blog, topics, authors, about, contact, legal
    404, robots, llms, rss
  styles/                tokens.css, global.css, prose.css
  scripts/               rebrand.mjs（改主色系）, og.mjs（重新產生分享卡圖）, app.mjs（Capacitor用）
```

## 使用者的決策與限制（重要，執行時務必遵守）

1. **不能修改 Obsidian vault 內的任何原始檔案**——所有跟 Obsidian 相關的自動化，必須是「唯讀讀取＋於Astro build時記憶體中轉換」，不能是會寫回 `.md` 檔案本體的做法（例如 Obsidian 外掛）
2. **語言**：只用**繁體中文**，不做雙語，需要移除 Reef 的雙語架構（英/法）與語言切換UI
3. **移除以下功能**（因目前用不到）：
   - 多作者系統 → 已改為保留一筆使用者自己的作者資料（見下方進度）
   - ~~Newsletter 訂閱表單~~ → v1.1 移除後，**使用者在 v1.2（2026-11-05）改變決定，已恢復訂閱功能**，外觀完全照原版，但**不含 RSS**（RSS 維持移除）。表單目前仍是示範用，沒有 `action`，還沒接電子報服務
   - Contact 聯絡表單/頁面 → 已從導覽選單和頁尾移除（頁面檔案 `contact.astro` 本身還在，只是沒有任何連結指向它）
   - 首頁「Who writes here」作者介紹區塊 → 已移除（首頁不再引用 `WritersStrip`，元件檔案本身還在）
4. **App封裝能力（Capacitor）**：不用處理，維持原樣忽略即可，不影響網站運作
5. **效率優先**：使用者明確表示不想在前置作業花太多時間，優先採用風險最低、改動最少的方式

## 目前已完成的進度（在 reef-blog 專案內）

> 下面 1 到 6 是最早期的紀錄，當時路徑還是 `en/`；雙語移除後，這些路徑都改成 `zh/` 了（例如作者檔案現在是 `src/data/authors/zh/mara-lindqvist.json`）。

1. ✅ `git clone` Reef 原始碼、`pnpm install`、`pnpm dev` 確認可正常運行，畫面與官方demo (`reef.alohapixel.app`) 一致
2. ✅ 修改 `src/config/navData.json.ts`：
   - `getNavData()`：移除 Contact 連結項目
   - `getFooterData()` 的 Studio 欄：移除 Contact 連結項目
   - `getFooterData()` 的 Read 欄：移除 Authors 連結項目
   - **注意**：`getSiteRoutes()` 裡的 `contact`、`authors` 路徑定義**刻意保留未刪**，因不確定是否被其他元件引用，需要進一步確認後才能安全移除
3. ✅ `src/data/authors/en/mara-lindqvist.json`：內容已換成使用者自己的真實作者資料（保留原檔名，因檔名可能被文章frontmatter當作作者ID引用）
4. ✅ 刪除 `src/data/authors/en/noor-benali.json`、`tomas-abaroa.json`
5. ⚠️ 上一步驟曾導致 build 錯誤：`Auteur inconnu "en/tomas-abaroa"`，因為某篇範本文章的 frontmatter 引用了已刪除的作者。**解法：使用者選擇直接刪除所有範本文章**（而非復原作者檔案），目前已刪除 `src/data/posts/en` 內的範本文章，確認網站恢復正常運作
6. ✅ `fr/` 資料夾已隨雙語移除一併清除（2026-11-05 確認：`src/data/` 和 `src/i18n/ui/` 底下都只剩 `zh/`）

## 任務清單（A 到 G，依原訂順序）

### A. 移除首頁的 Newsletter 和「Who writes here」區塊（✅ 完成）

- [x] `src/pages/[...locale]/index.astro` 已移除兩個區塊的呼叫（2026-11-05 確認）
- [x] `fr/` 範本內容已清除
- **v1.2 後續**：Newsletter 訂閱區塊在 v1.2 已依使用者新的決定恢復，見 `Release_Note.md`。「Who writes here」維持移除

### B. 移除雙語架構（英/法 → 純繁體中文）（✅ 完成，2026-11-05 確認現況）

- [x] 字典只剩 `src/i18n/ui/zh/`，`en/`、`fr/` 已移除
- [x] 導覽列已經沒有語言切換 UI（EN/FR）
- [x] `pnpm check`、`pnpm build` 都正常
- 頁面檔案仍放在 `src/pages/[...locale]/` 底下，`localePaths` 機制也保留，只是語系清單只剩一個，輸出網址是 `/`、`/blog/` 這類不帶語系前綴的路徑

### C. 基本身份設定（✅ 完成，2026-09-24）

- [x] 修改 `src/config/siteData.json.ts`：
  - 網站名稱（`name`）：「Hailey」
  - ~~標題~~：`title` 欄位確認是死資料（全站沒有任何地方讀取它），已整個移除，不需要再填
  - 描述（`description`）：「一個離開日復一日的迴圈後，重新尋找生命意義的地方。閱讀、思考、書寫，記錄我一步步療癒自己、找回生活重量的過程。」
  - 作者姓名（`author.name`）：「Hailey」
  - 作者信箱（`author.email`）：暫留空字串，使用者確認之後會補上，暫不處理程式碼邏輯（footer 的 email 圖示目前會連到空白 `mailto:`，屬已知暫時狀態）
  - 社群連結（`author.twitter`）：暫不處理，架構目前只支援 Twitter/X 一個欄位；使用者之後想接 Instagram 或 Threads，等有帳號再回來調整
- [x] 修改 `astro.config.mjs` 的 `site`：當時設成舊站網址 `https://mythinkingblog.ton-yuan-su.workers.dev`
  - ✅ **2026-11-05 修正**：G 項最後決定新站另外部署，但 `site` 一直沒跟著改，造成 canonical、OG 分享卡、sitemap、robots.txt、llms.txt 全部指向舊站。經使用者確認，實際上線網址是 `https://haileycosmosblog.ton-yuan-su.workers.dev/`，已改正 `site`，並重新產生 OG 分享卡圖片。**以後換網址請照下方「更換網址檢查清單」逐項做**
- [x] `pnpm rebrand`：使用者決定維持預設色系，不執行（這是明確決定，不是待辦）
- [x] 執行 `pnpm og` 重新產生分享卡圖片：
  - `scripts/og.mjs` 裡原本寫死的英文文案（"Reef Notes"、舊網域）已改成「Hailey Cosmos」品牌新文案，`contact` 那組卡片因為 `/contact/` 頁已停用而整組移除
  - 已執行 `pnpm og`，`public/og/{default,blog,topics,about}.png` 都已重新產生；舊的 `public/og/contact.png` 殘留檔案也一併刪除
  - `siteData.defaultImage.alt` 已同步更新為新卡片內容描述

### D. 清除範本內容（確認完整性，2026-09-24 確認狀態）

- [x] Legal/Privacy 頁面：已直接整個刪除頁面（`legal.astro`／`privacy.astro`／`terms.astro`，連同 RSS 一起，見對話記錄），不是保留範本文字，是頁面本身已不存在、不可連結
- [x] `src/data/posts/`、`src/data/authors/`、`src/data/topics/` 範本內容清查：**下面這段是 2026-09-24 的舊狀態，已經過時**。範本文章和範本分類已在 2026-09-29 全部刪除，最新狀態見 F 項。舊紀錄保留如下：
  - `src/data/posts/zh/` 4 篇文章仍是原版英文範本（網頁開發／接案主題，跟部落格定位無關），尚未刪除／替換
  - `src/data/topics/zh/` 目前**共 8 個檔案，新舊並存**：
    - 舊範本 5 個，尚未清除：`craft.json`／`design.json`／`performance.json`／`studio.json`／`typography.json`
    - 真實分類 3 個，E-3 項已建立並確認可用：`reduce-plastic.json`（減塑）／`reading.json`（閱讀）／`personal.json`（個人）
  - `src/data/authors/zh/mara-lindqvist.json`：`name` 已改「Hailey」，但 `role`（英文「Founder and web developer」）與 `bio`（只有「閱讀、生活記錄」四字，未寫完整）都還沒處理
  - **決定**：舊範本 5 個 topic、4 篇範本文章、作者 role/bio，這些改動順序併入「F. 內容遷移」，等實際內容遷移時一次處理，不在 D 階段單獨處理

### E. 搬遷先前已驗證的 Obsidian 自動化功能（Wikilink / Callout / 圖片同步）✅ 全部完成（2026-09-24）

以下三項功能已在舊專案 `my-thinking` 驗證成功，需要「搬」到 Reef 專案，運作原則不變（唯讀、build時於記憶體中轉換，不寫回vault）：

> **日常寫作規範另見 `Obsidian寫作SOP.md`**（2026-09-24 建立）：frontmatter 必填
> 欄位、主題 slug 對照表、wikilink／callout 語法，都記在那份文件，這裡只記錄
> 搬遷過程本身。

1. **Wikilink**：✅ 完成（2026-09-24）
   - 已確認 Astro 7 預設的 Satteri 引擎會忽略 `markdown.remarkPlugins`（已棄用），改用 `processor: unified({ remarkPlugins: [...] })` 包起來，套件為此額外裝了 `@astrojs/markdown-remark`
   - `urlResolver` 路徑在動手前已重新查證 Reef 實際路由（`src/pages/[...locale]/blog/[id].astro`），確認 `/blog/<slug>/` 跟舊專案一致，程式碼照搬未修改
   - 設定寫在 `astro.config.mjs`；`[[slug]]` 與 `![[embed]]` 皆已用測試文章驗證轉換正確，測試內容驗證後已清除
   - `THIRD-PARTY.md` 已補上三個新套件的記錄
   - 套件：`@flowershow/remark-wiki-link`，**務必安裝 3.3.1 版本**（4.0.0版本有Vite無法解析的打包問題）
   ```bash
   # 本專案用 pnpm（舊專案用 npm）；已安裝，見 package.json
   pnpm add @flowershow/remark-wiki-link@3.3.1
   ```
   - 需確認 Reef 使用的 Astro 版本（7.3.1）markdown處理方式，是否同樣需要額外安裝 `@astrojs/markdown-remark` 並改用 `processor: unified({...})` 寫法（舊專案曾因Astro 7的Sätteri引擎更換而需要這個相容套件）
   - urlResolver 設定範例（需依Reef實際文章路徑規則調整 `/blog/` 部分）：
   ```javascript
   urlResolver: ({ filePath, isEmbed }) => {
     if (isEmbed) {
       return `/images/${filePath}`;
     }
     return `/blog/${filePath}/`;
   },
   ```
   - **注意**：urlResolver 收到的是物件 `{ filePath, heading, isEmbed }`，不是字串，需解構取值，否則會得到 `[object Object]` 導致404

2. **Callout**：✅ 完成（2026-09-24）
   - `rehypePlugins: [rehypeCallouts]` 加進同一個 `astro.config.mjs` 的 `processor: unified({...})` 區塊（跟 Wikilink 共用同一個處理器設定，不用另外切換引擎）
   - Reef 沒有 `BlogPost.astro` 這種檔案，文章排版走 `.prose`（`src/styles/prose.css`），佈景主題用 `@import "rehype-callouts/theme/obsidian" layer(components);` 接進去，並包進 `layer(components)`，避免搶贏 Tailwind 工具類的優先權
   - 已用測試文章驗證：`> [!note]` 語法正確產生 `data-callout="note"` 的區塊與圖示，佈景主題 CSS 也確認有編譯進頁面，測試內容驗證後已清除
   - 套件：`rehype-callouts`
   ```bash
   # 本專案用 pnpm；已安裝，見 package.json
   pnpm add rehype-callouts
   ```
   - 需在Reef對應「文章內文排版」的layout檔案（結構可能與舊專案的`BlogPost.astro`不同，需找到Reef實際的文章排版元件）加入樣式主題：
   ```astro
   import 'rehype-callouts/theme/obsidian';
   ```

3. **圖片同步腳本**：✅ 完成（2026-09-24），`scripts/sync-content.mjs`，指令 `pnpm sync-content`
   - 沿用舊腳本 `scripts/sync-content.js` 的核心原則（唯讀 vault、只複製、不寫回不刪除），但**新增了 frontmatter 解析與驗證**，因為 Reef 的 `author`／`topic` 是必填的 reference 欄位，舊腳本整篇文字原封不動複製的做法在 Reef 會直接讓 build 失敗
   - 輸出目的地改成 `src/data/posts/zh/`（Reef 的 content collection 路徑），圖片維持沿用 `public/images/`
   - `author` 自動補上 `zh/mara-lindqvist`（目前唯一作者）；`topic` 要求 vault frontmatter 手動填 bare slug（見 `Obsidian寫作SOP.md` 的對照表），腳本轉換成 `zh/<slug>` 並對照 `src/data/topics/zh/*.json` 動態驗證是否存在
   - **驗證失敗即整篇跳過，不會讓其他文章或整個網站的 build 失敗**：`title`／`description`／`pubDate`／`topic` 任一缺漏，或 `topic` 拼字不在有效清單內，該篇文章就不會被複製，終端機印出warning 說明原因；其餘通過驗證的文章不受影響
   - 這次順手在 `src/data/topics/zh/` 新增了三個真實分類（`reduce-plastic`／`reading`／`personal`，對照表見 `Obsidian寫作SOP.md`），供 vault 筆記引用；舊的 5 個範本分類尚未清除（併入 D／F 項處理）
   - 用暫存的假 vault 目錄測過正向與負向路徑（缺 topic 跳過、有效 topic 正確同步＋補欄位＋複製圖片），沒有寫入使用者真實 vault 的任何內容，測試完的檔案也已清除
   - `package.json` 新增 `"sync-content": "node scripts/sync-content.mjs"`
   - **2026-09-24 延伸：封面圖也改成 vault 端自動化**（原本設計是「同步腳本不處理，手動補」，使用者反饋封面圖是必要功能後重新設計）：vault frontmatter 新增 `cover`（`99_assets` 裡的檔名）／`coverAlt`（選填）兩個欄位，腳本自動複製圖片到 `src/assets/covers/` 並在輸出 frontmatter 產生正確的 `../../../assets/covers/...` 相對路徑；封面圖檔名對照不到就印警告但整篇文章照常同步，不會被跳過。用暫存假 vault 測過三種情況（有效封面圖、完全不填、填了但檔案不存在），並額外用一張真實圖片完整跑過 `pnpm build`，確認 Astro 圖片最佳化流程（`srcset` 響應式尺寸、`alt` 正確帶入）end-to-end 正常，測試檔案已清除
   - **已知限制（已記錄進 `Obsidian寫作SOP.md`）**：封面圖沿用「只複製不刪除」原則，換封面圖時舊圖片檔案不會自動從 `src/assets/covers/` 清掉，會變成孤兒檔案，需要手動清；跟文章刪除的已知缺口是同一類限制

### F. 內容遷移

- [x] vault 早期的 3 篇筆記（`test1`／`hello-world`／`second-post`）：**2026-11-05 結案**，使用者確認都只是測試文章，不再處理
- [x] Topics設定：**2026-09-29 定案並完成**，最終只保留閱讀、個人兩個分類，見 `src/data/topics/zh/{reading,personal}.json`。原本 E-3 項一併建立的「減塑」分類（`reduce-plastic.json`）也已依使用者指示移除，之後有需要再自行新增
- [x] （併入自 D 項）處理 `src/data/posts/zh/` 範本文章：**2026-09-29 完成**，4 篇原始英文範本、加上期間使用者自行測試同步的「新版面測試1」，全部確認是測試性質後一併刪除，之後的文章由 vault 的 `posted` 資料夾同步進來
- [x] （併入自 D 項）處理 `src/data/topics/zh/` 範本主題：**2026-09-29 完成**，5 個舊範本（craft／design／performance／studio／typography）全部刪除，見上面 Topics 設定一條
- [ ] （併入自 D 項，2026-09-24）補完 `src/data/authors/zh/mara-lindqvist.json` 的 `role`／`bio` 欄位內容——**2026-09-29 更新**：使用者已自行把 `role` 改成空字串（確認 schema 允許空字串，不影響 build），`bio`（"閱讀、生活記錄"）目前仍是初版，尚未確認是否為最終版本

### G. 最終部署決策與上線（✅ 完成，2026-09-30）

- [x] 確認 `pnpm build`、`pnpm preview` 本機測試通過
- [x] 決定：**新專案重新接上 GitHub + Cloudflare**（未取代 my-thinking，舊站維持不動、零風險）。評估過程見對話紀錄：兩邊都是純靜態資產部署（無 Worker 腳本），技術上等價，新專案路線因為 repo 已經先設定好、不用動舊站的既有連接，判斷更省事
- [x] 正式部署，實測正式網站效果：**上線網址 `https://haileycosmosblog.ton-yuan-su.workers.dev/`**（使用者 2026-11-05 確認；舊版文件曾寫成 `haileycosmos.ton-yuan-su.workers.dev`，有誤）
  - ✅ **2026-11-05 修正**：使用者截圖確認 Cloudflare 後台只有一個 Worker，名稱是 `haileycosmosblog`，連接的 GitHub repo 是 `JourneySu/HaileyCosmosBlog`。但本機 `wrangler.jsonc` 的 `name` 一直是 `haileycosmos`，兩邊對不上，已改成 `haileycosmosblog`。下方部署坑第 1 點寫的「改用 `haileycosmos` 重新連接」不是最終狀態，實際重建的 Worker 名稱是 `haileycosmosblog`
  - 同一張截圖顯示這個 Worker「已手動部署」、最後修改「1 個月前」，最近沒有因為 push 而自動部署的紀錄。下次 push 後請到後台確認有沒有新的部署；沒有的話，照 Cloudflare 步驟第 7 點檢查 GitHub 授權有沒有中斷

**部署過程中實際踩到的坑（供下次參考，也見下方「已知技術陷阱記錄」第 7 條）：**
1. `wrangler.jsonc` 建立後忘記先 push，就在 Cloudflare 後台建立了「Connect to Git」專案，導致 Cloudflare 依 repo 名稱自動建立了一個名稱對不上本機設定的專案，一度考慮改名配合，最後使用者選擇**直接砍掉重建 Cloudflare 專案**，改用跟本機 `wrangler.jsonc` 一致的 `haileycosmos` 重新連接，問題自然消失
2. Cloudflare Workers Builds 的建置環境會自動幫你安裝 `wrangler` 當 devDependency，連帶需要 `workerd`（Workers 執行環境本體）的原生二進位檔，pnpm 11 預設擋掉這類安裝腳本，導致第一次部署直接失敗（`ERR_PNPM_IGNORED_BUILDS`）。解法是在 `pnpm-workspace.yaml` 的 `allowBuilds` 補上 `workerd: true`，跟原本就有的 `esbuild`／`sharp` 同一套邏輯
3. ⚠️ **2026-11-05 查證更正**：本機的 `pnpm-workspace.yaml` 現在**並沒有** `workerd: true`，`allowBuilds` 只有 `esbuild`、`sharp` 兩項，所以下面「只存在於本機」的描述已不符合現況（可能是之後被復原或沒存檔）。下次部署失敗、看到 `ERR_PNPM_IGNORED_BUILDS` 時，需要重新加上這行。以下是 2026-09-30 的原始紀錄：上面第 2 點的修正目前**只存在於本機，還沒有 commit／push**（2026-09-30 確認）。這次部署剛好在沒有這個修正的版本下也成功了（原因不明，可能是 Cloudflare 建置快取重用了前一次失敗留下的 `workerd` 解析結果）。經跟使用者討論過因果關係（「沒 push wrangler.jsonc」跟「workerd 被擋」是兩個獨立問題，前者只影響命名對應，不影響 workerd 是否需要安裝），確認目前網站運作正常，**使用者決定：目前暫不處理，待後續真的發生部署失敗再回來補這個修正**（`pnpm-workspace.yaml` 本機的 `workerd: true` 那行本身不用復原，純粹是「先不 commit/push」的決定）
4. Git 帳戶授權也曾一度顯示「已中斷連線」，導致 push 後沒有觸發自動重新部署，需要到 Cloudflare 帳號設定重新授權一次 GitHub App 才恢復正常

### H. v1.2 調整（✅ 完成，2026-11-05）

詳細內容見 `Release_Note.md`，摘要如下：

- 恢復訂閱功能，共 4 處：首頁訂閱區塊、導覽列按鈕、手機選單按鈕、頁尾表單。外觀照原版，不含 RSS，表單仍是示範用
- 字典中提到 RSS 的兩句文案已改寫
- 比例對齊 demo：根字級改為固定 16px；大標題字級改成以 demo 現在的數值乘 0.85
- 首頁主標題用字典裡的 `\n` 固定換行；首頁介紹文字字級調小一級

**v1.2 留下的待辦（使用者尚未決定）**

- [x] 訂閱表單串接 Buttondown（2026-11-06）：表單送到自己的 `/api/subscribe`，由 `worker/index.js` 用 API key 呼叫 Buttondown，不離開頁面。Astro 維持純靜態、沒有加 adapter。使用方式、設定位置、出問題時看哪裡，見 `部落格使用手冊.md` 第 7 節
- [ ] Buttondown 實測：重複訂閱、被防火牆擋下時的實際回傳，要看 Cloudflare Observability 的記錄（搜尋 `subscribe:`），確認 `worker/index.js` 的判斷（目前用回傳內容有沒有 `already`／`exist` 判斷「已訂閱」）是否正確
- [ ] Turnstile：這次刻意不做，先用陷阱欄位、IP 頻率限制和 Buttondown 防火牆。之後如果 Buttondown 後台出現大量未確認的陌生信箱，再加上
- [ ] **封面圖沒有進版控**（2026-11-06 發現）：`.gitignore` 排除了 `src/assets/covers/` 和 `src/assets/*.webp`，原本是給主題的範本照片用的（建置時 `scripts/covers.mjs` 會從 Pexels 下載）。但同步腳本也把使用者自己的封面圖放在 `src/assets/covers/`，這些圖不會被 commit。真實文章如果用了自己的封面圖，push 後 Cloudflare 建置會因為找不到圖片而失敗。範本文章沒出事，是因為它們用的剛好是 `covers.mjs` 會下載的範本照片
- [ ] 訂閱文案（「一個月一封信」、「沒有追蹤像素」等）是從原版範本翻過來的，使用者表示這次先不動，之後再看要不要改成符合實際的寄信頻率
- [x] ~~`astro.config.mjs` 的 `site` 和實際上線網址不一致~~：2026-11-05 已修正（見 C 項）
- [x] ~~`wrangler.jsonc` 的 `name` 和實際 Worker 名稱不一致~~：2026-11-05 已改成 `haileycosmosblog`（見 G 項）
- [ ] 下次 push 後，確認 Cloudflare 有自動部署（見 G 項）
- [x] `scripts/sync-content.mjs` 現在會把 Obsidian frontmatter 的 `featured` 帶過去（2026-11-05 完成）：`true` 才寫入，其他無法辨識的值只警告、文章照常同步。用暫存的假 vault 測過 true／false／不填／`yes`／`TRUE` 五種情況，沒有碰真實 vault。規則說明見 `部落格使用手冊.md` 第 5、6 節

**2026-11-05 其他調整（使用者確認後執行）**

- 首頁「關於」區塊（`FilmScene`）先改成固定照片（`_film.ts` 的 `animated()` 固定回傳 false），之後再依使用者指示從首頁隱藏（`index.astro` 裡註解掉）。兩處程式裡都有註解寫明恢復方法
- 首頁精選與最新筆記的挑選規則，已整理進 `部落格使用手冊.md` 第 6 節

## 已刪除的 GitHub Actions 檢查（2026-11-05）

- **檔案**：`.github/workflows/verifier.yml`（Reef 內建的自動檢查，每次 push 會跑 check／build／test／lint:house）
- **刪除原因**：從第一次 push 起每次都失敗，對本站沒有實際作用；部署由 Cloudflare 自己建置把關，建置失敗時網站會停在上一版
- **要找回時**：最後一個包含它的 commit 是 `a138aa1`
- **找回後不能直接用，要先修這兩個問題**：
  1. 有一個步驟呼叫 `scripts/backoffice-manifest.mjs`，但這支腳本已隨後台功能一起刪除，要拿掉這個步驟
  2. `lint:house` 會擋 em dash（`—`），目前 `Reef主題套用_交接文件.md`、`Obsidian寫作SOP.md`、`部落格使用手冊.md`、`scripts/og.mjs` 裡都有，要改掉

## 更換網址檢查清單（買網域、換網址時必做，2026-11-05 建立）

> 起因：G 項部署時換了網址，但 `site` 沒跟著改，canonical、分享卡、sitemap 指向舊站超過一個月（2026-09-30 到 2026-11-05）都沒有發現。**網址一換，請依序做完下面每一項。**

**目前網址**：`https://haileycosmosblog.ton-yuan-su.workers.dev/`

### 一定要改（專案內）

| # | 位置 | 要做什麼 | 沒改會怎樣 |
|---|---|---|---|
| 1 | `astro.config.mjs` 的 `site` | 改成新網址（含 `https://`，結尾不加 `/`） | 這是**全站網址的唯一來源**：canonical、`og:url`、`og:image`、sitemap、`robots.txt`、`llms.txt`、JSON-LD 結構化資料都從這裡讀。沒改的話，搜尋引擎和社群分享都會指向舊網址 |
| 2 | 執行 `pnpm og` | 重新產生 `public/og/*.png` 四張分享卡（`scripts/og.mjs` 會自動從第 1 項的 `site` 讀網址，印在圖片右下角，不用另外改腳本） | **`pnpm build` 不會自動重新產生這些圖片**，而且它們是進版控的檔案，沒跑的話分享卡上會一直印著舊網址 |
| 3 | 驗證 | 跑 `pnpm check`、`pnpm build`，再搜尋 `dist/` 裡有沒有舊網址（PowerShell：`Get-ChildItem dist -Recurse -File -Include *.html,*.xml,*.txt \| Select-String "舊網址關鍵字"`，結果要是 0 筆） | 漏改會直接被搜出來 |
| 4 | commit + push | 要包含 `astro.config.mjs` 和 `public/og/*.png` | 由使用者自己操作 |

### 一定要做（專案外）

| # | 位置 | 要做什麼 |
|---|---|---|
| 5 | Cloudflare 後台 → 這個 Worker → Settings／Triggers → **Add Custom Domain** | 把買來的網域接上去。網域要先由 Cloudflare 代管 DNS（在 Cloudflare 買的就已經是） |
| 6 | 本交接文件 | 更新本節的「目前網址」，以及 G 項的上線網址 |

### 視情況處理

- **原本的 `*.workers.dev` 網址**：接上自訂網域後，舊的 workers.dev 網址預設**仍然可以開啟**。因為第 1 項已經讓 canonical 指向新網域，搜尋引擎會以新網域為準，不改也沒關係；想要只留新網域的話，可以在 Cloudflare 的 Worker 設定裡關閉 workers.dev 路由
- **`wrangler.jsonc` 的 `name`**：這是 Worker 的名稱，**和自訂網域無關**，換網域時不用改。只有要改 workers.dev 子網域名稱時才會動到它，而且要和 Cloudflare 後台的 Worker 名稱一致
- **外部服務**：如果之後有登錄 Google Search Console、社群帳號簡介、名片等，記得一起換成新網址

### 不用改的地方（搜得到網址，但和本站無關）

`package.json` 的 `author`／`homepage`、`README.md`、`DEPLOY.md`、`CHANGELOG.md`，以及 `docs/`、`src/styles/tokens.css`、`scripts/favicon.mjs` 註解裡的 `alohapixel.app`：這些都是原作者主題本身的資訊，不是本站網址。

## 未來優化構想（非本次搬遷範圍，日後可考慮）

- [ ] **文章底部「複製連結」分享功能**（2026-09-29 提出）：原本 `PostFooter.astro` 的「分享」區塊（電子郵件、X 兩個按鈕）已整段移除（見對話紀錄），使用者認為讀者直接用瀏覽器網址列複製分享即可。但字典裡 `src/i18n/ui/zh/reading.ts` 的 `post.copyLink`（"複製連結"）／`post.linkCopied`（"已複製連結"）這兩個翻譯字串**刻意保留未刪**——確認過整個專案目前沒有任何程式碼引用它們，是 Reef 主題原本就預留、但從未真正接上功能的死字串。使用者之後如果想在文章底部（原「分享」按鈕的位置）加回一顆「複製連結」按鈕，這兩個字串已經現成可用，只需要：
  1. 在 `PostFooter.astro` 加回一個按鈕（可放在標籤欄旁邊，恢復先前兩欄並排的版面，或找其他合適位置）
  2. 寫一小段用 `navigator.clipboard.writeText()` 複製目前網址的原生 script（不需要框架，符合 AGENTS.md「平台優先」的排梯規則），點擊後把按鈕文字從 `copyLink` 暫時換成 `linkCopied` 提示成功
  3. 這會是本主題少數幾個帶 `<script>` 的元件之一，記得照 `docs/conventions/motion.md`／`astro.md` 的規範處理 view transitions 重新初始化（`astro:page-load` + `data-*-ready` 防重複綁定）

## 已知技術陷阱記錄（避免重複踩坑）

1. **Astro 7 Sätteri引擎**：預設markdown處理器更換，remark/rehype外掛需搭配 `@astrojs/markdown-remark` 與 `processor: unified({...})` 寫法，不能用舊版平行 `remarkPlugins`/`rehypePlugins` 寫法
2. **套件版本**：`@flowershow/remark-wiki-link` 務必用3.3.1，4.0.0版本有打包問題無法被Vite解析
3. **urlResolver參數是物件**：`{ filePath, heading, isEmbed }`，需解構取用，直接塞進字串模板會得到`[object Object]`
4. **Astro內容快取**：修改設定檔後，若文章內容本身沒變動，可能沿用快取結果。排查順序：先改動文章內容觸發重新處理 → 仍無效則清除 `.astro` 快取資料夾（PowerShell用 `Remove-Item -Recurse -Force .astro`）→ 重新 `npm run dev`/`pnpm dev`
   - **2026-09-29 補充，真正持久化的內容快取在別的地方**：專案根目錄的 `.astro/` 資料夾只是「型別產生快取」，不是內容資料本身。真正記住每篇文章/主題/作者資料的持久化儲存是 `node_modules/.astro/data-store.json`。實測案例：刪除多篇文章跟主題檔案後，即使清空根目錄 `.astro/` 資料夾重跑 `pnpm check`，仍會報錯說「文章引用了已刪除的主題」——這些是資料層快取記住的已刪除舊資料，不是程式碼或設定寫錯。真正解法是額外刪除 `node_modules/.astro/data-store.json`（PowerShell：`Remove-Item -Force node_modules\.astro\data-store.json`）後再重跑，兩個快取都要清乾淨才會真正重新掃描 `src/data/` 底下的實際檔案
   - 另外要提醒：這個資料層快取只有 `pnpm check`／`pnpm build`（一次性指令）會重新讀取。如果 `pnpm dev` 開發伺服器本來就在背景執行，就算清了快取，該伺服器也不會自動重新掃描，必須手動停掉（Ctrl+C）再重開，才會反映最新的檔案異動（同一類「dev server 沒跟上內容變化」的狀況）
5. **Content Collection資料互相依賴**：Reef的posts會引用authors、topics的id，刪除被引用中的資料會導致build報錯（`Auteur inconnu "..."`這類錯誤），修改前建議先確認引用關係，或採用「先清空引用方，再刪除被引用方」的順序
6. **Windows PowerShell語法差異**：不支援CMD語法如 `rmdir /s /q`，需用 `Remove-Item -Recurse -Force`
7. **Cloudflare Workers Builds 也會踩到 pnpm 11 的建置腳本限制**（2026-09-30 發現）：本機開發只需要 `esbuild`、`sharp` 兩個套件的建置腳本授權（見 `pnpm-workspace.yaml`），但**只有在 Cloudflare 的建置環境上**，部署流程會額外自動安裝 `wrangler`（devDependency），連帶引入 `workerd`（Cloudflare Workers 執行環境本體），需要同一份 `allowBuilds` 清單裡補上 `workerd: true`，否則 Cloudflare 那端的部署會報 `ERR_PNPM_IGNORED_BUILDS` 失敗，即使本機 `pnpm build` 完全正常也一樣——這個坑只有實際連上 Cloudflare 部署才會顯現，本機測試看不出來

8. **拿 demo 對照時，demo 不等於本機的原版**（2026-11-05 發現）：原 GitHub repo 已經無法存取，只能用 demo 網站的 HTML 對照，但 demo 在使用者下載之後還有更新。比對時看到本機完全沒有的 class 或元件（例如 `scene-lumiere`、`border-beam`、`Scene.astro`、`user-invalid:`），應該先當作「demo 後來新增的」，不是先前 AI 刪掉的。另外，先前 AI 在 `tokens.css` 註解寫的「已和 demo 對照確認」，對照的是舊版 demo，不能當作和現在的 demo 一致
9. **兩個比例設定會影響全站**（2026-11-05）：`src/styles/global.css` 的 `html { font-size }` 是全站 `rem` 的基準，改了它，導覽列、按鈕、內文、間距都會一起變；`src/styles/tokens.css` 的 `--text-display-*` 決定所有大標題。另外，首頁第一屏面板有最小高度 `min-h-[80svh]`，標題太高時會把面板撐長、吃掉下方的空隙，所以調標題字級時要一起看第一屏
10. **只有靜態資源的 Worker 不能設定變數或機密**（2026-11-06）：Cloudflare 後台會顯示「無法將變數新增到只有靜態資產的 Worker 中」。要先讓 `wrangler.jsonc` 有 `main`（Worker 程式）並部署一次，後台才會開放新增機密。所以設定 `BUTTONDOWN_API_KEY` 的順序是：先 push 含 Worker 的版本，再到後台加機密

## 給接手 Agent 的建議執行順序

A 到 H 項都已完成（F 項還有兩篇筆記等使用者在 Obsidian 補上 frontmatter 後同步，以及作者 `bio` 待確認）。接手時：

1. 先讀 `Release_Note.md` 最新版本，了解最近改了什麼
2. 確認 H 項和 C 項留下的待辦，目前還等使用者決定
3. 使用者習慣一次只做一項：先提出方案，等明確同意後才動手；git 操作一律由使用者自己處理

每完成一個階段，建議執行 `pnpm check`（必須 0/0/0）和 `pnpm build`，確認沒有破壞性錯誤再進行下一階段，避免多個改動疊加後難以排查問題根源。

## Cloudflare 連接 GitHub 步驟（下次開新 blog 時參考，2026-09-30 記錄）

以下是這次實際走過、有成功部署的流程，照順序做即可。

1. **本機先準備好 `wrangler.jsonc`**，放在專案根目錄，內容最簡單的純靜態資產部署寫法：
   ```json
   {
     "name": "你的worker名稱",
     "compatibility_date": "YYYY-MM-DD",
     "assets": { "directory": "./dist" }
   }
   ```
   `name` 決定預設網址 `<name>.你的帳號子網域.workers.dev`，先想好要取什麼名字。
2. **確認 `pnpm-workspace.yaml` 的 `allowBuilds` 已包含 `esbuild`、`sharp`、`workerd` 三個**（見上方「已知技術陷阱記錄」第 7 條），這是 Cloudflare 建置環境專屬的坑，本機測試不會發現。
3. **先 commit + push**，確認 GitHub 上的內容是最新的，再去 Cloudflare 後台建立連接——**順序很重要**：這次就是因為先連接後台、`wrangler.jsonc` 還沒 push 上去，導致 Cloudflare 依 repo 名稱自動建立了一個名稱對不上的專案，多繞一圈才修正。
4. **Cloudflare Dashboard → Workers & Pages → 建立新專案 → Connect to Git**，選擇要連接的 repo。
5. 填建置設定：
   - 組建命令（Build command）：`pnpm run build`
   - 部署命令（Deploy command）：`npx wrangler deploy`
6. 送出後看第一次建置結果。若失敗，先看錯誤訊息裡有沒有 `ERR_PNPM_IGNORED_BUILDS`，有的話回到第 2 步補齊 `allowBuilds` 清單，commit/push 後會自動觸發重新建置。
7. **如果之後 push 了新內容，但 Cloudflare 沒有自動觸發重新部署**：先去 Cloudflare 後台這個專案的頁面最上方，檢查有沒有「已與 Git 帳戶中斷連線」的提示；有的話代表不是 push 沒生效，是 Cloudflare 跟 GitHub 之間的帳號授權斷了，要去 Cloudflare 帳號設定重新授權一次 GitHub App。
8. 部署成功後，記得**確認 `wrangler.jsonc` 的 `name` 是不是真的跟 Cloudflare 後台顯示的專案名稱一致**——如果連接後台時 `wrangler.jsonc` 還沒 push（違反第 3 步的建議順序），Cloudflare 可能會依 repo 名稱自動建立一個不同名稱的專案，造成兩邊對不上。這種情況下最乾淨的解法是把 Cloudflare 那個專案砍掉重建，用已經 push 好、名稱正確的 `wrangler.jsonc` 重新連接一次。
9. 想換掉預設的 `*.workers.dev` 網址，之後可以另外買網域，到 Worker 的 Triggers 分頁「Add Custom Domain」接上去，跟這次部署流程是獨立的步驟，隨時可以做。
