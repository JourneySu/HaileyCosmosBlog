---
description: 合成文章封面（背景 + 書封）到 vault 的 99_assets，確認後同步文章
argument-hint: <名稱，例如 elephant-and-rider>
---

<!-- .claude/commands/combine-cover.md - /combine-cover 指令：合成封面、開圖確認、同步文章。 -->

為名稱「$ARGUMENTS」合成文章封面。依序執行下面四步，任何一步失敗就停下來，把原因告訴使用者，不要自己想辦法繞過。

## 絕對規則

- 對 Obsidian vault（`D:\File\Books\`）唯一允許的寫入，是第 1 步的腳本在 `99_assets` 新增成品。除此之外，不可用任何方式新增、修改、移動或刪除 vault 裡的檔案，包括合成失敗或使用者取消的時候。
- 不可自行修改 `scripts/combine-cover.mjs` 的參數或檢查條件來讓它通過。
- 不執行任何 git 指令。

## 1. 合成

如果「$ARGUMENTS」是空的，請使用者提供名稱，然後停止。

執行：

```
pnpm combine-cover $ARGUMENTS
```

腳本失敗（找不到素材、素材重複、99_assets 已有同名成品、名稱格式不對）時，把錯誤訊息轉告使用者並停止。不要執行同步。

成功時，輸出的最後一行是成品的完整路徑。

## 2. 開圖給使用者看，並自己檢查

1. 用 PowerShell 開啟成品，讓使用者在看圖程式裡看到：`Start-Process "<成品路徑>"`
2. 用 Read 讀取成品，自己檢查：
   - 書封是否完整，沒有被裁切或變形
   - 書封有沒有擋住背景的主體（人物、動物、主要景物）
   - 背景裡有沒有奇怪的文字、標誌、浮水印或明顯的 AI 生成瑕疵
3. 用一兩句話告訴使用者檢查結果，有問題就具體指出在哪裡。

## 3. 等使用者確認

用 AskUserQuestion 問使用者，兩個選項：

- **確認，執行同步**
- **取消**

選擇取消時：不要刪除成品。告訴使用者成品的完整路徑，說明如果要重做，請手動刪除這個檔案，調整 `_素材/` 的圖之後再執行一次 `/combine-cover $ARGUMENTS`。然後停止。

## 4. 同步

使用者確認後執行：

```
pnpm sync-content
```

不要執行 `sync-content.bat`，它最後的 `pause` 會卡住。

同步完成後，從輸出裡確認有出現「已複製封面圖：$ARGUMENTS.webp」。如果出現的是「在 99_assets 裡找不到」的警告，代表 vault 筆記的 `cover` 欄位跟名稱對不上，請使用者檢查筆記的 `cover` 是否寫成 `$ARGUMENTS.webp`。最後回報同步了幾篇、跳過幾篇，以及任何警告。
