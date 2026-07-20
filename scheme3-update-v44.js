// scheme3-update-v44
(() => {
  'use strict';

  const mainFlow = `
    <div><span>01</span><b>接收建築圖</b><small>建築圖、專案 Profile 與元件庫。</small></div>
    <i>→</i>
    <div><span>02</span><b>驗證資料可信度</b><small>不把圖層名稱直接當成外牆答案。</small></div>
    <i>→</i>
    <div><span>03</span><b>建立建築條件</b><small>外牆、開口、陽台、退縮與禁止區。</small></div>
    <i>→</i>
    <div><span>04</span><b>形成配置方案</b><small>系統在內部比較可能配置，最後依規則採用或停止。</small></div>
    <i>→</i>
    <div><span>05</span><b>驗證並重新計數</b><small>共同核心檢查合法性與數量。</small></div>
    <i>→</i>
    <div><span>06</span><b>AutonomyGate</b><small>決定能自動輸出、推薦或必須停下。</small></div>
    <i>→</i>
    <div><span>07</span><b>回饋方案二</b><small>保存結果、人工確認與未知案例。</small></div>
  `;

  const overlayMarkup = `
    <section class="dev-hero report-hero scheme3-v44-hero">
      <span class="dev-kicker">SCHEME 03 · 一般敘述</span>
      <h2 id="schemeThreeOverlayTitle">自主系統不是看到 CAD 就直接下答案。</h2>
      <p>建商只提供建築平面圖。方案三要把這張圖整理成可配置的建築條件，再依已確認的搭架法與元件庫，完成施工架配置、規則檢查與報價數量。資料不完整或互相矛盾時，系統必須說明原因並停下來。</p>
      <div class="scheme3-v44-boundary">
        <strong>這裡說的自主：</strong>
        <span>系統能自己讀圖、整理條件、配置、計算與回報；遇到未知或衝突時，也能自己判定「目前不能繼續」。</span>
        <small>自主不等於永遠自動。每一個自動結果都要留下輸入、規則、證據與停止原因。</small>
      </div>
    </section>

    <section class="report-section" id="schemeThreeAutonomy">
      <div class="report-section-head">
        <span>01 · 一般敘述</span>
        <h3>方案三要完成的是一整條工作閉環，不只是產生幾個方案</h3>
      </div>
      <p class="report-copy">建商給的是建築圖，不是已經排好的施工架。系統要自己完成從建築圖到報價數量的中間工作；但它不能把不確定的地方假設成正確。真正的自主，是知道什麼時候可以繼續，什麼時候必須停下。</p>

      <div class="scheme3-v44-autonomy-flow">
        <article><span>01 感知</span><strong>Observe</strong><small>讀取 CAD 圖元、文字、座標與外部設定。</small></article><i>→</i>
        <article><span>02 判斷</span><strong>Validate</strong><small>確認單位、幾何、拓撲與建築特徵是否可信。</small></article><i>→</i>
        <article><span>03 建模</span><strong>Model</strong><small>建立可供工程規則使用的建築條件模型。</small></article><i>→</i>
        <article><span>04 規劃</span><strong>Plan</strong><small>依搭架法與元件庫，在系統內部比較可行配置。</small></article><i>→</i>
        <article><span>05 驗證</span><strong>Verify</strong><small>重算數量、檢查限制、淘汰不合法配置。</small></article><i>→</i>
        <article><span>06 決策</span><strong>AutonomyGate</strong><small>自動計算、提出推薦、人工確認或停止。</small></article>
      </div>

      <div class="scheme3-v44-shared-flow">
        <article><span>方案一</span><strong>提供單張圖的稽核案例</strong><small>人工配置、程式重算、異常位置與修正結果。</small></article><i>→</i>
        <article><span>方案二</span><strong>驗證規則能用到哪裡</strong><small>批次案例、證據等級、未知範圍與回歸結果。</small></article><i>→</i>
        <article class="core"><span>方案三</span><strong>把已確認的規則用於自主配置</strong><small>採用合法配置、計算數量；不能確認時，清楚說明並停止。</small></article>
      </div>
    </section>

    <section class="report-section" id="schemeThreeInputs">
      <div class="report-section-head">
        <span>02 · 工程邏輯：輸入與驗證</span>
        <h3>先確認建築條件可信，才允許系統開始配置</h3>
      </div>
      <p class="report-copy">方案三的第一個風險不是求解器，而是建築圖的語意。圖層名稱可能錯、外牆可能斷線、陽台可能和標註線重疊。因此系統要把圖層、幾何連續性、拓撲關係、文字與尺寸當成不同證據，再決定建築條件是否可信。</p>

      <div class="scheme3-v44-input-grid">
        <article><span>建築圖</span><strong>原始 DWG／DXF</strong><small>外牆、柱、開口、陽台、退縮、障礙物與樓層資料的候選來源。</small></article>
        <article><span>工程 Profile</span><strong>搭架法＋元件庫</strong><small>傳統框式、系統式或其他指定方法，以及標準架跨、架深、短跨與特殊件。</small></article>
        <article><span>專案限制</span><strong>離牆距離＋禁止區</strong><small>出入口、保留空間、地面條件、施工範圍與現場限制。</small></article>
        <article><span>高度條件</span><strong>樓層／立面／剖面</strong><small>有足夠資料才計算垂直層數與完整總量，沒有就明確標記缺件。</small></article>
      </div>

      <div class="scheme3-v44-signal-flow">
        <article><span>訊號 A</span><strong>圖層候選</strong><small>只能提供可能的外牆或柱線，不能單獨決定語意。</small></article><i>＋</i>
        <article><span>訊號 B</span><strong>幾何與拓撲</strong><small>連續性、閉合性、相鄰關係與空間位置。</small></article><i>＋</i>
        <article><span>訊號 C</span><strong>文字與尺寸</strong><small>標註、圖塊屬性、樓層表與專案設定。</small></article><i>→</i>
        <article class="core"><span>形成條件</span><strong>BuildingFeatureEvidence</strong><small>每個外牆、開口、陽台與禁止區都帶信心、來源與衝突狀態。</small></article>
      </div>

      <div class="scheme3-v44-gate-grid">
        <article><span>GATE 01 · 可讀嗎？</span><strong>資料品質</strong><small>單位、座標、圖元、轉換與必要輸入不通過，就停止。</small></article>
        <article><span>GATE 02 · 看懂嗎？</span><strong>條件可信度</strong><small>訊號互相衝突時，不把外牆或開口硬判成確定答案。</small></article>
        <article><span>GATE 03 · 能配置嗎？</span><strong>規格完整度</strong><small>搭架法、元件模數、離牆距離與禁止區不足，就不能求解。</small></article>
        <article class="core"><span>GATE 04 · 能自主到哪裡？</span><strong>AutonomyGate</strong><small>決定輸出水平配置、完整數量、推薦方案、人工確認或停止。</small></article>
      </div>
    </section>

    <section class="report-section" id="schemeThreePipeline">
      <div class="report-section-head">
        <span>03 · 工程邏輯：決策管線</span>
        <h3>求解器只處理已經翻譯成約束的工程條件</h3>
      </div>
      <p class="report-copy">CP-SAT、啟發式或其他求解器都不會替我們理解 DWG 裡哪條線是牆。它們接收的是變數、候選位置、硬性限制與評分目標。因此建築條件模型和約束模型，比選哪一個求解器更早、更重要。</p>

      <div class="scheme3-v44-pipeline">
        <article><span>01</span><strong>CAD Adapter</strong><small>DWG／DXF → CadEntitySnapshot</small></article><i>→</i>
        <article><span>02</span><strong>BuildingFeatureResolver</strong><small>幾何、拓撲與文字 → 建築條件</small></article><i>→</i>
        <article class="core"><span>03</span><strong>ConstraintModelBuilder</strong><small>條件 → 變數、硬性約束與評分目標</small></article><i>→</i>
        <article><span>04</span><strong>LayoutSolver</strong><small>規則式／啟發式／CP-SAT，依本案評估</small></article><i>→</i>
        <article><span>05</span><strong>Shared Core Validator</strong><small>合法性、數量與結果證據</small></article>
      </div>

      <div class="scheme3-v44-model-note"><span>程式邏輯邊界</span><strong>CAD圖元 ≠ 工程條件 ≠ 求解變數</strong><p>只有完成語意解析與工程建模，才會進入 LayoutSolver。求解器不能越過前面的資料可信度閘門，也不負責判斷哪條線是外牆。</p></div>

      <div class="scheme3-v44-package-grid">
        <article><span>共同工程核心</span><strong>C# Domain／Core</strong><small>施工架元件、配置、數量與規則驗證的正式來源。</small></article>
        <article><span>幾何與空間</span><strong>NetTopologySuite／STRtree</strong><small>輪廓、鄰近、碰撞候選與空間索引；不負責工程語意。</small></article>
        <article><span>候選求解</span><strong>OR-Tools CP-SAT（後置）</strong><small>將離散化變數與整數約束交給求解器；模型未穩定前不先導入。</small></article>
        <article><span>資料與版本</span><strong>SQLite／JSON／Result DXF</strong><small>保存輸入、候選、規則版本、數量與 AutonomyGate 結果。</small></article>
        <article><span>人工檢視</span><strong>Web UI／WPF／Babylon.js</strong><small>呈現候選與差異，幫助確認，不取代工程決策。</small></article>
        <article><span>AI協助</span><strong>特徵候選與排序</strong><small>可協助模糊案例，但不能越過信心門檻直接改寫硬性規則。</small></article>
      </div>
    </section>

    <section class="report-section" id="schemeThreeCandidates">
      <div class="report-section-head">
        <span>04 · 工程邏輯：配置與數量</span>
        <h3>先形成施工架配置，再計算報價需要的數量</h3>
      </div>
      <p class="report-copy">系統不能用「建築周長 ÷ 某個尺寸」直接當答案。它要先依本案搭架法與元件庫，決定架列起點、完整架跨、不足尺寸、轉角、開口與特殊件，再把已確認的配置轉成主架、架跨與其他報價項目。</p>

      <div class="scheme3-v44-component-flow">
        <article><span>元件庫</span><strong>標準架跨與架深</strong><small>183、182、181、180 或其他核准尺寸，由本案 Profile 決定，不在程式裡寫死。</small></article><i>→</i>
        <article><span>配置規則</span><strong>完整優先＋起點策略</strong><small>依柱線、外側到內側、轉角與開口形成可行架列。</small></article><i>→</i>
        <article><span>特殊處理</span><strong>不足尺寸與禁止區</strong><small>短跨、移動起點、中斷或特殊件都要留下工程理由。</small></article><i>→</i>
        <article class="core"><span>數量輸出</span><strong>QuantityCalculator</strong><small>先有 CandidateScaffoldLayout，才計算可追溯的報價數量。</small></article>
      </div>

      <div class="scheme3-v44-candidate-flow">
        <article><span>內部計算 A</span><strong>完整架跨優先</strong><small>先檢查數量，再檢查轉角與禁止區。</small></article><i>→</i>
        <article><span>內部計算 B</span><strong>起點調整</strong><small>比較短跨、特殊件與施工限制的差異。</small></article><i>→</i>
        <article><span>內部計算 C</span><strong>分段配置</strong><small>避開開口與突出物，重新計算架列。</small></article><i>→</i>
        <article class="core"><span>系統判定</span><strong>採用、推薦或停止</strong><small>候選只在系統內部比較，不把未判定的選擇丟給人工猜。</small></article>
      </div>

      <div class="scheme3-v44-table">
        <div class="head"><span>內部配置</span><span>完整架跨</span><span>短跨</span><span>主架</span><span>特殊件</span><span>系統判定</span></div>
        <div><b>A</b><span>86</span><span>4</span><span>97</span><span>4</span><strong>需確認轉角</strong></div>
        <div><b>B</b><span>84</span><span>2</span><span>95</span><span>2</span><strong>可自動採用</strong></div>
        <div><b>C</b><span>81</span><span>8</span><span>93</span><span>7</span><strong>淘汰：施工性</strong></div>
      </div>
    </section>

    <section class="report-section" id="schemeThreeAutonomyGate">
      <div class="report-section-head">
        <span>05 · 一般敘述＋工程邊界</span>
        <h3>AutonomyGate 決定系統可以自己做到哪裡</h3>
      </div>
      <p class="report-copy">自主系統不應只有「成功／失敗」兩種結果。它要把目前的資料、規則與候選狀態轉成可理解的輸出層級，讓使用者知道這次是可以自動計算，還是只能提出候選。</p>

      <div class="scheme3-v44-autonomy-levels">
        <article><span>LEVEL 0 · STOP</span><strong>停止</strong><small>圖面不可讀、必要資料缺漏或語意衝突，不能進入配置。</small></article>
        <article><span>LEVEL 1 · HORIZONTAL</span><strong>只輸出水平候選</strong><small>平面條件可信，但高度或立面資料不足。</small></article>
        <article><span>LEVEL 2 · QUANTITY</span><strong>自動計算候選數量</strong><small>配置與元件規格通過驗證，可輸出數量與依據。</small></article>
        <article><span>LEVEL 3 · RECOMMEND</span><strong>提出推薦方案</strong><small>多個合法候選經比較後，仍保留人工核准。</small></article>
        <article class="core"><span>LEVEL 4 · HUMAN CONFIRMED</span><strong>確認後回饋</strong><small>核准、調整與退回原因回送方案二，成為下一輪驗證資料。</small></article>
      </div>

      <div class="scheme3-v44-responsibility-grid">
        <article><span>系統自主</span><strong>讀取、驗證、建模、產生候選、計數、比較與回報停止原因。</strong></article>
        <article><span>工程規則</span><strong>定義搭架法、元件能力、硬性限制、數量關係與合法性。</strong></article>
        <article><span>專業人員</span><strong>確認現場條件、安全、施工順序與最終採用配置。</strong></article>
      </div>
    </section>

    <section class="report-section" id="schemeThreeReportDemo">
      <div class="report-section-head">
        <span>06 · 工程路徑：從 0 到 1</span>
        <h3>先建立能停下來的自主系統，再逐步放大自動化</h3>
      </div>
      <p class="report-copy">第一版不從「所有建築圖都能自動配置」開始，而是選定一個搭架法、一套元件庫與少量建築條件，完整跑通感知、閘門、候選、數量、確認與回饋。</p>

      <div class="scheme3-v44-mvp">
        <article><span>01 · Profile</span><strong>鎖定搭架法與元件庫</strong><small>先確認標準尺寸、短跨政策、轉角件與計數項目。</small></article>
        <article><span>02 · Observe</span><strong>完成建築條件驗證</strong><small>先處理簡單輪廓，再加入開口、陽台與禁止區。</small></article>
        <article><span>03 · Plan</span><strong>不用求解器先做候選</strong><small>用明確規則產生少量可解釋配置，驗證數量閉環。</small></article>
        <article><span>04 · Solve</span><strong>再導入候選求解</strong><small>條件離散化後，評估啟發式與 CP-SAT 的適用範圍。</small></article>
        <article><span>05 · Gate</span><strong>建立自主輸出層級</strong><small>自動計算、推薦、人工確認與停止都要有明確理由。</small></article>
        <article><span>06 · Feedback</span><strong>回送方案二回歸</strong><small>把核准、退回、未知與退步案例納入規則邊界。</small></article>
      </div>

      <div class="scheme3-v44-boundary-grid">
        <article><span>方案三會做</span><strong>從建築圖建立可驗證的施工架候選，計算數量，說明候選差異與自主程度。</strong></article>
        <article><span>方案三不會做</span><strong>不把圖層當真值、不在缺資料時自行補造條件、不輸出沒有依據的唯一答案。</strong></article>
        <article><span>最終成果</span><strong>一個能觀察、判斷、配置、驗證、計數、停下與回饋的自主工程系統。</strong></article>
      </div>
    </section>

    <footer class="dev-footer scheme3-v44-footer">
      <button id="closeSchemeThreeBottom" type="button">← 返回方案三主畫面</button>
      <p>方案三不是把人拿掉，而是把可形式化的工程工作交給系統，並讓不能確定的地方被明確看見。</p>
    </footer>
  `;

  function updateMainScheme() {
    const scheme = document.querySelector('.scheme-three');
    if (!scheme || scheme.dataset.scheme3V44 === 'true') return;

    const heading = scheme.querySelector('.scheme-heading');
    const title = heading?.querySelector('h3');
    const description = heading?.querySelector('p');
    const coreLabel = heading?.querySelector('.scheme-core span');
    const coreText = heading?.querySelector('.scheme-core strong');
    const flow = scheme.querySelector('.scheme-operation-flow');
    const action = scheme.querySelector('.flow-card-action span');

    if (title) title.textContent = '自主施工架配置系統';
    if (description) description.textContent = '從建商建築圖開始，系統自己驗證建築條件、產生施工架候選、重新計算數量，並由 AutonomyGate 決定能否自動輸出。';
    if (coreLabel) coreLabel.textContent = '方案三的核心價值';
    if (coreText) coreText.textContent = '讓系統能自主配置，也能在不確定時自己停下來。';
    if (action) action.textContent = '展開查看：自主閉環、輸入閘門、候選求解與 0-1 路徑';

    if (flow) {
      flow.innerHTML = mainFlow;
      flow.classList.add('scheme3-v44-main-flow');
      if (flow.parentElement?.classList.contains('scheme-flow-card')) {
        heading?.insertAdjacentElement('afterend', flow);
      }
    }

    scheme.dataset.scheme3V44 = 'true';
  }

  function rebuildOverlay() {
    const overlay = document.querySelector('#schemeThreeOverlay');
    const main = overlay?.querySelector('.dev-main.report-main');
    if (!main || main.dataset.scheme3V44 === 'true') return;

    main.innerHTML = overlayMarkup;
    main.dataset.scheme3V44 = 'true';
    document.getElementById('closeSchemeThreeBottom')?.addEventListener('click', () => {
      document.getElementById('closeSchemeThree')?.click();
    });
  }

  function boot() {
    updateMainScheme();
    rebuildOverlay();
    window.setTimeout(() => { updateMainScheme(); rebuildOverlay(); }, 250);
    window.setTimeout(() => { updateMainScheme(); rebuildOverlay(); }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();