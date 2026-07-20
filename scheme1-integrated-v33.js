(() => {
  'use strict';

  const steps = [
    {
      no: 'STEP 00',
      stage: '建置範圍',
      title: '需要支援哪些 AutoCAD 版本？',
      body: '先確認外掛要支援哪些 AutoCAD 版本，再決定 Solution 要建立一個 Host，還是同時建立 net48 與 net8 兩個建置目標。',
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
      body: '先讓 AutoCAD 載入 DLL，並執行一個最小的 SCAFFOLD_AUDIT 指令。這一步先不讀圖、不開面板，也不寫施工架規則。',
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
      title: '圖面和人工整理的數量都讀得到嗎？',
      body: '外掛要先拿到兩邊資料：一邊是目前 DWG 裡畫好的施工架，另一邊是繪圖人員原本整理的數量。兩邊都讀得到，後面才有辦法比較。',
      pass: '程式能列出指定圖層的圖元、座標與 Handle，同時取得人工數量，且兩者都保留來源紀錄。',
      detailTitle: 'DWG Reader、人工數量來源與資料快照',
      detail: `
        <pre>輸入 A：目前 DWG
DocumentManager → Database → Transaction
→ Model Space → 過濾 Entity.Layer
→ 幾何資料、圖元類型、座標、Handle

輸入 B：人工數量
第一版：WPF 面板輸入／確認
後續：固定格式 CAD 數量表、文字標註或 Excel／BOM</pre>
        <p>讀圖結果轉成不依賴 AutoCAD 的資料快照，再送入 Scaffold.Core。跨 Transaction 只保存 Handle 與純資料，不保存開啟中的 DBObject reference。</p>
      `
    },
    {
      no: 'STEP 03',
      stage: '共同核心',
      title: '程式能不能自己再算一次？',
      body: '讀到圖面後，共同核心要自己找出哪些圖元代表主架、哪些形成架跨，再算出一份程式數量。最後把這份結果和繪圖人員整理的數量比較，同時檢查圖面規則和資料是不是完整。',
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
          <li><code>QuantityReconciler</code>：比較人工數量與程式重算結果。</li>
          <li><code>RuleValidator</code>：檢查已知配置規則與資料完整性。</li>
        </ul>
        <p>方案二應批次呼叫同一個 C# Core，不在 Python 重新寫一套規則；方案三則在這個共用核心之外增加約束模型與候選求解模組。</p>
      `
    },
    {
      no: 'STEP 04',
      stage: '結果與定位',
      title: '面板能不能把差異說清楚？',
      body: '面板不能只顯示一個總數。它要讓使用者看見人工數量、程式數量、差多少，以及圖面還有哪些問題。點擊差異或異常後，也要能直接回到對應位置。',
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
      title: '修正後再按一次，結果會不會更新？',
      body: '繪圖人員可能修正圖面，也可能修正原本整理錯的數量。按下重新檢查後，外掛要重新讀取兩邊資料，不能繼續使用上一輪結果。',
      pass: '修正後重新執行，人工數量、程式重算、差異、異常清單與稽核標記都依目前狀態同步更新。',
      detailTitle: '重新讀圖、人工數量更新與安全快取',
      detail: `
        <p>每次執行前清除上一輪 ViewModel 結果、暫時高亮與稽核標記，再從 MdiActiveDocument.Database 建立新的資料快照，並重新取得目前人工數量。</p>
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
      <h2 id="devOverlayTitle">繪圖人員先把施工架畫好，外掛再重新檢查一次。</h2>
      <p>繪圖人員先完成施工架圖，也把數量整理好。外掛會重新讀取目前的 DWG，自己再算一次數量，確認兩邊有沒有差異。發現問題時，程式會列出差在哪裡，並帶使用者回到圖面檢查。</p>
      <p class="scheme1-boundary-v33"><strong>第一版先做什麼：</strong>方案一不會幫使用者自動畫施工架。它先處理已經畫好的圖面，協助檢查數量和圖面內容。</p>
    </section>

    <section class="report-section" id="schemeOneTech">
      <div class="report-section-head">
        <span>01 · 方案目的與技術選擇</span>
        <h3>外掛到底要幫繪圖人員檢查什麼？</h3>
      </div>
      <p class="report-copy">繪圖人員已經把施工架畫好，也算出一份數量。外掛不直接使用這個結果，而是重新讀圖、重新算一次，再比較兩邊。這樣才看得出來是數量算錯、圖面畫錯，還是圖面資料不夠。</p>
      <div class="mini-api-summary scheme1-tech-summary-v33">
        <article class="selected"><span>數量有沒有對上</span><b>比較人工數量和程式重算結果</b></article>
        <article><span>圖面有沒有問題</span><b>數量相同時，配置仍可能有異常</b></article>
        <article><span>資料夠不夠</span><b>未知、未分類和缺少資料不能當成通過</b></article>
        <article><span>問題出在哪裡</span><b>點選差異後回到來源圖元</b></article>
      </div>
      <div class="ribbon-equation">
        <div><span>繪圖人員的結果</span><strong>施工架圖＋整理好的數量</strong></div><i>⇄</i>
        <div><span>外掛重新處理</span><strong>讀圖＋計算＋檢查</strong></div><i>→</i>
        <div><span>最後看到</span><strong>數量差異、圖面問題或資料不足</strong></div>
      </div>
      <details class="scheme1-section-detail-v33">
        <summary><span>展開查看</span><strong>為什麼使用 AutoCAD Managed .NET API、C# 與 WPF？</strong><b>＋</b></summary>
        <div><p>方案一需要讀取目前開啟的 DWG、建立自訂命令、取得圖元 Handle、顯示可停靠的比對面板、定位原始圖元並寫回稽核標記。因此採用 C#、AutoCAD Managed .NET API 與 WPF；共同核心維持為不依賴 AutoCAD UI 的 C# Class Library。</p></div>
      </details>
    </section>

    <section class="report-section" id="schemeOneUserFlow">
      <div class="report-section-head">
        <span>02 · 使用者操作流程</span>
        <h3>繪圖人員實際要做哪些動作？</h3>
      </div>
      <p class="report-copy">外掛安裝完成後，繪圖人員不用接觸程式碼。他照原本方式把圖畫好、把數量整理好，再按下檢查。兩邊數量不同或圖面有問題時，直接點選項目就能回到對應位置。</p>
      <div class="report-loop scheme1-user-loop-v33">
        <div><span>01</span><b>把施工架畫好並整理數量</b></div><i>→</i>
        <div><span>02</span><b>按下檢查</b></div><i>→</i>
        <div><span>03</span><b>查看兩邊數量和差異</b></div><i>→</i>
        <div><span>04</span><b>回到圖面修正</b></div><i>↺</i>
        <div><span>05</span><b>再檢查一次</b></div>
      </div>
      <div class="scheme1-screen-v33" aria-label="AutoCAD 方案一介面示意">
        <div class="scheme1-screen-v33__ribbon"><span>常用</span><span>插入</span><span>註解</span><span class="active">施工架工具</span><span>檢視</span></div>
        <div class="scheme1-screen-v33__body">
          <div class="scheme1-screen-v33__cad">
            <div class="scheme1-screen-v33__buttons"><button>施工架檢查</button><button>重新檢查</button><button>人工數量</button></div>
            <div class="scheme1-screen-v33__drawing"><span class="line l1"></span><span class="line l2"></span><span class="line l3"></span><span class="issue-dot"></span><small>目前 DWG 與差異來源</small></div>
          </div>
          <aside class="scheme1-screen-v33__panel">
            <span>施工架檢查結果</span>
            <strong>繪圖人員數量 128</strong>
            <div><b>外掛重算 126</b><small>相差 2</small></div>
            <ul><li>主架數量少 2</li><li>1 個轉角需要確認</li><li>1 個孤立圖元</li></ul>
            <button>定位差異位置</button>
          </aside>
        </div>
      </div>
      <div class="scheme1-core-boundary-v33"><strong>還要注意：</strong>就算兩邊數量一樣，也不能直接代表圖面沒有問題。外掛還會檢查轉角、短跨、孤立圖元，以及需要的資料是不是完整。</div>
    </section>

    <section class="report-section" id="schemeOneArchitecture">
      <div class="report-section-head">
        <span>03 · 系統架構與套件分工</span>
        <h3>外掛讀到圖面後，程式接下來怎麼算？</h3>
      </div>
      <p class="report-copy">外掛先把 AutoCAD 裡的線段、圖塊和數量資料讀出來，再交給共同核心處理。共同核心負責找出主架和架跨的關係、重新計算數量、比較兩邊結果，並檢查已知的圖面規則。</p>
      <div class="scheme1-architecture-v33">
        <article><span>01</span><h4>AutoCAD Host</h4><p>讀取目前 DWG，處理命令與 DocumentLock。</p></article><i>→</i>
        <article><span>02</span><h4>Input Adapter</h4><p>把 AutoCAD 圖元和人工數量轉成 Core 能處理的資料。</p></article><i>→</i>
        <article class="core"><span>03</span><h4>Scaffold.Domain／Core</h4><p>重建配置、計算數量、比對結果並檢查規則。</p></article><i>→</i>
        <article><span>04</span><h4>WPF ViewModel</h4><p>準備面板要顯示的數量、差異、異常和缺少資料。</p></article><i>→</i>
        <article><span>05</span><h4>Audit Writeback</h4><p>定位圖元、Highlight，並寫入檢查標記。</p></article>
      </div>
      <div class="scheme1-core-boundary-v33"><strong>三個方案怎麼共用：</strong>共同核心會先做在方案一裡。方案一能正常讀圖、計算和比對後，方案二再用同一套程式跑大量案例，確認規則在哪些情況有效。等規則穩定後，方案三才加入自動排列施工架的求解功能。<br><strong>工程分工：</strong><code>Scaffold.Batch</code> reference <code>Scaffold.Core</code>；Python／Colab只負責案例分析、統計和報告，不重寫正式規則。</div>
    </section>

    <section class="report-section scheme1-development-v33" id="schemeOneDevelopment">
      <div class="report-section-head">
        <span>04 · 從 0 到 1 的開發路徑</span>
        <h3>從外掛能執行，到真的能重新計算和找出差異。</h3>
      </div>
      <p class="report-copy">每一步只先確認一件事。特別是 STEP 03，要先證明共同核心真的能從圖面算出結果，不能讀完 DWG 後就直接把數字送到面板。</p>
      <div class="scheme1-dev-list-v33">${stepsMarkup}</div>
      <article class="scheme1-deploy-v33">
        <div><span>DEPLOY · 正式安裝</span><h4>六個步驟通過後，怎麼安裝到使用者的 AutoCAD？</h4></div>
        <p>開發期間使用 NETLOAD；正式部署改用 .bundle 與 PackageContents.xml。同一個安裝包可包含 net48 與 net8 Host，由 AutoCAD 依版本自動載入。</p>
        <div class="scheme1-pass-v33"><span>通過標準</span><strong>安裝一次後，所有支援版本都能載入正確 Host，並完成讀圖、人工數量取得、共同核心重算、比對、定位與重新驗證。</strong></div>
      </article>
    </section>

    <section class="report-section" id="schemeOneReportDemo">
      <div class="report-section-head">
        <span>05 · 第一版範圍與驗收方式</span>
        <h3>做到什麼，才算方案一真的能用？</h3>
      </div>
      <p class="report-copy">Demo 不能只展示按鈕和面板。它要證明外掛真的能讀到圖面和人工數量、自己再算一次，並在兩邊不同時找到問題位置。</p>
      <div class="scheme1-acceptance-v33">
        <article><span>DEMO 01</span><h4>圖面和人工數量都讀得到</h4><p>外掛能讀到施工架圖元，也能取得繪圖人員整理的數量。</p></article>
        <article><span>DEMO 02</span><h4>程式能自己再算一次</h4><p>共同核心從圖面重新算出數量，並列出和人工結果的差異。</p></article>
        <article><span>DEMO 03</span><h4>找到問題，修正後再檢查</h4><p>點擊差異可以回到圖面；修正後，數量和異常會重新更新。</p></article>
      </div>
      <div class="demo-frame report-demo-frame scheme1-demo-v33">
        <div class="demo-frame-icon">DEMO</div>
        <strong>方案一端到端 Demo</strong>
        <span>建議尺寸：16:9</span>
        <small>Human configuration + manual quantity → Read DWG → Rebuild topology → Recalculate → Compare → Locate → Fix → Check again</small>
      </div>
      <div class="scheme1-first-release-v33">
        <strong>第一版不包含：</strong>
        <span>從建築圖自動畫出施工架、替使用者決定未知工程條件，以及在沒有高度資料時估算完整立面總量。</span>
      </div>
      <div class="scheme1-boundary-v33"><strong>方案一不是幫使用者自動畫施工架。</strong><br>繪圖人員先把施工架畫好，也把數量整理好。外掛會重新讀圖、自己再算一次，確認兩邊有沒有差異。<br>發現漏算、重複計算或圖面異常時，使用者可以直接回到圖面修正，再按一次檢查。</div>
    </section>

    <footer class="dev-bottom-actions scheme1-bottom-v33">
      <button class="dev-back" id="closeDevBottom" type="button">← 返回方案一</button>
      <a href="#schemeOneTech">回到本頁開頭 ↑</a>
    </footer>
  `;

  function rebuildSchemeOne() {
    const overlay = document.querySelector('#devOverlay');
    const main = overlay?.querySelector('.dev-main.report-main');
    if (!main || main.dataset.integratedV35 === 'true') return;

    main.innerHTML = integratedMarkup;
    main.dataset.integratedV35 = 'true';

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
