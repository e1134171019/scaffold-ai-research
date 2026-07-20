(() => {
  'use strict';

  function rewriteAct4Opening() {
    const act4 = document.querySelector('#act4');
    const head = act4?.querySelector('.act4-head');
    if (!act4 || !head) return;

    act4.classList.add('act4-opening-v41');

    const eyebrow = head.querySelector('.eyebrow');
    const title = head.querySelector('h2');
    const narrative = head.querySelector('.act4-narrative');
    const oldRecap = head.querySelector('.act4-keyword-recap');
    const oldFocus = head.querySelector('.act4-focus-note');
    const oldRoute = head.querySelector('.three-route-line');

    if (eyebrow) eyebrow.textContent = 'ACT 04 · 從問題定義走向實際開發';
    if (title) title.innerHTML = '01～03 先定義問題，<br><em>04 把條件變成流程。</em>';

    if (narrative) {
      narrative.innerHTML = `
        <p><strong>01～03 不是已經完成的系統，而是我們先整理出的問題定義與邊界。</strong>前面先確認客戶真正要的是施工架數量、報價依據與錯誤追蹤，再分清建築圖、已配置施工架圖、搭架法與元件規格。</p>
        <p>接著把可以判斷、不能判斷、資料不足與需要人工確認的情況列出來。ACT 04 的工作，就是把這些條件收斂成一條可執行的程式流程，再分別看方案一、方案二與方案三可以解決什麼問題。</p>
      `;
    }

    oldRecap?.remove();
    oldFocus?.remove();

    if (oldRoute) {
      oldRoute.className = 'act4-condition-flow-v41';
      oldRoute.setAttribute('aria-label', '01 到 03 的問題定義與邊界，轉成程式條件流程');
      oldRoute.innerHTML = `
        <div class="act4-condition-origin-v41">
          <span>前面三篇先整理什麼？</span>
          <div class="act4-condition-inputs-v41">
            <article>
              <b>01</b>
              <strong>客戶要解決的問題</strong>
              <small>數量、報價、人工錯誤與差異追蹤。</small>
            </article>
            <article>
              <b>02</b>
              <strong>輸入與工程前提</strong>
              <small>建築圖、施工架圖、搭架法、元件規格與專案條件。</small>
            </article>
            <article>
              <b>03</b>
              <strong>可判斷的邊界</strong>
              <small>哪些能計算、哪些會衝突、哪些必須停止或人工確認。</small>
            </article>
          </div>
        </div>

        <div class="act4-condition-arrow-v41" aria-hidden="true">↓</div>

        <div class="act4-condition-contract-v41">
          <span>整理成系統條件</span>
          <strong>輸入條件　＋　工程規則　＋　停止與確認條件</strong>
          <small>先確認資料能不能進入計算，再決定程式可以做到哪一步。</small>
        </div>

        <div class="act4-condition-arrow-v41" aria-hidden="true">↓</div>

        <div class="act4-condition-process-v41">
          <span>條件進入程式流程</span>
          <div class="act4-condition-steps-v41">
            <article><b>1</b><strong>讀取與整理 CAD</strong><small>圖元、座標、單位、圖層與 Block。</small></article>
            <i aria-hidden="true">→</i>
            <article><b>2</b><strong>建立幾何關係</strong><small>斷線、重複線、鄰近、相交與拓撲。</small></article>
            <i aria-hidden="true">→</i>
            <article><b>3</b><strong>轉成工程物件</strong><small>建築特徵、施工架元件與可追溯來源。</small></article>
            <i aria-hidden="true">→</i>
            <article><b>4</b><strong>檢查完整性</strong><small>未知、衝突、信心與人工確認佇列。</small></article>
          </div>
        </div>

        <div class="act4-condition-result-v41">
          <span><b>條件不足或互相衝突</b> → 標記未知，交給人工確認</span>
          <span><b>條件足夠</b> → 進入下面三個可獨立交付的方案</span>
        </div>
      `;
    }

    let bridge = head.querySelector('.act4-opening-bridge-v41');
    if (!bridge) {
      bridge = document.createElement('p');
      bridge.className = 'act4-opening-bridge-v41';
      (oldRoute || narrative)?.insertAdjacentElement('afterend', bridge);
    }
    bridge.innerHTML = '<strong>下面才開始看方案一～三。</strong>三個方案各自能解決一個實際問題；它們可以共用條件與驗證結果，但不代表只能使用同一種軟體。';
  }

  function boot() {
    [0, 360, 1250].forEach((delay) => window.setTimeout(rewriteAct4Opening, delay));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
