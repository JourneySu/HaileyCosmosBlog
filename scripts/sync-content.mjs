// scripts/sync-content.mjs - 同步 Obsidian vault 的文章到 haileyCosmosBlog 專案，唯讀 vault，只複製不刪除不寫回。
//
// 運作原則：
// 只讀取 vault，絕不修改、絕不刪除 vault 裡的任何檔案。所有欄位轉換（補
// author、轉換 topic 前綴、驗證）都只發生在寫進 haileyCosmosBlog 專案的那一份輸出檔案上。
//
// 跟舊腳本不同的地方：haileyCosmosBlog 的 content.config.ts 要求每篇文章必填 author 跟
// topic（用 reference() 驗證，build 時會實際檢查該筆記是否存在），vault 裡的
// 筆記目前完全沒有這兩個欄位，所以這裡多了一層 frontmatter 解析跟驗證，而不
// 是像舊腳本一樣整篇文字原封不動複製。
//
// 用法：pnpm sync-content

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import path from "node:path";

// === 設定區：依實際路徑調整 ===
const VAULT_POSTS_DIR = "D:\\File\\Books\\11_haileyCosmos\\posted";
const VAULT_ASSETS_DIR = "D:\\File\\Books\\99_assets";
const DEST_POSTS_DIR = path.resolve("./src/data/posts/zh");
const DEST_TOPICS_DIR = path.resolve("./src/data/topics/zh");
const DEST_IMAGES_DIR = path.resolve("./public/images");
// 封面圖跟內文嵌入圖片共用同一個 vault 資料夾（VAULT_ASSETS_DIR），但目的地
// 不同：封面圖要走 Astro 的圖片最佳化流程，複製到 src/assets/covers/，不是
// public/images/。
const DEST_COVERS_DIR = path.resolve("./src/assets/covers");

// 目前站上只有一位作者，vault 筆記不用寫這個欄位，這裡直接補上。
const FIXED_AUTHOR = "zh/mara-lindqvist";

