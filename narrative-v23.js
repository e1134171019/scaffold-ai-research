(() => {
  'use strict';

  const blocks = {
    'ACT 02': `
      <div class="narrative-v23 nv-compact" id="narrative-act-02">
        <p class="nv-kicker">工程規則從哪裡來</p>
        <h3>先理解人工怎麼搭，才知道程式最後要算什麼</h3>
        <p class="nv-lead">施工架不是把牆長除以固定尺寸就結束。基本架跨可以先建立基準，但外凸轉角、內凹轉角、短跨、雨遮、女兒牆與屋頂等條件，會改變主架位置、收尾方式與實際數量。</p>
        <div class="nv-flow" aria-label="施工架工程特徵整理流程">
          <div class="nv-step">基本架跨<br>183 × 80</div><div class="nv-arrow">→</div>
          <div class="nv-step">外凸／內凹<br>轉角</div><div class="nv-arrow">→</div>
          <div class="nv-step">短跨與<br>收尾</div><div class="nv-arrow">→</div>
          <div class="nv-step">雨遮、突出物<br>與屋頂條件</div>
        </div>
        <p class="nv-copy">建築外形可以不同，但施工架配置面對的工程事件會反覆出現。研究重點不是替每一棟建築重新寫程式，而是把這些事件整理成可辨識、可組合、可驗證的工程特徵。</p>
        <div class="nv-key">第二篇回答的是：施工架為什麼這樣搭，以及哪些判斷能被整理成通用規則。</div>
      </div>`,

    'ACT 03': `
      <div class="narrative-v23 nv-compact" id="narrative-act-03">
        <p class="nv-kicker">把工程經驗轉成程式條件</p>
        <h3>先確認程式看得到什麼、能確定什麼，再決定要不要使用 AI</h3>
        <p class="nv-lead">前一篇整理的是工程特徵；這一篇則把特徵轉成 CAD 可讀資料，例如圖層、圖塊、線段、文字、尺寸與座標。程式只能根據實際輸入做判斷，缺少關鍵資訊時必須停止，而不是自行補猜。</p>
        <div class="nv-flow" aria-label="CAD 輸入轉為可計算資料流程">
          <div class="nv-step">最低必要輸入</div><div class="nv-arrow">→</div>
          <div class="nv-step">幾何操作</div><div class="nv-arrow">→</div>
          <div class="nv-step">工程約束</div><div class="nv-arrow">→</div>
          <div class="nv-step">結果狀態與停止條件</div>
        </div>
        <div class="nv-role-grid">
          <div class="nv-role"><strong>人工</strong><p>確認搭設範圍、施工側與無法從圖面判斷的條件。</p></div>
          <div class="nv-role"><strong>幾何核心</strong><p>處理輪廓、長度、偏移、相交、轉角與碰撞。</p></div>
          <div class="nv-role"><strong>規則核心</strong><p>處理架跨、主架關係、短跨、收尾與障礙避讓。</p></div>
          <div class="nv-role"><strong>AI</strong><p>協助模糊圖層、文字與相似案例，不直接決定正式數量。</p></div>
        </div>
        <div class="nv-status-grid" aria-label="計算結果狀態">
          <div class="nv-status"><strong>已確認</strong><p>條件完整，可輸出正式結果。</p></div>
          <div class="nv-status"><strong>條件式</strong><p>依清楚列出的假設進行估算。</p></div>
          <div class="nv-status"><strong>多候選</strong><p>存在數個可行配置，需要人工選擇。</p></div>
          <div class="nv-status"><strong>無法判斷</strong><p>資訊不足、互相矛盾或規則尚未涵蓋。</p></div>
        </div>
        <div class="nv-key">第三篇回答的是：哪些資料能直接計算、哪些需要人工確認、哪些情況必須停止。</div>
      </div>`,

    'ACT 04': `
      <div class="narrative-v23 nv-compact" id="narrative-act-04">
        <p class="nv-kicker">三個方案的真正關係</p>
        <h3>不是三個平行產品，而是同一套工程核心逐步成熟的路徑</h3>
        <p class="nv-lead">若直接從建築圖跳到全自動配置，系統沒有足夠案例驗證規則，也無法知道錯誤發生在哪裡。因此三個方案必須依序累積資料、驗證規則，再提高自動化程度。</p>
        <div class="nv-timeline" aria-label="三階段發展流程">
          <div class="nv-step"><span><span class="nv-stage-number">1</span><br>方案一<br>取得與稽核人工配置</span></div><div class="nv-arrow">→</div>
          <div class="nv-step"><span><span class="nv-stage-number">2</span><br>方案二<br>批次驗證規則與失效邊界</span></div><div class="nv-arrow">→</div>
          <div class="nv-step"><span><span class="nv-stage-number">3</span><br>方案三<br>生成可比較的候選配置</span></div>
        </div>
        <div class="nv-key">方案一取得經驗，方案二驗證經驗，方案三使用已驗證的經驗。</div>
      </div>`,

    'ACT 05': `
      <div class="narrative-v23 nv-compact" id="narrative-act-05">
        <p class="nv-kicker">研究如何收束</p>
        <h3>第五篇不是再增加新方案，而是把整個專案收斂成可追蹤的規則化路徑</h3>
        <p class="nv-lead">施工架規則不會一次寫完。每次加入新案例，都要確認既有規則是否仍成立、失敗區域是否縮小，以及新規則有沒有破壞原本正確的案例。</p>
        <div class="nv-flow" aria-label="規則建立閉環">
          <div class="nv-step">人工配置案例</div><div class="nv-arrow">→</div>
          <div class="nv-step">工程特徵標記</div><div class="nv-arrow">→</div>
          <div class="nv-step">候選規則</div><div class="nv-arrow">→</div>
          <div class="nv-step">邊界分析</div><div class="nv-arrow">→</div>
          <div class="nv-step">全案例回歸</div>
        </div>
        <div class="nv-summary-grid">
          <div class="nv-summary-item"><strong>即時稽核</strong><p>在 AutoCAD 中讀取、計算、標記與回到原圖。</p></div>
          <div class="nv-summary-item"><strong>離線驗證</strong><p>批次測試歷史圖面，分析規則成功率與失效邊界。</p></div>
          <div class="nv-summary-item"><strong>候選生成</strong><p>只使用已驗證規則產生配置，並保留人工選擇。</p></div>
        </div>
        <div class="nv-key">最終成果不是一個會猜答案的 AI，而是一套可驗證、可追蹤、可持續擴充的施工架工程規則系統。</div>
      </div>`
  };

  const storyline = [
    {
      act: 'ACT 01',
      title: '問題從哪裡開始？',
      copy: '客戶要算組數、主架與尺寸，但第一步必須先判斷圖面中是否已經存在施工架。'
    },
    {
      act: 'ACT 02',
      title: '施工架為什麼這樣搭？',
      copy: '從基本架跨、轉角、短跨與特殊條件，整理反覆出現的工程特徵。'
    },
    {
      act: 'ACT 03',
      title: '程式能確定什麼？',
      copy: '把工程經驗轉成最低輸入、幾何操作、工程約束、結果狀態與停止條件。'
    },
    {
      act: 'ACT 04',
      title: '為什麼分成三方案？',
      copy: '方案一取得案例，方案二驗證規則，方案三使用已驗證規則生成候選配置。'
    },
    {
      act: 'ACT 05',
      title: '系統如何持續收斂？',
      copy: '透過特徵標記、邊界分析、版本化與全案例回歸，形成完整研究閉環。'
    }
  ];

  const normalize = (value) => (value || '').replace(/\s+/g, ' ').trim().toUpperCase();

  function rewriteHero() {
    const hero = document.querySelector('#act1');
    if (!hero) return;

    const eyebrow = hero.querySelector('.eyebrow');
    const title = hero.querySelector('h1');
    const lead = hero.querySelector('.hero-lead');
    const stats = [...hero.querySelectorAll('.stat')];
    const clientNote = hero.querySelector('.client-note');
    const clarifier = hero.querySelector('.hero-clarifier');

    if (eyebrow) eyebrow.textContent = 'ACT 01 · 問題從哪裡開始';
    if (title) title.innerHTML = '問題，從一張<br><em>施工架 DWG</em><br>開始。';
    if (lead) {
      lead.textContent = '客戶希望從 CAD 圖面得到施工架組數、主架數量，並檢查標註尺寸是否正確。真正的第一個問題不是「AI 能不能算」，而是這張圖裡究竟已經畫了施工架，還是只有建築結構。兩種輸入代表完全不同的任務。';
    }

    const statContent = [
      ['輸入', '建築圖或施工架配置圖'],
      ['輸出', '組數、主架與尺寸稽核'],
      ['核心', '先辨識輸入，再進行計算']
    ];
    stats.slice(0, 3).forEach((element, index) => {
      const item = statContent[index];
      if (item) element.innerHTML = `<b>${item[0]}</b><span>${item[1]}</span>`;
    });

    if (clientNote) {
      clientNote.innerHTML = '<strong>第一個判斷：</strong> 圖面中已經存在人工配置的施工架，還是程式必須先建立施工架配置？';
    }

    if (clarifier) {
      clarifier.innerHTML = `
        <span>第一篇的研究邊界</span>
        <p>先不回答如何全自動生成施工架；第一步是把人工繪製的 DWG 轉成一致、可計算、可追溯的工程資料。</p>
        <small>客戶提出的是「鷹架數量」需求；進入工程規則與程式設計後，統一使用「施工架」。</small>
      `;
    }
  }

  function insertStoryline() {
    if (document.getElementById('storyline-v23')) return;
    const hero = document.querySelector('#act1');
    if (!hero?.parentElement) return;

    const section = document.createElement('section');
    section.id = 'storyline-v23';
    section.className = 'storyline-v23';
    section.innerHTML = `
      <header class="storyline-v23__header">
        <div>
          <p>研究敘事總覽</p>
          <h2>整理後的五篇故事線</h2>
        </div>
        <span>每一篇只回答一個問題，並把下一篇需要的條件交出去。</span>
      </header>
      <div class="storyline-v23__grid">
        ${storyline.map((item, index) => `
          <article class="storyline-v23__item">
            <b>${item.act}</b>
            <h3>${item.title}</h3>
            <p>${item.copy}</p>
            ${index < storyline.length - 1 ? '<i aria-hidden="true">→</i>' : ''}
          </article>
        `).join('')}
      </div>
    `;

    hero.insertAdjacentElement('afterend', section);
  }

  function findMarker(label) {
    const exact = [...document.querySelectorAll('body *')].find((element) => {
      if (element.closest('.narrative-v23, .storyline-v23, script, style, template')) return false;
      if (element.children.length > 2) return false;
      return normalize(element.textContent) === label;
    });
    if (exact) return exact;

    const expression = new RegExp(`^${label.replace(' ', '\\s*')}(?:\\b|\\s|[｜|·:：])`, 'i');
    return [...document.querySelectorAll('body h1, body h2, body h3, body h4, body p, body span, body div')].find((element) => {
      if (element.closest('.narrative-v23, .storyline-v23, script, style, template')) return false;
      return expression.test((element.textContent || '').trim()) && (element.textContent || '').trim().length < 90;
    }) || null;
  }

  function findSection(marker, currentLabel, nextLabel) {
    if (!marker) return null;

    const semanticSection = marker.closest('section, article');
    if (semanticSection) return semanticSection;

    let candidate = marker.parentElement;
    while (candidate && candidate !== document.body) {
      const text = normalize(candidate.textContent);
      const containsCurrent = text.includes(currentLabel);
      const containsNext = nextLabel ? text.includes(nextLabel) : false;
      if (containsCurrent && !containsNext && candidate.children.length >= 2) return candidate;
      candidate = candidate.parentElement;
    }

    return marker.parentElement || null;
  }

  function findAnchor(section, marker) {
    if (!section) return marker;
    const heading = [...section.querySelectorAll('h1, h2, h3, h4')].find((element) => !element.closest('.narrative-v23'));
    if (heading) {
      const header = heading.closest('header');
      if (header && section.contains(header)) return header;
      return heading;
    }

    let anchor = marker;
    while (anchor && anchor.parentElement && anchor.parentElement !== section) {
      if (anchor.parentElement.children.length > 4) break;
      anchor = anchor.parentElement;
    }
    return anchor || section.firstElementChild;
  }

  function insertNarrative(label, nextLabel) {
    const id = `narrative-act-${label.slice(-2)}`;
    document.getElementById(id)?.remove();

    const marker = findMarker(label);
    if (!marker) return;

    const section = findSection(marker, label, nextLabel);
    const anchor = findAnchor(section, marker);
    if (!anchor?.parentElement || !blocks[label]) return;

    const template = document.createElement('template');
    template.innerHTML = blocks[label].trim();
    anchor.insertAdjacentElement('afterend', template.content.firstElementChild);
  }

  function replaceLegacyTerms() {
    const replacements = new Map([
      ['規則交互矩陣', '幾何操作與工程約束'],
      ['RuleInteractionMatrix', 'GeometryConstraintPlanner'],
      ['持續擴張工程特徵庫', '持續擴張幾何事件、工程約束與例外邊界']
    ]);

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const node of nodes) {
      if (node.parentElement?.closest('script, style, template, .narrative-v23, .storyline-v23')) continue;
      let text = node.nodeValue;
      for (const [from, to] of replacements) text = text.split(from).join(to);
      if (text !== node.nodeValue) node.nodeValue = text;
    }
  }

  function boot() {
    rewriteHero();
    insertStoryline();

    const labels = ['ACT 02', 'ACT 03', 'ACT 04', 'ACT 05'];
    labels.forEach((label, index) => insertNarrative(label, labels[index + 1] || null));
    replaceLegacyTerms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
