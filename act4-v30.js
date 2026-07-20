(() => {
  'use strict';

  const schemeConfigs = [
    {
      selector: '.scheme-one',
      description: '繪圖人員先把施工架畫好，也把數量整理好。外掛再讀一次目前的 DWG，自己重新計算，找出兩邊的差異和圖面問題。',
      promptLabel: '繪圖人員怎麼使用？',
      prompt: '畫好施工架並整理數量 → 按下檢查 → 查看差異 → 回圖修正 → 再檢查一次。',
      output: '人工數量、程式重算、兩邊差異、圖面異常、缺少資料，以及對應的圖面位置。',
      trigger: '展開查看：AutoCAD 外掛、共同核心、數量比對與 Demo'
    },
    {
      selector: '.scheme-two',
      description: '把大量既有 DWG／DXF 整理成案例，再用同一套規則核心批次測試，確認哪些情況算得準、哪些情況會衝突或失效。',
      promptLabel: '方案二要回答什麼？',
      prompt: '這套規則在哪些圖面能用，遇到什麼情況會失效？',
      output: '規則覆蓋率、衝突案例、未知案例、失效範圍與版本回歸報告。',
      trigger: '展開查看：批次分析架構、邊界報告與 Demo'
    },
    {
      selector: '.scheme-three',
      description: '等輸入條件和規則邊界確認後，程式才開始依照硬性限制產生可比較的施工架候選配置。',
      promptLabel: '方案三要回答什麼？',
      prompt: '規則穩定後，程式能不能排出符合條件的施工架方案？',
      output: '合法候選配置、每層數量與還沒辦法決定的條件；高度資料足夠時，再輸出完整總量。',
      trigger: '展開查看：約束求解架構、生成流程與 Demo'
    }
  ];

  function rewriteHeader(act4) {
    const head = act4.querySelector('.act4-head');
    if (!head) return;

    const eyebrow = head.querySelector('.eyebrow');
    const title = head.querySelector('h2');
    const narrative = head.querySelector('.act4-narrative');
    const recap = head.querySelector('.act4-keyword-recap');
    const focusNote = head.querySelector('.act4-focus-note');
    const route = head.querySelector('.three-route-line');

    if (eyebrow) eyebrow.textContent = 'ACT 04 · 三個發展階段';
    if (title) title.innerHTML = '同一套工程核心，<br><em>一步一步往後發展。</em>';

    if (narrative) {
      narrative.innerHTML = `
        <p><strong>這三個方案不是三套互不相關的系統。</strong>它們會共用同一套資料模型、規則和數量計算。</p>
        <p>方案一先處理已經畫好的施工架，重新計算並比對人工數量。方案二再用大量案例測試同一套規則。等規則穩定後，方案三才加入自動排列施工架的求解功能。</p>
      `;
    }

    if (recap) recap.hidden = true;
    if (focusNote) focusNote.hidden = true;

    if (route) {
      route.innerHTML = `
        <div><span>階段一</span><b>先檢查人工結果</b><small>人先畫好並整理數量，外掛再重新計算、比對和定位問題。</small></div>
        <i>→</i>
        <div><span>階段二</span><b>再測試規則能用到哪裡</b><small>用大量案例找出規則有效、衝突、未知和失效的範圍。</small></div>
        <i>→</i>
        <div><span>階段三</span><b>最後才讓程式排出候選方案</b><small>只有在輸入和規則都清楚時，才增加求解器產生配置。</small></div>
      `;
    }
  }

  function rewriteScheme(act4, config) {
    const scheme = act4.querySelector(config.selector);
    if (!scheme) return;

    const heading = scheme.querySelector('.scheme-heading');
    const description = heading?.querySelector('div:first-child > p');
    const core = heading?.querySelector('.scheme-core');
    const coreLabel = core?.querySelector('span');
    const coreText = core?.querySelector('strong');
    const button = scheme.querySelector('.scheme-flow-card');
    const flow = scheme.querySelector('.scheme-operation-flow');

    if (description) description.textContent = config.description;
    if (coreLabel) coreLabel.textContent = config.promptLabel;
    if (coreText) coreText.textContent = config.prompt;

    if (flow) {
      flow.classList.add('act4-operation-v30');
      if (button && flow.parentElement === button) {
        heading?.insertAdjacentElement('afterend', flow);
      }
    }

    let output = scheme.querySelector('.act4-output-v30');
    if (!output) {
      output = document.createElement('div');
      output.className = 'act4-output-v30';
      output.innerHTML = `<span>這個階段會得到什麼？</span><strong></strong>`;
      (flow || heading)?.insertAdjacentElement('afterend', output);
    }
    const outputText = output.querySelector('strong');
    if (outputText) outputText.textContent = config.output;

    if (button) {
      button.classList.add('act4-tech-trigger-v30');
      button.innerHTML = `<span>${config.trigger}</span><b>→</b>`;
    }
  }

  function rewriteAct4() {
    const act4 = document.querySelector('#act4');
    if (!act4) return;

    document.querySelector('#narrative-act-04')?.remove();
    act4.classList.add('act4-v30');

    rewriteHeader(act4);
    schemeConfigs.forEach((config) => rewriteScheme(act4, config));
  }

  function boot() {
    rewriteAct4();
    window.setTimeout(rewriteAct4, 250);
    window.setTimeout(rewriteAct4, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
