(() => {
  'use strict';

  const stages = [
    {
      number: '01',
      title: '大量工程圖',
      description: '收集不同專案、繪圖方式與建築條件。'
    },
    {
      number: '02',
      title: '已知特徵辨識',
      description: '統計特徵的出現頻率、通過結果與失效情況。'
    },
    {
      number: '03',
      title: '未知案例分群',
      description: '找出無法分類、規則衝突與高失敗區域。'
    },
    {
      number: '04',
      title: '新增工程特徵',
      description: '補充定義、必要輸入與對應配置規則。'
    },
    {
      number: '05',
      title: '全案例回歸',
      description: '確認新規則沒有讓既有案例的整體結果變差。'
    }
  ];

  const compact = (value) => (value || '').replace(/\s+/g, '').trim();

  function findSmallestTextElement(phrase) {
    const target = compact(phrase);
    const candidates = [...document.querySelectorAll('body h1, body h2, body h3, body h4, body h5, body strong, body span, body p, body div, body li')]
      .filter((element) => {
        if (element.closest('.nv-feature-loop-v24, script, style, template')) return false;
        const text = compact(element.textContent);
        return text.includes(target) && text.length <= 180;
      })
      .sort((a, b) => compact(a.textContent).length - compact(b.textContent).length);

    return candidates[0] || null;
  }

  function lowestCommonAncestor(elements) {
    if (!elements.length) return null;
    let candidate = elements[0];
    while (candidate && candidate !== document.body) {
      if (elements.every((element) => candidate.contains(element))) return candidate;
      candidate = candidate.parentElement;
    }
    return null;
  }

  function findSingleStageCard(element, bridge) {
    let candidate = element;
    while (candidate?.parentElement && candidate.parentElement !== bridge && candidate.parentElement !== document.body) {
      const parent = candidate.parentElement;
      const parentText = compact(parent.textContent);
      const stageCount = stages.filter((stage) => parentText.includes(compact(stage.title))).length;
      if (stageCount > 1 || parentText.length > 520) break;
      candidate = parent;
    }
    return candidate;
  }

  function hideLegacyStageFlow(bridge) {
    const titleElements = stages.map((stage) => findSmallestTextElement(stage.title));
    const foundElements = titleElements.filter(Boolean);
    if (foundElements.length < 3) return;

    if (foundElements.length === stages.length) {
      const common = lowestCommonAncestor(foundElements);
      if (
        common &&
        common !== bridge &&
        common !== document.body &&
        !common.querySelector('#feature-bridge-title') &&
        compact(common.textContent).length < 2600
      ) {
        common.dataset.nvFeatureLegacyHidden = 'true';
        return;
      }
    }

    foundElements.forEach((element) => {
      const card = findSingleStageCard(element, bridge);
      if (card && card !== bridge && !card.querySelector('#feature-bridge-title')) {
        card.dataset.nvFeatureLegacyHidden = 'true';
      }
    });

    [...document.querySelectorAll('body *')].forEach((element) => {
      if (element.closest('.nv-feature-loop-v24, .feature-bridge-flow, script, style, template')) return;
      const text = (element.textContent || '').trim();
      if ((text === '→' || text === '↓') && element.children.length === 0) {
        const bounds = element.getBoundingClientRect();
        if (bounds.width < 80 && bounds.height < 80) {
          element.dataset.nvFeatureLegacyHidden = 'true';
        }
      }
    });
  }

  function buildStageLoop() {
    const wrapper = document.createElement('div');
    wrapper.className = 'nv-feature-loop-v24';
    wrapper.setAttribute('aria-label', '工程特徵建立與驗證流程');

    const cards = stages.map((stage) => `
      <article class="nv-feature-stage-v24">
        <span class="nv-feature-stage-v24__number">${stage.number}</span>
        <h4>${stage.title}</h4>
        <p>${stage.description}</p>
      </article>
    `).join('');

    wrapper.innerHTML = `
      <div class="nv-feature-loop-v24__header">
        <h3>工程特徵如何持續擴充</h3>
        <p>新規則必須經過案例分群與全案例回歸，不能只在單一圖面上成立。</p>
      </div>
      <div class="nv-feature-loop-v24__grid">${cards}</div>
    `;

    return wrapper;
  }

  function repairFeatureBridge() {
    const bridge = document.querySelector('.feature-bridge');
    if (!bridge) return;

    bridge.classList.add('nv-feature-bridge-v24');
    hideLegacyStageFlow(bridge);

    if (!bridge.querySelector('.nv-feature-loop-v24')) {
      bridge.appendChild(buildStageLoop());
    }
  }

  function boot() {
    repairFeatureBridge();
    window.setTimeout(repairFeatureBridge, 250);
    window.setTimeout(repairFeatureBridge, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
