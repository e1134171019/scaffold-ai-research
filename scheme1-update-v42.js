// scheme1-update-v42
(() => {
  'use strict';

  const mainFlow = `
    <div><span>01</span><b>收到建商建築圖</b><small>先確認搭架法、元件庫與工程設定。</small></div>
    <i>→</i>
    <div><span>02</span><b>繪圖人員排列施工架</b><small>依柱線、外側到內側與完整優先配置。</small></div>
    <i>→</i>
    <div><span>03</span><b>外掛掃描整張 DWG</b><small>不把圖層名稱當成答案。</small></div>
    <i>→</i>
    <div><span>04</span><b>建立配置單元</b><small>從幾何、拓撲與空間關係重建。</small></div>
    <i>→</i>
    <div><span>05</span><b>依規則重新計算</b><small>完整架、短跨、寬度與內外架分開計算。</small></div>
    <i>→</i>
    <div><span>06</span><b>交叉驗證並定位</b><small>把差異、衝突與未知回到來源圖元。</small></div>
    <i>→</i>
    <div><span>07</span><b>修正後重新檢查</b><small>以目前 DWG 重新建立結果。</small></div>
  `;

  const overlayMarkup = `
    <section class="dev-hero report-hero scheme1-v42-hero">
      <span class="dev-kicker">SCHEME 01 · AUTOCAD NATIVE AUDIT PLUG-IN</span>
      <h2 id="devOverlayTitle">人先配置，程式依規則重新驗證。</h2>
      <p>繪圖人員收到建商建築圖後，先依指定搭架法與元件庫排列施工架。外掛不直接相信圖層名稱，也不直接接受人工整理的總數，而是重新讀取目前 DWG，建立可計價的配置單元，再依工程規則重算。</p>
      <div class="scheme1-v42-boundary">
        <strong>方案一的邊界</strong>
        <span>第一版不是從空白建築圖自動畫出完整施工架；它先驗證人工配置是否符合目前的搭架法、元件規格與數量規則。自主產生候選配置屬於方案三。</span>
      </div>
    </section>

    <section class="report-section" id="schemeOneUserFlow">
      <div class="report-section-head">
        <span>01 · 使用者看見的流程</span>
        <h3>繪圖人員仍照原本方式工作</h3>
      </div>
      <p class="report-copy">外掛的目的不是改掉繪圖員的工作方式，而是在原本的 AutoCAD 流程中多一個可重複執行的檢查。程式會自己重新計算，讓人工結果與程式結果可以比較。</p>
      <div class="report-loop scheme1-v42-loop">
        <div><span>01</span><b>選定搭架法與元件庫</b></div><i>→</i>
        <div><span>02</span><b>完成施工架配置</b></div><i>→</i>
        <div><span>03</span><b>按下 SCAFFOLD_AUDIT</b></div><i>→</i>
        <div><span>04</span><b>查看數量與衝突</b></div><i>→</i>
        <div><span>05</span><b>定位、修正、確認</b></div><i>↺</i>
        <div><span>06</span><b>重新讀取目前 DWG</b></div>
      </div>
      <div class="scheme1-v42-result-grid">
        <article><span>使用者看到</span><strong>人工數量、程式重算、差異與異常位置</strong></article>
        <article><span>程式不會省略</span><strong>未知圖元、圖層衝突、未閉合配置與資料不足</strong></article>
      </div>
    </section>

    <section class="report-section" id="schemeOneCrossValidation">
      <div class="report-section-head">
        <span>02 · 交叉驗證</span>
        <h3>圖層只是候選，正確性要靠多個來源一起確認</h3>
      </div>
      <p class="report-copy">如果圖層設定錯誤，程式不能只讀指定圖層。它要先掃描整張圖，再把圖層、幾何、拓撲、原始建築參考與元件規則放在一起比較。</p>
      <div class="scheme1-v42-cross-flow">
        <article><span>輸入 A</span><strong>建商原始建築參考</strong><small>輪廓、柱線、開口、陽台、退縮與可搭設邊界。</small></article>
        <i>＋</i>
        <article><span>輸入 B</span><strong>目前 DWG 全圖掃描</strong><small>所有相關圖元、圖層來源、Block、文字、座標與 Handle。</small></article>
        <i>＋</i>
        <article><span>輸入 C</span><strong>搭架法與元件庫</strong><small>標準長度、寬度、短跨與計價規則。</small></article>
        <i>→</i>
        <article class="core"><span>驗證結果</span><strong>確認、衝突、未知或人工複核</strong><small>沒有足夠證據時，不產生靜默的零。</small></article>
      </div>
      <div class="scheme1-v42-check-grid">
        <article><b>建築輪廓</b><span>閉合、連續、包覆柱群與建築內容，並和原始建築參考比對。</span></article>
        <article><b>施工架配置</b><span>靠近建築外側、沿邊界排列、符合柱線起點與搭架方向。</span></article>
        <article><b>完整架與短跨</b><span>實際長度對照 Profile；短跨可計一塊，但保留實際尺寸與證據。</span></article>
        <article><b>圖層一致性</b><span>檢查圖層內容純度、跨圖層重複、混合圖元與漏讀候選。</span></article>
      </div>
    </section>

    <section class="report-section" id="schemeOneArchitecture">
      <div class="report-section-head">
        <span>03 · 工程／程式架構</span>
        <h3>套件只處理底層能力，工程語意由共同核心負責</h3>
      </div>
      <p class="report-copy">以下是程式內部的分工。C#、AutoCAD API 與幾何套件負責取得和整理資料；施工架元件、配置單元、交叉驗證與數量計算則是本研究自行建立的工程核心。</p>
      <div class="scheme1-v42-architecture">
        <article><span>01 · Host</span><strong>C# + AutoCAD Managed .NET API</strong><small>Ribbon、SCAFFOLD_AUDIT、Transaction、DocumentLock 與目前 DWG。</small></article>
        <i>→</i>
        <article><span>02 · Input</span><strong>EntityInventory + CAD 中介模型</strong><small>全圖掃描圖元、Block、文字、座標、圖層來源與 Handle。</small></article>
        <i>→</i>
        <article><span>03 · Geometry</span><strong>NetTopologySuite STRtree</strong><small>空間查詢、鄰近、交集、線段分群與幾何關係。</small></article>
        <i>→</i>
        <article><span>04 · Core</span><strong>自建拓撲與配置單元核心</strong><small>BuildingReference、ScaffoldProfile、RuleValidator、QuantityCalculator。</small></article>
        <i>→</i>
        <article><span>05 · UI</span><strong>WPF PaletteSet + AuditResult</strong><small>數量、證據、差異、定位、Highlight 與人工確認。</small></article>
      </div>
      <div class="scheme1-v42-package-grid">
        <article><span>幾何工具</span><strong>NetTopologySuite</strong><small>STRtree、LineMerger 與幾何運算；不能替我們判斷工程語意。</small></article>
        <article><span>邊界運算</span><strong>Clipper2（必要時）</strong><small>Union、Difference、Offset；不是施工架辨識器。</small></article>
        <article><span>資料保存</span><strong>SQLite / JSON</strong><small>元件庫、案例、規則版本、Evidence 與人工確認結果。</small></article>
        <article><span>後期才加入</span><strong>OR-Tools / CP-SAT</strong><small>方案三的候選配置求解；方案一初期不需要。</small></article>
      </div>
    </section>

    <section class="report-section" id="schemeOneSharedCore">
      <div class="report-section-head">
        <span>04 · 三方案共用的資料</span>
        <h3>方案一不是終點，而是自主系統的資料入口</h3>
      </div>
      <p class="report-copy">方案一每次驗證都會留下原始圖面、建築特徵、施工架配置、人工修正、規則版本與結果狀態。方案二用這些資料做批次回歸；方案三再使用已確認的建築特徵、元件與限制條件產生候選配置。</p>
      <div class="scheme1-v42-shared-flow">
        <article><span>方案一</span><strong>人工配置＋現場稽核</strong><small>產生可追溯、可複核的案例。</small></article><i>→</i>
        <article><span>方案二</span><strong>大量案例＋規則回歸</strong><small>找出覆蓋率、衝突與未知範圍。</small></article><i>→</i>
        <article><span>方案三</span><strong>建築條件＋候選配置</strong><small>用已確認的約束產生多個方案。</small></article>
      </div>
      <div class="scheme1-v42-boundary"><strong>資料品質規則</strong><span>人工畫出的結果先是 Observed Layout，不直接當成正確答案；只有完成確認的案例，才可以進入規則回歸與自主配置資料。</span></div>
    </section>

    <section class="report-section scheme1-development-v42" id="schemeOneDevelopment">
      <div class="report-section-head">
        <span>05 · 0 到 1 的第一版</span>
        <h3>先證明一張真實圖能被完整驗證</h3>
      </div>
      <div class="scheme1-v42-mvp">
        <article><span>STEP 01</span><strong>外掛能載入</strong><small>NETLOAD、版本 Host、SCAFFOLD_AUDIT。</small></article>
        <article><span>STEP 02</span><strong>全圖能讀取</strong><small>不依賴單一圖層，保存 EntitySnapshot 與 Handle。</small></article>
        <article><span>STEP 03</span><strong>配置單元能建立</strong><small>建立輪廓、柱線、主架、完整架與短跨候選。</small></article>
        <article><span>STEP 04</span><strong>規則能重算</strong><small>輸出數量、證據、未知、衝突與差異。</small></article>
        <article><span>STEP 05</span><strong>能回圖修正</strong><small>定位、Highlight、人工修正、重新讀取。</small></article>
      </div>
      <div class="scheme1-v42-boundary"><strong>第一版不承諾：</strong><span>不從空白建築圖直接產生唯一施工架答案，也不在圖層錯誤或參考資料不足時假裝得到完整正確數量。</span></div>
    </section>

    <footer class="dev-bottom-actions scheme1-v42-footer">
      <button class="dev-back" id="closeDevBottom" type="button">← 返回方案一</button>
      <a href="#schemeOneUserFlow">回到本頁開頭 ↑</a>
    </footer>
  `;

  function updateMainCard() {
    const scheme = document.querySelector('.scheme-one');
    if (!scheme || scheme.dataset.scheme1V42 === 'true') return;

    const heading = scheme.querySelector('.scheme-heading');
    const title = heading?.querySelector('h3');
    const description = heading?.querySelector('div:first-child > p');
    const coreLabel = heading?.querySelector('.scheme-core span');
    const coreText = heading?.querySelector('.scheme-core strong');
    const flow = scheme.querySelector('.scheme-operation-flow');
    const action = scheme.querySelector('.flow-card-action span');
    const bottom = scheme.querySelector('.flow-card-bottom span');

    if (title) title.textContent = 'AutoCAD 現場外掛：人工配置的規則稽核';
    if (description) description.textContent = '繪圖人員先依建商建築圖、搭架法與元件庫排列施工架；外掛再掃描整張 DWG，重建配置單元、交叉驗證並重新計算數量。';
    if (coreLabel) coreLabel.textContent = '方案一的原則';
    if (coreText) coreText.textContent = '不以圖層或人工總數作為答案，程式自己重算並留下證據。';
    if (flow) flow.innerHTML = mainFlow;
    if (action) action.textContent = '點擊查看使用流程、交叉驗證與工程架構';
    if (bottom) bottom.textContent = '先看現場工作，再展開工程／程式邏輯與套件分工。';

    if (!scheme.querySelector('.scheme1-v42-package-note')) {
      const note = document.createElement('div');
      note.className = 'scheme1-v42-package-note';
      note.innerHTML = '<span>工程實作配置</span><strong>C# ＋ AutoCAD Managed .NET API ＋ 幾何／空間工具 ＋ 自建工程核心</strong><small>套件只處理底層幾何與資料存取；圖層驗證、配置單元與數量規則由共同核心負責。</small>';
      scheme.appendChild(note);
    }
    scheme.dataset.scheme1V42 = 'true';
  }

  function updateOverlay() {
    const main = document.querySelector('#devOverlay .dev-main.report-main');
    if (!main || main.dataset.scheme1V42 === 'true') return;
    main.innerHTML = overlayMarkup;
    main.dataset.scheme1V42 = 'true';
    document.getElementById('closeDevBottom')?.addEventListener('click', () => {
      document.getElementById('closeDevDetail')?.click();
    });
  }

  function boot() {
    updateMainCard();
    updateOverlay();
    window.setTimeout(() => { updateMainCard(); updateOverlay(); }, 250);
    window.setTimeout(() => { updateMainCard(); updateOverlay(); }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

