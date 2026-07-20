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
      body: '先讓 AutoCAD 載入 DLL，並執行一個最小的 SCAFFOLD_AUDIT 指令。此時不寫施工架規則、不做面板，也不讀圖。',
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
      stage: '雙重輸入',
      title: '能不能同時讀到圖面配置與人工數量？',
      body: '方案一需要兩個獨立來源：目前 DWG 裡的施工架配置，以及繪圖人員原本申報的數量。第一版先讀固定測試圖層，人工數量則由結果面板輸入或確認。',
      pass: '程式能列出指定圖層的圖元、座標與 Handle，同時取得人工申報數量，且兩者都保留來源紀錄。',
      detailTitle: 'DWG Reader、人工數量來源與資料快照',
      detail: `
        <pre>輸入 A：目前 DWG
DocumentManager → Database → Transaction
→ Model Space → 過濾 Entity.Layer
→ 幾何資料、圖元類型、座標、Handle

輸入 B：人工申報數量
第一版：WPF 面板輸入／確認
後續：固定格式 CAD 數量表、文字標註或 Excel／BOM</pre>
        <p>讀圖結果轉成不依賴 AutoCAD 的資料快照，再送入 Scaffold.Core。跨 Transaction 只保存 Handle 與純資料，不保存開啟中的 DBObject reference。</p>
      `
    },
    {
      no: 'STEP 03',
      stage: '共同核心',
      title: '能不能獨立重建配置、重算數量並完成比對？',
      body: '共同核心不是等方案二才建立。方案一先建立第一個可執行版本：把圖元標準化、重建主架與架跨關係、獨立計算數量，再和人工申報數量比對，同時執行配置規則與資料完整性檢查。',
      pass: '固定測試圖能穩定輸出人工數量、程式重算數量、差異值、配置異常與資料缺漏；結果不依賴 WPF 或 AutoCAD 畫面。',
      detailTitle: '共同核心的最小模組與責任',
      detail: `
        <pre>GeometryNormalizer
→ TopologyBuilder
→ QuantityCalculator
→ QuantityReconciler
→ RuleValidator
→ AuditIssue</pre>
        <ul>
          <li><code>GeometryNormalizer</code>：把 AutoCAD 圖元轉成標準工程幾何。</li>
          <li><code>TopologyBuilder</code>：重建主架、架跨、轉角與連接關係。</li>
          <li><code>QuantityCalculator</code>：依圖面配置獨立重算元件數量。</li>
          <li><code>QuantityReconciler</code>：比較人工申報與程式重算結果。</li>
          <li><code>RuleValidator</code>：檢查已知配置規則與資料完整性。</li>
        </ul>
        <p>方案二應批次呼叫同一個 C# Core，不在 Python 重新寫一套規則；方案三則在這個共用核心之外增加約束模型與候選求解模組。</p>
      `
    },
    {
      no: 'STEP 04',
      stage: '結果與定位',
      title: '能不能把一致、不一致與配置異常說清楚？',
      body: '右側 PaletteSet 必須同時顯示人工數量、程式重算、差異值、配置異常與資料缺漏。點擊任何差異或異常，都能回到對應來源圖元。',
      pass: '面板能區分「數量一致且配置通過」「數量不一致」「數量一致但配置異常」「資料不足無法確認」，並能定位來源。',
      detailTitle: 'WPF ViewModel、Handle 定位與稽核結果寫回',
      detail: `
        <pre>AuditResult
→ WPF ViewModel／PaletteSet
→ Handle 取回 ObjectId
→ Transaction 開啟來源 Entity
→ 更新目前 View／Zoom helper
→ Highlight／Audit Result Layer</pre>
        <p>由 modeless PaletteSet 修改 DWG 時，必須回到適當的 AutoCAD 文件環境並取得 DocumentLock。方案一只寫回稽核標記，不寫入新的施工架配置。</p>
      `
    },
    {
      no: 'STEP 05',
      stage: '閉環驗證',
      title: '修正圖面或人工數量後，重新檢查會不會更新？',
      body: '人員可以修正施工架圖元，也可以修正原本填寫錯誤的人工數量。按下重新檢查後，系統必須重新讀取兩個輸入，不能沿用上一輪結果。',
      pass: '修正後重新執行，人工數量、程式重算、差異、異常清單與稽核標記都依目前狀態同步更新。',
      detailTitle: '重新讀圖、人工數量更新與安全快取',
      detail: `
        <p>每次執行前清除上一輪 ViewModel 結果、暫時高亮與稽核標記，再從 MdiActiveDocument.Database 建立新的資料快照，並重新取得目前人工申報數量。</p>
        <p>兩次執行之間只保存 Handle、純資料模型、人工數量紀錄與規則結果，不保存跨 Transaction 的 Entity／DBObject reference。</p>
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
      <h2 id="devOverlayTitle">人工先完成配置，外掛再做獨立複核。</h2>
      <p>繪圖人員先在 AutoCAD 中完成施工架配置與人工數量；外掛再從目前 DWG 獨立重建施工架關係、重新計算數量，檢查兩者是否一致，並指出配置異常或資料缺漏。</p>
      <p class="scheme1-boundary-v33"><strong>第一版邊界：</strong>方案一不替繪圖人員配置施工架，也不自動生成候選方案；它負責重算、比對、稽核、定位與修正後重新驗證。</p>
    </section>

    <section class="report-section" id="schemeOneTech">
      <div class="report-section-head">
        <span>01 · 方案目的與技術選擇</span>
        <h3>方案一到底要確認什麼？</h3>
      </div>
      <p class="report-copy">方案一的核心不是單純替人員算一次數量，而是建立第二條獨立計算路徑。人工配置與人工數量是一組結果；外掛從 DWG 重建配置後得到另一組結果，兩者比對後才能形成可追溯的複核證據。</p>
      <div class="mini-api-summary scheme1-tech-summary-v33">
        <article class="selected"><span>數量複核</span><b>人工申報與程式重算是否一致</b></article>
        <article><span>配置稽核</span><b>數量一致時，配置仍可能違反規則</b></article>
        <article><span>資料完整性</span><b>未知、未分類與不足不能當成通過</b></article>
        <article><span>原圖追溯</span><b>每個差異都能回到來源圖元</b></article>
      </div>
      <div class="ribbon-equation">
        <div><span>人工結果</span><strong>配置＋申報數量</strong></div><i>⇄</i>
        <div><span>共同核心</span><strong>重建＋重算＋稽核</strong></div><i>→</i>
        <div><span>判斷結果</span><strong>一致、差異、異常或未知</strong></div>
      </div>
      <details class="scheme1-section-detail-v33">
        <summary><span>展開查看</span><strong>為什麼仍採用 AutoCAD Managed .NET API、C# 與 WPF？</strong><b>＋</b></summary>
        <div><p>方案一需要讀取目前開啟的 DWG、建立自訂命令、取得圖元 Handle、顯示可停靠的比對面板、定位原始圖元並寫回稽核標記。因此採用 C#、AutoCAD Managed .NET API 與 WPF；共同核心維持為不依賴 AutoCAD UI 的 C# Class Library。</p></div>
      </details>
    </section>

    <section class="report-section" id="schemeOneUserFlow">
      <div class="report-section-head">
        <span>02 · 使用者操作閉環</span>
        <h3>繪圖人員實際只做哪些動作？</h3>
      </div>
      <p class="report-copy">正式安裝後，繪圖人員仍照原本方式完成配置與人工數量。他只需要執行檢查、查看比對結果與異常、定位問題、修正圖面或數量，再重新檢查目前 DWG。</p>
      <div class="report-loop scheme1-user-loop-v33">
        <div><span>01</span><b>完成配置與人工數量</b></div><i>→</i>
        <div><span>02</span><b>執行施工架檢查</b></div><i>→</i>
        <div><span>03</span><b>查看重算與差異</b></div><i>→</i>
        <div><span>04</span><b>定位並修正</b></div><i>↺</i>
        <div><span>05</span><b>重新複核目前結果</b></div>
      </div>
      <div class="scheme1-screen-v33" aria-label="AutoCAD 方案一介面示意">
        <div class="scheme1-screen-v33__ribbon"><span>常用</span><span>插入</span><span>註解</span><span class="active">施工架工具</span><span>檢視</span></div>
        <div class="scheme1-screen-v33__body">
          <div class="scheme1-screen-v33__cad">
            <div class="scheme1-screen-v33__buttons"><button>施工架檢查</button><button>重新檢查</button><button>人工數量</button></div>
            <div class="scheme1-screen-v33__drawing"><span class="line l1"></span><span class="line l2"></span><span class="line l3"></span><span class="issue-dot"></span><small>目前 DWG 與差異來源</small></div>
          </div>
          <aside class="scheme1-screen-v33__panel">
            <span>施工架複核結果</span>
            <strong>人工 128 ／重算 126</strong>
            <div><b>差 2</b><small>數量不一致</small></div>
            <ul><li>主架數量差異：−2</li><li>轉角共用條件待確認</li><li>1 個孤立圖元</li></ul>
            <button>定位差異來源</button>
          </aside>
        </div>
      </div>
      <div class="scheme1-core-boundary-v33"><strong>判斷原則：</strong>數量一致不代表配置一定正確。方案一同時檢查數量一致性、配置規則與資料完整性。</div>
    </section>

    <section class="report-section" id="schemeOneArchitecture">
      <div class="report-section-head">
        <span>03 · 系統架構與責任邊界</span>
        <h3>共同核心在方案一開發時怎麼使用？</h3>
      </div>
      <p class="report-copy">共同核心不是等三個方案全部完成後才出現。它先在方案一中建立第一個可執行版本，負責重建配置、計算、比對與規則稽核；方案二再批次執行同一核心，方案三則在其外增加候選求解能力。</p>
      <div class="scheme1-architecture-v33">
        <article><span>01</span><h4>AutoCAD Host</h4><p>net48／net8、命令入口與 DocumentLock。</p></article><i>→</i>
        <article><span>02</span><h4>Input Adapter</h4><p>DWG 圖元與人工數量轉成可追溯資料快照。</p></article><i>→</i>
        <article class="core"><span>03</span><h4>Domain／Core</h4><p>拓樸重建、數量計算、數量比對、規則與 AuditIssue。</p></article><i>→</i>
        <article><span>04</span><h4>WPF ViewModel</h4><p>顯示人工、重算、差異、異常與資料缺漏。</p></article><i>→</i>
        <article><span>05</span><h4>Audit Writeback</h4><p>定位、Highlight、稽核結果圖層與重新讀取。</p></article>
      </div>
      <div class="scheme1-core-boundary-v33"><strong>三方案關係：</strong>方案一是共同核心的第一個實際使用者；方案二用大量案例批次驗證同一核心；方案三重用已驗證的資料模型、規則與數量計算，再增加約束求解器。Python／Colab只負責離線分析與報告，不另寫一套正式規則。</div>
    </section>

    <section class="report-section scheme1-development-v33" id="schemeOneDevelopment">
      <div class="report-section-head">
        <span>04 · 從 0 到 1 的開發路徑</span>
        <h3>從第一個指令，到人工數量的獨立複核閉環。</h3>
      </div>
      <p class="report-copy">每一關只驗證一件事。新版開發路徑把「共同核心的重建、計算與比對」獨立列為 STEP 03，避免讀完 DWG 後直接跳到面板，卻沒有證明工程計算真的成立。</p>
      <div class="scheme1-dev-list-v33">${stepsMarkup}</div>
      <article class="scheme1-deploy-v33">
        <div><span>DEPLOY · 正式安裝</span><h4>六道關卡通過後，如何交付給客戶？</h4></div>
        <p>開發期間使用 NETLOAD；正式部署改用 .bundle 與 PackageContents.xml。同一個安裝包可包含 net48 與 net8 Host，由 AutoCAD 依版本自動載入。</p>
        <div class="scheme1-pass-v33"><span>通過標準</span><strong>安裝一次後，所有支援版本都能載入正確 Host，並完成讀圖、人工數量取得、共同核心重算、比對、定位與重新驗證。</strong></div>
      </article>
    </section>

    <section class="report-section" id="schemeOneReportDemo">
      <div class="report-section-head">
        <span>05 · 第一版範圍與驗收證據</span>
        <h3>做到什麼，才算方案一真的成立？</h3>
      </div>
      <p class="report-copy">Demo 不只展示外掛介面，而要證明「人工結果」與「程式獨立重算」確實是兩條不同來源，並能在差異發生時回到原圖。</p>
      <div class="scheme1-acceptance-v33">
        <article><span>DEMO 01</span><h4>兩種輸入成立</h4><p>外掛能讀取施工架圖元與人工申報數量，並保存兩者來源。</p></article>
        <article><span>DEMO 02</span><h4>核心重算與比對</h4><p>共同核心獨立重建配置，輸出重算數量、差異、規則異常與資料缺漏。</p></article>
        <article><span>DEMO 03</span><h4>定位與重新複核</h4><p>差異能定位回來源；修正圖面或人工數量後，全部結果同步更新。</p></article>
      </div>
      <div class="demo-frame report-demo-frame scheme1-demo-v33">
        <div class="demo-frame-icon">DEMO</div>
        <strong>方案一端到端 Demo</strong>
        <span>建議尺寸：16:9</span>
        <small>Human configuration + declared quantity → Read DWG → Rebuild topology → Recalculate → Reconcile → Locate → Fix → Re-audit</small>
      </div>
      <div class="scheme1-first-release-v33">
        <strong>第一版不包含：</strong>
        <span>建築圖自動生成施工架、未知工程條件自行決策、沒有高度資料時推算完整立面總量。</span>
      </div>
      <p class="scheme1-boundary-v33"><strong>方案一的最終目的：</strong>繪圖人員先完成施工架配置與人工數量，外掛再從目前 DWG 獨立重建施工架關係、重新計算數量，檢查兩者是否一致；若有差異、配置異常或資料缺漏，直接定位來源，修正後重新驗證。</p>
    </section>

    <footer class="dev-bottom-actions scheme1-bottom-v33">
      <button class="dev-back" id="closeDevBottom" type="button">← 返回方案一</button>
      <a href="#schemeOneTech">回到本頁開頭 ↑</a>
    </footer>
  `;

  function rebuildSchemeOne() {
    const overlay = document.querySelector('#devOverlay');
    const main = overlay?.querySelector('.dev-main.report-main');
    if (!main || main.dataset.integratedV34 === 'true') return;

    main.innerHTML = integratedMarkup;
    main.dataset.integratedV34 = 'true';

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
