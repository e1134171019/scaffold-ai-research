(() => {
  'use strict';

  const MARKER = 'act4-simulation-v45';

  function renderSimulationStory() {
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
        <span>原本流程 → 加入仿真</span>
        <h3 id="act4SimulationTitleV45">原本程式已能重新驗算，<br>為什麼還要再做一份？</h3>
        <p>前面已經把真實流程、工程條件與可處理邊界說清楚。接下來先看原本準備怎麼用程式處理，再說明為什麼還需要加入一條獨立仿真流程。</p>
      </header>

      <div class="act4-original-process-v45">
        <div class="act4-story-label-v45">原本的程式邏輯</div>
        <div class="act4-original-steps-v45" aria-label="原本施工架圖面重新驗算流程">
          <article><b>1</b><strong>讀取人工 CAD</strong><small>取得圖層、圖塊、線段、文字與座標。</small></article>
          <i aria-hidden="true">→</i>
          <article><b>2</b><strong>還原人工配置</strong><small>辨認架列、跨距、主架、樓層與標註。</small></article>
          <i aria-hidden="true">→</i>
          <article><b>3</b><strong>重新計算</strong><small>依照圖面幾何重算構件與數量。</small></article>
          <i aria-hidden="true">→</i>
          <article><b>4</b><strong>檢查並回報</strong><small>找出標註、數量與已知工程規則的差異。</small></article>
        </div>
        <p>這條流程做的是：把工程人員已經完成的圖面重新讀一次、算一次、檢查一次。它很適合找出數量寫錯、構件漏算、標註與實際座標不一致等問題。</p>
      </div>

      <aside class="act4-process-limit-v45">
        <div>
          <span>真正的缺口</span>
          <strong>它能檢查人工答案內部是否一致，卻不一定知道答案一開始是否完整。</strong>
          <p>如果人工在最前面就漏掉一段外牆，程式只會計算圖面中已經存在的施工架。剩下的數量可以全部算對，但整體配置仍然少了一段。</p>
        </div>
        <div class="act4-limit-chain-v45" aria-label="人工配置遺漏可能沿用到重新計算流程">
          <span>人工漏畫</span><i>→</i><span>程式讀不到</span><i>→</i><span>現有部分全算對</span><i>→</i><span>整體仍不完整</span>
        </div>
      </aside>

      <div class="act4-simulation-idea-v45">
        <div>
          <span>因此提出一個想法</span>
          <h4>再加入一條不看人工答案的仿真路徑</h4>
          <p>系統只讀取已確認的建築範圍、樓層高度、產品尺寸與工程規則，另外重新產生一份施工架配置，而不是沿著人工原圖補線或修改。</p>
        </div>
        <strong>同一題，做第二份答案</strong>
      </div>

      <div class="act4-twin-definition-v45">
        <div class="act4-story-label-v45">這裡所說的孿生</div>
        <h4>讓人工與程式面對同一棟建築，各自完成一次施工架配置。</h4>
        <p>孿生不是把原圖複製一份，也不是單純把 2D 轉成 3D。它的重點是：程式在不抄人工答案的情況下，依照相同工程條件重新做一次。</p>

        <div class="act4-twin-flow-v45" aria-label="人工配置與仿真配置的雙軌比較流程">
          <div class="act4-twin-input-v45">
            <span>相同且已確認的條件</span>
            <strong>建築範圍　＋　樓層高度　＋　產品尺寸　＋　工程規則</strong>
          </div>
          <div class="act4-twin-split-v45" aria-hidden="true">↓</div>
          <div class="act4-twin-lanes-v45">
            <article class="is-human">
              <b>A</b>
              <span>人工路徑</span>
              <strong>讀取工程人員完成的配置</strong>
              <small>得到人工配置與人工數量。</small>
            </article>
            <article class="is-shadow">
              <b>B</b>
              <span>仿真路徑</span>
              <strong>不看人工答案，重新配置</strong>
              <small>得到獨立仿真配置與仿真數量。</small>
            </article>
          </div>
          <div class="act4-twin-merge-v45" aria-hidden="true">↓</div>
          <div class="act4-twin-compare-v45">
            <span>兩份結果放在一起</span>
            <strong>比較覆蓋範圍、跨距排列、轉角處理、構件數量與規則結果</strong>
          </div>
        </div>
      </div>

      <div class="act4-effect-grid-v45">
        <article>
          <span>加入仿真前</span>
          <strong>確認人工答案內部是否一致</strong>
          <small>適合找數量、標註、圖層與構件關係錯誤。</small>
        </article>
        <article>
          <span>加入仿真後</span>
          <strong>多一份獨立答案可以互相比較</strong>
          <small>可進一步發現整段遺漏、配置方法差異與規則缺口。</small>
        </article>
        <article class="is-review">
          <span>結果怎麼使用</span>
          <strong>差異不是判決，而是審查範圍</strong>
          <small>人工可能錯、系統可能錯、兩者也可能都合法；最後仍由工程人員確認原因。</small>
        </article>
      </div>

      <footer class="act4-simulation-conclusion-v45">
        <strong>預期效果：</strong>原本需要工程師重新看完整張圖，加入仿真後，可以先把問題縮小到真正不同的位置，再針對遺漏、數量、排列或規則原因進行確認。
      </footer>
    `;
  }

  function boot() {
    [20, 460, 1450].forEach((delay) => window.setTimeout(renderSimulationStory, delay));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
