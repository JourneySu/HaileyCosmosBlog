# Reef 主題套用作業 — AI Agent 交接文件

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
| Vault 發布用文章資料夾 | `D:\File\Books\21_Public創作` |
| Vault 附件（圖片）資料夾 | `D:\File\Books\99_assets` |
| 新主題測試專案路徑 | `D:\File\reef-blog`（獨立資料夾，與 my-thinking、vault 皆分開） |
| 新主題套件管理工具 | pnpm（非 npm，語法：`pnpm install`、`pnpm dev`、`pnpm build`） |

## 新主題資訊：Reef

- 來源：`https://github.com/alohapixelcom-hash/reef`
- 技術棧：Astro 7 + Tailwind CSS 4，幾乎不用JavaScript（原生 `<dialog>`/`<details>` 元素）
- **授權注意**：官方 GitHub repo 授權為「Commercial license」（非MIT），限制是不能將 Reef 主題本身重新包裝轉售，但可用它做無限個人商業產品
- 預設深色模式（dark by default），非淺色
- 內建雙語架構（英/法），**不會自動翻譯**，需手動維護兩份內容，且無「單語言模式」設定開關（需改程式碼）
- 目前實測 Astro 版本為 7.3.1

### Reef 專案結構重點

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
   - Newsletter 訂閱表單 → 尚未處理
   - Contact 聯絡表單/頁面 → 已從導覽選單移除（見下方進度）
   - 首頁「Who writes here」作者介紹區塊 → 尚未處理
4. **App封裝能力（Capacitor）**：不用處理，維持原樣忽略即可，不影響網站運作
5. **效率優先**：使用者明確表示不想在前置作業花太多時間，優先採用風險最低、改動最少的方式

## 目前已完成的進度（在 reef-blog 專案內）

1. ✅ `git clone` Reef 原始碼、`pnpm install`、`pnpm dev` 確認可正常運行，畫面與官方demo (`reef.alohapixel.app`) 一致
2. ✅ 修改 `src/config/navData.json.ts`：
   - `getNavData()`：移除 Contact 連結項目
   - `getFooterData()` 的 Studio 欄：移除 Contact 連結項目
   - `getFooterData()` 的 Read 欄：移除 Authors 連結項目
   - **注意**：`getSiteRoutes()` 裡的 `contact`、`authors` 路徑定義**刻意保留未刪**，因不確定是否被其他元件引用，需要進一步確認後才能安全移除
3. ✅ `src/data/authors/en/mara-lindqvist.json`：內容已換成使用者自己的真實作者資料（保留原檔名，因檔名可能被文章frontmatter當作作者ID引用）
4. ✅ 刪除 `src/data/authors/en/noor-benali.json`、`tomas-abaroa.json`
5. ⚠️ 上一步驟曾導致 build 錯誤：`Auteur inconnu "en/tomas-abaroa"`，因為某篇範本文章的 frontmatter 引用了已刪除的作者。**解法：使用者選擇直接刪除所有範本文章**（而非復原作者檔案），目前已刪除 `src/data/posts/en` 內的範本文章，確認網站恢復正常運作
6. ⏳ `src/data/authors/fr/` 資料夾**尚未同步處理**（對應的示範作者檔案可能還在），評估是否等移除雙語架構時一併處理

## 尚待執行的任務（依原訂待辦順序）

### A. 立即待處理（本次對話中斷前的最後任務）

- [ ] 打開 `src/pages/[...locale]/index.astro`，找出並移除以下兩個區塊的呼叫：
  - Newsletter 訂閱表單區塊
  - 「Who writes here」作者介紹區塊
- [ ] 確認 `src/data/posts/fr/`、`src/data/authors/fr/` 是否也需要同步清除範本內容（視是否已先處理雙語移除而定）

### B. 移除雙語架構（英/法 → 純繁體中文）

- [ ] 檢視 `src/i18n/` 資料夾的 config、helpers、en/、fr/ 字典結構
- [ ] 決定最小改動方式：可能是將 `en` 字典內容直接改寫為繁體中文，移除 `fr` 相關路由與資料夾，並移除 `[...locale]` 動態路由邏輯改為固定單一語系
- [ ] 移除 Header 內的語言切換UI（EN/FR按鈕）
- [ ] 測試 `pnpm build` 確認沒有因缺少字典欄位而失敗（字典是型別化的，缺欄位會直接讓build失敗，此為架構特性非bug）

### C. 基本身份設定（✅ 完成，2026-09-24）

