@echo off
REM sync-content.bat - double-click to run "pnpm sync-content" (Obsidian vault -> blog).

REM UTF-8 console, so the Chinese messages of the script display correctly.
chcp 65001 > nul

REM Always run from the folder of this file, wherever it was launched from.
cd /d "%~dp0"

call pnpm sync-content

echo.
pause
