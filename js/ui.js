// UI helpers + "write-up renderers": turn engine results into exam-style worked solutions.
(function () {
  const L = window.LA;
  const { F, texM, texV } = L;
  const im = (s) => `\\(${s}\\)`;
  const dm = (s) => `\\[${s}\\]`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const box = (type, title, html) => `<div class="box ${type}">${title ? `<span class="h">${title}</span>` : ''}${html}</div>`;
  const ans = (html, title = 'Answer') => `<div class="ans"><div class="h">${title}</div>${html}</div>`;
  const ordinal = (k) => ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'][k] || `#${k + 1}`;
  const list = (arr) => arr.join(', ');

  function renderMath(el) {
    if (!window.renderMathInElement) return;
    renderMathInElement(el, {
      delimiters: [
        { left: '$$', right: '$$', display: true }, { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }, { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
    });
  }

  /* ---------- parsing ---------- */
  function parseMatrix(text) {
    const rows = String(text).trim().split(/\n|;/).map((r) => r.trim()).filter(Boolean)
      .map((r) => r.replace(/[\[\]]/g, '').split(/[\s,]+/).filter(Boolean).map(F));
    if (!rows.length) throw new Error('Enter at least one row.');
    if (rows.some((r) => r.length !== rows[0].length)) throw new Error('Every row must have the same number of entries.');
    return rows;
  }
  function parseVector(text) {
    const v = String(text).replace(/[\[\]()]/g, '').split(/[\s,;]+/).filter(Boolean).map(F);
    if (!v.length) throw new Error('Enter a vector.');
    return v;
  }
  const matText = (rows) => rows.map((r) => r.join(' ')).join('\n');

  /* ---------- generic pieces ---------- */
  function stepsHtml(steps, bar) {
    return `<div class="steps">${steps.map((s) => `
      <div class="step ${s.marker ? 'marker' : ''}">
        <div class="st">${s.title}</div>
        ${s.ops && s.ops.length ? `<div class="ops">${s.ops.map(im).join(' &nbsp;·&nbsp; ')}</div>` : ''}
        ${dm(texM(s.M, { bar }))}
      </div>`).join('')}</div>`;
  }
  const colNums = (arr) => arr.map((c) => c + 1).join(', ');
  const xs = (arr) => arr.map((c) => `x_{${c + 1}}`).join(', ');

  // A - λI with symbolic λ
  function minusLambdaTex(A) {
    return '\\begin{bmatrix}' + A.map((r, i) => r.map((x, j) => {
      if (i !== j) return x.tex();
      return x.isZero() ? '-\\lambda' : `${x.tex()}-\\lambda`;
    }).join(' & ')).join(' \\\\ ') + '\\end{bmatrix}';
  }

  /* ---------- 1. Linear systems ---------- */
  function systemHtml(Aug, opts = {}) {
    const n = Aug[0].length - 1;
    const an = L.analyseSystem(Aug);
    let h = '';
    if (opts.equations !== false) h += `<p><b>Augmented matrix</b> ${im('[A\\,|\\,\\mathbf b]')}:</p>${dm(texM(Aug, { bar: n }))}`;
    h += `<p><b>Row reduction</b> (forward phase → echelon form, backward phase → RREF):</p>`;
    h += stepsHtml(an.steps, n);
    h += `<p><b>Pivot columns:</b> ${colNums(an.pivots)} &nbsp;·&nbsp; <b>rank</b> ${im('[A|\\mathbf b]')} = ${an.rank}</p>`;
    if (an.type === 'none') {
      h += ans(`<p>${an.reason}</p><p>The last nonzero row reads ${im('0 = ' + an.rref[an.rank - 1][n].tex())}, which is impossible. <b>No solution.</b></p>`, 'Inconsistent system');
    } else {
      const basic = an.basic, free = an.free;
      h += `<p><b>Basic variables:</b> ${im(xs(basic))}${free.length ? ` &nbsp; <b>Free variables:</b> ${im(xs(free))}` : ' &nbsp; (no free variables)'}</p>`;
      h += ans(`<p>${an.type === 'unique' ? 'Consistent with <b>no free variables</b> → <b>unique solution</b>.' : 'Consistent with at least one free variable → <b>infinitely many solutions</b>.'}</p>
        ${dm(L.generalTex(an))}${dm(L.solutionTex(an))}`, an.type === 'unique' ? 'Unique solution' : 'Infinitely many solutions');
    }
    return h;
  }

  function rrefHtml(M, opts = {}) {
    const r = L.rrefSteps(M);
    const n = M[0].length;
    const free = []; for (let j = 0; j < n; j++) if (!r.pivots.includes(j)) free.push(j);
    let h = dm(texM(M, { bar: opts.bar }));
    h += stepsHtml(r.steps, opts.bar);
    h += `<p><b>Echelon form</b> (pivot positions are the leading entries):</p>${dm(texM(r.echelon, { bar: opts.bar }))}`;
    const pivPos = r.pivots.map((c, i) => `(${i + 1},${c + 1})`).join(', ');
    h += ans(`<p><b>Pivot positions:</b> ${pivPos} &nbsp;→ pivot columns ${colNums(r.pivots)}</p>
      <p><b>rank</b> = number of pivots = <b>${r.rank}</b></p>
      ${opts.vars !== false ? `<p><b>Basic variables</b> (pivot columns): ${im(xs(r.pivots) || '\\text{none}')}<br><b>Free variables</b> (non-pivot columns): ${im(xs(free) || '\\text{none}')}</p>` : ''}`);
    return h;
  }

  function inverseHtml(A, verify = true) {
    const n = A.length;
    const r = L.inverseSteps(A);
    let h = `<p>Form ${im('[A\\,|\\,I]')} and row reduce until the left block becomes ${im('I')}:</p>`;
    h += dm(texM(A.map((row, i) => row.concat(L.eye(n)[i])), { bar: n }));
    h += stepsHtml(r.steps, n);
    if (!r.invertible) return h + ans(`<p>The left block cannot be reduced to ${im('I')} (only ${r.rank} pivots), so ${im('A')} is <b>not invertible</b>.</p>`, 'Singular matrix');
    h += ans(dm('A^{-1} = ' + texM(r.inv)));
    if (verify) {
      const P = L.mul(A, r.inv);
      h += `<p><b>Verification</b> ${im('A A^{-1}')}: ${dm(texM(A) + texM(r.inv) + ' = ' + texM(P))}</p>`;
      h += box(L.eqM(P, L.eye(n)) ? 'good' : 'bad', '', L.eqM(P, L.eye(n)) ? `${im('AA^{-1} = I')} ✓` : 'Product is not I');
    }
    return h;
  }

  /* ---------- 2. Block multiplication ---------- */
  const cumul = (sizes) => sizes.reduce((a, s) => (a.push(a[a.length - 1] + s), a), [0]);
  function blockTable(M, rs, cs) {
    const rb = cumul(rs).slice(1, -1), cb = cumul(cs).slice(1, -1);
    return `<table class="blk">${M.map((r, i) => `<tr>${r.map((x, j) =>
      `<td class="${rb.includes(i) ? 'bt0' : ''} ${cb.includes(j) ? 'bl0' : ''}">${x.toString()}</td>`).join('')}</tr>`).join('')}</table>`;
  }
  function getBlock(M, rs, cs, i, j) {
    const R = cumul(rs), C = cumul(cs);
    return L.sub2(M, R[i], R[i + 1], C[j], C[j + 1]);
  }
  function blockHtml(A, B, rp, kp, cp, opts = {}) {
    const sum = (a) => a.reduce((x, y) => x + y, 0);
    if (sum(rp) !== A.length || sum(kp) !== A[0].length || sum(kp) !== B.length || sum(cp) !== B[0].length) {
      throw new Error('Partition sizes must add up to the matrix dimensions (and A’s column partition must equal B’s row partition).');
    }
    let h = `<div class="blkwrap"><div><span class="lbl">A</span>${blockTable(A, rp, kp)}</div><div><span class="lbl">B</span>${blockTable(B, kp, cp)}</div></div>`;
    h += `<p class="hint">Blue lines show the partition. A’s column partition (${kp.join('+')}) <b>must equal</b> B’s row partition — that is what makes every product ${im('A_{ik}B_{kj}')} defined.</p>`;
    h += '<h4>Blocks</h4><div class="overflow">';
    for (let i = 0; i < rp.length; i++) for (let k = 0; k < kp.length; k++) {
      const blk = getBlock(A, rp, kp, i, k);
      h += im(`A_{${i + 1}${k + 1}} = ${texM(blk)}\\ (${L.dims(blk)})`) + ' &nbsp; ';
    }
    h += '<br>';
    for (let k = 0; k < kp.length; k++) for (let j = 0; j < cp.length; j++) {
      const blk = getBlock(B, kp, cp, k, j);
      h += im(`B_{${k + 1}${j + 1}} = ${texM(blk)}\\ (${L.dims(blk)})`) + ' &nbsp; ';
    }
    h += '</div><h4>Block products</h4>';
    const want = opts.only;
    const Cblocks = [];
    for (let i = 0; i < rp.length; i++) {
      Cblocks.push([]);
      for (let j = 0; j < cp.length; j++) {
        if (want && !want.some(([a, b]) => a === i && b === j)) { Cblocks[i].push(null); continue; }
        const formula = kp.map((_, k) => `A_{${i + 1}${k + 1}}B_{${k + 1}${j + 1}}`).join(' + ');
        let total = null; const parts = [];
        kp.forEach((_, k) => {
          const P = L.mul(getBlock(A, rp, kp, i, k), getBlock(B, kp, cp, k, j));
          parts.push(P); total = total ? L.add(total, P) : P;
        });
        Cblocks[i].push(total);
        h += `<div class="step"><div class="st" style="counter-increment:none">${im(`C_{${i + 1}${j + 1}} = ${formula}`)} &nbsp; <span class="pill">${rp[i]}×${cp[j]}</span></div>
          ${dm(`= ${parts.map(texM).join(' + ')} = ${texM(total)}`)}</div>`;
      }
    }
    const AB = L.mul(A, B);
    if (!want) {
      h += ans(dm('C = AB = ' + texM(AB)) + `<p class="small">Assembled from the blocks above; size ${A.length}×${B[0].length}.</p>`);
    } else {
      h += ans(want.map(([i, j]) => im(`C_{${i + 1}${j + 1}} = ${texM(Cblocks[i][j])}`)).join(' &nbsp;&nbsp; '));
    }
    // verification of one entry by scalar multiplication
    const R = cumul(rp), C = cumul(cp);
    const [vi, vj] = want ? want[0] : [0, 0];
    const r0 = R[vi], c0 = C[vj];
    const terms = A[r0].map((a, k) => `(${a.tex()})(${B[k][c0].tex()})`).join(' + ');
    h += `<p><b>Verification by direct multiplication</b> (entry ${im(`c_{${r0 + 1}${c0 + 1}}`)} = row ${r0 + 1} of A · column ${c0 + 1} of B):</p>${dm(`c_{${r0 + 1}${c0 + 1}} = ${terms} = ${AB[r0][c0].tex()}`)}`;
    let same = true;
    Cblocks.forEach((row, i) => row.forEach((blk, j) => blk && blk.forEach((r, a) => r.forEach((x, b) => {
      if (!x.eq(AB[R[i] + a][C[j] + b])) same = false;
    }))));
    h += box(same ? 'good' : 'bad', '', same ? `Matches the block result ✓ (every computed block also agrees with the ordinary product ${im('AB')})` : 'Mismatch with direct product');
    return h;
  }

  /* ---------- 3. LU ---------- */
  function luHtml(A) {
    const r = L.luSteps(A);
    let h = '';
    if (r.failedAt) {
      const k = r.failedAt.k;
      h += box('warn', 'Why plain A = LU fails', `<p>Eliminating column 1 without swaps gives</p>${dm(texM(r.failedAt.U))}<p>The next pivot position ${im(`(${k + 1},${k + 1})`)} holds <b>0</b>, so we cannot divide by it to compute the multipliers. A row interchange is required, so ${im('A')} has <b>no</b> LU factorization without a permutation. We use ${im('PA = LU')}.</p>`);
    }
    h += '<div class="steps">' + r.steps.map((s) => `<div class="step"><div class="st">${s.title}</div>
      <div class="ops">${s.ops.map(im).join('<br>')}</div>${dm('U \\text{ so far} = ' + texM(s.U))}</div>`).join('') + '</div>';
    const PA = L.mul(r.P, A), LU = L.mul(r.L, r.U);
    h += ans(`${r.needsP ? dm('P = ' + texM(r.P)) : ''}${dm('L = ' + texM(r.L) + ',\\qquad U = ' + texM(r.U))}
      <p class="small">L has 1s on the diagonal and the multipliers ${im('\\ell_{ij}')} (the number you subtracted) below it.</p>`);
    h += `<p><b>Check:</b> ${dm((r.needsP ? 'PA = ' + texM(PA) : 'A') + '\\quad LU = ' + texM(LU))}</p>`;
    h += box(L.eqM(PA, LU) ? 'good' : 'bad', '', L.eqM(PA, LU) ? `${im(r.needsP ? 'PA = LU' : 'A = LU')} ✓` : 'Mismatch');
    return h;
  }

  /* ---------- 4. Spaces ---------- */
  function colNullHtml(A, opts = {}) {
    const n = A[0].length, m = A.length;
    const nb = L.nullBasis(A);
    const res = nb.res;
    let h = `<p><b>Row reduce</b> ${im('A')}:</p>` + stepsHtml(res.steps.filter((s) => s.ops.length || s.marker), undefined);
    h += `<p>Pivot columns: <b>${colNums(res.pivots)}</b> &nbsp;·&nbsp; rank A = <b>${res.rank}</b></p>`;
    const cb = res.pivots.map((j) => L.col(A, j));
    h += ans(`<p><b>Basis for Col A</b> — the pivot columns of the <u>original</u> A:</p>${dm('\\left\\{' + cb.map(texV).join(',\\ ') + '\\right\\}')}<p>${im(`\\dim \\operatorname{Col} A = ${res.rank}`)} (a subspace of ${im(`\\mathbb R^{${m}}`)})</p>`, 'Column space');
    if (nb.basis.length) {
      const an = L.analyseSystem(A.map((r) => r.concat([F(0)])));
      h += `<p><b>Null space:</b> solve ${im('A\\mathbf x = \\mathbf 0')}. From the RREF: ${im(L.generalTex(an))}</p>`;
      h += `<p>Parametric vector form:</p>${dm(L.solutionTex(an))}`;
      h += ans(`${dm('\\left\\{' + nb.basis.map(texV).join(',\\ ') + '\\right\\}')}<p>${im(`\\dim \\operatorname{Nul} A = ${nb.basis.length}`)} = number of free variables (a subspace of ${im(`\\mathbb R^{${n}}`)})</p>`, 'Basis for Nul A');
    } else {
      h += ans(`<p>No free variables, so ${im('\\operatorname{Nul}A = \\{\\mathbf 0\\}')}, ${im('\\dim\\operatorname{Nul}A = 0')}.</p>`, 'Null space');
    }
    h += box('key', 'Rank Theorem', dm(`\\operatorname{rank} A + \\dim\\operatorname{Nul} A = ${res.rank} + ${nb.basis.length} = ${n} = n\\ (\\text{number of columns})\\ ✓`));
    if (opts.orth && nb.basis.length) {
      const lines = nb.basis.map((v, k) => A.map((row, i) => `\\mathbf r_{${i + 1}}\\cdot\\mathbf v_{${k + 1}} = ${L.dot(row, v).tex()}`).join(',\\ '));
      h += `<p><b>Each null-space vector is orthogonal to every row of A</b> (because ${im('A\\mathbf v = \\mathbf 0')} means every row dotted with ${im('\\mathbf v')} is 0):</p>${lines.map(dm).join('')}`;
    }
    return h;
  }

  function coordHtml(Bcols, x) {
    const P = L.fromCols(Bcols);
    const n = P.length;
    let h = `<p>${im('P_\\mathcal B = [\\mathbf b_1\\ \\cdots\\ \\mathbf b_n]')} (basis vectors as columns):</p>${dm('P_\\mathcal B = ' + texM(P))}`;
    const d = L.det(P);
    h += `<p>${im(`\\det P_\\mathcal B = ${d.tex()} \\neq 0`)}, so the columns are linearly independent and ${im('P_\\mathcal B')} is invertible (true for any basis).</p>`;
    const Pi = L.inverse(P);
    h += dm('P_\\mathcal B^{-1} = ' + texM(Pi));
    if (n === 2) h += `<p class="hint">2×2 shortcut: ${im('\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}^{-1} = \\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}')}</p>`;
    const xb = L.mulV(Pi, x);
    h += ans(dm(`[\\mathbf x]_\\mathcal B = P_\\mathcal B^{-1}\\mathbf x = ${texM(Pi)}${texV(x)} = ${texV(xb)}`));
    const back = L.mulV(P, xb);
    h += `<p><b>Verify:</b> ${im(Bcols.map((b, i) => `(${xb[i].tex()})${texV(b)}`).join(' + ') + ' = ' + texV(back))} ✓</p>`;
    return h;
  }

  function changeBasisHtml(Bcols, Ccols, xB) {
    const n = Bcols.length;
    const Cm = L.fromCols(Ccols), Bm = L.fromCols(Bcols);
    const aug = Cm.map((r, i) => r.concat(Bm[i]));
    const r = L.rrefSteps(aug, { maxPivotCol: n });
    const P = r.rref.map((row) => row.slice(n));
    let h = `<p>Row reduce ${im('[\\,\\mathbf c_1\\ \\mathbf c_2\\ |\\ \\mathbf b_1\\ \\mathbf b_2\\,]')} to ${im('[\\,I\\ |\\ {}_{\\mathcal C\\leftarrow\\mathcal B}P\\,]')}:</p>`;
    h += dm(texM(aug, { bar: n })) + stepsHtml(r.steps, n);
    h += ans(dm('\\underset{\\mathcal C\\leftarrow\\mathcal B}{P} = ' + texM(P)));
    const Pi = L.inverse(P);
    h += `<p>${im('\\underset{\\mathcal B\\leftarrow\\mathcal C}{P} = \\left(\\underset{\\mathcal C\\leftarrow\\mathcal B}{P}\\right)^{-1}')}:</p>${dm('\\underset{\\mathcal B\\leftarrow\\mathcal C}{P} = ' + texM(Pi))}`;
    h += `<p><b>Check:</b> ${im(texM(P) + texM(Pi) + ' = ' + texM(L.mul(P, Pi)))} ✓</p>`;
    if (xB) {
      const xC = L.mulV(P, xB);
      h += ans(dm(`[\\mathbf x]_\\mathcal C = \\underset{\\mathcal C\\leftarrow\\mathcal B}{P}[\\mathbf x]_\\mathcal B = ${texM(P)}${texV(xB)} = ${texV(xC)}`), '[x]_C');
      const x1 = L.mulV(Bm, xB), x2 = L.mulV(Cm, xC);
      h += `<p><b>Check in standard coordinates:</b></p>${dm(`\\mathbf x = ${xB.map((c, i) => `(${c.tex()})\\mathbf b_{${i + 1}}`).join(' + ')} = ${texV(x1)}`)}${dm(`\\mathbf x = ${xC.map((c, i) => `(${c.tex()})\\mathbf c_{${i + 1}}`).join(' + ')} = ${texV(x2)}`)}`;
      h += box(L.eqM([x1], [x2]) ? 'good' : 'bad', '', 'Both give the same vector ✓');
    }
    return h;
  }

  /* ---------- 5. Determinants ---------- */
  function det2Tex(M) {
    const [[a, b], [c, d]] = M;
    return `(${a.tex()})(${d.tex()}) - (${b.tex()})(${c.tex()}) = ${L.det(M).tex()}`;
  }
  function cofactorHtml(A, idx = 0, byCol = false) {
    const n = A.length;
    const ce = L.cofactorExpansion(A, idx, byCol);
    const where = byCol ? `down column ${idx + 1}` : `across row ${idx + 1}`;
    const formula = ce.terms.map((t) => `a_{${t.i + 1}${t.j + 1}}C_{${t.i + 1}${t.j + 1}}`).join(' + ');
    let h = `<p>Expansion ${where}: ${im('\\det A = ' + formula)}, where ${im('C_{ij} = (-1)^{i+j}\\det A_{ij}')}.</p>`;
    ce.terms.forEach((t) => {
      const sg = t.sign > 0 ? '+' : '-';
      const inner = t.minor.length === 2 ? det2Tex(t.minor) : `${t.minorDet.tex()}`;
      h += dm(`C_{${t.i + 1}${t.j + 1}} = (-1)^{${t.i + 1}+${t.j + 1}}\\det${texM(t.minor)} = ${sg}\\left[${inner}\\right] = ${t.C.tex()}`);
    });
    const sumTerms = ce.terms.map((t) => `(${t.a.tex()})(${t.C.tex()})`).join(' + ');
    h += ans(dm(`\\det A = ${sumTerms} = ${ce.det.tex()}`));
    if (n === 2) h = ans(dm(`\\det A = ad - bc = ${det2Tex(A)}`));
    return h;
  }
  function detElimHtml(A) {
    const r = L.detElim(A);
    let h = `<p>Use only replacements (det unchanged) and interchanges (each flips the sign). Do <b>not</b> scale rows.</p>`;
    h += stepsHtml(r.steps, undefined);
    if (r.singular) return h + ans(`<p>A column has no pivot ⇒ ${im('\\det A = 0')} (A is singular).</p>`);
    h += ans(dm(`\\det A = (-1)^{r}\\cdot(\\text{product of pivots}) = (-1)^{${r.swaps}}\\cdot ${r.pivots.map((p) => `(${p.tex()})`).join('')} = ${r.det.tex()}`) + `<p>Row interchanges ${im(`r = ${r.swaps}`)}.</p>`);
    return h;
  }
  function cramerHtml(A, b) {
    const n = A.length;
    const d = L.det(A);
    let h = `<p>${im('x_i = \\dfrac{\\det A_i(\\mathbf b)}{\\det A}')}, where ${im('A_i(\\mathbf b)')} is A with column ${im('i')} replaced by ${im('\\mathbf b')}.</p>`;
    h += dm(`\\det A = \\det${texM(A)} = ${d.tex()}`);
    if (d.isZero()) return h + ans(`${im('\\det A = 0')}: Cramer’s rule does not apply.`);
    const sol = [];
    for (let i = 0; i < n; i++) {
      const Ai = A.map((r, k) => r.map((x, j) => (j === i ? b[k] : x)));
      const di = L.det(Ai);
      sol.push(di.div(d));
      h += dm(`A_{${i + 1}}(\\mathbf b) = ${texM(Ai)},\\quad \\det A_{${i + 1}}(\\mathbf b) = ${di.tex()},\\quad x_{${i + 1}} = \\frac{${di.tex()}}{${d.tex()}} = ${di.div(d).tex()}`);
    }
    h += ans(dm(`\\mathbf x = ${texV(sol)}`));
    return h;
  }

  /* ---------- 6. Eigen ---------- */
  function eigenHtml(A, opts = {}) {
    const n = A.length;
    const e = L.eigen(A);
    let h = '';
    const tri = A.every((r, i) => r.every((x, j) => j >= i || x.isZero())) || A.every((r, i) => r.every((x, j) => j <= i || x.isZero()));
    if (tri && n > 2) h += box('key', 'Triangular matrix', `<p>The eigenvalues of a triangular matrix are its diagonal entries: ${im(A.map((r, i) => r[i].tex()).join(',\\ '))}.</p>`);
    h += `<p><b>Characteristic equation</b> ${im('\\det(A-\\lambda I) = 0')}:</p>${dm('A - \\lambda I = ' + minusLambdaTex(A))}`;
    if (n === 2) {
      const [[a, b], [c, d]] = A;
      h += dm(`\\det(A-\\lambda I) = (${a.tex()}-\\lambda)(${d.tex()}-\\lambda) - (${b.tex()})(${c.tex()}) = ${L.polyTex(e.cp)}`);
      h += `<p class="hint">Shortcut: ${im(`\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A = \\lambda^2 - (${L.trace(A).tex()})\\lambda + (${L.det(A).tex()})`)}</p>`;
    } else {
      const sgn = n % 2 ? '-\\left(' : '';
      h += dm(`\\det(A-\\lambda I) = ${sgn}${L.polyTex(e.cp)}${n % 2 ? '\\right)' : ''}`);
    }
    if (e.allRational) {
      h += dm(`${L.polyTex(e.cp)} = ${L.factoredTex(e.groups)} = 0`);
    } else if (e.irrational) {
      if (e.groups.length) h += dm(`\\text{rational roots: } ${e.groups.map((g) => g.value.tex()).join(', ')}`);
      if (e.irrational.tex) h += dm(`\\lambda = ${e.irrational.tex}` + (e.irrational.approx ? `\\approx ${e.irrational.approx.map((x) => x.toFixed(4)).join(',\\ ')}` : ''));
      else h += `<p>Remaining roots (numeric): ${e.irrational.numeric.map((z) => z.re.toFixed(4) + (Math.abs(z.im) > 1e-9 ? (z.im > 0 ? '+' : '') + z.im.toFixed(4) + 'i' : '')).join(', ')}</p>`;
    }
    h += ans(`<p>${e.groups.map((g) => im(`\\lambda = ${g.value.tex()}`) + ` (algebraic multiplicity ${g.am})`).join('<br>')}${e.irrational ? '<br>+ the non-rational eigenvalues above' : ''}</p>`, 'Eigenvalues');
    e.groups.forEach((g) => {
      h += `<h4>Eigenspace for ${im(`\\lambda = ${g.value.tex()}`)}</h4>`;
      h += `<p>Solve ${im(`(A - ${g.value.tex()}I)\\mathbf x = \\mathbf 0`)}:</p>${dm(texM(g.matrix) + '\\ \\sim\\ ' + texM(g.rref))}`;
      h += `<p>Basis: ${im('\\left\\{' + g.basis.map(texV).join(',\\ ') + '\\right\\}')} &nbsp;→ <b>geometric multiplicity ${g.gm}</b>${g.gm < g.am ? ' <span class="pill no">GM &lt; AM</span>' : ''}</p>`;
      if (g.value.isZero()) h += `<p class="hint">λ = 0 is an eigenvalue ⇒ A is singular (not invertible).</p>`;
    });
    if (opts.diag !== false) {
      if (e.diagonalizable) {
        const AP = L.mul(A, e.P), PD = L.mul(e.P, e.D);
        h += ans(`<p>Every eigenvalue has GM = AM (total ${n} independent eigenvectors) ⇒ <b>diagonalizable</b>.</p>
          ${dm(`P = ${texM(e.P)},\\qquad D = ${texM(e.D)},\\qquad A = PDP^{-1}`)}
          <p class="small">Column ${im('j')} of P is an eigenvector for the ${im('j')}-th diagonal entry of D (keep the same order!).</p>`, 'Diagonalization');
        h += `<p><b>Check</b> ${im('AP = PD')}: ${dm(`AP = ${texM(AP)},\\quad PD = ${texM(PD)}`)}</p>`;
      } else if (e.allRational) {
        const bad = e.groups.find((g) => g.gm < g.am);
        h += ans(`<p>For ${im(`\\lambda = ${bad.value.tex()}`)}: AM = ${bad.am} but GM = ${bad.gm}. There are fewer than ${n} linearly independent eigenvectors ⇒ <b>not diagonalizable</b>.</p>`, 'Diagonalization');
      }
    }
    return h;
  }

  function powerHtml(A, k) {
    const e = L.eigen(A);
    if (!e.diagonalizable) return '<p>Matrix is not diagonalizable.</p>';
    const Pi = L.inverse(e.P);
    const Dk = e.D.map((r) => r.map((x) => { let p = F(1); for (let i = 0; i < k; i++) p = p.mul(x); return p; }));
    const Ak = L.mul(L.mul(e.P, Dk), Pi);
    let h = dm(`P = ${texM(e.P)},\\ D = ${texM(e.D)},\\ P^{-1} = ${texM(Pi)}`);
    h += dm(`D^{${k}} = ${texM(Dk)}`);
    h += ans(dm(`A^{${k}} = PD^{${k}}P^{-1} = ${texM(e.P)}${texM(Dk)}${texM(Pi)} = ${texM(Ak)}`));
    return h;
  }

  /* ---------- 7. Orthogonality ---------- */
  function gsHtml(xsv) {
    const g = L.gramSchmidt(xsv);
    let h = '';
    g.steps.forEach((s, idx) => {
      const k = s.k + 1;
      if (s.k === 0) { h += dm(`\\mathbf v_1 = \\mathbf x_1 = ${texV(s.v)}`); return; }
      const terms = s.coefs.map((c) => `\\frac{\\mathbf x_{${k}}\\cdot\\mathbf v_{${c.j + 1}}}{\\mathbf v_{${c.j + 1}}\\cdot\\mathbf v_{${c.j + 1}}}\\mathbf v_{${c.j + 1}}`).join(' - ');
      const nums = s.coefs.map((c) => `\\frac{${c.num.tex()}}{${c.den.tex()}}${texV(g.vs[c.j])}`).join(' - ');
      h += dm(`\\mathbf v_{${k}} = \\mathbf x_{${k}} - ${terms} = ${texV(xsv[s.k])} - ${nums} = ${texV(s.raw)}`);
      if (s.dependent) h += box('warn', '', `${im(`\\mathbf v_{${k}} = \\mathbf 0`)}: ${im(`\\mathbf x_{${k}}`)} is in the span of the earlier vectors; drop it.`);
      else if (s.scaledFrom) h += `<p class="hint">Scale to clear fractions (still orthogonal): ${im(`\\mathbf v_{${k}} = ${texV(s.v)}`)}</p>`;
    });
    h += ans(`<p><b>Orthogonal basis:</b> ${im('\\left\\{' + g.vs.map(texV).join(',\\ ') + '\\right\\}')}</p>
      <p>Check: ${g.vs.map((u, i) => g.vs.slice(i + 1).map((w, j) => im(`\\mathbf v_{${i + 1}}\\cdot\\mathbf v_{${i + j + 2}} = ${L.dot(u, w).tex()}`)).join(', ')).filter(Boolean).join(', ')}</p>
      <p><b>Orthonormal basis</b> (divide each by its length):</p>${dm(g.vs.map((v, i) => `\\mathbf u_{${i + 1}} = ${L.unitTex(v)}`).join(',\\qquad '))}`);
    return h;
  }

  function projHtml(y, us) {
    if (!L.isOrthogonalSet(us)) {
      return box('warn', 'Basis is not orthogonal', `<p>The projection formula needs an <b>orthogonal</b> basis. Run Gram–Schmidt first:</p>${gsHtml(us)}`) + projHtml(y, L.gramSchmidt(us).vs);
    }
    const p = L.projectOnto(y, us);
    let h = '';
    if (us.length > 1) h += `<p>The basis is orthogonal: ${us.map((u, i) => us.slice(i + 1).map((w, j) => im(`\\mathbf u_{${i + 1}}\\cdot\\mathbf u_{${i + j + 2}} = 0`)).join(', ')).filter(Boolean).join(', ')}.</p>`;
    const formula = us.map((_, i) => `\\frac{\\mathbf y\\cdot\\mathbf u_{${i + 1}}}{\\mathbf u_{${i + 1}}\\cdot\\mathbf u_{${i + 1}}}\\mathbf u_{${i + 1}}`).join(' + ');
    const nums = p.coefs.map((c, i) => `\\frac{${c.num.tex()}}{${c.den.tex()}}${texV(us[i])}`).join(' + ');
    h += dm(`\\hat{\\mathbf y} = ${formula}`) + dm(`= ${nums} = ${texV(p.yhat)}`);
    h += ans(dm(`\\hat{\\mathbf y} = ${texV(p.yhat)}`), 'Orthogonal projection');
    h += dm(`\\mathbf z = \\mathbf y - \\hat{\\mathbf y} = ${texV(y)} - ${texV(p.yhat)} = ${texV(p.z)}`);
    h += `<p>Check ${im('\\mathbf z \\perp')} each basis vector: ${us.map((u, i) => im(`\\mathbf z\\cdot\\mathbf u_{${i + 1}} = ${L.dot(p.z, u).tex()}`)).join(', ')} ✓</p>`;
    h += ans(dm(`\\operatorname{dist} = \\|\\mathbf y - \\hat{\\mathbf y}\\| = \\sqrt{${p.z.map((x) => `(${x.tex()})^2`).join('+')}} = \\sqrt{${p.dist2.tex()}} = ${L.sqrtFracTex(p.dist2)}`), 'Distance from y to the subspace');
    return h;
  }

  /* ---------- 8. Symmetric / quadratic forms ---------- */
  function quadExprTex(A, names) {
    const n = A.length; names = names || Array.from({ length: n }, (_, i) => `x_{${i + 1}}`);
    let s = '';
    for (let i = 0; i < n; i++) s += L.termTex(A[i][i], `${names[i]}^2`, s === '');
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) s += L.termTex(A[i][j].mul(2), `${names[i]}${names[j]}`, s === '');
    return s || '0';
  }
  function classify(vals) {
    const pos = vals.every((v) => v > 1e-12), neg = vals.every((v) => v < -1e-12);
    const psd = vals.every((v) => v > -1e-12), nsd = vals.every((v) => v < 1e-12);
    if (pos) return 'positive definite'; if (neg) return 'negative definite';
    if (psd) return 'positive semidefinite'; if (nsd) return 'negative semidefinite';
    return 'indefinite';
  }
  function quadHtml(A, x) {
    const n = A.length;
    let h = `<p>Matrix of the form: diagonal entries = coefficients of ${im('x_i^2')}; off-diagonal ${im('a_{ij} = a_{ji}')} = <b>half</b> the coefficient of ${im('x_ix_j')}.</p>`;
    h += dm(`Q(\\mathbf x) = ${quadExprTex(A)} = \\mathbf x^T${texM(A)}\\mathbf x`);
    const e = L.eigen(A);
    const vals = [];
    e.groups.forEach((g) => { for (let k = 0; k < g.am; k++) vals.push(+g.value); });
    if (e.irrational && e.irrational.approx) vals.push(...e.irrational.approx);
    if (e.irrational && e.irrational.numeric) vals.push(...e.irrational.numeric.map((z) => z.re));
    h += `<p>Eigenvalues: ${e.groups.map((g) => im(g.value.tex()) + (g.am > 1 ? ` (×${g.am})` : '')).join(', ')}${e.irrational && e.irrational.tex ? ' ' + im(e.irrational.tex) : ''}</p>`;
    h += ans(`<p>Q is <b>${classify(vals)}</b>.</p><p class="small">All λ &gt; 0 ⇒ positive definite · all λ &lt; 0 ⇒ negative definite · mixed signs ⇒ indefinite.</p>`, 'Classification');
    if (x) {
      const v = L.dot(x, L.mulV(A, x));
      h += dm(`Q${L.texRowV(x)} = ${v.tex()}`);
    }
    return h;
  }

  /* ---------- 9. SVD ---------- */
  function sigmaMatrixTex(m, n, sig) {
    const rows = [];
    for (let i = 0; i < m; i++) { const r = []; for (let j = 0; j < n; j++) r.push(i === j && i < sig.length ? sig[i] : '0'); rows.push(r.join(' & ')); }
    return `\\begin{bmatrix}${rows.join(' \\\\ ')}\\end{bmatrix}`;
  }
  function svdHtml(A) {
    const s = L.svd(A);
    const m = A.length, n = A[0].length;
    let h = dm(`A^TA = ${texM(L.transpose(A))}${texM(A)} = ${texM(s.AtA)}`);
    if (!s.ok) return h + box('warn', '', 'Eigenvalues of AᵀA are not rational — try a matrix from class. (Numeric SVD not shown.)');
    h += `<p>Eigenvalues of ${im('A^TA')} (sorted ${im('\\lambda_1\\ge\\lambda_2\\ge\\cdots')}): ${s.vs.map((v) => im(v.lambda.tex())).join(', ')}</p>`;
    s.eg.groups.forEach((g) => { h += dm(`\\lambda = ${g.value.tex()}:\\ (A^TA - ${g.value.tex()}I) \\sim ${texM(g.rref)} \\Rightarrow ${g.basis.map(texV).join(',\\ ')}`); });
    const sig = s.vs.map((v) => L.sqrtFracTex(v.lambda));
    h += ans(`<p>${s.vs.map((v, i) => im(`\\sigma_{${i + 1}} = \\sqrt{\\lambda_{${i + 1}}} = \\sqrt{${v.lambda.tex()}} = ${sig[i]}`)).join(', ')}</p><p>rank A = number of nonzero σ = <b>${s.r}</b></p>${dm('\\Sigma = ' + sigmaMatrixTex(m, n, sig))}`, 'Singular values');
    h += `<p><b>V</b>: unit eigenvectors of ${im('A^TA')} as columns:</p>${dm(s.vs.map((v, i) => `\\mathbf v_{${i + 1}} = ${L.unitTex(v.w)}`).join(',\\quad '))}`;
    h += `<p><b>U</b>: ${im('\\mathbf u_i = \\frac{1}{\\sigma_i}A\\mathbf v_i')} for each nonzero ${im('\\sigma_i')}:</p>`;
    s.us.forEach((u, i) => {
      h += dm(`\\mathbf u_{${i + 1}} = \\frac{1}{${sig[i]}}A\\mathbf v_{${i + 1}} = ${L.unitTex(u.w)}`);
    });
    if (s.extra.length) {
      h += `<p>Need ${s.extra.length} more column(s) for U (${m}×${m}): take an orthonormal basis of ${im('\\operatorname{Nul}A^T')} (vectors orthogonal to all ${im('\\mathbf u_i')}):</p>`;
      h += dm(s.extra.map((w, k) => `\\mathbf u_{${s.r + k + 1}} = ${L.unitTex(w)}`).join(',\\quad '));
    }
    h += box('key', 'Result', `${dm('A = U\\Sigma V^T,\\quad U = [\\mathbf u_1\\ \\cdots\\ \\mathbf u_' + m + '],\\ V = [\\mathbf v_1\\ \\cdots\\ \\mathbf v_' + n + ']')}`);
    h += `<p><b>Maximum of</b> ${im('\\|A\\mathbf x\\|')} over unit ${im('\\mathbf x')} is ${im('\\sigma_1 = ' + sig[0])}, attained at ${im('\\mathbf v_1')}.</p>`;
    h += ans(dm(`A^+ = V_r D^{-1} U_r^T = ${texM(s.Aplus)}`), 'Pseudoinverse');
    return h;
  }

  function leftRightHtml(A) {
    const m = A.length, n = A[0].length;
    const r = L.rank(A);
    const At = L.transpose(A);
    let h = `<p>${im('A')} is ${m}×${n} with rank ${r}.</p>`;
    if (r === n) {
      const AtA = L.mul(At, A), inv = L.inverse(AtA), Lf = L.mul(inv, At);
      h += `<p>Columns independent (rank = n) ⇒ <b>left inverse</b> ${im('L = (A^TA)^{-1}A^T')}.</p>`;
      h += dm(`A^TA = ${texM(AtA)},\\quad (A^TA)^{-1} = ${texM(inv)}`);
      h += ans(dm(`L = ${texM(Lf)}`) + dm(`LA = ${texM(L.mul(Lf, A))} = I_${n}\\ ✓`), 'Left inverse');
    }
    if (r === m) {
      const AAt = L.mul(A, At), inv = L.inverse(AAt), Rt = L.mul(At, inv);
      h += `<p>Rows independent (rank = m) ⇒ <b>right inverse</b> ${im('R = A^T(AA^T)^{-1}')}.</p>`;
      h += dm(`AA^T = ${texM(AAt)},\\quad (AA^T)^{-1} = ${texM(inv)}`);
      h += ans(dm(`R = ${texM(Rt)}`) + dm(`AR = ${texM(L.mul(A, Rt))} = I_${m}\\ ✓`), 'Right inverse');
    }
    if (r < m) h += box('warn', 'No right inverse', `<p>A right inverse would need ${im(`AR = I_${m}`)}, but ${im(`\\operatorname{rank}(AR) \\le \\operatorname{rank}A = ${r} < ${m}`)}. (Equivalently: A is not onto ${im(`\\mathbb R^${m}`)}.)</p>`);
    if (r < n) h += box('warn', 'No left inverse', `<p>Columns are dependent (rank ${r} &lt; ${n}), so ${im('A^TA')} is singular and no left inverse exists.</p>`);
    return h;
  }

  /* ---------- 10. Linear transformations ---------- */
  function transformHtml(A) {
    const m = A.length, n = A[0].length;
    const r = L.rank(A);
    let h = dm(`A = [\\,T(\\mathbf e_1)\\ \\cdots\\ T(\\mathbf e_${n})\\,] = ${texM(A)}`);
    const oneone = r === n, onto = r === m;
    h += ans(`<p><b>One-to-one?</b> ${oneone ? 'Yes' : 'No'} — the columns are linearly ${oneone ? 'independent' : 'dependent'} (rank ${r} ${oneone ? '=' : '<'} n = ${n}), so ${im('A\\mathbf x=\\mathbf 0')} has ${oneone ? 'only the trivial solution' : 'nontrivial solutions'}.</p>
      <p><b>Onto ${im(`\\mathbb R^${m}`)}?</b> ${onto ? 'Yes' : 'No'} — ${onto ? 'there is a pivot in every row' : `only ${r} pivot(s) for ${m} rows`}.</p>`, 'Properties');
    if (m === n) h += `<p>${im(`\\det A = ${L.det(A).tex()}`)} ${L.det(A).isZero() ? '= 0 ⇒ not invertible' : '≠ 0 ⇒ invertible (one-to-one and onto)'}.</p>`;
    return h;
  }

  window.UI = {
    im, dm, esc, box, ans, renderMath, parseMatrix, parseVector, matText, stepsHtml, list, ordinal,
    systemHtml, rrefHtml, inverseHtml, blockHtml, luHtml, colNullHtml, coordHtml, changeBasisHtml,
    cofactorHtml, detElimHtml, cramerHtml, eigenHtml, powerHtml, gsHtml, projHtml, quadHtml, quadExprTex, classify,
    svdHtml, leftRightHtml, transformHtml, minusLambdaTex,
  };
})();