// --- 讀取目前有效的 topic slug 清單 -----------------------------------------
// 動態讀 src/data/topics/zh/*.json 的檔名，而不是寫死一份清單：以後在那個
// 資料夾新增一個 topic 檔案，這支腳本自動就認得，不用回來改程式碼。
function getValidTopicSlugs() {
  return readdirSync(DEST_TOPICS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

// --- 極簡 frontmatter 解析 ---------------------------------------------------
// 不引入 YAML 套件：vault 筆記的 frontmatter 只有扁平的 key: value，用不到巢狀
// 結構，手寫解析比多裝一個相依套件划算。只處理這支腳本讀寫得到的欄位。
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const [, frontmatterBlock, body] = match;

  const data = {};
  for (const line of frontmatterBlock.split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    // 去掉頭尾的單引號或雙引號，不處理跳脫字元：vault 筆記目前沒用到。
    const value = rawValue.trim().replace(/^['"](.*)['"]$/, "$1");
    data[key] = value;
  }
  return { data, body };
}

// 把值包成雙引號的 YAML 字串，並跳脫內部的雙引號。
function yamlString(value) {
  return `"${value.replace(/"/g, '\\"')}"`;
}

function buildFrontmatter({ title, description, pubDate, topicSlug, coverFile, coverAlt, featured }) {
  const lines = [
    "---",
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `pubDate: ${pubDate}`,
    `author: ${FIXED_AUTHOR}`,
    `topic: zh/${topicSlug}`,
  ];
  // cover 是選填的，只有在來源圖片真的存在、已經複製過去之後才寫這行，
  // 絕不寫一個指向不存在檔案的路徑。
  if (coverFile) {
    lines.push(`cover: ../../../assets/covers/${coverFile}`);
    if (coverAlt) lines.push(`coverAlt: ${yamlString(coverAlt)}`);
  }
  // featured 只在 true 時才寫：網站 schema 的預設值就是 false，省略等於 false。
  if (featured) lines.push("featured: true");
  lines.push("---");
  return lines.join("\n");
}

// --- 主流程 -------------------------------------------------------------
mkdirSync(DEST_POSTS_DIR, { recursive: true });
mkdirSync(DEST_IMAGES_DIR, { recursive: true });
mkdirSync(DEST_COVERS_DIR, { recursive: true });

const validTopics = getValidTopicSlugs();
const mdFiles = readdirSync(VAULT_POSTS_DIR).filter((f) => f.endsWith(".md"));
console.log(`在 vault 找到 ${mdFiles.length} 篇筆記：`, mdFiles);

const referencedImages = new Set();
let synced = 0;
let skipped = 0;

for (const file of mdFiles) {
  const srcPath = path.join(VAULT_POSTS_DIR, file);
  // 唯讀：只 readFileSync，這支腳本從頭到尾不會對 vault 裡的任何檔案呼叫
  // writeFileSync 或 unlinkSync。
  const raw = readFileSync(srcPath, "utf-8");

  const parsed = parseFrontmatter(raw);
  if (!parsed) {
    console.warn(`⚠️  跳過「${file}」：找不到 frontmatter 區塊（缺少開頭跟結尾的 ---）`);
    skipped++;
    continue;
  }

  const { data, body } = parsed;
  const missing = ["title", "description", "pubDate", "topic"].filter((key) => !data[key]);
  if (missing.length > 0) {
    console.warn(`⚠️  跳過「${file}」：缺少必填欄位 ${missing.join("、")}`);
    skipped++;
    continue;
  }

  if (!validTopics.includes(data.topic)) {
    console.warn(
      `⚠️  跳過「${file}」：topic "${data.topic}" 不是有效分類（目前可用：${validTopics.join("、")}）`,
    );
    skipped++;
    continue;
  }

  // 封面圖是選填的：cover 欄位存在才處理，找不到來源檔案只警告，不會讓這篇
  // 文章被跳過（沒有封面圖本來就是主題支援的正常狀態）。
  let coverFile;
  if (data.cover) {
    const srcCoverPath = path.join(VAULT_ASSETS_DIR, data.cover);
    if (existsSync(srcCoverPath)) {
      copyFileSync(srcCoverPath, path.join(DEST_COVERS_DIR, data.cover));
      coverFile = data.cover;
      console.log(`🖼️  已複製封面圖：${data.cover}（來自「${file}」）`);
    } else {
      console.warn(
        `⚠️  「${file}」指定的封面圖「${data.cover}」在 99_assets 裡找不到，這篇文章會照常同步，只是沒有封面圖`,
      );
    }
  }

  // featured 是選填的：決定這篇是否放首頁「本月精選」（規則見部落格使用手冊第 6 節）。
  // Obsidian 的勾選框屬性存成 true／false；其他寫法只警告，文章照常同步，視為 false。
  let featured = false;
  if (data.featured !== undefined && data.featured !== "") {
    const flag = data.featured.toLowerCase();
    if (flag === "true") featured = true;
    else if (flag !== "false") {
      console.warn(`⚠️  「${file}」的 featured 值「${data.featured}」無法辨識，只接受 true 或 false，這篇先當作 false 同步`);
    }
  }

  const frontmatter = buildFrontmatter({
    title: data.title,
    description: data.description,
    pubDate: data.pubDate,
    topicSlug: data.topic,
    coverFile,
    coverAlt: data.coverAlt,
    featured,
  });
  writeFileSync(path.join(DEST_POSTS_DIR, file), `${frontmatter}\n\n${body}`, "utf-8");
  console.log(`✅ 已同步文章：${file}（topic: zh/${data.topic}${featured ? "，featured" : ""}）`);
  synced++;

  // 掃描這篇「通過驗證、真的會被同步」的文章裡引用到的圖片。
  for (const match of body.matchAll(/!\[\[([^\]|]+)(\|[^\]]+)?\]\]/g)) {
    referencedImages.add(match[1].trim());
  }
}

console.log(`\n找到 ${referencedImages.size} 個被引用的圖片：`, [...referencedImages]);

for (const imageName of referencedImages) {
  const srcImagePath = path.join(VAULT_ASSETS_DIR, imageName);
  const destImagePath = path.join(DEST_IMAGES_DIR, imageName);

  if (existsSync(srcImagePath)) {
    copyFileSync(srcImagePath, destImagePath);
    console.log(`🖼️  已複製圖片：${imageName}`);
  } else {
    console.warn(`⚠️  警告：找不到圖片「${imageName}」，請確認檔名是否正確（存在於 99_assets 嗎？）`);
  }
}

console.log(`\n同步完成！${synced} 篇文章已同步，${skipped} 篇被跳過。`);
