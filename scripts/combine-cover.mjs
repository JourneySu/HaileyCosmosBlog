// scripts/combine-cover.mjs - 把 _素材/ 的背景圖與書封合成為文章封面，只新增到 vault 的 99_assets，絕不覆蓋。
//
// 用法：pnpm combine-cover <名稱>
// 例如：pnpm combine-cover elephant-and-rider
//
// 會去 _素材/ 找 Background-<名稱>.* 與 bookCover-<名稱>.* 兩張圖，合成後
// 輸出到 99_assets/<名稱>.webp。之後由 pnpm sync-content 照一般封面流程，
// 從 99_assets 複製進 src/assets/covers/。
//
// 對 vault 的權限只有一種：在 99_assets 新增「一個」原本不存在的檔案。
// 不建立資料夾、不覆蓋、不刪除、不讀寫 99_assets 以外的任何位置。這幾條
// 寫死在程式裡，不靠使用者或 AI 記得遵守。

import { readdirSync, existsSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// === 設定區：依實際路徑調整 ===
// 跟 scripts/sync-content.mjs 的 VAULT_ASSETS_DIR 是同一個資料夾。
const VAULT_ASSETS_DIR = "D:\\File\\Books\\99_assets";
// 素材資料夾在專案根目錄，已列入 .gitignore。用腳本自己的位置推算，
// 不管從哪個資料夾執行都找得到。
const SOURCE_DIR = fileURLToPath(new URL("../_素材/", import.meta.url));

// === 合成參數 ===
// 3:2 橫式，寬度大於文章頁最大會用到的 1440（PostHero 的 widths）。
const WIDTH = 1600;
const HEIGHT = 1067;
// 書封高度占畫面 75%，上下各留約 12%：列表卡裁成 16:9 時，上下會各切掉約 8%。
const BOOK_HEIGHT_RATIO = 0.75;
// 書封中心放在畫面寬度 70% 的位置，也就是中間偏右。
const BOOK_CENTER_X_RATIO = 0.7;
// 陰影往右下偏移的距離、模糊程度、不透明度。
const SHADOW = { dx: 14, dy: 20, blur: 18, opacity: 0.45 };
const WEBP_QUALITY = 82;

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

// 出錯就印出原因並結束，什麼都不寫。
function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

// --- 1. 檢查參數 -------------------------------------------------------------
// 名稱只允許英數字、- 和 _：擋掉 ../ 這類路徑，確保輸出只會落在 99_assets 裡。
const name = process.argv[2];
if (!name) fail("請提供名稱，例如：pnpm combine-cover elephant-and-rider");
if (!/^[A-Za-z0-9_-]+$/.test(name)) {
  fail(`名稱「${name}」只能包含英文字母、數字、- 和 _（不要加副檔名）`);
}

// --- 2. 找素材 ---------------------------------------------------------------
if (!existsSync(SOURCE_DIR)) fail(`找不到素材資料夾：${SOURCE_DIR}`);
const sourceFiles = readdirSync(SOURCE_DIR);

// 找「<前綴>-<名稱>.<允許的副檔名>」，副檔名不分大小寫。
// 找不到或找到兩張以上都報錯：寧可停下來，也不要猜該用哪一張。
function findSource(prefix) {
  const base = `${prefix}-${name}`;
  const matches = sourceFiles.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext) && path.basename(file, path.extname(file)) === base;
  });
  if (matches.length === 0) {
    fail(`在 _素材/ 找不到「${base}」（可接受的副檔名：${ALLOWED_EXTENSIONS.join("、")}）`);
  }
  if (matches.length > 1) {
    fail(`在 _素材/ 找到不只一張「${base}」：${matches.join("、")}，請只留一張`);
  }
  return path.join(SOURCE_DIR, matches[0]);
}

const backgroundPath = findSource("Background");
const bookPath = findSource("bookCover");

// --- 3. 檢查輸出位置 -----------------------------------------------------------
// 99_assets 必須已經存在：這支程式不在 vault 裡建立資料夾。
if (!existsSync(VAULT_ASSETS_DIR) || !statSync(VAULT_ASSETS_DIR).isDirectory()) {
  fail(`找不到 vault 的 99_assets 資料夾：${VAULT_ASSETS_DIR}`);
}
const outputPath = path.join(VAULT_ASSETS_DIR, `${name}.webp`);
if (existsSync(outputPath)) {
  fail(`99_assets 裡已經有「${name}.webp」，這支程式不覆蓋檔案。要重做請先手動刪除：${outputPath}`);
}

// --- 4. 合成 -----------------------------------------------------------------
// 先在記憶體裡完成整張圖，最後才寫檔：中途出錯時 vault 裡不會留下半成品。
const bookMeta = await sharp(bookPath).metadata();
const bookHeight = Math.round(HEIGHT * BOOK_HEIGHT_RATIO);
const bookWidth = Math.round((bookHeight * bookMeta.width) / bookMeta.height);
const left = Math.round(WIDTH * BOOK_CENTER_X_RATIO - bookWidth / 2);
const top = Math.round((HEIGHT - bookHeight) / 2);

if (left < 0 || left + bookWidth > WIDTH) {
  fail(`書封比例太寬（${bookMeta.width} x ${bookMeta.height}），放在中間偏右會超出畫面，請改用直式書封`);
}

// 背景等比縮放並置中裁切成 3:2，原圖不是 3:2 也不會變形。
const background = await sharp(backgroundPath)
  .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
  .toBuffer();
const book = await sharp(bookPath).resize(bookWidth, bookHeight).toBuffer();

// 陰影用一張全畫面的 SVG 畫：一個跟書封同尺寸的黑色矩形，往右下偏移後模糊。
const shadow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${SHADOW.blur}" />
    </filter>
  </defs>
  <rect x="${left + SHADOW.dx}" y="${top + SHADOW.dy}" width="${bookWidth}" height="${bookHeight}"
    fill="black" fill-opacity="${SHADOW.opacity}" filter="url(#blur)" />
</svg>`);

const output = await sharp(background)
  .composite([
    { input: shadow, left: 0, top: 0 },
    { input: book, left, top },
  ])
  .webp({ quality: WEBP_QUALITY })
  .toBuffer();

// --- 5. 寫入 vault -----------------------------------------------------------
// flag "wx"：檔案已存在就直接失敗。上面已經檢查過一次，這裡是第二道保護，
// 就算檢查完到寫入之間剛好有人放了同名檔案，也絕不會覆蓋。
try {
  writeFileSync(outputPath, output, { flag: "wx" });
} catch (error) {
  if (error.code === "EEXIST") fail(`99_assets 裡已經有「${name}.webp」，沒有覆蓋：${outputPath}`);
  throw error;
}

console.log(`🖼️  背景：${path.basename(backgroundPath)}`);
console.log(`📕 書封：${path.basename(bookPath)}（縮放為 ${bookWidth} x ${bookHeight}，位置 ${left}, ${top}）`);
console.log(`✅ 已輸出 ${WIDTH} x ${HEIGHT}，${Math.round(output.length / 1024)} KB`);
// 最後一行固定只印成品路徑，讓 /combine-cover 指令直接拿來開圖。
console.log(outputPath);
