# 監視器誤差時間轉換器（PWA）— GitHub Pages 部署教學

## 一、建立儲存庫
1. 登入 GitHub，新增一個 Repository，例如 `cctv-time-diff-pwa`。（Public）
2. 將本資料夾全部檔案上傳到該 repo 的根目錄（包含 `index.html`、`sw.js`、`manifest.webmanifest`、`icons/`、`.nojekyll` 等）。

## 二、啟用 GitHub Pages
1. 進入 `Settings → Pages`。
2. 在 **Source** 選擇 `Deploy from a branch`。
3. Branch 選 `main`、資料夾選 `/ (root)`，按 **Save**。
4. 等待數十秒至數分鐘，會出現一個 `https://<username>.github.io/<repo>/` 的網址。

> 本專案使用相對路徑（例如 `./sw.js`、`./manifest.webmanifest`），可直接在 Project Pages（`/<repo>/`）底下運作，無需額外調整。

## 三、手機安裝（PWA）
- **iOS（Safari）**：打開上述網址 → 分享 → 加入主畫面。
- **Android（Chrome）**：打開網址 → 右上角三點 → 安裝應用程式 / 加到主畫面。

## 四、常見問題
- **首次載入需要網路**：用於註冊 Service Worker 與快取資源，之後可離線使用。
- **路徑問題**：若你改動檔名或層級，請同步更新 `index.html` 中 `<link rel="manifest">` 與 `sw.js` 註冊路徑。
- **Jekyll 影響**：已附 `.nojekyll`，避免 Pages 預設處理干擾。
