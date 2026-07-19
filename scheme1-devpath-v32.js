(() => {
  'use strict';

  const appendixMarkup = `
    <section class="tech-appendix dev-path-v32" aria-labelledby="scheme1DevPathTitle">
      <header class="dev-path-v32__head">
        <span class="dev-path-v32__kicker">SCHEME 01 · DEVELOPMENT PATH</span>
        <h4 id="scheme1DevPathTitle">方案一 · 開發路徑</h4>
        <p class="appendix-lead">從第一個指令能跑起來，到完整稽核閉環——分六道關卡驗證。<br>每一關只證明一件事，通過之前不進行下一關。</p>
      </header>

      <div class="dev-path-v32__principle">
        <span>共同核心的語言邊界</span>
        <strong>施工架共同核心以 C# Class Library 實作。</strong>
        <p>Python／Colab 用於方案二的離線分析、規則探索與統計驗證，不進入方案一的正式執行路徑。</p>
      </div>

      <div class="dev-step dev-step--version">
        <div class="step-header">
          <span class="step-number">STEP 00</span>
          <div><span class="step-stage">建置範圍</span><h5 class="step-title">確認需要支援哪些 AutoCAD 版本</h5></div>
        </div>
        <div class="step-main">
          <p class="step-body">這個問題決定 Solution 的 build 結構。客戶只使用單一版本家族時，可以先建立一個 Host；公司內部同時使用 2021–2024 與 2025–2026 時，則建立 net48 與 net8 兩個建置目標，放進同一個 <code>.bundle</code>。AutoCAD 啟動時自動選擇，使用者不需要手動切換。</p>
          <p class="step-pass"><strong>通過標準</strong><span>所有宣告支援的 AutoCAD 版本都能載入正確 DLL，並正常執行 <code>SCAFFOLD_AUDIT</code>。</span></p>
        </div>
        <details>
          <summary><span>展開查看</span><strong>AutoCAD 版本、.NET 執行環境與 bundle 結構</strong><b>＋</b></summary>
          <div class="step-detail">
            <div class="version-pair">
              <div><span>AutoCAD 2021–2024</span><strong>.NET Framework 4.8</strong></div>
              <div><span>AutoCAD 2025–2026</span><strong>.NET 8</strong></div>
            </div>
            <pre>ScaffoldAudit.bundle/
├── PackageContents.xml
└── Contents/
    ├── net48/
    │   ├── Scaffold.AutoCAD.dll
    │   ├── Scaffold.Core.dll
    │   └── Scaffold.Domain.dll
    └── net8/
        ├── Scaffold.AutoCAD.dll
        ├── Scaffold.Core.dll
        └── Scaffold.Domain.dll</pre>
            <p><code>PackageContents.xml</code> 使用 <code>SeriesMin</code>／<code>SeriesMax</code> 指定每個 Host DLL 的適用版本。版本路由只負責選擇 DLL；每個宣告支援的版本仍須實機回歸測試。</p>
          </div>
        </details>
      </div>

      <div class="dev-step">
        <div class="step-header">
          <span class="step-number">STEP 01</span>
          <div><span class="step-stage">外掛入口</span><h5 class="step-title">確認外掛能進入 AutoCAD</h5></div>
        </div>
        <div class="step-main">
          <p class="step-body">這一關只做一件事：讓 AutoCAD 載入 DLL，並執行一個最小的 <code>SCAFFOLD_AUDIT</code> 指令。此時不寫施工架規則、不做 WPF，也不讀圖。</p>
          <p class="step-pass"><strong>通過標準</strong><span>輸入 <code>SCAFFOLD_AUDIT</code> 後命令能被呼叫，命令列顯示測試訊息，且 NETLOAD 沒有載入錯誤。</span></p>
        </div>
        <details>
          <summary><span>展開查看</span><strong>Visual Studio 專案結構與 IExtensionApplication 設定</strong><b>＋</b></summary>
          <div class="step-detail">
            <p>建議 Solution 結構：</p>
            <ul>
              <li><code>Scaffold.AutoCAD.Net48</code> — AutoCAD 2021–2024 Host</li>
              <li><code>Scaffold.AutoCAD.Net8</code> — AutoCAD 2025–2026 Host</li>
              <li><code>Scaffold.Domain</code> — 施工架資料模型</li>
              <li><code>Scaffold.Core</code> — C# 共同工程核心，不依賴 AutoCAD 與 WPF</li>
              <li><code>Scaffold.UI</code> — ViewModel 與結果面板</li>
              <li><code>Scaffold.Tests</code> — 核心規則與案例測試</li>
            </ul>
            <p>Host 專案 reference 指向目標 AutoCAD SDK 的 <code>acmgd.dll</code> 與 <code>acdbmgd.dll</code>，並將 <code>Copy Local</code> 設為 <code>False</code>。第一版的 <code>Initialize()</code>／<code>Terminate()</code> 可以保持最小化，只先驗證 <code>CommandMethod</code>。</p>
          </div>
        </details>
      </div>

      <div class="dev-step">
        <div class="step-header">
          <span class="step-number">STEP 02</span>
          <div><span class="step-stage">DWG 讀取</span><h5 class="step-title">確認能讀到圖層裡的圖元</h5></div>
        </div>
        <div class="step-main">
          <p class="step-body">這一關只做一件事：從固定測試圖層找到施工架圖元，並把圖元類型、數量與座標印到命令列。先證明讀圖路徑成立，再處理不同客戶的圖層映射。</p>
          <p class="step-pass"><strong>通過標準</strong><span>命令列能列出指定圖層的圖元數量，以及至少一個圖元的起點、終點或插入座標。</span></p>
        </div>
        <details>
          <summary><span>展開查看</span><strong>Database、Transaction 與圖層過濾實作</strong><b>＋</b></summary>
          <div class="step-detail">
            <pre>DocumentManager → MdiActiveDocument
→ Database → Transaction
→ BlockTable → Model Space BlockTableRecord
→ 過濾 Entity.Layer
→ 取得幾何資料、圖元類型與 Handle</pre>
            <p>讀圖結果應轉成不依賴 AutoCAD 的資料快照，再送進 <code>Scaffold.Core</code>。同時保存 Handle 字串，STEP 04 才能重新找回來源圖元；不要把開啟中的 DBObject reference 傳入共同核心。</p>
          </div>
        </details>
      </div>

      <div class="dev-step">
        <div class="step-header">
          <span class="step-number">STEP 03</span>
          <div><span class="step-stage">結果面板</span><h5 class="step-title">確認計算結果能送進 WPF 面板</h5></div>
        </div>
        <div class="step-main">
          <p class="step-body">這一關只做一件事：執行指令後，右側 PaletteSet 顯示從 DWG 讀到的主架數量。面板只保存 ViewModel 與使用者操作意圖，DWG 的讀寫仍留在 AutoCAD 文件環境。</p>
          <p class="step-pass"><strong>通過標準</strong><span>PaletteSet 能停靠、開關與更新，數量和命令列結果一致，且沒有文件鎖定、焦點或 UI 更新錯誤。</span></p>
        </div>
        <details>
          <summary><span>展開查看</span><strong>PaletteSet、WPF ViewModel 與文件執行環境</strong><b>＋</b></summary>
          <div class="step-detail">
            <p>結果面板使用 WPF <code>UserControl</code> 與 ViewModel。PaletteSet 可以使用目標 AutoCAD 版本支援的 WPF 整合方式；是否採直接 WPF 支援或 ElementHost，應在 STEP 03 以停靠、縮放、焦點和關閉行為實測後選定。</p>
            <p>從 modeless PaletteSet 修改 DWG 時，要回到適當的 AutoCAD 文件環境並取得 <code>DocumentLock</code>。只有背景工作完成後需要跨執行緒更新 WPF 時，才使用 <code>Dispatcher</code>。</p>
          </div>
        </details>
      </div>

      <div class="dev-step">
        <div class="step-header">
          <span class="step-number">STEP 04</span>
          <div><span class="step-stage">原圖定位</span><h5 class="step-title">確認能從面板定位回原始圖元</h5></div>
        </div>
        <div class="step-main">
          <p class="step-body">這一關只做一件事：在面板點擊「定位」，AutoCAD 視角移到對應圖元並高亮。計算結果與異常清單必須能回到原始證據，而不是只顯示一個總數。</p>
          <p class="step-pass"><strong>通過標準</strong><span>點擊異常項目後，視角移到正確位置；來源圖元可暫時高亮，持久標記則寫入獨立 Result Layer。</span></p>
        </div>
        <details>
          <summary><span>展開查看</span><strong>Handle → ObjectId、視角定位與 Result Layer</strong><b>＋</b></summary>
          <div class="step-detail">
            <pre>Handle 字串
→ Database 取回 ObjectId
→ Transaction 開啟來源 Entity
→ 取得幾何範圍
→ 更新目前 View 或呼叫 Zoom helper
→ Highlight／Result Layer 標記</pre>
            <p>由 PaletteSet 觸發的圖面操作需要在 AutoCAD 文件環境中執行，修改資料庫時取得 <code>DocumentLock</code>。Result Layer 不改動原始施工架圖層，讓使用者可以關閉標記並回到乾淨圖面。</p>
          </div>
        </details>
      </div>

      <div class="dev-step">
        <div class="step-header">
          <span class="step-number">STEP 05</span>
          <div><span class="step-stage">閉環驗證</span><h5 class="step-title">確認修正後重新讀圖結果會更新</h5></div>
        </div>
        <div class="step-main">
          <p class="step-body">這一關只做一件事：人員修正圖元後按「重新檢查」，面板反映目前 DWG，而不是上一次的快取。這一步通過，方案一才形成真正的稽核閉環。</p>
          <p class="step-pass"><strong>通過標準</strong><span>修正一個異常後重新執行，異常數量、定位清單與 Result Layer 都依目前圖面同步更新。</span></p>
        </div>
        <details>
          <summary><span>展開查看</span><strong>重新讀圖、狀態清除與安全快取</strong><b>＋</b></summary>
          <div class="step-detail">
            <p>每次執行前清除上一輪的 ViewModel 結果、暫時高亮與 Result Layer 標記，再從 <code>MdiActiveDocument.Database</code> 建立新的資料快照。</p>
            <p>兩次執行之間只保存 Handle、純資料模型與規則結果，不保存跨 Transaction 的 Entity／DBObject reference。</p>
          </div>
        </details>
      </div>

      <div class="dev-step dev-step--deploy">
        <div class="step-header">
          <span class="step-number">DEPLOY</span>
          <div><span class="step-stage">正式安裝</span><h5 class="step-title">六道關卡通過後，再進入部署</h5></div>
        </div>
        <div class="step-main">
          <p class="step-body">開發期間使用 NETLOAD 手動載入 DLL；正式部署改用 <code>.bundle</code> 與 <code>PackageContents.xml</code>。同一個安裝包可包含 net48 與 net8 Host，AutoCAD 依版本自動載入正確元件。</p>
          <p class="step-pass"><strong>通過標準</strong><span>安裝一次後，所有支援版本啟動時能載入正確 Host，Ribbon／命令與相依 DLL 均可使用。</span></p>
        </div>
        <details>
          <summary><span>展開查看</span><strong>PackageContents.xml 與多版本部署設定</strong><b>＋</b></summary>
          <div class="step-detail">
            <p>企業部署可將 <code>ScaffoldAudit.bundle</code> 放入 Autodesk 的 ApplicationPlugins 搜尋路徑。<code>PackageContents.xml</code> 以不同 <code>ComponentEntry</code> 指向 net48 與 net8 Host，並透過 <code>RuntimeRequirements</code> 的版本範圍進行路由。</p>
            <p>部署完成後仍需建立支援矩陣，逐版驗證載入、命令、PaletteSet、讀寫 DWG 與重新檢查流程。</p>
          </div>
        </details>
      </div>
    </section>
  `;

  function replaceAppendix() {
    const overlay = document.querySelector('#devOverlay');
    if (!overlay) return;
    if (overlay.querySelector('.dev-path-v32')) return;

    const oldAppendix = overlay.querySelector('details.technical-appendix, .tech-appendix');
    if (!oldAppendix) return;

    const template = document.createElement('template');
    template.innerHTML = appendixMarkup.trim();
    oldAppendix.replaceWith(template.content.firstElementChild);
  }

  function boot() {
    replaceAppendix();
    window.setTimeout(replaceAppendix, 250);
    window.setTimeout(replaceAppendix, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
