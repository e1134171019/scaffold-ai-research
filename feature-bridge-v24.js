(() => {
  'use strict';

  function createDetails(summaryText, bodyHtml, className = '') {
    const details = document.createElement('details');
    details.className = `act2-detail ${className}`.trim();
    details.innerHTML = `
      <summary>${summaryText}<span aria-hidden="true">＋</span></summary>
      <div class="act2-detail__body">${bodyHtml}</div>
    `;
    details.addEventListener('toggle', () => {
      const icon = details.querySelector('summary span');
      if (icon) icon.textContent = details.open ? '－' : '＋';
    });
    return details;
  }

  function rewriteAct2() {
    const act2 = document.querySelector('#act2');
    if (!act2 || act2.dataset.act2V28 === 'true') return;

    act2.dataset.act2V28 = 'true';
    document.getElementById('narrative-act-02')?.remove();

    const head = act2.querySelector('.act-head');
    if (head) {
      const eyebrow = head.querySelector('.eyebrow');
      const title = head.querySelector('h2');
      const intro = head.querySelector('p');

      if (eyebrow) eyebrow.textContent = 'ACT 02 · 工程特徵與配置規律';
      if (title) title.innerHTML = '建築外形那麼多變，<br>施工架的問題有沒有規律可循？';
      if (intro) {
        intro.textContent = '建築的尺寸、方向與外形各不相同，但施工架實際遇到的配置問題會反覆出現。這一篇的工作，是先把這些重複的情況整理出來，讓後續程式能夠辨識、分類並套用對應規則。';
      }
    }

    const contextStrip = act2.querySelector('.context-strip');
    const contextCards = contextStrip ? [...contextStrip.querySelectorAll('.context-card')] : [];
    const systemCard = contextCards[0] || null;
    const basisCard = contextCards[1] || null;

    if (systemCard) {
      systemCard.classList.add('act2-system-card');
      const heading = systemCard.querySelector('h3');
      const paragraph = systemCard.querySelector('p');
      if (heading) heading.textContent = '本案初步判斷：傳統框式施工架';
      if (paragraph) {
        paragraph.textContent = '從目前圖面中的架跨尺寸、主架形式與配置方式初步判斷，本案主要採用傳統框式施工架，並以圖面標示的 183 × 80 cm 作為第一階段分析基準。';
      }
    }

    if (basisCard) basisCard.remove();
    if (contextStrip) contextStrip.classList.add('act2-context-single');

    const caseStack = act2.querySelector('.case-stack');
    if (caseStack && !act2.querySelector('.act2-case-intro')) {
      const intro = document.createElement('div');
      intro.className = 'act2-case-intro';
      intro.innerHTML = `
        <span>第一批會改變配置的典型情況</span>
        <h3>先看這些情況會改變施工架配置的哪一部分</h3>
        <p>基本架跨建立數量基準；轉角改變架列銜接；短跨、突出物與屋頂條件則改變收尾、路徑或必要輸入。</p>
      `;
      caseStack.insertAdjacentElement('beforebegin', intro);
    }

    const bridge = act2.querySelector('.feature-bridge');
    if (!bridge) return;

    const legacyGrowth = bridge.querySelector('.feature-growth-loop');
    const growthHtml = legacyGrowth
      ? legacyGrowth.outerHTML
      : '<p>大量工程圖 → 已知特徵辨識 → 未知案例分群 → 新增工程特徵 → 全案例回歸</p>';

    const basisHtml = basisCard
      ? basisCard.innerHTML
      : `
        <h3>設計與計算依據</h3>
        <p>架跨模數、離牆距離與安全規範來自法規、CNS、產品型錄與客戶圖面。本案暫以圖面標示的 183 × 80 cm 為基準，實際條件仍須依客戶產品與現場資料確認。</p>
      `;

    bridge.className = 'feature-bridge act2-ending-v28';
    bridge.innerHTML = `
      <div class="act2-ending-v28__summary">
        <span class="case-kicker">本篇發現</span>
        <h3>這六種情況只是第一批。</h3>
        <p>後續還要透過更多工程圖面，確認既有分類是否足夠，並找出尚未被整理的新情況。</p>
        <div class="act2-mini-flow" aria-label="後續擴張流程">
          <b>第一批典型情況</b><i>→</i><b>更多案例驗證</b><i>→</i><b>補充新情況</b>
        </div>
      </div>
      <div class="act2-detail-list"></div>
      <div class="act2-next-question">
        <span>下一篇問題</span>
        <strong>工程師看得懂轉角、短跨與雨遮，但 CAD 程式實際看見的是圖層、線段、圖塊、文字與座標。兩者之間要怎麼轉換？</strong>
      </div>
    `;

    const detailList = bridge.querySelector('.act2-detail-list');
    detailList?.appendChild(createDetails('這些尺寸與判斷依據從哪裡來？', basisHtml, 'act2-basis-detail'));
    detailList?.appendChild(createDetails('後續如何擴張這份典型情況清單？', growthHtml, 'act2-growth-detail'));
  }

  function boot() {
    rewriteAct2();
    window.setTimeout(rewriteAct2, 250);
    window.setTimeout(rewriteAct2, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
