@echo off
chcp 65001 > nul
echo ================================================
echo   Mandala Chart v2.0.9 - GitHub 公開スクリプト
echo ================================================
echo.

set REPO_URL=https://github.com/gurio318/obsidian-mandala-chart.git
set PLUGIN_DIR=%~dp0mandala-chart

echo プラグインフォルダ: %PLUGIN_DIR%
echo.

cd /d "%PLUGIN_DIR%"

:: すでに .git があれば削除して再初期化
if exist ".git" (
  echo 既存の .git フォルダを削除中...
  rmdir /s /q .git
)

echo Git リポジトリを初期化中...
git init
git checkout -b main

echo ファイルを追加中...
git add .

echo コミット中...
git commit -m "Release v2.0.9"

echo リモートを設定中...
git remote add origin %REPO_URL%

echo GitHub にプッシュ中...
echo (ブラウザで認証ダイアログが表示される場合があります)
git push -u origin main

echo.
if %ERRORLEVEL% == 0 (
  echo ✓ プッシュ成功！
  echo.
  echo 次のステップ: GitHub でリリースを作成してください
  echo https://github.com/gurio318/obsidian-mandala-chart/releases/new
  echo.
  echo タグ: 2.0.9
  echo タイトル: v2.0.9
  echo アセット: main.js / manifest.json / styles.css をアップロード
) else (
  echo × プッシュに失敗しました。
  echo Git 認証情報を確認してください。
)

echo.
pause
