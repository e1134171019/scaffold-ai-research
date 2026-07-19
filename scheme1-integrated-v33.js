(() => {
  'use strict';

  const steps = [
    {
      no: 'STEP 00',
      stage: '建置範圍',
      title: '需要支援哪些 AutoCAD 版本？',
      body: '先定義正式支援範圍，才能決定 Solution 要建立一個 Host，還是同時建立 net48 與 net8 兩個建置目標。',
      pass: '所有宣告支援的 AutoCAD 版本，都能載入正確 DLL 並執行 SCAFFOLD_AUDIT。',
      detailTitle: 'AutoCAD 版本、.NET 執行環境與 bundle 結構',
      detail: `
        <div class="scheme1-version-pair-v33">
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
        <p>PackageContents.xml 以 RuntimeRequirements、SeriesMin 與 SeriesMax 路由到正確 Host。版本路由不等於完成相容性驗證，仍須逐版回歸測試。</p>
      `
    },
    {
      no: 'STEP 01',
      stage: '外掛入口',
      title: '外掛能不能先進入 AutoCAD？',
      body: '先讓 AutoCAD 載入 DLL，並執行一個最小的 SCAFFOLD_AUDIT 指令。此時不寫施工架規則、不做 WPF，也不讀圖。',
      pass: '命令可以被呼叫、命令列顯示測試訊息，NETLOAD 沒有載入錯誤。',
      detailTitle: 'Visual Studio 專案結構與 IExtensionApplication 設定',
      detail: `
        <ul>
          <li><code>Scaffold.AutoCAD.Net48</code>：AutoCAD 2021–2024 Host</li>
          <li><code>Scaffold.AutoCAD.Net8</code>：AutoCAD 2025–2026 Host</li>
          <li><code>Scaffold.Domain</code>：施工架資料模型</li>
          <li><code>Scaffold.Core</code>：C# 共同工程核心</li>
          <li><code>Scaffold.UI</code>：ViewModel 與結果面板</li>
          <li><code>Scaffold.Tests</code>：核心規則與案例測試</li>
        </ul>
        <p>兩個 Host 專案分別 reference 目標 AutoCAD SDK 的 acmgd.dll 與 acdbmgd.dll，並將 Copy Local 設為 False。第一版只先驗證 IExtensionApplication 與 CommandMethod。</p>
      `
    },
    {
      no: 'STEP 02',
      stage: 'DWG 讀取',
      title: '程式能不能讀到指定圖層的圖元？',
      body: '從固定測試圖層找到施工架圖元，將圖元類型、數量與座標印到命令列。先證明讀圖路徑成立，再處理不同客戶的圖層映射。',
      pass: '命令列能列出指定圖層的圖元數量，以及至少一個圖元的起點、終點或插入座標。',
      detailTitle: 'Database、Transaction 與圖層過濾實作',
      detail: `
        <pre>DocumentManager → MdiActiveDocument
→ Database → Transaction
→ BlockTable → Model Space
→ 過濾 Entity.Layer
→ 取得幾何資料、圖元類型與 Handle</pre>
        <p>讀圖結果轉成不依賴 AutoCAD 的資料快照，再送入 Scaffold.Core。跨 Transaction 只保存 Handle 與純資料，不保存開啟中的 DBObject reference。</p>
      `
    },
    {
      no: 'STEP 03',
      stage: '結果面板',
      title: '計算結果能不能顯示在右側面板？',
      body: '執行指令後，右側 PaletteSet 顯示從目前 DWG 讀到的主架數量與異常。面板負責呈現結果與接收操作意圖，圖面讀寫仍留在 AutoCAD 文件環境。',
      pass: 'PaletteSet 可以停靠、開關與更新，顯示數字和命令列結果一致，且沒有文件鎖定、焦點或 UI 更新錯誤。',
      detailTitle: 'PaletteSet、WPF ViewModel 與文件執行環境',
      detail: `
        <p>結果面板使用 WPF UserControl 與 ViewModel。直接 WPF 支援或 ElementHost 都應在目標版本實測停靠、縮放、焦點與關閉行為後再定案。</p>
        <p>由 modeless PaletteSet 修改 DWG 時，必須回到適當的 AutoCAD 文件環境並取得 DocumentLock。只有實際跨執行緒更新 WPF 時才使用 Dispatcher。</p>
      `
    },
    {
      no: 'STEP 04',
      stage: '原圖定位',
      title: '能不能從異常清單回到來源圖元？',
      body: '從面板點擊「定位」，AutoCAD 視角移到對應圖元並高亮。異常結果必須能回到原始證據，而不是只顯示一個總數。',
      pass: '點擊異常項目後視角移到正確位置；來源圖元可暫時高亮，持久標記寫入獨立 Result Layer。',
      detailTitle: 'Handle → ObjectId、視角定位與 Result Layer',
      detail: `
        <pre>Handle 字串
→ Database 取回 ObjectId
→ Transaction 開啟來源 Entity
→ 取得幾何範圍
→ 更新目前 View／Zoom helper
→ Highlight／Result Layer</pre>
        <p>Result Layer 不修改原始施工架圖層。由 PaletteSet 觸發的圖面操作仍須在 AutoCAD 文件環境中執行。</p>
      `
    },
    {
      no: 'STEP 05',
      stage: '閉環驗證',
      title: '修正圖面後，重新檢查會不會更新？',
      body: '人員修正圖元後按「重新檢查」，面板重新讀取目前 DWG，而不是使用上一輪快取。這一步通過，方案一才形成真正的稽核閉環。',
      pass: '修正一個異常後重新執行，異常數量、定位清單與 Result Layer 都依目前圖面同步更新。',
      detailTitle: '重新讀圖、狀態清除與安全快取',
      detail: `
        <p>每次執行前清除上一輪 ViewModel 結果、暫時高亮與 Result Layer 標記，再從 MdiActiveDocument.Database 建立新的資料快照。</p>
        <p>兩次執行之間只保存 Handle、純資料模型與規則結果，不保存跨 Transaction 的 Entity／DBObject reference。</p>
      `
    }
  ];

  const stepsMarkup = steps.map((step) => `
    <article class="scheme1-dev-step-v33">
      <div class="scheme1-dev-step-v33__head">
        <span>${step.no} · ${step.stage}</span>
        <h4>${step.title}</h4>
      </div>
      <p class="report-copy">${step.body}</p>
      <div class="scheme1-pass-v33"><span>通過標準</span><strong>${step.pass}</strong></div>
      <details class="scheme1-detail-v33">
        <summary><span>展開查看</span><strong>${step.detailTitle}</strong><b>＋</b></summary>
        <div>${step.detail}</div>
      </details>
    </article>
  `).join('');

  const integratedMarkup = `
    <section class="dev-hero report-hero scheme1-hero-v33">
      <span class="dev-kicker">SCHEME 01 · AUTOCAD NATIVE AUDIT PLUG-IN</span>
      <h2 id="devOverlayTitle">把人工繪圖，接上自動稽核與重新驗證。</h2>
      <p>繪圖人員仍在 AutoCAD 中完成施工架配置；外掛讀取目前 DWG，計算數量、指出異常、回到原圖定位，並在修正後重新檢查。</p>
      <p class="scheme1-boundary-v33"><strong>第一版邊界：</strong>方案一稽核既有人工配置，不在此階段自動生成施工架。</p>
    </section>

    <section class="report-section" id="schemeOneTech">
      <div class="report-section-head">
        <span>01 · 方案定位與技術選擇</span>
        <h3>為什麼使用 AutoCAD 原生外掛？</h3>
      </div>
      <p class="report-copy">方案一需要讀取目前開啟的 DWG、建立自訂命令、顯示可停靠的結果面板、定位原始圖元，並將檢查標記寫回圖面。因此主路線採用 Visual Studio、C#、AutoCAD Managed .NET API 與 WPF。</p>
      <div class="mini-api-summary scheme1-tech-summary-v33">
        <article class="selected"><span>Managed .NET API</span><b>DWG 讀寫、命令、Ribbon 與面板</b></article>
        <article><span>C# Class Library</span><b>資料模型、規則與數量核心</b></article>
        <article><span>WPF／PaletteSet</span><b>結果、異常與定位入口</b></article>
        <article><span>.bundle</span><b>多版本部署與自動載入</b></article>
      </div>
      <div class="ribbon-equation">
        <div><span>目前 DWG</span><strong>人工配置結果</strong></div><i>→</i>
        <div><span>外掛命令</span><strong>SCAFFOLD_AUDIT</strong></div><i>→</i>
        <div><span>輸出</span><strong>數量、異常、定位</strong></div>
      </div>
      <details class="scheme1-section-detail-v33">
        <summary><span>展開查看</span><strong>為什麼不選 ObjectARX、AutoLISP 或 COM 作為第一版主路線？</strong><b>＋</b></summary>
        <div><p>ObjectARX 適合更底層的原生整合；AutoLISP 適合快速腳本；ActiveX／COM 適合外部程式控制 AutoCAD。方案一需要完整 DWG 讀寫、可維護的共同核心與 WPF 面板，因此 Managed .NET API 更符合第一版需求。</p></div>
      </details>
    </section>

    <section class="report-section" id="schemeOneUserFlow">
      <div class="report-section-head">
        <span>02 · 使用者操作閉環</span>
        <h3>繪圖人員實際只做哪些動作？</h3>
      </div>
      <p class="report-copy">正式安裝後，繪圖人員不需要接觸 Visual Studio、DLL 或程式碼。他只在 AutoCAD 中完成配置、執行檢查、查看數量與異常、定位問題、修正或確認，再重新檢查目前 DWG。</p>
      <div class="report-loop scheme1-user-loop-v33">
        <div><span>01</span><b>完成施工架配置</b></div><i>→</i>
        <div><span>02</span><b>執行施工架檢查</b></div><i>→</i>
        <div><span>03</span><b>查看數量與異常</b></div><i>→</i>
        <div><span>04</span><b>定位並修正</b></div><i>↺</i>
        <div><span>05</span><b>重新讀取目前 DWG</b></div>
      </div>
      <div class="scheme1-screen-v33" aria-label="AutoCAD 方案一介面示意">
        <div class="scheme1-screen-v33__ribbon"><span>常用</span><span>插入</span><span>註解</span><span class="active">施工架工具</span><span>檢視</span></div>
        <div class="scheme1-screen-v33__body">
          <div class="scheme1-screen-v33__cad">
            <div class="scheme1-screen-v33__buttons"><button>施工架檢查</button><button>重新檢查</button><button>專案設定</button></div>
            <div class="scheme1-screen-v33__drawing"><span class="line l1"></span><span class="line l2"></span><span class="line l3"></span><span class="issue-dot"></span><small>目前 DWG 與異常位置</small></div>
          </div>
          <aside class="scheme1-screen-v33__panel">
            <span>施工架稽核結果</span>
            <strong>主架 128</strong>
            <div><b>3</b><small>待確認異常</small></div>
            <ul><li>轉角共用條件</li><li>短跨未分類</li><li>孤立圖元</li></ul>
            <button>定位到圖面</button>
          </aside>
        </div>
      </div>
    </section>

    <section class="report-section" id="schemeOneArchitecture">
      <div class="report-section-head">
        <span>03 · 系統架構與責任邊界</span>
        <h3>完整系統由哪些部分組成？</h3>
      </div>
      <p class="report-copy">完成後的方案一不是單一 DLL 裡的一團邏輯，而是把 AutoCAD 相依層、工程核心與使用者介面分開。這樣後續方案二與方案三才能重用同一套資料模型與規則。</p>
      <div class="scheme1-architecture-v33">
        <article><span>01</span><h4>AutoCAD Host</h4><p>net48／net8、命令入口、DocumentLock。</p></article><i>→</i>
        <article><span>02</span><h4>DWG Adapter</h4><p>圖層、圖元、座標與 Handle 轉成資料快照。</p></article><i>→</i>
        <article class="core"><span>03</span><h4>Domain／Core</h4><p>主架、架跨、數量、規則與 AuditIssue。</p></article><i>→</i>
        <article><span>04</span><h4>WPF ViewModel</h4><p>顯示結果並接收定位、確認與重查意圖。</p></article><i>→</i>
        <article><span>05</span><h4>Writeback</h4><p>視角定位、Highlight、Result Layer 與重新讀圖。</p></article>
      </div>
      <div class="scheme1-core-boundary-v33"><strong>共同核心：</strong>施工架規則以 C# Class Library 實作；Python／Colab只用於方案二的離線分析、規則探索與統計驗證，不進入方案一正式執行路徑。</div>
    </section>

    <section class="report-section scheme1-development-v33" id="schemeOneDevelopment">
      <div class="report-section-head">
        <span>04 · 從 0 到 1 的開發路徑</span>
        <h3>從第一個指令能執行，到完整稽核閉環。</h3>
      </div>
      <p class="report-copy">方案一不會一次完成所有功能。每一關只驗證一件事；前一關沒有通過，就不進入下一關，避免錯誤跨越多個技術層後才被發現。</p>
      <div class="scheme1-dev-list-v33">${stepsMarkup}</div>
      <article class="scheme1-deploy-v33">
        <div><span>DEPLOY · 正式安裝</span><h4>六道關卡通過後，如何交付給客戶？</h4></div>
        <p>開發期間使用 NETLOAD；正式部署改用 .bundle 與 PackageContents.xml。同一個安裝包可包含 net48 與 net8 Host，由 AutoCAD 依版本自動載入。</p>
        <div class="scheme1-pass-v33"><span>通過標準</span><strong>安裝一次後，所有支援版本都能載入正確 Host，Ribbon、命令、面板與相依 DLL 均可使用。</strong></div>
      </article>
    </section>

    <section class="report-section" id="schemeOneReportDemo">
      <div class="report-section-head">
        <span>05 · 第一版範圍與驗收證據</span>
        <h3>做到什麼，才算方案一真的成立？</h3>
      </div>
      <p class="report-copy">Demo 不只展示畫面，而要對應六道關卡的通過證據。第一版完成標準分成三段。</p>
      <div class="scheme1-acceptance-v33">
        <article><span>DEMO 01</span><h4>外掛與讀圖</h4><p>正確 DLL 載入、指令可執行、命令列顯示指定圖層圖元與座標。</p></article>
        <article><span>DEMO 02</span><h4>面板與定位</h4><p>PaletteSet 顯示數量與異常，點擊項目可回到來源圖元。</p></article>
        <article><span>DEMO 03</span><h4>修正與重驗</h4><p>修正圖元後重新檢查，數量、異常清單與標記同步更新。</p></article>
      </div>
      <div class="demo-frame report-demo-frame scheme1-demo-v33">
        <div class="demo-frame-icon">DEMO</div>
        <strong>方案一端到端 Demo</strong>
        <span>建議尺寸：16:9</span>
        <small>Load correct Host → SCAFFOLD_AUDIT → Read DWG → Result Panel → Locate → Fix → Re-audit</small>
      </div>
      <div class="scheme1-first-release-v33">
        <strong>第一版不包含：</strong>
        <span>建築圖自動生成施工架、未知工程條件自行決策、沒有高度資料時推算完整立面總量。</span>
      </div>
    </section>

    <footer class="dev-bottom-actions scheme1-bottom-v33">
      <button class="dev-back" id="closeDevBottom" type="button">← 返回方案一</button>
      <a href="#schemeOneTech">回到本頁開頭 ↑</a>
    </footer>
  `;

  function rebuildSchemeOne() {
    const overlay = document.querySelector('#devOverlay');
    const main = overlay?.querySelector('.dev-main.report-main');
    if (!main || main.dataset.integratedV33 === 'true') return;

    main.innerHTML = integratedMarkup;
    main.dataset.integratedV33 = 'true';

    document.getElementById('closeDevBottom')?.addEventListener('click', () => {
      document.getElementById('closeDevDetail')?.click();
    });
  }

  function boot() {
    rebuildSchemeOne();
    window.setTimeout(rebuildSchemeOne, 250);
    window.setTimeout(rebuildSchemeOne, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
