// Router + pages.
(function () {
  const U = window.UI;
  const app = document.getElementById('app');
  const TOPICS = window.TOPICS, ASG = window.ASSIGNMENTS;
  const allQuestions = () => ASG.flatMap((a) => a.questions);
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const topicById = (id) => TOPICS.find((t) => t.id === id);

  function topicScore(t) {
    const P = Progress.get();
    const sol = t.solutions.length ? t.solutions.filter((q) => Progress.solved(q)).length / t.solutions.length : 1;
    const quiz = (P.quiz[t.id] && P.quiz[t.id].best) / 100 || 0;
    const done = Progress.topicDone(t.id) ? 1 : 0;
    return Math.round(100 * (0.35 * done + 0.35 * sol + 0.3 * quiz));
  }

  /* ---------- nav ---------- */
  function renderNav(route) {
    const link = (href, label, extra = '') => `<a href="${href}" class="${('#' + route) === href || (href === '#/' && route === '/') ? 'active' : ''}">${label}${extra}</a>`;
    const tick = (ok) => (ok ? '<span class="tick">✓</span>' : '');
    document.getElementById('nav').innerHTML = `
      ${link('#/', '🏠 Dashboard')}
      ${link('#/cheatsheet', '📋 Formula sheet & strategy')}
      <div class="nav-group"><div class="label">Topics</div>
        ${TOPICS.map((t) => link(`#/topic/${t.id}`, `${t.n}. ${t.title}`, tick(Progress.topicDone(t.id)))).join('')}</div>
      <div class="nav-group"><div class="label">Solved assignments</div>
        ${ASG.map((a) => link(`#/sol/${a.id}`, a.title.split(' — ')[0], tick(a.questions.every((q) => Progress.solved(q.id))))).join('')}</div>
      <div class="nav-group"><div class="label">Practice</div>
        ${link('#/quiz', '❓ Concept quiz')}${link('#/practice', '🎲 Random problems')}${link('#/flash', '🃏 Flashcards')}${link('#/mistakes', '🔁 Review mistakes')}</div>
      <div class="nav-group"><div class="label">Tools</div>${link('#/tools', '🧮 Step-by-step solvers')}</div>
      <div class="nav-group">${link('#/progress', '💾 Progress file')}</div>`;
  }

  /* ---------- pages ---------- */
  function home() {
    const P = Progress.get();
    const nTopics = TOPICS.filter((t) => Progress.topicDone(t.id)).length;
    const qs = allQuestions();
    const nSolved = qs.filter((q) => Progress.solved(q.id)).length;
    const quizVals = Object.values(P.quiz).map((q) => q.best);
    const quizAvg = quizVals.length ? Math.round(quizVals.reduce((a, b) => a + b, 0) / quizVals.length) : 0;
    const pr = P.practice.total ? Math.round((100 * P.practice.right) / P.practice.total) : 0;
    const overall = Math.round(TOPICS.reduce((s, t) => s + topicScore(t), 0) / TOPICS.length);
    const nextTopic = TOPICS.find((t) => topicScore(t) < 80);
    app.innerHTML = `
      <h1>CSE 903 Mid-1 — exam prep</h1>
      <p class="muted">Everything from Assignments 1–3 and the Class 4 & 5 homework: notes, every question solved step by step, solvers that show the working, and unlimited practice.</p>
      <div class="stats">
        <div class="stat"><div class="v">${overall}%</div><div class="l">Overall readiness</div><div class="bar"><span style="width:${overall}%"></span></div></div>
        <div class="stat"><div class="v">${nTopics}/${TOPICS.length}</div><div class="l">Topics mastered</div></div>
        <div class="stat"><div class="v">${nSolved}/${qs.length}</div><div class="l">Assignment questions you can do</div></div>
        <div class="stat"><div class="v">${quizAvg}%</div><div class="l">Avg best quiz score</div></div>
        <div class="stat"><div class="v">${pr}%</div><div class="l">Practice accuracy (${P.practice.total})</div></div>
      </div>
      ${nextTopic ? U.box('key', 'Suggested next step', `<p>Work on <a href="#/topic/${nextTopic.id}"><b>${nextTopic.n}. ${nextTopic.title}</b></a>: read the notes, re-do its solved questions on paper, then take its quiz until you score 80%+.</p>`) : U.box('good', 'You are ready', '<p>Every topic is at 80%+. Keep doing random mixed problems and review your mistakes.</p>')}
      <h2>Topics</h2>
      <div class="grid">${TOPICS.map((t) => {
        const s = topicScore(t);
        return `<a class="tile" href="#/topic/${t.id}"><div class="t">${t.n}. ${t.title}</div><div class="d">${t.summary}</div>
          <div class="meta"><span>${Progress.topicDone(t.id) ? '✓ mastered' : ''}</span><span>${s}%</span></div><div class="bar"><span style="width:${s}%"></span></div></a>`;
      }).join('')}</div>
      <h2>Plan for tonight</h2>
      <div class="card"><ol>
        <li><b>For each topic:</b> read the notes (10 min), then cover the solution and redo its assignment questions on paper. Tick “I can do this” only when you get it right unaided.</li>
        <li><b>Concept quiz</b> per topic — True/False questions appear in every homework (Part A). Aim for 80%+.</li>
        <li><b>Random problems</b> (mixed) for speed: determinants, eigenvalues, inverses, projections, Gram–Schmidt, quadratic forms.</li>
        <li><b>Review mistakes</b> and the <a href="#/cheatsheet">formula sheet</a> just before sleeping.</li></ol>
      ${U.box('warn', 'Marks are for the working', '<p>Every assignment says “answers with no working receive partial credit at most”. Always: label row operations, state the theorem you use, and finish with a <b>verification</b> (AA⁻¹ = I, PA = LU, AP = PD, z·u = 0, …).</p>')}</div>`;
  }

  function topicPage(id) {
    const t = topicById(id);
    if (!t) return notFound();
    const i = TOPICS.indexOf(t);
    const prev = TOPICS[i - 1], next = TOPICS[i + 1];
    const qlinks = t.solutions.map((qid) => {
      const f = window.findQuestion(qid);
      return f ? `<li><a href="#/sol/${f.a.id}?q=${qid}">${f.a.title.split(' — ')[0]}: ${f.q.title}</a> ${Progress.solved(qid) ? '<span class="pill ok">✓</span>' : ''}</li>` : '';
    }).join('');
    const tools = t.tools.map((tid) => { const tl = window.TOOLS.find((x) => x.id === tid); return `<a class="btn" href="#/tool/${tid}">🧮 ${tl.title}</a>`; }).join(' ');
    app.innerHTML = `
      <div class="row space"><span class="pill acc">Topic ${t.n} of ${TOPICS.length}</span>
        <label class="check"><input type="checkbox" id="doneChk" ${Progress.topicDone(id) ? 'checked' : ''}> I have mastered this topic</label></div>
      <h1>${t.title}</h1><p class="muted">${t.summary}</p>
      <div class="card">${t.html}</div>
      <div class="card"><h3>Practise this topic</h3>
        <div class="row"><a class="btn primary" href="#/quiz?topic=${id}">❓ Topic quiz</a><a class="btn" href="#/practice?topic=${id}">🎲 Random problems</a><a class="btn" href="#/flash?topic=${id}">🃏 Flashcards</a></div>
        ${qlinks ? `<h4>Solved assignment questions</h4><ul>${qlinks}</ul>` : ''}
        <h4>Step-by-step tools</h4><div class="row">${tools}</div></div>
      <div class="row space">${prev ? `<a class="btn" href="#/topic/${prev.id}">← ${prev.title}</a>` : '<span></span>'}${next ? `<a class="btn" href="#/topic/${next.id}">${next.title} →</a>` : ''}</div>`;
    app.querySelector('#doneChk').onchange = (e) => { Progress.setTopicDone(id, e.target.checked); renderNav('/topic/' + id); };
    U.renderMath(app);
  }

  function solPage(aid, query) {
    const a = ASG.find((x) => x.id === aid);
    if (!a) return notFound();
    app.innerHTML = `<h1>${a.title}</h1>
      <p class="muted">Source: <code>MID 1/${a.file}</code> · Try each question on paper first, then open the solution. Tick the box once you can reproduce it without looking.</p>
      ${a.questions.map((q) => `
        <details class="q" id="q-${q.id}">
          <summary><span>${q.title}</span><span class="marks pill">${q.marks} marks</span>${Progress.solved(q.id) ? '<span class="pill ok">✓</span>' : ''}</summary>
          <div class="body"><div class="qtext">${q.text}</div>
            <label class="check" style="margin:6px 0"><input type="checkbox" data-q="${q.id}" ${Progress.solved(q.id) ? 'checked' : ''}> I can do this without looking</label>
            <div class="sol"><button class="primary showSol">Show full solution</button></div></div>
        </details>`).join('')}`;
    U.renderMath(app);
    app.querySelectorAll('details.q').forEach((d) => {
      const q = a.questions.find((x) => 'q-' + x.id === d.id);
      d.querySelector('.showSol').onclick = (e) => {
        const box = e.target.parentElement;
        try { box.innerHTML = q.solve(); } catch (err) { box.innerHTML = `<p class="err">Error: ${U.esc(err.message)}</p>`; }
        U.renderMath(box);
      };
      d.querySelector('input[type=checkbox]').onchange = (e) => { Progress.setSolved(q.id, e.target.checked); renderNav('/sol/' + aid); };
    });
    if (query.q) {
      const d = document.getElementById('q-' + query.q);
      if (d) { d.open = true; d.querySelector('.showSol').click(); setTimeout(() => d.scrollIntoView({ behavior: 'smooth' }), 50); }
    }
  }

  function toolsPage() {
    app.innerHTML = `<h1>Step-by-step solvers</h1><p class="muted">Type any matrix (one row per line, spaces between entries, fractions like <code>3/4</code> are fine). Every tool shows the full working in exact fractions — use them to <b>check your hand calculations</b>.</p>` +
      TOPICS.map((t) => {
        const ts = window.TOOLS.filter((x) => x.topic === t.id);
        if (!ts.length) return '';
        return `<h2>${t.n}. ${t.title}</h2><div class="grid">${ts.map((x) => `<a class="tile" href="#/tool/${x.id}"><div class="t">${x.title}</div><div class="d">${x.desc}</div></a>`).join('')}</div>`;
      }).join('');
  }
  function toolPage(id, query) {
    const tl = window.TOOLS.find((x) => x.id === id);
    if (!tl) return notFound();
    const t = topicById(tl.topic);
    app.innerHTML = `<a href="#/tools" class="small">← All tools</a><h1>${tl.title}</h1><p class="muted">${tl.desc} · Topic: <a href="#/topic/${t.id}">${t.title}</a></p><div id="toolBody"></div>`;
    window.renderTool(tl, app.querySelector('#toolBody'), query);
  }

  /* ---------- quiz ---------- */
  function quizPage(query) {
    const topics = TOPICS.map((t) => `<option value="${t.id}" ${query.topic === t.id ? 'selected' : ''}>${t.n}. ${t.title}</option>`).join('');
    app.innerHTML = `<h1>Concept quiz</h1><p class="muted">True/False and multiple-choice questions in the style of the homework Part A. Every answer comes with a one-line justification — learn those, the exam asks for them.</p>
      <div class="card row"><select id="qTopic"><option value="all">All topics (mixed)</option>${topics}</select>
        <select id="qN"><option>10</option><option>20</option><option value="999">All</option></select>
        <button class="primary" id="qStart">Start quiz</button></div><div id="qBody"></div>`;
    app.querySelector('#qStart').onclick = () => startQuiz(app.querySelector('#qTopic').value, +app.querySelector('#qN').value);
    if (query.topic) startQuiz(query.topic, 999);
  }
  function startQuiz(topic, n, fixed) {
    const pool = fixed || (topic === 'all' ? window.QUIZ : window.QUIZ.filter((q) => q.topic === topic));
    const qs = shuffle(pool).slice(0, n);
    const body = app.querySelector('#qBody');
    const results = [];
    let i = 0;
    const show = () => {
      if (i >= qs.length) return finish();
      const q = qs[i];
      const dots = qs.map((_, k) => `<span class="${k < i ? (results[k] ? 'ok' : 'no') : k === i ? 'cur' : ''}"></span>`).join('');
      const opts = q.type === 'tf' ? ['True', 'False'] : q.options;
      body.innerHTML = `<div class="card"><div class="row space"><span class="pill">${topicById(q.topic).title}</span><span class="muted small">Question ${i + 1} of ${qs.length}</span></div>
        <div class="progress-dots">${dots}</div>
        <p style="font-size:1.08rem">${q.type === 'tf' ? '<b>True or False?</b> ' : ''}${q.q}</p>
        ${opts.map((o, k) => `<button class="opt" data-k="${k}">${o}</button>`).join('')}
        <div id="qFb"></div></div>`;
      U.renderMath(body);
      body.querySelectorAll('.opt').forEach((b) => {
        b.onclick = () => {
          if (body.querySelector('.opt.correct')) return;
          const k = +b.dataset.k;
          const correctK = q.type === 'tf' ? (q.answer ? 0 : 1) : q.answer;
          const ok = k === correctK;
          results.push(ok);
          Progress.markWrong(q.id, !ok);
          body.querySelectorAll('.opt')[correctK].classList.add('correct');
          if (!ok) b.classList.add('wrong');
          const fb = body.querySelector('#qFb');
          fb.innerHTML = `<div class="explain">${U.box(ok ? 'good' : 'bad', ok ? '✓ Correct' : '✗ Incorrect', `<p>${q.explain}</p>`)}</div><button class="primary" id="qNext">${i + 1 < qs.length ? 'Next →' : 'See result'}</button>`;
          U.renderMath(fb);
          fb.querySelector('#qNext').onclick = () => { i++; show(); };
          fb.querySelector('#qNext').focus();
        };
      });
    };
    const finish = () => {
      const score = results.filter(Boolean).length;
      if (!fixed) {
        if (topic !== 'all') Progress.recordQuiz(topic, score, qs.length);
        else { // record per topic for a mixed quiz
          const byT = {};
          qs.forEach((q, k) => { byT[q.topic] = byT[q.topic] || [0, 0]; byT[q.topic][1]++; if (results[k]) byT[q.topic][0]++; });
          Object.entries(byT).forEach(([t, [s, n]]) => Progress.recordQuiz(t, s, n));
        }
      }
      const pct = Math.round((100 * score) / qs.length);
      body.innerHTML = `<div class="card"><h2 style="border:0;margin-top:0">${pct >= 90 ? '🏆' : pct >= 70 ? '👍' : '📚'} ${score} / ${qs.length} (${pct}%)</h2>
        <p>${pct >= 90 ? 'Excellent — exam-ready on these concepts.' : pct >= 70 ? 'Good. Review the ones you missed below.' : 'Re-read the topic notes, then try again.'}</p>
        ${qs.map((q, k) => results[k] ? '' : `<div class="box bad"><p>${q.q}</p><p><b>Answer:</b> ${q.type === 'tf' ? (q.answer ? 'True' : 'False') : q.options[q.answer]} — ${q.explain}</p></div>`).join('')}
        <button class="primary" id="again">Try again</button></div>`;
      U.renderMath(body);
      body.querySelector('#again').onclick = () => startQuiz(topic, n, fixed);
    };
    show();
  }

  function mistakesPage() {
    const wrong = Progress.get().wrongQs;
    const qs = window.QUIZ.filter((q) => wrong[q.id]);
    app.innerHTML = `<h1>Review mistakes</h1><p class="muted">Quiz questions you got wrong (they disappear once you answer them correctly).</p><div id="qBody"></div>`;
    if (!qs.length) { app.querySelector('#qBody').innerHTML = U.box('good', 'Nothing to review', '<p>No outstanding mistakes. Take a <a href="#/quiz">quiz</a>!</p>'); return; }
    app.querySelector('#qBody').innerHTML = `<div class="card"><p>${qs.length} question(s) to review.</p><button class="primary" id="go">Retry them now</button></div>`;
    app.querySelector('#go').onclick = () => startQuiz('all', 999, qs);
  }

  /* ---------- flashcards ---------- */
  function flashPage(query) {
    let cards = query.topic ? window.FLASH.filter((c) => c.topic === query.topic) : window.FLASH.slice();
    let i = 0, flipped = false;
    app.innerHTML = `<h1>Flashcards</h1><p class="muted">Click the card (or press <kbd>Space</kbd>) to flip; <kbd>←</kbd>/<kbd>→</kbd> to move.</p>
      <div class="row"><select id="fTopic"><option value="">All topics</option>${TOPICS.map((t) => `<option value="${t.id}" ${query.topic === t.id ? 'selected' : ''}>${t.title}</option>`).join('')}</select><button id="fShuffle">🔀 Shuffle</button></div>
      <div class="card flash" id="fCard"></div>
      <div class="row space"><button id="fPrev">← Prev</button><span id="fCount" class="muted"></span><button id="fNext">Next →</button></div>`;
    const draw = () => {
      const c = cards[i];
      app.querySelector('#fCard').innerHTML = `<div><div class="side">${flipped ? 'Answer' : topicById(c.topic).title}</div><div>${flipped ? c.back : c.front}</div></div>`;
      app.querySelector('#fCount').textContent = `${i + 1} / ${cards.length}`;
      U.renderMath(app.querySelector('#fCard'));
    };
    const move = (d) => { i = (i + d + cards.length) % cards.length; flipped = false; draw(); };
    app.querySelector('#fCard').onclick = () => { flipped = !flipped; draw(); };
    app.querySelector('#fPrev').onclick = () => move(-1);
    app.querySelector('#fNext').onclick = () => move(1);
    app.querySelector('#fShuffle').onclick = () => { cards = shuffle(cards); i = 0; flipped = false; draw(); };
    app.querySelector('#fTopic').onchange = (e) => { location.hash = '#/flash' + (e.target.value ? '?topic=' + e.target.value : ''); };
    keyHandler = (e) => {
      if (e.target.tagName === 'SELECT') return;
      if (e.key === ' ') { e.preventDefault(); flipped = !flipped; draw(); }
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    };
    draw();
  }

  function practicePage(query) {
    app.innerHTML = `<h1>Random practice problems</h1><p class="muted">Fresh numbers every time. Answers are checked exactly (fractions like <code>-3/2</code> are accepted). A wrong answer automatically shows the full worked solution.${query.topic ? ` Showing: <b>${topicById(query.topic).title}</b> · <a href="#/practice">all topics</a>` : ''}</p><div id="pBody"></div>`;
    const gens = query.topic ? window.PRACTICE_GENS.filter((g) => g.topic === query.topic) : [];
    window.renderPractice(app.querySelector('#pBody'), query.topic && gens.length ? query.topic : null);
  }

  function cheatsheet() {
    const R = String.raw;
    app.innerHTML = R`<h1>Formula sheet & exam strategy</h1>
<div class="card"><h3>Exam strategy for 90–100%</h3><ol>
<li><b>Read the whole paper first</b>; start with the questions you are fastest at (determinants, eigenvalues, projections) to bank marks.</li>
<li><b>Show every step.</b> Label row operations (\(R_2\to R_2-2R_1\)), write the formula before substituting, state the theorem used (“by the Rank Theorem…”, “by the Spectral Theorem…”).</li>
<li><b>Always verify</b> — it is often worth 20–40% of a question: \(AA^{-1}=I\), \(PA=LU\), \(AP=PD\), \(\mathbf z\cdot\mathbf u = 0\), \(LA = I\), plug the solution back into the equations.</li>
<li><b>T/F questions:</b> give a one-line reason or a counterexample. A bare “True” gets no marks.</li>
<li><b>Exact answers:</b> keep fractions and square roots (\(\frac{1}{\sqrt5}\), \(2\sqrt5\)), no decimals.</li>
<li><b>Sanity checks:</b> trace = sum of eigenvalues, det = product; a unit vector has length 1; Σ has the shape of A; rank + nullity = n.</li></ol></div>
<div class="card overflow"><h3>Formulas</h3><table class="tbl">
<tr><th>Topic</th><th>Must-know</th></tr>
<tr><td>Systems</td><td>No solution ⇔ pivot in the augmented column. Unique ⇔ consistent + no free variable. \([A|I]\sim[I|A^{-1}]\). \(\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1} = \frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}\)</td></tr>
<tr><td>Blocks</td><td>\(C_{ij} = \sum_k A_{ik}B_{kj}\); column partition of A = row partition of B; \(AB = A_1B_1 + A_2B_2\)</td></tr>
<tr><td>LU</td><td>\(R_i\to R_i-\ell R_j\) ⇒ \(L_{ij} = \ell\); zero pivot ⇒ swap ⇒ \(PA = LU\); solve \(L\mathbf y = P\mathbf b,\ U\mathbf x = \mathbf y\)</td></tr>
<tr><td>Transformations</td><td>\(A = [T(\mathbf e_1)\cdots T(\mathbf e_n)]\); “S then R” ⇒ \(RS\); 1-1 ⇔ pivot every column; onto ⇔ pivot every row; rotation \(\begin{bmatrix}\cos&-\sin\\\sin&\cos\end{bmatrix}\)</td></tr>
<tr><td>Spaces</td><td>Col A basis = pivot cols of original A; Nul A basis from parametric form; rank + dim Nul = n; \([\mathbf x]_\mathcal B = P_\mathcal B^{-1}\mathbf x\); \([\mathcal C|\mathcal B]\sim[I|{}_{\mathcal C\leftarrow\mathcal B}P]\)</td></tr>
<tr><td>Determinants</td><td>\(C_{ij} = (-1)^{i+j}\det A_{ij}\); swap ⇒ −; scale by k ⇒ ×k; \(\det A = (-1)^r\prod\text{pivots}\); \(\det A^T = \det A\); \(\det AB = \det A\det B\); \(\det A^{-1} = 1/\det A\); \(\det kA = k^n\det A\); volume = |det|; Cramer \(x_i = \det A_i(\mathbf b)/\det A\)</td></tr>
<tr><td>Eigen</td><td>\(\det(A-\lambda I)=0\); 2×2: \(\lambda^2 - \operatorname{tr}A\,\lambda + \det A\); triangular ⇒ diagonal entries; diagonalizable ⇔ GM = AM ∀λ; \(A^k = PD^kP^{-1}\); check \(AP = PD\)</td></tr>
<tr><td>Orthogonality</td><td>\(\hat{\mathbf y} = \sum\frac{\mathbf y\cdot\mathbf u_i}{\mathbf u_i\cdot\mathbf u_i}\mathbf u_i\) (orthogonal basis); dist = \(\|\mathbf y - \hat{\mathbf y}\|\); \(U^TU = I\); \((\operatorname{Row}A)^\perp = \operatorname{Nul}A\), \((\operatorname{Col}A)^\perp = \operatorname{Nul}A^T\); G–S \(\mathbf v_2 = \mathbf x_2 - \frac{\mathbf x_2\cdot\mathbf v_1}{\mathbf v_1\cdot\mathbf v_1}\mathbf v_1\)</td></tr>
<tr><td>Symmetric / QF</td><td>\(A = PDP^T = \sum\lambda_i\mathbf u_i\mathbf u_i^T\); off-diagonal = ½ cross coefficient; \(\mathbf x = P\mathbf y\Rightarrow Q = \sum\lambda_iy_i^2\); definiteness from eigenvalue signs; max/min on unit sphere = \(\lambda_{\max}/\lambda_{\min}\)</td></tr>
<tr><td>SVD</td><td>\(\sigma_i = \sqrt{\lambda_i(A^TA)}\); V = unit eigenvectors of \(A^TA\); \(\mathbf u_i = A\mathbf v_i/\sigma_i\); Σ is m×n; \(A^+ = V_rD^{-1}U_r^T\); \(L = (A^TA)^{-1}A^T\); \(R = A^T(AA^T)^{-1}\); \(\max\|A\mathbf x\| = \sigma_1\)</td></tr>
</table></div>
<div class="card"><h3>Top 12 traps</h3><ol>
<li>Basis of Col A from the RREF columns (wrong — use the original A).</li>
<li>Composition order: “first S then R” is \(RS\), not \(SR\).</li>
<li>Change-of-basis coefficients written as rows instead of columns.</li>
<li>Forgetting the sign flip for each row swap in determinants.</li>
<li>\((\operatorname{Col}A)^\perp = \operatorname{Nul}A\) — false; it is \(\operatorname{Nul}A^T\).</li>
<li>Singular values = eigenvalues of \(A^TA\) — false; take square roots.</li>
<li>Quadratic form: putting the full cross coefficient off the diagonal instead of half of it.</li>
<li>Projection formula with a non-orthogonal basis.</li>
<li>Forgetting to normalise eigenvectors for \(A = PDP^T\) / SVD.</li>
<li>Mixing the order of eigenvectors in P with the eigenvalues in D.</li>
<li>Claiming “diagonalizable ⇒ distinct eigenvalues”.</li>
<li>Stopping at echelon form when the question asks for RREF.</li></ol></div>`;
    U.renderMath(app);
  }

  function progressPage() {
    app.innerHTML = `<h1>Progress file</h1>
      <div class="card"><p>Your progress is saved automatically.</p>
      <ul><li><b>With the server</b> (<code>node server.js</code>, then open <a href="http://localhost:3000">http://localhost:3000</a>) it is written to <code>LinAlg-Exam-Prep/progress.json</code>.</li>
      <li><b>Opened directly as a file</b>, it is kept in this browser. Use Export/Import below to move it into <code>progress.json</code> by hand.</li></ul>
      <p class="muted small" id="pStatus"></p>
      <div class="row"><button id="exp">⬇ Download progress.json</button><label class="btn">⬆ Import progress.json<input type="file" id="imp" accept=".json" hidden></label><button id="rst" class="ghost">Reset all progress</button></div></div>
      <div class="card"><h3>Current data</h3><pre style="white-space:pre-wrap;font-size:.8rem" id="pj"></pre></div>`;
    app.querySelector('#pStatus').textContent = document.getElementById('saveStatus').textContent;
    app.querySelector('#pj').textContent = Progress.exportJSON();
    app.querySelector('#exp').onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([Progress.exportJSON()], { type: 'application/json' }));
      a.download = 'progress.json'; a.click();
    };
    app.querySelector('#imp').onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then((s) => { try { Progress.importJSON(s); route(); } catch (err) { alert('Invalid file: ' + err.message); } });
    };
    app.querySelector('#rst').onclick = () => { if (confirm('Erase all progress?')) { Progress.reset(); route(); } };
  }

  function notFound() { app.innerHTML = '<h1>Not found</h1><p><a href="#/">Back to dashboard</a></p>'; }

  /* ---------- router ---------- */
  let keyHandler = null;
  document.addEventListener('keydown', (e) => keyHandler && keyHandler(e));
  function route() {
    keyHandler = null;
    const h = location.hash.slice(1) || '/';
    const [path, qs] = h.split('?');
    const query = Object.fromEntries(new URLSearchParams(qs || ''));
    const parts = path.split('/').filter(Boolean);
    renderNav(path);
    document.body.classList.remove('nav-open');
    window.scrollTo(0, 0);
    switch (parts[0]) {
      case undefined: home(); break;
      case 'topic': topicPage(parts[1]); break;
      case 'sol': solPage(parts[1], query); break;
      case 'tools': toolsPage(); break;
      case 'tool': toolPage(parts[1], query); break;
      case 'quiz': quizPage(query); break;
      case 'mistakes': mistakesPage(); break;
      case 'flash': flashPage(query); break;
      case 'practice': practicePage(query); break;
      case 'cheatsheet': cheatsheet(); break;
      case 'progress': progressPage(); break;
      default: notFound();
    }
  }

  // theme toggle (remembered per browser)
  const applyTheme = (t) => { if (t) document.documentElement.setAttribute('data-theme', t); };
  try { applyTheme(localStorage.getItem('cse903-theme')); } catch (e) { /* ignore */ }
  document.getElementById('themeBtn').onclick = () => {
    const cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const nt = cur === 'dark' ? 'light' : 'dark';
    applyTheme(nt);
    try { localStorage.setItem('cse903-theme', nt); } catch (e) { /* ignore */ }
  };
  document.getElementById('menuBtn').onclick = () => document.body.classList.toggle('nav-open');

  window.addEventListener('hashchange', route);
  Progress.load().then(route);
})();
