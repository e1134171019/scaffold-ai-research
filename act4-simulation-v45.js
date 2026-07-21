(() => {
  'use strict';

  const MARKER = 'act4-simulation-v45';
  const BASE_W = 580;
  const BASE_H = 308;

  function rewriteEarlyNarrative() {
    const act1 = document.querySelector('#act1');
    if (act1) {
      const eyebrow = act1.querySelector('.eyebrow');
      const title = act1.querySelector('h1');
      const lead = act1.querySelector('.hero-lead');
      const stats = [...act1.querySelectorAll('.stat')];
      const note = act1.querySelector('.client-note');
      const clarifier = act1.querySelector('.hero-clarifier');

      if (eyebrow) eyebrow.textContent = 'ACT 01 · 客戶為什麼提出這個問題';
      if (title) title.innerHTML = '客戶要的看起來是數量，<br><em>真正的起點是先看懂 CAD。</em>';
      if (lead) lead.textContent = '客戶希望從圖面得到施工架組數、主架數量，並確認標註尺寸是否正確。但收到的 CAD 可能是已完成的施工架配置，也可能只有建築結構；兩種圖面代表兩種完全不同的工作。';

      const content = [
        ['目前工作', '人工查看 CAD、配置與核對數量'],
        ['希望輸出', '組數、主架與尺寸稽核'],
        ['第一個判斷', '這張圖已經有施工架，還是只有建築物']
      ];
      stats.slice(0, 3).forEach((element, index) => {
        if (content[index]) element.innerHTML = `<b>${content[index][0]}</b><span>${content[index][1]}</span>`;
      });
      if (note) note.innerHTML = '<strong>這不是同一個任務：</strong> 已完成施工架 CAD 要重建與稽核；只有建築物的 CAD，則必須先形成配置，之後才有數量。';
      if (clarifier) clarifier.innerHTML = '<span>ACT 01 的研究邊界</span><p>先把客戶需求、圖面角色與輸出說清楚。下一章再用人工完成的案例，理解施工架配置究竟包含哪些工程判斷。</p><small>先提出問題，不在第一章直接跳到全自動生成。</small>';
    }

    const storyline = [...document.querySelectorAll('.storyline-v23__item')];
    const storyContent = [
      ['ACT 01', '客戶為什麼需要這個系統？', '從人工核對工作開始，先分清已完成施工架 CAD 與只有建築物的 CAD。'],
      ['ACT 02', '施工架配置到底怎麼形成？', '用人工案例拆解架跨、主架、轉角、短跨與特殊位置，最後提出自主配置前的孿生驗證。'],
      ['ACT 03', '系統什麼時候有資格自己處理？', '定義建築幾何、專案 Profile、元件規格、工程規則，以及直接輸出、候選或停止的 Gate。']
    ];
    storyline.slice(0, 3).forEach((item, index) => {
      const [act, title, copy] = storyContent[index];
      const b = item.querySelector('b');
      const h = item.querySelector('h3');
      const p = item.querySelector('p');
      if (b) b.textContent = act;
      if (h) h.textContent = title;
      if (p) p.textContent = copy;
    });

    const act2Section = document.querySelector('#act2');
    if (act2Section) {
      const intro = [...act2Section.querySelectorAll('p')].find((paragraph) => paragraph.textContent.includes('本章先分清兩種資料'));
      if (intro) intro.textContent = '本章先從一張已完成的施工架 CAD 開始，理解人工如何把建築外形轉成架跨、主架與數量。等工程規則看懂後，再把人工圖層藏起來，示範系統如何依相同條件重新試排。';
    }

    const act2Narrative = document.querySelector('#narrative-act-02');
    if (act2Narrative) {
      const kicker = act2Narrative.querySelector('.nv-kicker');
      const heading = act2Narrative.querySelector('h3');
      const lead = act2Narrative.querySelector('.nv-lead');
      const copy = act2Narrative.querySelector('.nv-copy');
      const key = act2Narrative.querySelector('.nv-key');
      if (kicker) kicker.textContent = '先把施工架這件事看懂';
      if (heading) heading.textContent = '先理解人工怎麼配置，再討論程式如何自己形成方案';
      if (lead) lead.textContent = '本章先用一張已完成的施工架 CAD，拆解 183 × 80、主架、轉角、短跨與特殊位置。這些不是單純的圖形，而是後續系統必須能辨認與驗證的工程事件。';
      if (copy) copy.textContent = '案例看完後，研究再往前一步：原本稽核程式繼續保留，同時提出一條不看人工答案的孿生路徑，為未來自主配置提供試排與比較環境。';
      if (key) key.textContent = 'ACT 02 回答的是：施工架配置如何形成，以及為什麼自主配置前需要一條獨立驗證路徑。';
    }

    const act3Narrative = document.querySelector('#narrative-act-03');
    if (act3Narrative) {
      const kicker = act3Narrative.querySelector('.nv-kicker');
      const heading = act3Narrative.querySelector('h3');
      const lead = act3Narrative.querySelector('.nv-lead');
      const key = act3Narrative.querySelector('.nv-key');
      if (kicker) kicker.textContent = '孿生成立的前提';
      if (heading) heading.textContent = '不是有圖就能自己排，工程條件必須先成立';
      if (lead) lead.textContent = '上一章的孿生示範保留了建築幾何、牆段、支撐區與元件尺寸。正式系統還要進一步確認專案 Profile、工程規則、衝突與停止條件。';
      if (key) key.textContent = 'ACT 03 回答的是：系統何時可以直接處理、何時只能提出候選，以及何時必須停止。';
    }
  }

  function renderTwinStory() {
    const act2 = document.querySelector('#act2');
    if (!act2) return;

    act2.classList.add(MARKER);
    let story = act2.querySelector(':scope > .act4-simulation-story-v45');
    if (!story) {
      story = document.createElement('section');
      story.className = 'act4-simulation-story-v45';
      story.setAttribute('aria-labelledby', 'act4SimulationTitleV45');
      act2.appendChild(story);
    }

    story.innerHTML = `
      <header class="act4-simulation-head-v45">
        <span>ACT 02 · 研究轉折</span>
        <h3 id="act4SimulationTitleV45">從人工配置稽核，<br>走向自主配置前的驗證</h3>
        <p>原本流程沒有問題：人工完成施工架 CAD 後，程式負責讀取、重算與稽核。當研究準備讓系統從建築條件自己形成配置時，才需要另一個環境先觀察它怎麼分段、怎麼處理限制區，以及結果和既有案例有什麼不同。</p>
      </header>

      <div class="act4-twin-thesis-v45">
        <strong>原本系統回答：</strong><span>人工圖算得對不對？</span>
        <i>→</i>
        <strong>孿生協助回答：</strong><span>系統自己排出的方案是否合理？</span>
      </div>

      <div class="act4-twin-scrolly-v45" id="act4TwinScrollyV45">
        <div class="act4-twin-copy-v45">
          <article class="is-active" data-twin-step="0">
            <span>01 · 原本流程先保留</span>
            <h4>先看人工完成的配置</h4>
            <p>人工完成施工架 CAD 後，原本程式可以讀取主架、架跨與尺寸，重新計算並檢查圖面。這個設計本身沒有問題。</p>
          </article>
          <article data-twin-step="1">
            <span>02 · 自主配置改變了起點</span>
            <h4>先把人工施工架圖層藏起來</h4>
            <p>自主系統不能抄人工答案。畫面只保留建築外廓、有效牆段、支撐區與已確認的元件尺寸。</p>
          </article>
          <article data-twin-step="2">
            <span>03 · 孿生重新試排</span>
            <h4>每個有效牆段重新起算</h4>
            <p>孿生依相同條件重新配置主架。完整跨使用 183 cm，剩餘尺寸保留為短跨，不把支撐區當成一般牆段。</p>
          </article>
          <article data-twin-step="3">
            <span>04 · 比較不是判決</span>
            <h4>把兩份結果放回同一張圖</h4>
            <p>相同位置代表兩條路徑一致；不同位置只標為待確認。人工可能合理、孿生可能需要修正，也可能只是分段方法不同。</p>
          </article>
        </div>

        <div class="act4-twin-stage-wrap-v45">
          <div class="act4-twin-stage-v45">
            <div class="act4-twin-toolbar-v45">
              <div>
                <span id="act4TwinStatusV45">01｜先看人工完成的配置</span>
                <small id="act4TwinDetailV45">人工均勻排法示例 A；先理解原本稽核流程。</small>
              </div>
              <em>標準樓3.dxf · DXF 幾何示例</em>
            </div>
            <div class="act4-twin-legend-v45">
              <span class="is-human">人工示例 A</span>
              <span class="is-twin">孿生配置 B</span>
              <span class="is-support">支撐區</span>
              <span class="is-diff">待確認差異</span>
            </div>
            <canvas id="act4TwinCanvasV45" width="580" height="308" aria-label="施工架人工配置與孿生配置比較動畫"></canvas>
            <div class="act4-twin-controls-v45" aria-label="孿生動畫檢視模式">
              <button type="button" data-twin-mode="0" class="is-active">人工 A</button>
              <button type="button" data-twin-mode="1">保留建築條件</button>
              <button type="button" data-twin-mode="2">孿生 B</button>
              <button type="button" data-twin-mode="3">疊合比較</button>
            </div>
            <p class="act4-twin-source-v45">外廓、牆段與支撐區使用 DXF 幾何示例；人工 A 為「連續 183 cm 排列」的比較情境，不直接判定實際人工圖錯誤。畫面差異只代表需要工程確認。</p>
          </div>
        </div>
      </div>

      <footer class="act4-simulation-conclusion-v45">
        <div><span>孿生的角色</span><strong>不是取代原本稽核，也不是第四個方案</strong></div>
        <p>它是為後續自主配置準備的試排與驗證環境。下一章接著回答：系統必須取得哪些資料、通過哪些 Gate，才有資格直接計算、提出候選或停止。</p>
        <a href="#act3">進入 ACT 03：自主配置成立的條件 →</a>
      </footer>
    `;

    initTwinCanvas(story);
  }

  function initTwinCanvas(story) {
    const canvas = story.querySelector('#act4TwinCanvasV45');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const status = story.querySelector('#act4TwinStatusV45');
    const detail = story.querySelector('#act4TwinDetailV45');
    const steps = [...story.querySelectorAll('[data-twin-step]')];
    const buttons = [...story.querySelectorAll('[data-twin-mode]')];

    const S = 0.130, BX = 111, BY = 20, XMIN = 1490.4, YMAX = 3476.8;
    const tx = (x) => +(BX + (x - XMIN) * S).toFixed(1);
    const ty = (y) => +(BY + (YMAX - y) * S).toFixed(1);

    const POLY = [
      [4132.9,3366.8],[4032.9,3366.8],[4032.9,3326.8],[3292.9,3326.8],[3292.9,3366.8],
      [3192.9,3366.8],[3192.9,3326.8],[2537.9,3326.8],[2537.9,3366.8],[2437.9,3366.8],
      [2437.9,3326.8],[1697.9,3326.8],[1697.9,3366.8],[1597.9,3366.8],[1597.9,2821.8],
      [1490.4,2821.8],[1490.4,2406.8],[1582.9,2406.8],[1582.9,2364.3],[1597.9,2364.3],
      [1597.9,1706.8],[1567.9,1706.8],[1567.9,1606.8],[2417.9,1606.8],[2417.9,1399.3],
      [2762.9,1399.3],[2762.9,1641.8],[2767.9,1641.8],[2767.9,1656.8],[2962.9,1656.8],
      [2962.9,1641.8],[2967.9,1641.8],[2967.9,1399.3],[3312.9,1399.3],[3312.9,1606.8],
      [4172.9,1606.8],[4172.9,1706.8],[4132.9,1706.8],[4132.9,2364.3],[4147.9,2364.3],
      [4147.9,2406.8],[4240.4,2406.8],[4240.4,2821.8],[4132.9,2821.8],[4132.9,3366.8]
    ].map(([x, y]) => [tx(x), ty(y)]);

    const TY = ty(3326.8);
    const PHT = 14;
    const SUPPORTS = [
      [tx(1597.9),tx(1697.9)],[tx(2437.9),tx(2537.9)],
      [tx(3192.9),tx(3292.9)],[tx(4032.9),tx(4132.9)]
    ];
    const SECTIONS = [
      {x1:tx(1697.9),x2:tx(2437.9),span:740},
      {x1:tx(2537.9),x2:tx(3192.9),span:655},
      {x1:tx(3292.9),x2:tx(4032.9),span:740}
    ];
    const BAY = 183;
    const BP = BAY * S;

    const twinPosts = [];
    SECTIONS.forEach(({x1, x2, span}) => {
      const full = Math.floor(span / BAY);
      for (let i = 0; i <= full; i += 1) {
        const px = x1 + i * BP;
        if (px <= x2 + 1) twinPosts.push({x:px, type:'full'});
      }
      const remain = span - full * BAY;
      if (remain > 10) twinPosts.push({x:x2, type:'short', remain});
    });

    const humanPosts = [];
    for (let x = tx(1597.9); x <= tx(4132.9) + 1; x += BP) {
      const inSupport = SUPPORTS.some(([x1, x2]) => x > x1 + .3 && x < x2 - .3);
      humanPosts.push({x:+x.toFixed(1), inSupport});
    }
    if (humanPosts[humanPosts.length - 1].x < tx(4132.9) - 1) {
      humanPosts.push({x:tx(4132.9), inSupport:false});
    }

    const palette = {
      background:'#11231d', grid:'#203a31', planFill:'#152820', planStroke:'#6f857a',
      planText:'#536b60', human:'#90aec1', twin:'#9ed2ad', support:'#d99b62',
      short:'#f0b77f', diff:'#ff8664', text:'#f8f1e7', muted:'#a9bab0'
    };

    let mode = 0;
    let twinVisible = twinPosts.length;
    let animationToken = 0;

    function resize() {
      const width = Math.max(320, canvas.clientWidth || BASE_W);
      const height = width * BASE_H / BASE_W;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr * width / BASE_W, 0, 0, dpr * height / BASE_H, 0, 0);
      draw();
    }

    function drawPlan() {
      ctx.beginPath();
      POLY.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath();
      ctx.fillStyle = palette.planFill;
      ctx.fill();
      ctx.strokeStyle = palette.planStroke;
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.font = '7px ui-monospace, SFMono-Regular, Consolas, monospace';
      ctx.fillStyle = palette.planText;
      ctx.textAlign = 'center';
      [[2865,2100,'塔吊'],[2600,2900,'電梯'],[2160,1950,'A1戶'],[3100,1950,'A2戶'],[3750,2550,'A3戶'],[1930,2550,'A5戶']]
        .forEach(([x,y,label]) => ctx.fillText(label, tx(x), ty(y)));
    }

    function drawSegments() {
      ctx.save();
      SECTIONS.forEach(({x1, x2, span}, index) => {
        ctx.fillStyle = 'rgba(158,210,173,.11)';
        ctx.fillRect(x1, PHT - 2, x2 - x1, TY - PHT + 10);
        ctx.fillStyle = palette.twin;
        ctx.font = '7px ui-monospace, SFMono-Regular, Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`§${index + 1} ${span}cm`, (x1 + x2) / 2, PHT - 4);
        const n = Math.floor(span / BAY);
        const r = span - n * BAY;
        ctx.fillStyle = palette.muted;
        ctx.fillText(`${n}×183${r > 10 ? `＋短跨${r}` : ''}`, (x1 + x2) / 2, PHT + 3);
      });
      SUPPORTS.forEach(([x1, x2]) => {
        ctx.fillStyle = 'rgba(217,155,98,.20)';
        ctx.fillRect(x1, PHT - 5, x2 - x1, TY - PHT + 16);
        ctx.strokeStyle = 'rgba(217,155,98,.72)';
        ctx.setLineDash([2,2]);
        ctx.strokeRect(x1, PHT - 5, x2 - x1, TY - PHT + 16);
        ctx.setLineDash([]);
        ctx.fillStyle = palette.support;
        ctx.font = '7px ui-monospace, SFMono-Regular, Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('支撐', (x1 + x2) / 2, PHT - 1);
      });
      ctx.restore();
    }

    function drawHuman(alpha = 1) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = palette.human;
      ctx.lineWidth = 1.8;
      humanPosts.forEach((post, index) => {
        ctx.beginPath();
        ctx.moveTo(post.x, PHT);
        ctx.lineTo(post.x, TY);
        ctx.stroke();
        if (index > 0) {
          ctx.globalAlpha = alpha * .3;
          ctx.lineWidth = .6;
          ctx.setLineDash([3,3]);
          ctx.beginPath();
          ctx.moveTo(humanPosts[index - 1].x, (PHT + TY) / 2);
          ctx.lineTo(post.x, (PHT + TY) / 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1.8;
        }
      });
      ctx.restore();
    }

    function drawTwin(count) {
      const bottom = TY + 31;
      ctx.save();
      for (let i = 0; i < Math.min(count, twinPosts.length); i += 1) {
        const post = twinPosts[i];
        ctx.strokeStyle = post.type === 'short' ? palette.short : palette.twin;
        ctx.lineWidth = 1.9;
        ctx.beginPath();
        ctx.moveTo(post.x, TY);
        ctx.lineTo(post.x, bottom);
        ctx.stroke();
        if (post.type === 'short') {
          ctx.fillStyle = palette.short;
          ctx.font = '7px ui-monospace, SFMono-Regular, Consolas, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`短${post.remain}`, post.x, bottom + 9);
        } else if (i > 0 && twinPosts[i - 1].type === 'full') {
          ctx.globalAlpha = .35;
          ctx.strokeStyle = palette.twin;
          ctx.lineWidth = .6;
          ctx.setLineDash([3,3]);
          ctx.beginPath();
          ctx.moveTo(twinPosts[i - 1].x, (TY + bottom) / 2);
          ctx.lineTo(post.x, (TY + bottom) / 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        }
      }
      ctx.restore();
    }

    function drawDiff() {
      ctx.save();
      humanPosts.filter((post) => post.inSupport).forEach((post) => {
        ctx.strokeStyle = palette.diff;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3,2]);
        ctx.beginPath();
        ctx.arc(post.x, (PHT + TY) / 2, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = palette.diff;
        ctx.font = '7px ui-monospace, SFMono-Regular, Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('待確認', post.x, TY + 12);
      });
      ctx.restore();
    }

    function drawSummary() {
      const differences = humanPosts.filter((post) => post.inSupport).length;
      const x = tx(3520), y = ty(2730), width = 175, height = 82;
      ctx.save();
      ctx.fillStyle = 'rgba(17,35,29,.94)';
      ctx.strokeStyle = 'rgba(158,210,173,.38)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, 6);
      ctx.fill();
      ctx.stroke();
      ctx.textAlign = 'left';
      ctx.font = 'bold 9px ui-monospace, SFMono-Regular, Consolas, monospace';
      ctx.fillStyle = palette.text;
      ctx.fillText('北牆 A／B 比較', x + 9, y + 15);
      ctx.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace';
      ctx.fillStyle = palette.twin;
      ctx.fillText('一致位置', x + 9, y + 34);
      ctx.fillText(`${humanPosts.length - differences}/${humanPosts.length}`, x + 125, y + 34);
      ctx.fillStyle = palette.diff;
      ctx.fillText('待確認差異', x + 9, y + 50);
      ctx.fillText(`${differences}/${humanPosts.length}`, x + 125, y + 50);
      ctx.fillStyle = palette.muted;
      ctx.font = '7px ui-monospace, SFMono-Regular, Consolas, monospace';
      ctx.fillText('可能原因：分段起算方式不同', x + 9, y + 66);
      ctx.fillText('處理：交由工程人員確認', x + 9, y + 77);
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, BASE_W, BASE_H);
      ctx.fillStyle = palette.background;
      ctx.fillRect(0, 0, BASE_W, BASE_H);
      ctx.fillStyle = palette.grid;
      for (let x = 17; x < BASE_W; x += 34) {
        for (let y = 17; y < BASE_H; y += 34) {
          ctx.beginPath();
          ctx.arc(x, y, .75, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      drawPlan();
      drawSegments();
      if (mode === 0) drawHuman(1);
      if (mode === 1) drawHuman(.08);
      if (mode === 2) drawTwin(twinVisible);
      if (mode === 3) {
        drawHuman(.72);
        drawTwin(twinPosts.length);
        drawDiff();
        drawSummary();
      }
    }

    const modeText = [
      ['01｜先看人工完成的配置', '人工均勻排法示例 A；先理解原本稽核流程。'],
      ['02｜隱藏人工圖層，保留建築條件', '自主配置不能抄人工答案，只留下外廓、牆段與支撐區。'],
      ['03｜孿生依牆段重新試排', '各段重新從邊界起算，完整跨 183 cm，餘數保留為短跨。'],
      ['04｜A／B 疊合比較', '差異只標為待確認，不直接判定人工或孿生哪一方錯誤。']
    ];

    function animateTwin() {
      animationToken += 1;
      const token = animationToken;
      twinVisible = 0;
      const step = () => {
        if (token !== animationToken || mode !== 2) return;
        twinVisible += 1;
        draw();
        if (twinVisible < twinPosts.length) window.setTimeout(step, 115);
      };
      step();
    }

    function setMode(nextMode, animate = true) {
      mode = Number(nextMode);
      animationToken += 1;
      steps.forEach((step) => step.classList.toggle('is-active', Number(step.dataset.twinStep) === mode));
      buttons.forEach((button) => button.classList.toggle('is-active', Number(button.dataset.twinMode) === mode));
      if (status) status.textContent = modeText[mode][0];
      if (detail) detail.textContent = modeText[mode][1];
      twinVisible = twinPosts.length;
      draw();
      if (mode === 2 && animate) animateTwin();
    }

    buttons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.twinMode, true)));

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setMode(visible.target.dataset.twinStep, true);
    }, { rootMargin:'-28% 0px -42% 0px', threshold:[0.2,0.45,0.7] });
    steps.forEach((step) => observer.observe(step));

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', resize, { passive:true });
    setMode(0, false);
    resize();
  }

  function boot() {
    rewriteEarlyNarrative();
    renderTwinStory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once:true });
  } else {
    boot();
  }
})();
