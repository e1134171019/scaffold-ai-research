(() => {
  'use strict';

  const schemeConfigs = [
    {
      selector: '.scheme-one',
      description: '由繪圖人員先完成施工架配置與人工數量；外掛再從目前 DWG 獨立重建配置、重新計算並比對，同時定位配置異常與資料缺漏。',
      promptLabel: '使用者怎麼操作？',
      prompt: '完成配置與數量 → 按下檢查 → 處理差異或異常 → 重新檢查。',
      output: '人工數量與程式重算的比對結果、配置異常、資料缺漏，以及可追溯的原圖定位。',
      trigger: '展開查看：AutoCAD 外掛、共同核心、數量比對與 Demo'
    },
    {
      selector: '.scheme-two',
      description: '將大量既有 DWG／DXF 轉成可比較的案例資料，用來量化同一套規則核心在哪些情況成立、衝突或失效。',
      promptLabel: '方案二的問題',
      prompt: '規則在什麼情況下會失效？',
      output: '規則覆蓋率、衝突與未知案例、失效邊界，以及版本回歸報告。',
      trigger: '展開查看：批次分析架構、邊界報告與 Demo'
    },
    {
      selector: '.scheme-three',
      description: '在規則與輸入邊界已驗證後，讓程式依硬性約束產生可比較、可追溯的合法候選配置。',
      promptLabel: '方案三的問題',
      prompt: '規則已驗證後，能不能讓程式自己排出合法配置？',
      output: '合法候選配置、每層數量、未解條件；高度資料足夠時，才進一步輸出完整總量。',
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
    if (title) title.innerHTML = '同一套工程核心，<br><em>依成熟度走出三個階段。</em>';

    if (narrative) {
      narrative.innerHTML = `
        <p><strong>接上一篇的判斷結果：</strong>這一篇不再重複三道閘門，而是說明同一套工程核心如何逐步落地。</p>
        <p>方案一先用共同核心複核人工配置與人工數量；方案二再用大量工程圖批次驗證同一核心的適用邊界；方案三只在規則與輸入已驗證後，才增加約束求解並產生候選配置。</p>
      `;
    }

    if (recap) recap.hidden = true;
    if (focusNote) focusNote.hidden = true;

    if (route) {
      route.innerHTML = `
        <div><span>階段一</span><b>先複核人工結果</b><small>人工先畫並填數量，外掛獨立重算、比對、稽核與定位。</small></div>
        <i>→</i>
        <div><span>階段二</span><b>再驗證規則邊界</b><small>大量案例批次執行同一核心，找出成立、衝突、未知與失效範圍。</small></div>
        <i>→</i>
        <div><span>階段三</span><b>最後生成候選配置</b><small>只在輸入與規則邊界明確時增加求解器並產生合法方案。</small></div>
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
      output.innerHTML = `<span>這個階段輸出什麼？</span><strong></strong>`;
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