- [x] 修改 `src/config/siteData.json.ts`：
  - 網站名稱（`name`）：「Hailey」
  - ~~標題~~：`title` 欄位確認是死資料（全站沒有任何地方讀取它），已整個移除，不需要再填
  - 描述（`description`）：「一個離開日復一日的迴圈後，重新尋找生命意義的地方。閱讀、思考、書寫，記錄我一步步療癒自己、找回生活重量的過程。」
  - 作者姓名（`author.name`）：「Hailey」
  - 作者信箱（`author.email`）：暫留空字串，使用者確認之後會補上，暫不處理程式碼邏輯（footer 的 email 圖示目前會連到空白 `mailto:`，屬已知暫時狀態）
  - 社群連結（`author.twitter`）：暫不處理，架構目前只支援 Twitter/X 一個欄位；使用者之後想接 Instagram 或 Threads，等有帳號再回來調整
- [x] 修改 `astro.config.mjs`：`site` 改為正式網址 `https://mythinkingblog.ton-yuan-su.workers.dev`（沿用舊站網域）
- [x] `pnpm rebrand`：使用者決定維持預設色系，不執行（這是明確決定，不是待辦）
- [x] 執行 `pnpm og` 重新產生分享卡圖片：
  - `scripts/og.mjs` 裡原本寫死的英文文案（"Reef Notes"、舊網域）已改成「Hailey Cosmos」品牌新文案，`contact` 那組卡片因為 `/contact/` 頁已停用而整組移除
  - 已執行 `pnpm og`，`public/og/{default,blog,topics,about}.png` 都已重新產生；舊的 `public/og/contact.png` 殘留檔案也一併刪除
  - `siteData.defaultImage.alt` 已同步更新為新卡片內容描述

### D. 清除範本內容（確認完整性，2026-09-24 確認狀態）

- [x] Legal/Privacy 頁面：已直接整個刪除頁面（`legal.astro`／`privacy.astro`／`terms.astro`，連同 RSS 一起，見對話記錄），不是保留範本文字，是頁面本身已不存在、不可連結
- [ ] `src/data/posts/`、`src/data/authors/`、`src/data/topics/` 範本內容清查結果，**最新狀態（2026-09-24，E 項完成後）**：
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
   npm install @flowershow/remark-wiki-link@3.3.1
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
   npm install rehype-callouts
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

- [ ] vault 裡 `21_Public創作` 目前 3 篇筆記的處理狀態（2026-09-24 確認，尚未執行）：
  - `test1.md`：測試殘留檔，**不處理**，不會同步
  - `hello-world.md`：**要正式同步**，分類定案為 `topic: personal`，需使用者在 Obsidian 裡手動加上這行 frontmatter，再跑 `pnpm sync-content`
  - `second-post.md`：**要正式同步**（內文的 Lorem Ipsum 是刻意用來測排版，非殘留檔），分類定案為 `topic: personal`，同樣需使用者手動在 Obsidian 加上 frontmatter 後執行同步
- [x] Topics設定：**2026-09-29 定案並完成**，最終只保留閱讀、個人兩個分類，見 `src/data/topics/zh/{reading,personal}.json`。原本 E-3 項一併建立的「減塑」分類（`reduce-plastic.json`）也已依使用者指示移除，之後有需要再自行新增
- [x] （併入自 D 項）處理 `src/data/posts/zh/` 範本文章：**2026-09-29 完成**，4 篇原始英文範本、加上期間使用者自行測試同步的「新版面測試1」，全部確認是測試性質後一併刪除，`src/data/posts/zh/` 目前是空資料夾，等 F 項第一條的 `hello-world`／`second-post` 正式同步後才會有內容
- [x] （併入自 D 項）處理 `src/data/topics/zh/` 範本主題：**2026-09-29 完成**，5 個舊範本（craft／design／performance／studio／typography）全部刪除，見上面 Topics 設定一條
- [ ] （併入自 D 項，2026-09-24）補完 `src/data/authors/zh/mara-lindqvist.json` 的 `role`／`bio` 欄位內容——**2026-09-29 更新**：使用者已自行把 `role` 改成空字串（確認 schema 允許空字串，不影響 build），`bio`（"閱讀、生活記錄"）目前仍是初版，尚未確認是否為最終版本

### G. 最終部署決策與上線

- [ ] 確認 `pnpm build`、`pnpm preview` 本機測試通過
- [ ] 決定：直接取代 my-thinking 現有內容，或視為新專案重新接上 GitHub + Cloudflare
- [ ] 正式部署，實測正式網站效果

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

## 給接手 Agent 的建議執行順序

1. 先完成本次中斷前的立即任務（A項：移除Newsletter與Who writes here區塊）
2. 處理雙語架構移除（B項，技術複雜度最高，建議獨立測試確認build成功後再繼續）
3. 依序完成C、D項基本設定與清理
4. 搬遷Obsidian自動化功能（E項）——**建議在搬遷前，先實際查看Reef的 `content.config.ts` 完整內容，確認posts的zod schema必填欄位，才能正確設計frontmatter格式與同步腳本**
5. 內容遷移與最終部署（F、G項）

每完成一個階段，建議執行 `pnpm build` 確認沒有破壞性錯誤，再進行下一階段，避免多個改動疊加後難以排查問題根源。
