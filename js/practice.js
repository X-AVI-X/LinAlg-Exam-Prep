// Unlimited random practice problems with exact answer checking + worked solutions.
(function () {
  const L = window.LA, U = window.UI;
  const { F, texM, texV } = L;
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[ri(0, arr.length - 1)];
  const nz = (a, b) => { let x = 0; while (x === 0) x = ri(a, b); return x; };
  const mat = (rows) => L.toM(rows);
  const randM = (m, n, a = -3, b = 4) => mat(Array.from({ length: m }, () => Array.from({ length: n }, () => ri(a, b))));
  const vecEq = (u, v) => u.length === v.length && u.every((x, i) => x.eq(v[i]));
  const UNIMOD = [[[1, 1], [0, 1]], [[1, 2], [1, 3]], [[2, 1], [1, 1]], [[1, 0], [1, 1]], [[1, 1], [1, 2]], [[2, 3], [1, 2]], [[1, -1], [1, 0]], [[3, 2], [1, 1]]];

  const GENS = [
    {
      id: 'det3', topic: 'det', title: '3×3 determinant',
      gen() {
        const A = randM(3, 3, -3, 4);
        const d = L.det(A);
        return { prompt: `Compute \\(\\det ${texM(A)}\\).`, input: 'number', check: (s) => F(s).eq(d), answer: d.tex(), solution: () => U.cofactorHtml(A, 0, false) };
      },
    },
    {
      id: 'eig2', topic: 'eigen', title: 'Eigenvalues of a 2×2',
      gen() {
        const P = mat(pick(UNIMOD));
        let a = ri(-3, 5), b = ri(-3, 5); while (b === a) b = ri(-3, 5);
        const A = L.mul(L.mul(P, mat([[a, 0], [0, b]])), L.inverse(P));
        return {
          prompt: `Find the eigenvalues of \\(A = ${texM(A)}\\). <span class="hint">Enter both, separated by a space (any order).</span>`, input: 'text',
          check: (s) => { const v = U.parseVector(s).map(Number).sort((x, y) => x - y); return v.length === 2 && v[0] === Math.min(a, b) && v[1] === Math.max(a, b); },
          answer: `${Math.max(a, b)},\\ ${Math.min(a, b)}`, solution: () => U.eigenHtml(A),
        };
      },
    },
    {
      id: 'inv2', topic: 'systems', title: 'Inverse of a 2×2',
      gen() {
        let A, d;
        do { A = randM(2, 2, -4, 5); d = L.det(A); } while (![1, -1, 2, -2].includes(+d));
        const inv = L.inverse(A);
        return { prompt: `Find \\(A^{-1}\\) for \\(A = ${texM(A)}\\).`, input: 'matrix', check: (s) => L.eqM(U.parseMatrix(s), inv), answer: texM(inv), solution: () => U.inverseHtml(A) };
      },
    },
    {
      id: 'inv3', topic: 'systems', title: 'Inverse of a 3×3 (Gauss–Jordan)',
      gen() {
        let A, d;
        do { A = randM(3, 3, -2, 3); d = L.det(A); } while (![1, -1].includes(+d));
        const inv = L.inverse(A);
        return { prompt: `Find \\(A^{-1}\\) for \\(A = ${texM(A)}\\) by row reducing \\([A|I]\\).`, input: 'matrix', check: (s) => L.eqM(U.parseMatrix(s), inv), answer: texM(inv), solution: () => U.inverseHtml(A) };
      },
    },
    {
      id: 'systype', topic: 'systems', title: 'Classify a linear system',
      gen() {
        const kind = pick(['unique', 'infinite', 'none']);
        let Aug;
        const r1 = [nz(-2, 3), ri(-3, 3), ri(-3, 3), ri(-5, 6)], r2 = [ri(-3, 3), nz(-2, 3), ri(-3, 3), ri(-5, 6)];
        if (kind === 'unique') {
          do { Aug = randM(3, 4, -3, 4); } while (L.det(Aug.map((r) => r.slice(0, 3))).isZero());
        } else {
          const a = nz(-2, 2), b = nz(-2, 2);
          const r3 = r1.map((x, i) => a * x + b * r2[i]);
          if (kind === 'none') r3[3] += nz(-3, 3);
          Aug = mat([r1, r2, r3]);
          if (L.rank(mat([r1.slice(0, 3), r2.slice(0, 3)])) < 2) return this.gen();
        }
        const truth = L.analyseSystem(Aug).type;
        return {
          prompt: `How many solutions does the system with augmented matrix \\(${texM(Aug, { bar: 3 })}\\) have?`, input: 'choice', choices: ['none', 'unique', 'infinite'],
          check: (s) => s === truth, answer: `\\text{${truth}}`, solution: () => U.systemHtml(Aug),
        };
      },
    },
    {
      id: 'rank', topic: 'spaces', title: 'Rank & nullity',
      gen() {
        const r1 = [ri(-3, 3), ri(-3, 3), ri(-3, 3), ri(-3, 3)].map((x, i) => (i === 0 && x === 0 ? 1 : x));
        const r2 = [ri(-3, 3), ri(-3, 3), ri(-3, 3), ri(-3, 3)];
        const a = ri(-2, 2), b = ri(-2, 2);
        const r3 = Math.random() < 0.6 ? r1.map((x, i) => a * x + b * r2[i]) : [ri(-3, 3), ri(-3, 3), ri(-3, 3), ri(-3, 3)];
        const A = mat([r1, r2, r3]);
        const rk = L.rank(A);
        return { prompt: `\\(A = ${texM(A)}\\). Enter <b>rank A</b> and <b>dim Nul A</b> separated by a space.`, input: 'text',
          check: (s) => { const v = U.parseVector(s).map(Number); return v[0] === rk && v[1] === 4 - rk; }, answer: `${rk},\\ ${4 - rk}`, solution: () => U.colNullHtml(A) };
      },
    },
    {
      id: 'lu3', topic: 'lu', title: 'Find L in A = LU',
      gen() {
        const Lm = mat([[1, 0, 0], [ri(-3, 3), 1, 0], [ri(-3, 3), ri(-3, 3), 1]]);
        const Um = mat([[nz(-3, 3), ri(-3, 3), ri(-3, 3)], [0, nz(-3, 3), ri(-3, 3)], [0, 0, nz(-3, 3)]]);
        const A = L.mul(Lm, Um);
        const lu = L.luSteps(A);
        return { prompt: `Find the unit lower triangular \\(L\\) in \\(A = LU\\) for \\(A = ${texM(A)}\\).`, input: 'matrix', check: (s) => L.eqM(U.parseMatrix(s), lu.L), answer: texM(lu.L), solution: () => U.luHtml(A) };
      },
    },
    {
      id: 'coords', topic: 'spaces', title: 'Coordinate vector [x]_B',
      gen() {
        const P = mat(pick(UNIMOD));
        const c = [ri(-4, 4), ri(-4, 4)].map(F);
        const x = L.mulV(P, c);
        const bs = L.transpose(P);
        return { prompt: `\\(\\mathbf b_1 = ${texV(bs[0])},\\ \\mathbf b_2 = ${texV(bs[1])}\\), \\(\\mathbf x = ${texV(x)}\\). Find \\([\\mathbf x]_\\mathcal B\\).`, input: 'vector',
          check: (s) => vecEq(U.parseVector(s), c), answer: texV(c), solution: () => U.coordHtml(bs, x) };
      },
    },
    {
      id: 'proj', topic: 'orth', title: 'Projection onto a line',
      gen() {
        const n = pick([2, 3]);
        const u = Array.from({ length: n }, () => F(ri(-2, 3))); if (L.isZeroV(u)) u[0] = F(1);
        const y = Array.from({ length: n }, () => F(ri(-4, 6)));
        const p = L.projectOnto(y, [u]);
        return { prompt: `Find the orthogonal projection of \\(\\mathbf y = ${texV(y)}\\) onto \\(\\mathbf u = ${texV(u)}\\).`, input: 'vector',
          check: (s) => vecEq(U.parseVector(s), p.yhat), answer: texV(p.yhat), solution: () => U.projHtml(y, [u]) };
      },
    },
    {
      id: 'gs', topic: 'orth', title: 'Gram–Schmidt (find v₂)',
      gen() {
        let x1, x2;
        do { x1 = Array.from({ length: 3 }, () => F(ri(-2, 2))); x2 = Array.from({ length: 3 }, () => F(ri(-3, 3))); } while (L.isZeroV(x1) || L.rank([x1, x2]) < 2);
        const v2 = L.gramSchmidt([x1, x2]).vs[1];
        return { prompt: `Apply Gram–Schmidt to \\(\\mathbf x_1 = ${texV(x1)},\\ \\mathbf x_2 = ${texV(x2)}\\). Enter \\(\\mathbf v_2\\) <span class="hint">(any nonzero scalar multiple is accepted)</span>.`, input: 'vector',
          check: (s) => { const w = U.parseVector(s); return w.length === 3 && !L.isZeroV(w) && L.rank([w, v2]) === 1; }, answer: texV(v2), solution: () => U.gsHtml([x1, x2]) };
      },
    },
    {
      id: 'quadmat', topic: 'symm', title: 'Matrix of a quadratic form',
      gen() {
        const n = pick([2, 3]);
        const A = L.zeros(n, n);
        for (let i = 0; i < n; i++) A[i][i] = F(ri(-4, 6));
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const c = F(ri(-3, 3) * 2 + (Math.random() < 0.3 ? 1 : 0)).div(2); A[i][j] = c; A[j][i] = c; }
        return { prompt: `Find the symmetric matrix A with \\(Q(\\mathbf x) = ${U.quadExprTex(A)} = \\mathbf x^TA\\mathbf x\\).`, input: 'matrix',
          check: (s) => L.eqM(U.parseMatrix(s), A), answer: texM(A), solution: () => U.quadHtml(A) };
      },
    },
    {
      id: 'definite', topic: 'symm', title: 'Classify a quadratic form',
      gen() {
        const P = mat(pick([[[1, 1], [-1, 1]], [[2, -1], [1, 2]], [[1, -2], [2, 1]], [[1, -3], [3, 1]]]));
        const d1 = nz(-4, 6), d2 = nz(-4, 6);
        // A = P D P^T / |col|^2 keeps it symmetric with eigenvalues d1, d2
        const n2 = L.dot(L.col(P, 0), L.col(P, 0));
        const A = L.scale(F(1).div(n2), L.mul(L.mul(P, mat([[d1, 0], [0, d2]])), L.transpose(P)));
        const truth = U.classify([d1, d2]);
        return { prompt: `Classify \\(Q(\\mathbf x) = ${U.quadExprTex(A)}\\).`, input: 'choice', choices: ['positive definite', 'negative definite', 'indefinite'],
          check: (s) => s === truth, answer: `\\text{${truth}}`, solution: () => U.quadHtml(A) };
      },
    },
    {
      id: 'cramer', topic: 'det', title: "Cramer's rule (2×2)",
      gen() {
        let A; do { A = randM(2, 2, -4, 5); } while (L.det(A).isZero());
        const b = [F(ri(-6, 6)), F(ri(-6, 6))];
        const x1 = L.det(A.map((r, i) => [b[i], r[1]])).div(L.det(A));
        return { prompt: `Use Cramer's rule on \\(${texM(A)}\\mathbf x = ${texV(b)}\\). Enter \\(x_1\\).`, input: 'number', check: (s) => F(s).eq(x1), answer: x1.tex(), solution: () => U.cramerHtml(A, b) };
      },
    },
    {
      id: 'compose', topic: 'transform', title: 'Composite transformation',
      gen() {
        const ops = [
          ['rotates 90° counter-clockwise', [[0, -1], [1, 0]]], ['reflects in the x-axis', [[1, 0], [0, -1]]], ['reflects in the line y = x', [[0, 1], [1, 0]]],
          ['reflects in the y-axis', [[-1, 0], [0, 1]]], ['rotates 180°', [[-1, 0], [0, -1]]],
        ];
        const k = nz(-3, 3);
        const shear = [`applies a horizontal shear taking \\(\\mathbf e_2\\) to \\((${k},1)\\)`, [[1, k], [0, 1]]];
        let first = Math.random() < 0.5 ? shear : pick(ops), second = pick(ops);
        while (second === first) second = pick(ops);
        const S = mat(first[1]), Rm = mat(second[1]);
        const A = L.mul(Rm, S);
        return { prompt: `T first ${first[0]} and then ${second[0]}. Find the standard matrix of T.`, input: 'matrix', check: (s) => L.eqM(U.parseMatrix(s), A), answer: texM(A),
          solution: () => `<p>First map: \\(${texM(S)}\\). Second map: \\(${texM(Rm)}\\). The first map goes on the <b>right</b>:</p>\\[A = ${texM(Rm)}${texM(S)} = ${texM(A)}\\]` + U.transformHtml(A) };
      },
    },
    {
      id: 'svdsig', topic: 'svd', title: 'Singular values',
      gen() {
        // A = U Σ Vᵀ built from Pythagorean rotations so the σ's are integers
        const rots = [[[3, -4], [4, 3]], [[4, -3], [3, 4]], [[1, 0], [0, 1]], [[0, -1], [1, 0]]];
        const s1 = ri(2, 6), s2 = ri(0, s1 - 1);
        const Um = mat(pick(rots)), Vm = mat(pick(rots));
        const scaleU = L.dot(L.col(Um, 0), L.col(Um, 0)), scaleV = L.dot(L.col(Vm, 0), L.col(Vm, 0));
        const den = Math.sqrt(+scaleU * +scaleV);
        let A = L.mul(L.mul(Um, mat([[s1, 0], [0, s2]])), L.transpose(Vm));
        A = L.scale(F(1).div(F(den)), A);
        return { prompt: `Find the singular values of \\(A = ${texM(A)}\\). <span class="hint">Enter both (largest first).</span>`, input: 'text',
          check: (s) => { const v = U.parseVector(s).map(Number); return v.length === 2 && v[0] === s1 && v[1] === s2; }, answer: `${s1},\\ ${s2}`, solution: () => U.svdHtml(A) };
      },
    },
  ];

  function renderPractice(el, onlyTopic) {
    const gens = onlyTopic ? GENS.filter((g) => g.topic === onlyTopic) : GENS;
    let cur = null, gen = null, attempted = false, session = { right: 0, total: 0 };
    el.innerHTML = `
      <div class="card"><div class="row space">
        <div class="row"><label class="f" style="margin:0">Problem type</label>
        <select id="pType"><option value="mix">🎲 Random mix</option>${gens.map((g) => `<option value="${g.id}">${g.title}</option>`).join('')}</select></div>
        <span class="pill acc" id="pScore">Session 0 / 0</span></div></div>
      <div class="card" id="pCard"></div><div id="pSol"></div>`;
    const card = el.querySelector('#pCard'), sol = el.querySelector('#pSol');
    function next() {
      const t = el.querySelector('#pType').value;
      gen = t === 'mix' ? pick(gens) : gens.find((g) => g.id === t);
      cur = gen.gen(); attempted = false; sol.innerHTML = '';
      let input;
      if (cur.input === 'choice') input = `<div class="row">${cur.choices.map((c) => `<button class="choice" data-v="${c}">${c}</button>`).join('')}</div>`;
      else if (cur.input === 'matrix') input = `<textarea id="pIn" rows="3" placeholder="one row per line, e.g.\n1 2\n3 4"></textarea>`;
      else input = `<input type="text" id="pIn" placeholder="${cur.input === 'vector' ? 'e.g. 3 6  or  1/2 -1' : 'your answer (fractions OK)'}">`;
      card.innerHTML = `<div class="pill">${gen.title}</div><p style="font-size:1.05rem">${cur.prompt}</p>${input}
        <div class="row" style="margin-top:12px">${cur.input !== 'choice' ? '<button class="primary" id="pCheck">Check</button>' : ''}<button id="pShow">Show solution</button><button id="pNext">Next problem →</button></div>
        <div id="pFb" style="margin-top:10px"></div>`;
      U.renderMath(card);
      const fb = card.querySelector('#pFb');
      const grade = (val) => {
        let ok = false;
        try { ok = cur.check(val); } catch (e) { fb.innerHTML = `<span class="err">Could not read your answer: ${U.esc(e.message)}</span>`; return; }
        if (!attempted) { attempted = true; session.total++; if (ok) session.right++; Progress.recordPractice(ok); }
        el.querySelector('#pScore').textContent = `Session ${session.right} / ${session.total}`;
        fb.innerHTML = ok ? U.box('good', '✓ Correct!', '') : U.box('bad', '✗ Not quite', `<p>Correct answer: \\(${cur.answer}\\)</p>`);
        U.renderMath(fb);
        if (!ok) showSol();
      };
      const showSol = () => { sol.innerHTML = `<div class="card"><h3>Worked solution</h3>${cur.solution()}</div>`; U.renderMath(sol); };
      if (cur.input === 'choice') card.querySelectorAll('.choice').forEach((b) => { b.onclick = () => grade(b.dataset.v); });
      else {
        card.querySelector('#pCheck').onclick = () => grade(card.querySelector('#pIn').value);
        card.querySelector('#pIn').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (cur.input !== 'matrix' || e.ctrlKey)) { e.preventDefault(); grade(e.target.value); } });
        card.querySelector('#pIn').focus();
      }
      card.querySelector('#pShow').onclick = showSol;
      card.querySelector('#pNext').onclick = next;
    }
    el.querySelector('#pType').onchange = next;
    next();
  }

  window.PRACTICE_GENS = GENS;
  window.renderPractice = renderPractice;
})();
