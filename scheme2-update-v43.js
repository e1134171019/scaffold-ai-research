// scheme2-update-v43
(() => {
  'use strict';

  const mainFlow = `
    <div><span>01</span><b>收集可用案例</b><small>歷史圖、方案一稽核結果與專案設定。</small></div>
    <i>→</i>
    <div><span>02</span><b>保存原檔與證據</b><small>先記錄來源、版本、雜湊與證據等級。</small></div>
    <i>→</i>
    <div><span>03</span><b>轉換並讀取</b><small>DWG／DXF 進入同一個 CAD 資料格式。</small></div>
    <i>→</i>
    <div><span>04</span><b>呼叫共同核心</b><small>不在批次程式另寫一套施工架規則。</small></div>
    <i>→</i>
    <div><span>05</span><b>分類結果</b><small>通過、衝突、未知、失敗與需確認。</small></div>
    <i>→</i>
    <div><span>06</span><b>人工確認</b><small>把觀察資料和工程判斷分開保存。</small></div>
    <i>→</i>
    <div><span>07</span><b>規則回歸</b><small>規則修改後重新跑同一批案例。</small></div>
  `;

  const overlayMarkup = `
    <section class="dev-hero report-hero scheme2-v43-hero">
      <span class="dev-kicker">SCHEME 02 · OFFLINE RULE BOUNDARY VALIDATION</span>
      <h2 id="schemeTwoOverlayTitle">方案二不是找一個「正確答案」，<br>而是找出規則什麼時候可信。</h2>
      <p>方案一讓我們看見一張圖的配置和計算有沒有問題。方案二再把同一套核心放到大量歷史圖面上，確認規則在哪些情況能運作、在哪些情況會衝突、失效或根本沒有資料可以判斷。</p>
      <div class="scheme2-v43-boundary">
        <strong>這一階段要證明：</strong>
        <span>同一批圖面、同一個規則版本，能夠重複得到同樣結果，而且每個結果都找得到來源和判斷依據。</span>
        <small>歷史人工圖面是觀察資料，不直接等於工程真值。</small>
      </div>
    </section>

    <section class="report-section" id="schemeTwoRole">
      <div class="report-section-head">
        <span>01 · 方案定位</span>
        <h3>方案二要回答的，不是「這張圖像不像」，而是「規則能用到哪裡」</h3>
      </div>
      <p class="report-copy">歷史圖面裡可能有正確配置，也可能有漏畫、誤畫、圖層設定錯誤或人工數量錯誤。因此不能把過去畫過的圖直接拿來訓練程式。方案二的任務，是把圖面、程式結果與專業確認分開保存，再統計規則的適用範圍。</p>

      <div class="scheme2-v43-purpose-grid">
        <article><span>方案一提供</span><strong>可追溯的單張案例</strong><small>原始圖元、程式重算、異常位置、人工修正與結果狀態。</small></article>
        <article class="selected"><span>方案二建立</span><strong>可重跑的案例與邊界</strong><small>批次執行、結果分類、人工確認、規則版本與回歸比較。</small></article>
        <article><span>方案三需要</span><strong>已驗證的規則資料</strong><small>元件、限制、已知特徵與未知條件，才可以進入配置求解。</small></article>
      </div>

      <div class="scheme2-v43-opening-flow">
        <article><span>01 輸入</span><strong>歷史圖面＋方案一案例</strong><small>不同客戶、年份、繪圖員與圖面格式。</small></article><i>→</i>
        <article><span>02 先驗證</span><strong>來源、格式與證據</strong><small>檔案身分、單位、轉換差異與資料缺口。</small></article><i>→</i>
        <article class="core"><span>03 同一核心</span><strong>Scaffold.Core</strong><small>標準化、語意候選、配置重建、數量與規則檢查。</small></article><i>→</i>
        <article><span>04 分類</span><strong>通過／衝突／未知／失敗</strong><small>不把未確認案例混進通過率。</small></article><i>→</i>
        <article><span>05 累積</span><strong>案例庫＋規則回歸</strong><small>把結果交給後續規則修正與方案三。</small></article>
      </div>
    </section>

    <section class="report-section" id="schemeTwoEvidence">
      <div class="report-section-head">
        <span>02 · 證據與真值邊界</span>
        <h3>歷史圖面有用，但不能直接當成答案</h3>
      </div>
      <p class="report-copy">程式可以觀察過去的配置習慣，卻不能因為某個做法出現很多次，就直接宣告它是正確規則。每個案例要標記它是規格條件、已確認資料、人工觀察，還是目前無法判斷。</p>

      <div class="scheme2-v43-evidence-grid">
        <article><span>A · 硬條件</span><strong>規範、產品規格、專案已確認條件</strong><small>可作為規則限制，但仍要記錄來源與版本。</small></article>
        <article><span>B · 核准資料</span><strong>專業人員確認的配置或數量</strong><small>可作為測試基準，但要保留確認人與理由。</small></article>
        <article class="observed"><span>C · 觀察資料</span><strong>歷史人工圖面與原始數量</strong><small>只能說明過去怎麼畫，不能直接代表畫得正確。</small></article>
        <article class="unknown"><span>D · 不確定</span><strong>衝突、缺漏、未分類與轉換失敗</strong><small>不能硬塞進通過案例，必須進入人工佇列。</small></article>
      </div>

      <div class="scheme2-v43-warning"><strong>真正的防錯點：</strong><span>程式結果、人工原始標註與專業確認答案要分欄保存。沒有確認的歷史圖，不能被當成 Ground Truth。</span></div>

      <div class="scheme2-v43-result-grid">
        <article><b>PASS</b><strong>規則通過</strong><small>資料品質足夠、規則不衝突，且案例在已知邊界內。</small></article>
        <article><b>CONFLICT</b><strong>訊號互相矛盾</strong><small>圖層、幾何、文字或人工結果無法互相支持。</small></article>
        <article><b>UNKNOWN</b><strong>目前不知道</strong><small>新特徵、缺資料或信心不足，保留人工確認。</small></article>
        <article><b>FAILED</b><strong>資料讀不出來</strong><small>檔案損壞、轉換失敗或格式超出目前支援範圍。</small></article>
      </div>
    </section>

    <section class="report-section" id="schemeTwoUserFlow">
      <div class="report-section-head">
        <span>03 · 批次操作流程</span>
        <h3>操作人員不是逐張重算，而是處理需要判斷的案例</h3>
      </div>
      <p class="report-copy">批次程式先處理可以自動完成的工作：保存檔案身分、讀取 CAD、呼叫共同核心、整理數量差異與分類結果。人員集中處理未知、衝突與需要工程確認的案例。</p>

      <div class="scheme2-v43-batch-flow">
        <div><span>01</span><b>選擇資料夾</b><small>指定本次案例範圍。</small></div><i>→</i>
        <div><span>02</span><b>保存原檔證據</b><small>檔名、版本、雜湊與來源。</small></div><i>→</i>
        <div><span>03</span><b>轉換／解析</b><small>建立統一 CAD 快照。</small></div><i>→</i>
        <div><span>04</span><b>執行共同核心</b><small>重新辨識、重建與計算。</small></div><i>→</i>
        <div><span>05</span><b>篩選結果</b><small>通過、衝突、未知、失敗。</small></div><i>→</i>
        <div><span>06</span><b>人工確認</b><small>補上工程理由與證據。</small></div><i>→</i>
        <div><span>07</span><b>保存並回歸</b><small>規則更新後重新執行。</small></div>
      </div>

      <div class="scheme2-v43-batch-screen">
        <header><strong>Scaffold Rule Boundary Runner</strong><span>規則版本：R-0.3.2</span><button>開始批次檢查</button></header>
        <div class="scheme2-v43-batch-screen-body">
          <aside><span>本次案例</span><b>100 張</b><span>已完成</span><b>82 張</b><span>待人工確認</span><b>13 張</b><span>讀取失敗</span><b>5 張</b></aside>
          <main>
            <div class="scheme2-v43-table-head"><span>案例</span><span>輸入</span><span>核心結果</span><span>證據</span><span>下一步</span></div>
            <div><span>A001.dxf</span><span>已解析</span><span>數量差異 0</span><span>B／C</span><strong>通過</strong></div>
            <div><span>A002.dwg</span><span>轉換成功</span><span>圖層與幾何衝突</span><span>C／D</span><strong>人工確認</strong></div>
            <div><span>A003.dxf</span><span>已解析</span><span>新型轉角</span><span>D</span><strong>未知案例</strong></div>
          </main>
        </div>
      </div>
    </section>

    <section class="report-section" id="schemeTwoArchitecture">
      <div class="report-section-head">
        <span>04 · 程式內部架構</span>
        <h3>批次外殼可以換，正式工程規則不能分裂</h3>
      </div>
      <p class="report-copy">方案二不使用 AutoCAD 的 Document、Database 或 Ribbon。它只更換輸入與批次控制方式；不論資料從 DXF 讀入，還是由 DWG 讀取／轉換工具取得，最後都必須轉成同一個 <code>CadEntitySnapshot</code>，再交給 C# 共同核心。</p>

      <div class="scheme2-v43-architecture">
        <article><span>輸入 A</span><strong>DXF → ezdxf</strong><small>讀取 DXF 圖元、圖層、圖塊、文字與幾何，轉成快照。</small></article><i>↘</i>
        <article><span>輸入 B</span><strong>DWG → 讀取／轉換層</strong><small>ODA、RealDWG 或既有 AutoCAD pipeline 需依授權與版本評估。</small></article><i>↙</i>
        <article class="core"><span>共同資料邊界</span><strong>CadEntitySnapshot</strong><small>來源、單位、座標、圖元、Handle、解析狀態與轉換證據。</small></article><i>→</i>
        <article><span>正式規則</span><strong>Scaffold.Core · C#</strong><small>標準化、空間索引、配置重建、數量計算與規則驗證。</small></article><i>→</i>
        <article><span>批次結果</span><strong>Metrics＋Case Store</strong><small>覆蓋、衝突、未知、回歸差異與人工確認。</small></article>
      </div>

      <div class="scheme2-v43-package-grid">
        <article><span>正式工程核心</span><strong>C# Class Library</strong><small>方案一、二共用；批次程式不重新寫施工架規則。</small></article>
        <article><span>DXF 輸入</span><strong>ezdxf</strong><small>只負責 DXF 讀取與快照建立，不代表能直接讀 DWG。</small></article>
        <article><span>空間處理</span><strong>NetTopologySuite／STRtree</strong><small>做包圍盒查詢、鄰近搜尋與空間候選縮小。</small></article>
        <article><span>批次分析</span><strong>Python Runner＋統計工具</strong><small>負責排程、彙整與報告，不成為第二套規則核心。</small></article>
        <article><span>案例保存</span><strong>SQLite＋JSON／原檔雜湊</strong><small>保存來源、執行、證據、人工確認與規則版本。</small></article>
        <article><span>介面與分群</span><strong>先 CLI／報表，後 PySide6／聚類</strong><small>介面與未知案例分群是後續工具，不是第一個核心依賴。</small></article>
      </div>
      <div class="scheme2-v43-package-note"><span>工程設計原則</span><strong>C# 是正式規則的唯一來源；Python 是批次控制與統計工具。</strong><small>這樣方案一在 AutoCAD、方案二在離線批次、方案三在候選求解時，才不會各自算出不同答案。</small></div>
    </section>

    <section class="report-section" id="schemeTwoDatabase">
      <div class="report-section-head">
        <span>05 · 案例庫與規則回歸</span>
        <h3>每次修改規則，都要知道哪些案例變好、哪些案例變壞</h3>
      </div>
      <p class="report-copy">方案二真正累積的是可重跑的工程案例，不是單次報表。每個案例都要保留原始檔案識別、解析狀態、共同核心結果、人工觀察、專業確認與規則版本。</p>

      <div class="scheme2-v43-records">
        <article><span>DrawingIdentity</span><strong>原檔與來源</strong><small>路徑、版本、雜湊、格式與客戶／專案。</small></article>
        <article><span>AuditRun</span><strong>這次怎麼跑</strong><small>時間、程式版本、規則版本與輸入設定。</small></article>
        <article><span>ObservedLayout</span><strong>圖面看見什麼</strong><small>人工配置、圖元快照與原始數量。</small></article>
        <article><span>HumanReview</span><strong>誰確認了什麼</strong><small>確認答案、理由、證據與待辦事項。</small></article>
        <article><span>RegressionResult</span><strong>規則改了什麼</strong><small>改善、退步、狀態改變與需要重審的案例。</small></article>
      </div>

      <div class="scheme2-v43-regression-flow">
        <article><span>R-0.3.1</span><strong>固定一批案例</strong><small>保存基準結果</small></article><i>→</i>
        <article><span>規則修改</span><strong>例如補上轉角規則</strong><small>產生 R-0.3.2</small></article><i>→</i>
        <article><span>全案例重跑</span><strong>同一輸入、不同版本</strong><small>比較每個案例變化</small></article><i>→</i>
        <article class="core"><span>決定是否升版</span><strong>改善／退步／未知</strong><small>退步案例必須可定位、可回退。</small></article>
      </div>

      <div class="scheme2-v43-metric-grid">
        <article><b>Coverage</b><strong>規則有沒有觸發</strong><small>不是直接宣稱正確率，而是先知道規則覆蓋到哪裡。</small></article>
        <article><b>Conflict rate</b><strong>訊號衝突多少</strong><small>圖層、幾何、文字與人工結果是否互相矛盾。</small></article>
        <article><b>Unknown rate</b><strong>還有多少不知道</strong><small>未知要留下來，才能知道下一批工程特徵要補什麼。</small></article>
        <article><b>Regression list</b><strong>修改後壞了哪些</strong><small>規則升版前，先處理退步與未確認案例。</small></article>
      </div>
    </section>

    <section class="report-section" id="schemeTwoReportDemo">
      <div class="report-section-head">
        <span>06 · 從 0 到 1 與完成邊界</span>
        <h3>第一版先證明批次驗證能重複，不急著宣稱 AI 已經懂工程</h3>
      </div>
      <p class="report-copy">方案二的 0-1 不從數百張圖和模型訓練開始，而是先用少量、可說明的案例建立資料契約。每一階段都要能回頭檢查結果，再擴大資料量。</p>

      <div class="scheme2-v43-mvp">
        <article><span>01 · 最小案例</span><strong>固定格式 DXF＋少量代表圖</strong><small>先確認解析、快照與 C# 核心結果能對上。</small></article>
        <article><span>02 · 批次流程</span><strong>資料夾輸入＋狀態分類</strong><small>處理成功、失敗、衝突與未知，不只顯示總數。</small></article>
        <article><span>03 · 人工確認</span><strong>把案例變成可重跑測試</strong><small>保存證據、確認理由與規則版本。</small></article>
        <article><span>04 · 回歸安全網</span><strong>修改規則後全案例重跑</strong><small>有改善也有退步，才知道規則是否真的變好。</small></article>
        <article><span>05 · 擴大輸入</span><strong>再評估 DWG 讀取／轉換</strong><small>先以轉換忠實度驗證，再擴大客戶與年份。</small></article>
      </div>

      <div class="scheme2-v43-boundary-grid">
        <article><span>方案二會做</span><strong>驗證規則邊界、累積案例、保存證據、統計未知與回歸差異。</strong></article>
        <article><span>方案二不做</span><strong>不把歷史圖當真值、不直接替人修改目前 DWG，也不從空白建築圖自動排完整施工架。</strong></article>
        <article><span>交給方案三</span><strong>只有經過確認的元件、特徵、限制與數量邏輯，才可作為候選配置的輸入。</strong></article>
      </div>
    </section>

    <footer class="dev-footer scheme2-v43-footer">
      <button id="closeSchemeTwoBottom" type="button">← 返回方案二主畫面</button>
      <p>方案二的成果不是一個看似漂亮的百分比，而是一套知道自己在哪裡可靠、在哪裡必須停下來詢問人的驗證平台。</p>
    </footer>
  `;

  function updateMainScheme() {
    const scheme = document.querySelector('.scheme-two');
    if (!scheme || scheme.dataset.scheme2V43 === 'true') return;

    const heading = scheme.querySelector('.scheme-heading');
    const title = heading?.querySelector('h3');
    const description = heading?.querySelector('p');
    const coreLabel = heading?.querySelector('.scheme-core span');
    const coreText = heading?.querySelector('.scheme-core strong');
    const flow = scheme.querySelector('.scheme-operation-flow');
    const action = scheme.querySelector('.flow-card-action span');

    if (title) title.textContent = '歷史工程圖批次驗證';
    if (description) description.textContent = '把方案一的共同核心放到大量歷史圖面上，找出規則可以使用、需要確認、尚未知道與明確失效的範圍。';
    if (coreLabel) coreLabel.textContent = '方案二的核心價值';
    if (coreText) coreText.textContent = '找出規則邊界，不把歷史圖面直接當成答案。';
    if (action) action.textContent = '展開查看：資料證據、批次架構、案例庫與規則回歸';

    if (flow) {
      flow.innerHTML = mainFlow;
      flow.classList.add('scheme2-v43-main-flow');
      if (flow.parentElement?.classList.contains('scheme-flow-card')) {
        heading?.insertAdjacentElement('afterend', flow);
      }
    }

    scheme.dataset.scheme2V43 = 'true';
  }

  function rebuildOverlay() {
    const overlay = document.querySelector('#schemeTwoOverlay');
    const main = overlay?.querySelector('.dev-main.report-main');
    if (!main || main.dataset.scheme2V43 === 'true') return;

    main.innerHTML = overlayMarkup;
    main.dataset.scheme2V43 = 'true';
    document.getElementById('closeSchemeTwoBottom')?.addEventListener('click', () => {
      document.getElementById('closeSchemeTwo')?.click();
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
