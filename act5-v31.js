(() => {
  'use strict';

  const challengeCopy = [
    {
      title: '施工架系統與規格',
      copy: '不同施工架系統的元件尺寸與連接方式不同，沒有一套可直接套用到所有專案的通用規格。'
    },
    {
      title: '工程特徵與交互',
      copy: '六種典型情況只是第一批；多個特徵同時出現時，規則可能互相覆蓋、衝突或產生多個合法答案。'
    },
    {
      title: 'CAD 品質與語意映射',
      copy: '每個客戶的圖層、圖塊與繪圖習慣不同，程式讀到的物件不一定就是施工架需要的工程資訊。'
    },
    {
      title: '大量工程圖規則邊界',
      copy: '規則不是建立一次就結束；每次修改都可能改善部分案例，同時破壞原本正確的其他案例。'
    }
  ];

  function rewriteHeader(act5) {
    const head = act5.querySelector('.act5-head');
    if (!head) return;

    const eyebrow = head.querySelector('.eyebrow');
    const title = head.querySelector('h2');
    const lead = head.querySelector('p');

    if (eyebrow) eyebrow.textContent = 'ACT 05 · 規則總結';
    if (title) {
      title.innerHTML = '規則說清楚了，還不夠——<br><em>還要知道規則在哪裡會失效。</em>';
    }
    if (lead) {
      lead.textContent = '前四篇已經完成問題定義、工程特徵、三道判斷閘門與三個成熟階段。第五篇不再增加新方案，而是把整個研究收斂成一個可持續驗證的閉環。';
    }
  }

  function rewriteDualLoop(act5) {
    const loop = act5.querySelector('.dual-loop-summary');
    if (!loop) return;

    loop.classList.add('act5-loop-anchor-v31');
    const articles = loop.querySelectorAll('article');
    const arrow = loop.querySelector(':scope > i');

    if (articles[0]) {
      articles[0].innerHTML = `
        <span>KNOWLEDGE ENGINEERING</span>
        <h3>先把工程知識轉成第一版規則</h3>
        <p>專家配置案例 → 工程特徵 → CAD 線索 → 配置規則 → 可執行程式。</p>
      `;
    }

    if (articles[1]) {
      articles[1].innerHTML = `
        <span>BOUNDARY VALIDATION</span>
        <h3>再用大量工程圖找出規則邊界</h3>
        <p>批次案例 → 通過、衝突與未知統計 → 修正规則 → 全案例回歸。</p>
      `;
    }

    if (arrow) {
      arrow.innerHTML = '<b>⇄</b><small>互相回饋</small>';
    }
  }

  function rewriteChallenges(act5) {
    const grid = act5.querySelector('.act5-challenge-grid');
    if (!grid) return null;

    const block = grid.closest('.act5-block');
    const blockLabel = block?.querySelector('.act5-block-head span');
    const blockTitle = block?.querySelector('.act5-block-head h3');

    if (blockLabel) blockLabel.textContent = '01 · 四個真正的難點';
    if (blockTitle) blockTitle.textContent = '規則要能落地，這四個問題都不能被省略';

    [...grid.querySelectorAll('article')].forEach((article, index) => {
      const item = challengeCopy[index];
      if (!item) return;
      article.innerHTML = `
        <span>CHALLENGE ${String(index + 1).padStart(2, '0')}</span>
        <h4>${item.title}</h4>
        <p>${item.copy}</p>
      `;
    });

    return block;
  }

  function rewriteConclusion(act5, challengeBlock) {
    const conclusion = act5.querySelector('.act5-conclusion');
    if (!conclusion) return null;

    if (challengeBlock) challengeBlock.insertAdjacentElement('afterend', conclusion);

    const label = conclusion.querySelector(':scope > span');
    const title = conclusion.querySelector(':scope > h3');
    const copy = conclusion.querySelector(':scope > p');
    const quote = conclusion.querySelector(':scope > blockquote');
    const uses = conclusion.querySelector('.act5-three-use');

    if (label) label.textContent = 'PROJECT CONCLUSION · 研究回答';
    if (title) title.textContent = '知識工程建立第一版規則，大量工程圖讓規則知道自己的邊界。';
    if (copy) {
      copy.textContent = '系統的價值不只在於更快算出數量，而是讓每個結果都能回到規則、輸入與證據，並在資料不足時明確停下來。';
    }
    if (quote) {
      quote.textContent = '真正可靠的自動化，不是假設規則永遠正確，而是持續知道自己何時可能出錯。';
    }

    if (uses) {
      uses.classList.add('act5-three-stage-v31');
      const cards = uses.querySelectorAll('div');
      const content = [
        ['階段一', '讀取與稽核人工配置'],
        ['階段二', '用大量案例驗證規則邊界'],
        ['階段三', '用已驗證規則生成候選配置']
      ];
      cards.forEach((card, index) => {
        const item = content[index];
        if (item) card.innerHTML = `<span>${item[0]}</span><strong>${item[1]}</strong>`;
      });
    }

    return conclusion;
  }

  function wrapProjectFlow(act5, conclusion) {
    const loop = act5.querySelector('.project-full-loop');
    const block = loop?.closest('.act5-block');
    if (!loop || !block) return;

    if (block.closest('.act5-flow-details-v31')) return;

    const details = document.createElement('details');
    details.className = 'act5-flow-details-v31';
    details.innerHTML = `
      <summary>
        <span>完整執行順序</span>
        <strong>展開查看：從圖面輸入到規則回歸的八個步驟</strong>
        <b>＋</b>
      </summary>
    `;

    if (conclusion) conclusion.insertAdjacentElement('afterend', details);
    else block.parentElement?.insertBefore(details, block);

    details.appendChild(block);

    const blockLabel = block.querySelector('.act5-block-head span');
    const blockTitle = block.querySelector('.act5-block-head h3');
    if (blockLabel) blockLabel.textContent = 'TECHNICAL REFERENCE · 八步驟流程';
    if (blockTitle) blockTitle.textContent = '從規格確認、CAD 判斷到全案例回歸';
  }

  function rewriteRuleTable(act5) {
    const details = act5.querySelector('.rule-table-details');
    const block = details?.closest('.act5-block');
    if (!details || !block) return;

    block.classList.add('act5-rule-reference-v31');

    const blockLabel = block.querySelector('.act5-block-head span');
    const blockTitle = block.querySelector('.act5-block-head h3');
    const summaryLabel = details.querySelector('summary span');
    const summaryTitle = details.querySelector('summary strong');

    if (blockLabel) blockLabel.textContent = 'TECHNICAL REFERENCE · 規則總表';
    if (blockTitle) blockTitle.textContent = '規則、資料與程式的完整對照';
    if (summaryLabel) summaryLabel.textContent = '24 行完整總表';
    if (summaryTitle) summaryTitle.textContent = '展開查看：每條規則的條件、風險、程式模組與目前狀態';
  }

  function rewriteAct5() {
    const act5 = document.querySelector('#act5');
    if (!act5) return;

    document.querySelector('#narrative-act-05')?.remove();
    act5.classList.add('act5-v31');

    rewriteHeader(act5);
    rewriteDualLoop(act5);
    const challengeBlock = rewriteChallenges(act5);
    const conclusion = rewriteConclusion(act5, challengeBlock);
    wrapProjectFlow(act5, conclusion);
    rewriteRuleTable(act5);
  }

  function boot() {
    rewriteAct5();
    window.setTimeout(rewriteAct5, 250);
    window.setTimeout(rewriteAct5, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
