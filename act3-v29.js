(() => {
  'use strict';

  function rewriteAct3() {
    const act3 = document.querySelector('#act3');
    if (!act3) return;

    document.querySelector('#narrative-act-03')?.remove();

    const wrap = act3.querySelector('.act3-wrap');
    const head = act3.querySelector('.act3-head');
    const gates = act3.querySelector('.three-gate-grid');
    const roles = act3.querySelector('.act3-role-summary');
    const output = act3.querySelector('.act3-final-gate');
    const details = act3.querySelector('.act3-details');

    if (!wrap || !head || !gates || !roles || !output || !details) return;

    const eyebrow = head.querySelector('.eyebrow');
    const title = head.querySelector('h2');
    const lead = head.querySelector('p');

    if (eyebrow) eyebrow.textContent = 'ACT 03 · 三道工程判斷閘門';
    if (title) {
      title.innerHTML = '程式讀圖之前，先問三個問題：<br><em>這張圖可信嗎？規則有沒有衝突？案例還在已知範圍內嗎？</em>';
    }
    if (lead) {
      lead.textContent = '第二篇整理了第一批會改變施工架配置的典型情況。接下來，程式不能直接套公式，而要先確認這些判斷應由誰負責，以及目前資料是否足以支持計算。';
    }

    let principle = act3.querySelector('.act3-principle-v29');
    if (!principle) {
      principle = document.createElement('section');
      principle.className = 'act3-principle-v29';
      principle.innerHTML = `
        <header>
          <span>系統設計原則</span>
          <h3>先分清楚誰負責什麼，再進入三道判斷</h3>
          <p>確定性的尺寸與規則交給程式；模糊語意由 AI 提出候選；施工方法、安全與未形式化條件保留給專業人員確認。</p>
        </header>
      `;
      head.insertAdjacentElement('afterend', principle);
    }
    principle.appendChild(roles);

    let gateIntro = act3.querySelector('.act3-gate-intro-v29');
    if (!gateIntro) {
      gateIntro = document.createElement('div');
      gateIntro.className = 'act3-gate-intro-v29';
      gateIntro.innerHTML = `
        <span>為什麼不能讀到圖就直接算？</span>
        <p>CAD 圖品質因人而異，工程規則在特殊條件下可能互相衝突，而且沒有任何一套規則能覆蓋所有圖面。程式如果跳過這三道判斷，仍可能算出一個數字，但你不會知道這個數字是對的還是錯的。</p>
      `;
      principle.insertAdjacentElement('afterend', gateIntro);
    }

    const outputLabel = output.querySelector('span');
    const outputTitle = output.querySelector('strong');
    const outputCopy = output.querySelector('p');

    if (outputLabel) outputLabel.textContent = 'OUTPUT DECISION · 輸出原則';
    if (outputTitle) outputTitle.textContent = '三關都過，才輸出一個數字。';
    if (outputCopy) {
      outputCopy.innerHTML = '其他情況一律輸出候選方案、警告、缺漏清單或人工確認。<b>系統寧可說「這張圖我不確定」，也不提供一個看起來合理但可能錯誤的答案。</b>';
    }

    const summary = details.querySelector('summary');
    if (summary) {
      const summaryLabel = summary.querySelector('span');
      const summaryTitle = summary.querySelector('strong');
      if (summaryLabel) summaryLabel.textContent = '六個技術模組';
      if (summaryTitle) summaryTitle.textContent = '展開查看：六個模組如何分別執行這三道判斷';
    }

    act3.classList.add('act3-v29');
  }

  function boot() {
    rewriteAct3();
    window.setTimeout(rewriteAct3, 250);
    window.setTimeout(rewriteAct3, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
