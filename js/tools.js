// Interactive step-by-step solvers. Each tool = inputs + a run() that returns a worked solution.
(function () {
  const L = window.LA, U = window.UI;
  const { im, dm } = U;
  const M = (t) => U.parseMatrix(t);
  const V = (t) => U.parseVector(t);
  const sizes = (t) => String(t).split(/[\s,+]+/).filter(Boolean).map(Number);
  const cols = (t) => L.transpose(M(t)); // matrix whose columns are vectors -> list of vectors

  const TOOLS = [
    {
      id: 'system', topic: 'systems', title: 'Solve a linear system', desc: 'Augmented matrix → echelon → RREF → solution type',
      inputs: [{ id: 'A', type: 'matrix', label: 'Augmented matrix [A | b]', def: '1 2 -1 3\n2 -1 3 1\n3 1 2 4', hint: 'Last column is b. One row per line; fractions like 1/2 are fine.' }],
      run: (v) => U.systemHtml(M(v.A)),
    },
    {
      id: 'rref', topic: 'systems', title: 'Echelon form, pivots & rank', desc: 'Row reduce any matrix; list pivot positions, basic/free variables',
      inputs: [{ id: 'A', type: 'matrix', label: 'Matrix', def: '1 0 2 1\n0 1 -1 2\n1 1 1 4' }],
      run: (v) => U.rrefHtml(M(v.A)),
    },
    {
      id: 'inverse', topic: 'systems', title: 'Inverse by Gauss–Jordan', desc: '[A | I] → [I | A⁻¹], then verify AA⁻¹ = I',
      inputs: [{ id: 'A', type: 'matrix', label: 'Square matrix A', def: '1 2 3\n0 1 4\n5 6 0' }],
      run: (v) => U.inverseHtml(M(v.A)),
    },
    {
      id: 'block', topic: 'block', title: 'Block multiplication', desc: 'Partition A and B, compute every Cᵢⱼ = Σ AᵢₖBₖⱼ',
      inputs: [
        { id: 'A', type: 'matrix', label: 'A', def: '1 2 0 1\n0 1 1 0\n2 0 1 1\n1 1 0 2' },
        { id: 'B', type: 'matrix', label: 'B', def: '1 0 1 0\n0 1 0 1\n1 1 0 0\n0 0 1 1' },
        { id: 'rp', type: 'text', label: 'Row partition of A', def: '2 2', hint: 'Block heights, e.g. "2 2" or "2 3"' },
        { id: 'kp', type: 'text', label: 'Column partition of A = row partition of B', def: '2 2' },
        { id: 'cp', type: 'text', label: 'Column partition of B', def: '2 2' },
        { id: 'only', type: 'text', label: 'Only these blocks (optional)', def: '', hint: 'e.g. "11 23" to compute only C₁₁ and C₂₃' },
      ],
      run: (v) => {
        const only = v.only.trim() ? v.only.trim().split(/\s+/).map((s) => [Number(s[0]) - 1, Number(s[1]) - 1]) : null;
        return U.blockHtml(M(v.A), M(v.B), sizes(v.rp), sizes(v.kp), sizes(v.cp), { only });
      },
    },
    {
      id: 'blockdims', topic: 'block', title: 'Block compatibility checker', desc: 'Is A₁₁B₁₁ + A₁₂B₂₁ defined? Reason with sizes only',
      inputs: [{ id: 'expr', type: 'text', label: 'Sum of block products (sizes)', def: '3x2 * 2x5 + 3x3 * 4x5', hint: 'Format: "p×q * r×s + …" (x or × both fine)' }],
      run: (v) => {
        const terms = v.expr.split('+').map((t) => t.split('*').map((s) => s.trim().split(/[x×]/).map(Number)));
        let h = ''; let ok = true; const res = [];
        terms.forEach((t, i) => {
          const [[p, q], [r, s]] = t;
          if (q === r) { h += `<p>Term ${i + 1}: ${im(`(${p}\\times${q})(${r}\\times${s})`)} — inner sizes ${q} = ${r} ✓ → result ${im(`${p}\\times${s}`)}</p>`; res.push([p, s]); }
          else { ok = false; h += `<p>Term ${i + 1}: ${im(`(${p}\\times${q})(${r}\\times${s})`)} — inner sizes <b>${q} ≠ ${r}</b> ✗ (the number of columns of the A-block must equal the number of rows of the B-block)</p>`; }
        });
        if (ok && res.some((d) => d[0] !== res[0][0] || d[1] !== res[0][1])) { ok = false; h += '<p>The products have different sizes, so they cannot be added ✗</p>'; }
        return h + U.ans(ok ? `<p><b>Defined.</b> Resulting block is ${im(`${res[0][0]}\\times${res[0][1]}`)}.</p>` : '<p><b>Not defined</b> — see the mismatch above.</p>');
      },
    },
    {
      id: 'lu', topic: 'lu', title: 'LU factorization (PA = LU)', desc: 'Detect a zero pivot, swap rows, build P, L, U and verify',
      inputs: [{ id: 'A', type: 'matrix', label: 'Square matrix A', def: '1 2 3\n2 4 5\n1 3 4' }],
      run: (v) => U.luHtml(M(v.A)),
    },
    {
      id: 'spaces', topic: 'spaces', title: 'Col A, Nul A & Rank Theorem', desc: 'Bases, dimensions, parametric form, rank + nullity = n',
      inputs: [{ id: 'A', type: 'matrix', label: 'Matrix A', def: '1 2 0 -1\n2 4 1 1\n3 6 1 0' },
        { id: 'orth', type: 'select', label: 'Also check Nul A ⟂ rows?', options: ['yes', 'no'], def: 'yes' }],
      run: (v) => U.colNullHtml(M(v.A), { orth: v.orth === 'yes' }),
    },
    {
      id: 'span', topic: 'spaces', title: 'Basis of a span / redundant vectors', desc: 'Which vectors are redundant? Find a basis and the dimension',
      inputs: [{ id: 'A', type: 'matrix', label: 'Vectors as COLUMNS', def: '1 2 0 1\n2 4 1 3\n3 6 1 4', hint: 'Each column is one vector vᵢ' }],
      run: (v) => {
        const A = M(v.A);
        const r = L.rrefSteps(A);
        const n = A[0].length;
        let h = U.stepsHtml(r.steps.filter((s) => s.ops.length || s.marker));
        const red = [];
        for (let j = 0; j < n; j++) if (!r.pivots.includes(j)) {
          const comb = r.pivots.map((p, i) => [r.rref[i][j], p]).filter(([c]) => !c.isZero())
            .map(([c, p], k) => L.termTex(c, `\\mathbf v_{${p + 1}}`, k === 0)).join('');
          red.push(`${im(`\\mathbf v_{${j + 1}} = ${comb || '\\mathbf 0'}`)}`);
        }
        h += `<p>Non-pivot columns are linear combinations of the pivot columns (read the coefficients from the RREF):</p><p>${red.join('<br>') || 'None — all vectors are independent.'}</p>`;
        h += U.ans(`<p>Basis: ${im('\\{' + r.pivots.map((p) => `\\mathbf v_{${p + 1}}`).join(', ') + '\\}')} = ${im('\\left\\{' + r.pivots.map((p) => L.texV(L.col(A, p))).join(',') + '\\right\\}')}</p><p>dim = <b>${r.rank}</b></p>`);
        return h;
      },
    },
    {
      id: 'lt', topic: 'transform', title: 'Image, pre-image & range', desc: 'T(u) = Cu, solve Cx = b, test whether v is in the range',
      inputs: [
        { id: 'C', type: 'matrix', label: 'Standard matrix C', def: '2 -1\n1 4\n3 2' },
        { id: 'u', type: 'vector', label: 'u (find T(u))', def: '-2 3' },
        { id: 'b', type: 'vector', label: 'b (find x with T(x)=b / is b in range?)', def: '5 7 11' },
      ],
      run: (v) => {
        const C = M(v.C); let h = '';
        if (v.u.trim()) {
          const u = V(v.u); const Cu = L.mulV(C, u);
          const rowsTex = C.map((r) => r.map((x, j) => `(${x.tex()})(${u[j].tex()})`).join('+'));
          h += '<h4>Image</h4>' + dm(`T(\\mathbf u) = C\\mathbf u = ${L.texM(C)}${L.texV(u)} = \\begin{bmatrix}${rowsTex.join('\\\\')}\\end{bmatrix} = ${L.texV(Cu)}`);
        }
        if (v.b.trim()) {
          const b = V(v.b);
          h += '<h4>Pre-image: solve C x = b</h4>' + U.systemHtml(C.map((r, i) => r.concat([b[i]])));
        }
        h += '<h4>Properties of T</h4>' + U.transformHtml(C);
        return h;
      },
    },
    { id: 'ltviz', topic: 'transform', title: 'Transformation visualiser', desc: 'Compose shears, rotations, reflections; watch the unit square', custom: true },
    {
      id: 'coords', topic: 'spaces', title: 'Coordinates relative to a basis', desc: 'P_B, P_B⁻¹ and [x]_B with verification',
      inputs: [{ id: 'B', type: 'matrix', label: 'Basis vectors as COLUMNS', def: '2 1\n1 1' }, { id: 'x', type: 'vector', label: 'x', def: '7 4' }],
      run: (v) => U.coordHtml(cols(v.B), V(v.x)),
    },
    {
      id: 'cob', topic: 'spaces', title: 'Change of basis P(C←B)', desc: 'Row reduce [C | B]; inverse; convert coordinates',
      inputs: [
        { id: 'C', type: 'matrix', label: 'Basis C as COLUMNS', def: '1 2\n2 5' },
        { id: 'B', type: 'matrix', label: 'Basis B as COLUMNS', def: '5 2\n11 6' },
        { id: 'x', type: 'vector', label: '[x]_B (optional)', def: '1 -1' },
      ],
      run: (v) => U.changeBasisHtml(cols(v.B), cols(v.C), v.x.trim() ? V(v.x) : null),
    },
    {
      id: 'det', topic: 'det', title: 'Determinant (cofactor & elimination)', desc: 'Every cofactor shown; or (−1)ʳ × product of pivots',
      inputs: [
        { id: 'A', type: 'matrix', label: 'Square matrix', def: '2 1 0\n3 -1 4\n0 2 5' },
        { id: 'how', type: 'select', label: 'Method', options: ['row 1', 'row 2', 'row 3', 'column 1', 'column 2', 'column 3', 'elimination'], def: 'row 1' },
      ],
      run: (v) => {
        const A = M(v.A);
        if (A.length !== A[0].length) throw new Error('Matrix must be square.');
        if (v.how === 'elimination') return U.detElimHtml(A);
        const [kind, k] = v.how.split(' ');
        if (+k > A.length) throw new Error('Matrix is too small for that row/column.');
        return U.cofactorHtml(A, +k - 1, kind === 'column');
      },
    },
    {
      id: 'cramer', topic: 'det', title: "Cramer's rule", desc: 'xᵢ = det Aᵢ(b) / det A',
      inputs: [{ id: 'A', type: 'matrix', label: 'Coefficient matrix A', def: '0 1 2\n1 2 1\n2 7 9' }, { id: 'b', type: 'vector', label: 'b', def: '8 8 43' }],
      run: (v) => U.cramerHtml(M(v.A), V(v.b)),
    },
    {
      id: 'eigen', topic: 'eigen', title: 'Eigenvalues, eigenvectors & diagonalization', desc: 'Characteristic polynomial, eigenspaces, AM vs GM, P and D',
      inputs: [{ id: 'A', type: 'matrix', label: 'Square matrix', def: '8 -3 0\n6 -1 0\n6 -3 2' }],
      run: (v) => U.eigenHtml(M(v.A)),
    },
    {
      id: 'power', topic: 'eigen', title: 'Matrix power Aᵏ = PDᵏP⁻¹', desc: 'Use diagonalization to compute powers',
      inputs: [{ id: 'A', type: 'matrix', label: 'Diagonalizable matrix', def: '4 1\n2 3' }, { id: 'k', type: 'text', label: 'k', def: '3' }],
      run: (v) => U.powerHtml(M(v.A), parseInt(v.k, 10)),
    },
    {
      id: 'gs', topic: 'orth', title: 'Gram–Schmidt', desc: 'Orthogonal then orthonormal basis',
      inputs: [{ id: 'X', type: 'matrix', label: 'Vectors x₁, x₂, … one per LINE', def: '1 1 1\n1 2 3', hint: 'Here each row is one vector' }],
      run: (v) => U.gsHtml(M(v.X)),
    },
    {
      id: 'proj', topic: 'orth', title: 'Orthogonal projection & distance', desc: 'ŷ onto a line or subspace, z = y − ŷ, distance',
      inputs: [{ id: 'y', type: 'vector', label: 'y', def: '2 4 6' }, { id: 'U', type: 'matrix', label: 'Spanning vectors u₁, u₂, … one per LINE', def: '1 1 1\n1 -1 0' }],
      run: (v) => U.projHtml(V(v.y), M(v.U)),
    },
    {
      id: 'orthset', topic: 'orth', title: 'Orthogonal-basis weights', desc: 'cⱼ = (y·uⱼ)/(uⱼ·uⱼ) — no system solving',
      inputs: [{ id: 'y', type: 'vector', label: 'y', def: '6 -3 9' }, { id: 'U', type: 'matrix', label: 'Orthogonal vectors one per LINE', def: '1 2 2\n2 1 -2\n2 -2 1' }],
      run: (v) => {
        const y = V(v.y), us = M(v.U);
        let h = '<p>Check orthogonality:</p><p>' + us.map((u, i) => us.slice(i + 1).map((w, j) => im(`\\mathbf u_{${i + 1}}\\cdot\\mathbf u_{${i + j + 2}} = ${L.dot(u, w).tex()}`)).join(', ')).filter(Boolean).join(', ') + '</p>';
        if (!L.isOrthogonalSet(us)) return h + U.box('bad', '', 'Not an orthogonal set — the weight formula does not apply.');
        const cs = us.map((u) => L.dot(y, u).div(L.dot(u, u)));
        h += us.map((u, i) => dm(`c_{${i + 1}} = \\frac{\\mathbf y\\cdot\\mathbf u_{${i + 1}}}{\\mathbf u_{${i + 1}}\\cdot\\mathbf u_{${i + 1}}} = \\frac{${L.dot(y, u).tex()}}{${L.dot(u, u).tex()}} = ${cs[i].tex()}`)).join('');
        return h + U.ans(dm(`\\mathbf y = ${cs.map((c, i) => L.coefTex(c, `\\mathbf u_{${i + 1}}`)).join(' + ').replace(/\+ -/g, '- ')}`));
      },
    },
    {
      id: 'quad', topic: 'symm', title: 'Quadratic forms', desc: 'Matrix of Q, classification, value at a point',
      inputs: [
        { id: 'A', type: 'matrix', label: 'Symmetric matrix A', def: '5 2\n2 2', hint: 'Off-diagonal = HALF of the xᵢxⱼ coefficient. Use the “from coefficients” box instead if easier.' },
        { id: 'coef', type: 'text', label: 'OR coefficients (overrides A)', def: '', hint: '2 vars: a b c for ax₁²+bx₁x₂+cx₂² · 3 vars: a11 a22 a33 a12 a13 a23 (cross-term coefficients)' },
        { id: 'x', type: 'vector', label: 'Evaluate at x (optional)', def: '' },
      ],
      run: (v) => {
        let A;
        if (v.coef.trim()) {
          const c = V(v.coef); const h2 = (x) => x.div(2);
          if (c.length === 3) A = [[c[0], h2(c[1])], [h2(c[1]), c[2]]];
          else if (c.length === 6) A = [[c[0], h2(c[3]), h2(c[4])], [h2(c[3]), c[1], h2(c[5])], [h2(c[4]), h2(c[5]), c[2]]];
          else throw new Error('Give 3 numbers (2 variables) or 6 numbers (3 variables).');
        } else A = M(v.A);
        return U.quadHtml(A, v.x.trim() ? V(v.x) : null) + '<h4>Spectral decomposition / principal axes</h4>' + U.eigenHtml(A, { diag: true });
      },
    },
    {
      id: 'svd', topic: 'svd', title: 'Singular value decomposition', desc: 'AᵀA → σᵢ, V, uᵢ = Avᵢ/σᵢ, complete U, pseudoinverse',
      inputs: [{ id: 'A', type: 'matrix', label: 'Matrix A', def: '1 0\n0 1\n1 1' }],
      run: (v) => U.svdHtml(M(v.A)),
    },
    {
      id: 'leftright', topic: 'svd', title: 'Left / right inverse', desc: '(AᵀA)⁻¹Aᵀ or Aᵀ(AAᵀ)⁻¹, with checks',
      inputs: [{ id: 'A', type: 'matrix', label: 'Matrix A', def: '1 0\n0 1\n1 1' }],
      run: (v) => U.leftRightHtml(M(v.A)),
    },
    {
      id: 'matmul', topic: 'systems', title: 'Matrix calculator', desc: 'AB, A+B, Aᵀ, A⁻¹ — for checking your work',
      inputs: [
        { id: 'A', type: 'matrix', label: 'A', def: '1 2\n3 4' },
        { id: 'B', type: 'matrix', label: 'B', def: '0 1\n1 0' },
        { id: 'op', type: 'select', label: 'Operation', options: ['AB', 'BA', 'A+B', 'A−B', 'Aᵀ', 'AᵀA', 'det A', 'A⁻¹'], def: 'AB' },
      ],
      run: (v) => {
        const A = M(v.A); const B = () => M(v.B); let r;
        switch (v.op) {
          case 'AB': r = L.mul(A, B()); break;
          case 'BA': r = L.mul(B(), A); break;
          case 'A+B': r = L.add(A, B()); break;
          case 'A−B': r = L.sub(A, B()); break;
          case 'Aᵀ': r = L.transpose(A); break;
          case 'AᵀA': r = L.mul(L.transpose(A), A); break;
          case 'det A': return U.ans(dm('\\det A = ' + L.det(A).tex()));
          case 'A⁻¹': r = L.inverse(A); break;
        }
        return U.ans(dm(`${v.op.replace('ᵀ', '^T').replace('⁻¹', '^{-1}').replace('−', '-')} = ${L.texM(r)}`));
      },
    },
  ];

  /* ---------- generic tool page ---------- */
  function renderTool(tool, el, prefill = {}) {
    if (tool.custom) return renderLtViz(el);
    const field = (f) => {
      const val = prefill[f.id] != null ? prefill[f.id] : f.def;
      let input;
      if (f.type === 'matrix') {
        const rows = Math.max(3, String(val).split('\n').length + 1);
        input = `<textarea id="in-${f.id}" rows="${rows}" spellcheck="false">${U.esc(val)}</textarea>`;
      } else if (f.type === 'select') {
        input = `<select id="in-${f.id}">${f.options.map((o) => `<option ${o === val ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
      } else input = `<input type="text" id="in-${f.id}" value="${U.esc(val)}" spellcheck="false">`;
      return `<div><label class="f" for="in-${f.id}">${f.label}</label>${input}${f.hint ? `<div class="hint">${f.hint}</div>` : ''}</div>`;
    };
    el.innerHTML = `
      <div class="card">
        <div class="inputs">${tool.inputs.map(field).join('')}</div>
        <div class="row" style="margin-top:14px"><button class="primary" id="runBtn">▶ Solve step by step</button><span class="hint">Tip: <kbd>Ctrl</kbd>+<kbd>Enter</kbd> also solves</span></div>
        <div id="toolErr" class="err"></div>
      </div>
      <div id="toolOut"></div>`;
    const run = () => {
      const vals = {};
      tool.inputs.forEach((f) => { vals[f.id] = el.querySelector('#in-' + f.id).value; });
      const out = el.querySelector('#toolOut');
      el.querySelector('#toolErr').textContent = '';
      try {
        out.innerHTML = `<div class="card">${tool.run(vals)}</div>`;
        U.renderMath(out);
      } catch (e) {
        out.innerHTML = '';
        el.querySelector('#toolErr').textContent = '⚠ ' + e.message;
      }
    };
    el.querySelector('#runBtn').onclick = run;
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) run(); });
    run();
  }

  /* ---------- transformation visualiser ---------- */
  const OPS = {
    'Shear x by k (top moves right k)': (k) => [[1, k], [0, 1]],
    'Shear y by k': (k) => [[1, 0], [k, 1]],
    'Rotate 90° CCW': () => [[0, -1], [1, 0]],
    'Rotate 180°': () => [[-1, 0], [0, -1]],
    'Rotate 90° CW (270° CCW)': () => [[0, 1], [-1, 0]],
    'Reflect in x-axis': () => [[1, 0], [0, -1]],
    'Reflect in y-axis': () => [[-1, 0], [0, 1]],
    'Reflect in y = x': () => [[0, 1], [1, 0]],
    'Reflect in y = −x': () => [[0, -1], [-1, 0]],
    'Scale by k': (k) => [[k, 0], [0, k]],
    'Project onto x-axis': () => [[1, 0], [0, 0]],
  };
  function renderLtViz(el) {
    const seq = [{ op: 'Shear x by k (top moves right k)', k: '2' }, { op: 'Rotate 90° CCW', k: '' }];
    el.innerHTML = `
      <div class="card">
        <div class="row">
          <select id="opSel">${Object.keys(OPS).map((o) => `<option>${o}</option>`).join('')}</select>
          <input type="text" id="opK" value="2" style="width:80px" placeholder="k">
          <button id="addOp">+ Add step</button><button id="clearOp" class="ghost">Clear</button>
        </div>
        <ol id="opList" style="margin:12px 0"></ol>
        <p class="hint">Steps are applied top to bottom. The composite matrix multiplies <b>later steps on the left</b>: if T₁ is done first and then T₂, A = A₂A₁.</p>
      </div>
      <div class="two"><div class="card"><canvas id="cv" width="420" height="420"></canvas>
        <p class="hint">Grey: unit square · Blue: image · red arrow T(e₁) · green arrow T(e₂)</p></div>
        <div class="card" id="ltOut"></div></div>`;
    const draw = () => {
      el.querySelector('#opList').innerHTML = seq.map((s, i) => `<li>${s.op}${OPS[s.op].length ? ` (k = ${s.k})` : ''} <button class="ghost small" data-i="${i}">✕</button></li>`).join('') || '<li class="muted">Identity (no steps)</li>';
      el.querySelectorAll('#opList button').forEach((b) => { b.onclick = () => { seq.splice(+b.dataset.i, 1); draw(); }; });
      let A = L.eye(2);
      const mats = seq.map((s) => L.toM(OPS[s.op](L.F(s.k || 0))));
      mats.forEach((Mi) => { A = L.mul(Mi, A); });
      const out = el.querySelector('#ltOut');
      let h = '<h3>Standard matrix</h3>';
      if (mats.length) h += dm(`A = ${mats.map((_, i) => `A_{${i + 1}}`).reverse().join('')} = ${mats.slice().reverse().map(L.texM).join('')} = ${L.texM(A)}`);
      h += `<p>${im(`T(\\mathbf e_1) = ${L.texV(L.col(A, 0))},\\ T(\\mathbf e_2) = ${L.texV(L.col(A, 1))}`)}</p>`;
      h += U.transformHtml(A);
      out.innerHTML = h; U.renderMath(out);
      const cv = el.querySelector('#cv'), ctx = cv.getContext('2d');
      const css = getComputedStyle(document.documentElement);
      const c = (n) => css.getPropertyValue(n).trim();
      const W = cv.width, S = 42, O = W / 2;
      const P = (x, y) => [O + x * S, O - y * S];
      ctx.clearRect(0, 0, W, W);
      ctx.strokeStyle = c('--border'); ctx.lineWidth = 1;
      for (let i = -5; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(...P(i, -5)); ctx.lineTo(...P(i, 5)); ctx.stroke(); ctx.beginPath(); ctx.moveTo(...P(-5, i)); ctx.lineTo(...P(5, i)); ctx.stroke(); }
      ctx.strokeStyle = c('--muted'); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(...P(-5, 0)); ctx.lineTo(...P(5, 0)); ctx.moveTo(...P(0, -5)); ctx.lineTo(...P(0, 5)); ctx.stroke();
      const poly = (pts, fill, stroke) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...P(...p)) : ctx.moveTo(...P(...p)))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); };
      const sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
      poly(sq, 'rgba(128,128,128,.18)', 'rgba(128,128,128,.7)');
      const T = ([x, y]) => [+A[0][0] * x + +A[0][1] * y, +A[1][0] * x + +A[1][1] * y];
      poly(sq.map(T), 'rgba(80,110,255,.25)', c('--accent'));
      const arrow = (to, color) => { ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...P(0, 0)); ctx.lineTo(...P(...to)); ctx.stroke(); ctx.beginPath(); ctx.arc(...P(...to), 5, 0, 7); ctx.fill(); };
      arrow(T([1, 0]), '#e03131'); arrow(T([0, 1]), '#2f9e44');
    };
    el.querySelector('#addOp').onclick = () => { seq.push({ op: el.querySelector('#opSel').value, k: el.querySelector('#opK').value }); draw(); };
    el.querySelector('#clearOp').onclick = () => { seq.length = 0; draw(); };
    draw();
  }

  window.TOOLS = TOOLS;
  window.renderTool = renderTool;
})();
