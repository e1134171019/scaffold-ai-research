(() => {
  'use strict';

  const blocks = {
    'ACT 01': `
      <div class="narrative-v23 nv-compact" id="narrative-act-01">
        <p class="nv-kicker">問題從哪裡開始</p>
        <h3>一個看似簡單的需求：能不能讓程式直接算出施工架數量？</h3>
        <p class="nv-lead">客戶目前由專業人員依建築 CAD 圖面判斷搭設位置、排列方式與所需數量。結果會影響報價、備料與現場安排，因此希望降低人工時間與計算差異。</p>
        <div class="nv-flow" aria-label="最初構想流程">
          <div class="nv-step">建築 CAD</div><div class="nv-arrow">→</div>
          <div class="nv-step">辨識施工架</div><div class="nv-arrow">→</div>
          <div class="nv-step">統計數量</div>
        </div>
        <p class="nv-copy">這個流程成立的前提，是圖面中已經畫好了施工架。但實際資料不一定如此。</p>
        <div class="nv-question">程式究竟是在讀取施工架，還是必須先建立施工架？</div>
      </div>`,

    'ACT 02': `
      <div class="narrative-v23 nv-compact" id="narrative-act-02">
        <p class="nv-kicker">重新定義問題</p>
        <h3>同樣是 CAD，實際上可能是兩種完全不同的任務</h3>
        <div class="nv-lanes">
          <div class="nv-lane">
            <strong>圖面已畫好施工架</strong>
            <p>答案已經存在於圖面中，程式負責讀取、計數與檢查。</p>
            <div class="nv-mini-flow">人工配置 → 讀取 → 計算 → 稽核</div>
          </div>
          <div class="nv-lane">
            <strong>圖面只有建築結構</strong>
            <p>圖面中尚未有施工架，必須先確認搭設範圍並建立配置。</p>
            <div class="nv-mini-flow">建築圖 → 搭設範圍 → 生成配置 → 計算</div>
          </div>
        </div>
        <p class="nv-copy">因此，數量不是直接藏在建築線段裡。外牆、內牆與結構線只能提供幾何，真正的數量取決於施工架最後如何排列。</p>
        <div class="nv-key">施工架數量是配置的結果；沒有先建立配置，就沒有可靠數量。</div>
      </div>`,

    'ACT 03': `
      <div class="narrative-v23 nv-compact" id="narrative-act-03">
        <p class="nv-kicker">把問題變成可計算流程</p>
        <h3>第一版不必理解整張建築圖，只保留施工架真正需要的資訊</h3>
        <p class="nv-lead">使用者可先關閉無關圖層，只保留外牆、內牆、柱與必要障礙。結構線提供位置、長度與轉角，但「哪裡需要搭設」仍要由人員或施工資料確認。</p>
        <div class="nv-flow" aria-label="建築圖轉為施工架配置流程">
          <div class="nv-step">保留結構線</div><div class="nv-arrow">→</div>
          <div class="nv-step">確認搭設範圍</div><div class="nv-arrow">→</div>
          <div class="nv-step">建立輪廓與離牆路徑</div><div class="nv-arrow">→</div>
          <div class="nv-step">辨識線段、轉角與障礙</div><div class="nv-arrow">→</div>
          <div class="nv-step">生成配置</div>
        </div>
        <div class="nv-role-grid">
          <div class="nv-role"><strong>人工</strong><p>確認哪裡需要搭、搭設側與施工條件。</p></div>
          <div class="nv-role"><strong>幾何核心</strong><p>處理尺寸、輪廓、偏移、相交與碰撞。</p></div>
          <div class="nv-role"><strong>配置規則</strong><p>處理架跨、轉角、短跨與障礙避讓。</p></div>
          <div class="nv-role"><strong>AI</strong><p>提出圖層、線段與特殊區域候選，不直接決定正式數量。</p></div>
        </div>
        <p class="nv-copy">建築外形雖然可能無限變化，程式不需要為 L 形、U 形或每一種特殊形狀分別寫規則；所有形狀都先轉成輪廓、線段、轉角、障礙與連續路徑。</p>
        <div class="nv-key">不針對「形狀」寫規則，而是針對「幾何操作」與「配置決策」建立通用流程。</div>
        <div class="nv-status-grid" aria-label="計算結果狀態">
          <div class="nv-status"><strong>已確認</strong><p>條件完整，可輸出正式結果。</p></div>
          <div class="nv-status"><strong>條件式</strong><p>依明確列出的假設進行估算。</p></div>
          <div class="nv-status"><strong>多候選</strong><p>存在數個可行配置，需要人工選擇。</p></div>
          <div class="nv-status"><strong>無法判斷</strong><p>資訊不足、互相矛盾或規則尚未涵蓋。</p></div>
        </div>
      </div>`,

    'ACT 04': `
      <div class="narrative-v23 nv-compact" id="narrative-act-04">
        <p class="nv-kicker">三個方案的真正關係</p>
        <h3>不是三個平行產品，而是同一套系統逐步成熟的路徑</h3>
        <p class="nv-lead">要讓系統從沒有施工架的建築圖面生成配置，不能直接跳到全自動。必須先記錄人工怎麼做，再確認哪些經驗能穩定成為規則。</p>
        <div class="nv-timeline" aria-label="三階段發展流程">
          <div class="nv-step"><span><span class="nv-stage-number">1</span><br>方案一<br>取得與稽核人工配置</span></div><div class="nv-arrow">→</div>
          <div class="nv-step"><span><span class="nv-stage-number">2</span><br>方案二<br>驗證規則成立與失效邊界</span></div><div class="nv-arrow">→</div>
          <div class="nv-step"><span><span class="nv-stage-number">3</span><br>方案三<br>使用已驗證規則生成候選配置</span></div>
        </div>
        <div class="nv-key">方案一取得經驗，方案二驗證經驗，方案三使用經驗。</div>
      </div>`,

    'ACT 05': `
      <div class="narrative-v23 nv-compact" id="narrative-act-05">
        <p class="nv-kicker">研究閉環</p>
        <h3>規則不是一次寫完，而是在案例、驗證與修正中逐步收斂</h3>
        <div class="nv-flow" aria-label="規則建立閉環">
          <div class="nv-step">專家配置</div><div class="nv-arrow">→</div>
          <div class="nv-step">結構化案例</div><div class="nv-arrow">→</div>
          <div class="nv-step">候選規則</div><div class="nv-arrow">→</div>
          <div class="nv-step">大量案例驗證</div><div class="nv-arrow">→</div>
          <div class="nv-step">版本化規則</div>
        </div>
        <div class="nv-summary-grid">
          <div class="nv-summary-item"><strong>任意建築形狀</strong><p>轉換成有限的幾何操作與路徑事件。</p></div>
          <div class="nv-summary-item"><strong>專家配置經驗</strong><p>整理成工程約束與配置策略。</p></div>
          <div class="nv-summary-item"><strong>失敗與未知案例</strong><p>用來補充例外、停止條件與適用邊界。</p></div>
        </div>
        <div class="nv-key">知識工程建立配置規則；大量工程圖讓規則知道自己的適用邊界。</div>
      </div>`
  };

  const normalize = (value) => (value || '').replace(/\s+/g, ' ').trim().toUpperCase();

  function findMarker(label) {
    const exact = [...document.querySelectorAll('body *')].find((element) => {
      if (element.closest('.narrative-v23, script, style, template')) return false;
      if (element.children.length > 2) return false;
      return normalize(element.textContent) === label;
    });
    if (exact) return exact;

    const expression = new RegExp(`^${label.replace(' ', '\\s*')}(?:\\b|\\s|[｜|·:：])`, 'i');
    return [...document.querySelectorAll('body h1, body h2, body h3, body h4, body p, body span, body div')].find((element) => {
      if (element.closest('.narrative-v23, script, style, template')) return false;
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
    if (document.getElementById(id)) return;

    const marker = findMarker(label);
    if (!marker) return;

    const section = findSection(marker, label, nextLabel);
    const anchor = findAnchor(section, marker);
    if (!anchor || !anchor.parentElement) return;

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
      if (node.parentElement?.closest('script, style, template, .narrative-v23')) continue;
      let text = node.nodeValue;
      for (const [from, to] of replacements) text = text.split(from).join(to);
      if (text !== node.nodeValue) node.nodeValue = text;
    }
  }

  function boot() {
    const labels = ['ACT 01', 'ACT 02', 'ACT 03', 'ACT 04', 'ACT 05'];
    labels.forEach((label, index) => insertNarrative(label, labels[index + 1] || null));
    replaceLegacyTerms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
