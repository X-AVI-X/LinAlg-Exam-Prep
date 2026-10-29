// Linear algebra engine: exact computations that also record the steps a student must write.
(function (root) {
  const Frac = root.Frac || require('./fraction.js');
  const F = (x) => Frac.from(x);

  /* ---------- basic matrix helpers ---------- */
  const toM = (rows) => rows.map((r) => r.map(F));
  const clone = (M) => M.map((r) => r.slice());
  const zeros = (m, n) => Array.from({ length: m }, () => Array.from({ length: n }, () => Frac.ZERO));
  const eye = (n) => zeros(n, n).map((r, i) => r.map((_, j) => (i === j ? Frac.ONE : Frac.ZERO)));
  const transpose = (M) => M[0].map((_, j) => M.map((r) => r[j]));
  const col = (M, j) => M.map((r) => r[j]);
  const fromCols = (cols) => cols[0].map((_, i) => cols.map((c) => c[i]));
  const dot = (u, v) => u.reduce((s, x, i) => s.add(x.mul(v[i])), Frac.ZERO);
  const scaleV = (c, v) => v.map((x) => x.mul(c));
  const addV = (u, v) => u.map((x, i) => x.add(v[i]));
  const subV = (u, v) => u.map((x, i) => x.sub(v[i]));
  const isZeroV = (v) => v.every((x) => x.isZero());
  const add = (A, B) => A.map((r, i) => r.map((x, j) => x.add(B[i][j])));
  const sub = (A, B) => A.map((r, i) => r.map((x, j) => x.sub(B[i][j])));
  const scale = (c, A) => A.map((r) => r.map((x) => x.mul(c)));
  const eqM = (A, B) => A.length === B.length && A.every((r, i) => r.length === B[i].length && r.every((x, j) => x.eq(B[i][j])));
  function mul(A, B) {
    if (A[0].length !== B.length) throw new Error(`Cannot multiply ${A.length}×${A[0].length} by ${B.length}×${B[0].length}`);
    return A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => s.add(x.mul(B[k][j])), Frac.ZERO)));
  }
  const mulV = (A, v) => A.map((r) => dot(r, v));
  const trace = (A) => A.reduce((s, r, i) => s.add(r[i]), Frac.ZERO);
  const sub2 = (A, r0, r1, c0, c1) => A.slice(r0, r1).map((r) => r.slice(c0, c1));
  const dims = (A) => `${A.length}\\times ${A[0].length}`;

  /* ---------- TeX output ---------- */
  function texM(M, opts = {}) {
    const n = M[0].length;
    const body = M.map((r) => r.map((x) => (x.tex ? x.tex() : String(x))).join(' & ')).join(' \\\\ ');
    if (opts.bar != null) {
      const spec = 'c'.repeat(opts.bar) + '|' + 'c'.repeat(n - opts.bar);
      return `\\left[\\begin{array}{${spec}}${body}\\end{array}\\right]`;
    }
    return `\\begin{bmatrix}${body}\\end{bmatrix}`;
  }
  const texV = (v) => texM(v.map((x) => [x]));
  const texRowV = (v) => '(' + v.map((x) => x.tex()).join(',\\ ') + ')';

  // coefficient in front of a symbol: 1→"", -1→"-", 1/2→"\frac12"
  function coefTex(c, sym) {
    if (c.isOne()) return sym;
    if (c.eq(-1)) return '-' + sym;
    return c.tex() + sym;
  }
  // "+ 3x" / "- 3x" for a non-leading term
  function termTex(c, sym, leading) {
    if (c.isZero()) return '';
    if (leading) return coefTex(c, sym);
    return (c.sign() < 0 ? ' - ' : ' + ') + coefTex(c.abs(), sym);
  }

  // simplest radical form of a non-negative integer: 12 -> [2,3] meaning 2√3
  function radical(n) {
    let a = 1, b = n;
    for (let k = 2; k * k <= b; k++) while (b % (k * k) === 0) { b /= k * k; a *= k; }
    return [a, b];
  }
  function sqrtIntTex(n) {
    const [a, b] = radical(n);
    if (b === 1) return String(a);
    return (a === 1 ? '' : a) + '\\sqrt{' + b + '}';
  }
  // √(p/q) in simplest form
  function sqrtFracTex(fr) {
    fr = F(fr);
    if (fr.sign() < 0) return '\\sqrt{' + fr.tex() + '}';
    const [a, b] = radical(fr.n * fr.d);
    const g = Frac.gcd(a, fr.d);
    const num = a / g, den = fr.d / g;
    const top = b === 1 ? String(num) : (num === 1 ? '' : num) + '\\sqrt{' + b + '}';
    return den === 1 ? top : `\\frac{${top}}{${den}}`;
  }
  // scale a rational vector to the primitive integer vector in the same direction
  function primitive(v) {
    const L = v.reduce((l, x) => Frac.lcm(l, x.d), 1);
    let w = v.map((x) => x.n * (L / x.d));
    const g = w.reduce((g, x) => Frac.gcd(g, x), 0) || 1;
    w = w.map((x) => x / g);
    return w.map(F);
  }
  // unit vector in direction of v, as TeX: (1/√N)·w
  function unitTex(v) {
    const w = primitive(v);
    const N = dot(w, w).n;
    const [a, b] = radical(N);
    const pre = b === 1 ? (a === 1 ? '' : `\\frac{1}{${a}}`) : `\\frac{1}{${sqrtIntTex(N)}}`;
    return pre + texV(w);
  }

  /* ---------- row operations ---------- */
  const R = (i) => `R_{${i + 1}}`;
  function swapOp(i, j) { return `${R(i)} \\leftrightarrow ${R(j)}`; }
  function scaleOp(i, c) { return `${R(i)} \\to ${coefTex(c, R(i))}`; }
  function replOp(i, j, c) { // R_i -> R_i + c R_j
    return `${R(i)} \\to ${R(i)}${c.sign() < 0 ? ' - ' : ' + '}${coefTex(c.abs(), R(j))}`;
  }

  /**
   * Row reduce with recorded steps.
   * opts.maxPivotCol: only look for pivots in columns < this (e.g. [A|I] uses n)
   * Returns { steps:[{title, ops, M}], echelon, rref, pivots, rank, swaps }
   */
  function rrefSteps(M0, opts = {}) {
    const M = clone(M0);
    const m = M.length, n = M[0].length;
    const maxC = opts.maxPivotCol ?? n;
    const steps = [];
    const pivots = [];
    let r = 0, swaps = 0;
    for (let c = 0; c < maxC && r < m; c++) {
      let p = -1;
      for (let i = r; i < m; i++) if (!M[i][c].isZero()) { p = i; break; }
      if (p < 0) continue;
      const ops = [];
      if (p !== r) {
        [M[p], M[r]] = [M[r], M[p]];
        ops.push(swapOp(p, r)); swaps++;
      }
      for (let i = r + 1; i < m; i++) {
        if (M[i][c].isZero()) continue;
        const f = M[i][c].div(M[r][c]);
        M[i] = M[i].map((x, k) => x.sub(f.mul(M[r][k])));
        ops.push(replOp(i, r, f.neg()));
      }
      if (ops.length) steps.push({ title: `Column ${c + 1}: create zeros below the pivot`, ops, M: clone(M), phase: 'forward' });
      pivots.push(c); r++;
    }
    const echelon = clone(M);
    steps.push({ title: 'Echelon form reached (forward phase done)', ops: [], M: clone(M), marker: true });
    for (let k = pivots.length - 1; k >= 0; k--) {
      const c = pivots[k];
      const ops = [];
      if (!M[k][c].isOne()) {
        const s = M[k][c].inv();
        M[k] = M[k].map((x) => x.mul(s));
        ops.push(scaleOp(k, s));
      }
      for (let i = 0; i < k; i++) {
        if (M[i][c].isZero()) continue;
        const f = M[i][c];
        M[i] = M[i].map((x, j) => x.sub(f.mul(M[k][j])));
        ops.push(replOp(i, k, f.neg()));
      }
      if (ops.length) steps.push({ title: `Pivot in column ${c + 1}: scale to 1, clear above`, ops, M: clone(M), phase: 'backward' });
    }
    steps.push({ title: 'Reduced row echelon form (RREF)', ops: [], M: clone(M), marker: true });
    return { steps, echelon, rref: M, pivots, rank: pivots.length, swaps };
  }
  const rref = (M) => rrefSteps(M).rref;
  const rank = (M) => rrefSteps(M).rank;

  // Analyse an augmented matrix [A|b] (last column = b)
  function analyseSystem(Aug) {
    const nv = Aug[0].length - 1;
    const res = rrefSteps(Aug);
    const piv = res.pivots;
    const out = { ...res, nVars: nv };
    if (piv.includes(nv)) {
      out.type = 'none';
      out.reason = `A pivot appears in the augmented column (a row \\([0\\ \\cdots\\ 0\\ |\\ b],\\ b\\neq 0\\)), so the system is inconsistent.`;
      return out;
    }
    const free = [];
    for (let j = 0; j < nv; j++) if (!piv.includes(j)) free.push(j);
    out.basic = piv.slice(); out.free = free;
    const p = Array(nv).fill(Frac.ZERO);
    piv.forEach((c, i) => { p[c] = res.rref[i][nv]; });
    out.particular = p;
    out.dirs = free.map((f) => {
      const v = Array(nv).fill(Frac.ZERO);
      v[f] = Frac.ONE;
      piv.forEach((c, i) => { v[c] = res.rref[i][f].neg(); });
      return v;
    });
    out.type = free.length ? 'infinite' : 'unique';
    return out;
  }

  // TeX of solution, e.g. x = p + s v1 + t v2
  function solutionTex(an, names) {
    const nv = an.nVars;
    names = names || Array.from({ length: nv }, (_, i) => `x_{${i + 1}}`);
    if (an.type === 'none') return '\\text{No solution (inconsistent)}';
    const xv = texM(names.map((s) => [s]));
    if (an.type === 'unique') return `${xv} = ${texV(an.particular)}`;
    const params = ['s', 't', 'u', 'w', 'r', 'q'];
    let s = `${xv} = `;
    const parts = [];
    if (!isZeroV(an.particular)) parts.push(texV(an.particular));
    an.dirs.forEach((d, k) => parts.push(params[k] + texV(d)));
    s += parts.join(' + ');
    return s;
  }
  // Equation-style general solution: x1 = 2 - 3x3, x3 free
  function generalTex(an, names) {
    const nv = an.nVars;
    names = names || Array.from({ length: nv }, (_, i) => `x_{${i + 1}}`);
    const lines = an.basic.map((c, i) => {
      let s = names[c] + ' = ';
      let t = an.rref[i][nv].isZero() ? '' : an.rref[i][nv].tex();
      an.free.forEach((f) => { t += termTex(an.rref[i][f].neg(), names[f], t === ''); });
      return s + (t || '0');
    });
    an.free.forEach((f) => lines.push(names[f] + '\\ \\text{is free}'));
    return lines.join(',\\quad ');
  }

  function nullBasis(A) {
    const res = rrefSteps(A);
    const n = A[0].length;
    const free = [];
    for (let j = 0; j < n; j++) if (!res.pivots.includes(j)) free.push(j);
    const basis = free.map((f) => {
      const v = Array(n).fill(Frac.ZERO);
      v[f] = Frac.ONE;
      res.pivots.forEach((c, i) => { v[c] = res.rref[i][f].neg(); });
      return v;
    });
    return { basis, free, pivots: res.pivots, res };
  }
  const colBasis = (A) => rrefSteps(A).pivots.map((j) => col(A, j));

  /* ---------- inverse ---------- */
  function inverseSteps(A) {
    const n = A.length;
    if (A[0].length !== n) throw new Error('Only square matrices have an inverse.');
    const I = eye(n);
    const aug = A.map((r, i) => r.concat(I[i]));
    const res = rrefSteps(aug, { maxPivotCol: n });
    const invertible = res.rank === n;
    return { ...res, invertible, inv: invertible ? res.rref.map((r) => r.slice(n)) : null, n };
  }
  function inverse(A) {
    const r = inverseSteps(A);
    if (!r.invertible) throw new Error('Matrix is singular (not invertible).');
    return r.inv;
  }

  /* ---------- determinants ---------- */
  function minor(A, i, j) { return A.filter((_, r) => r !== i).map((r) => r.filter((_, c) => c !== j)); }
  function det(A) {
    const n = A.length;
    if (n === 1) return A[0][0];
    if (n === 2) return A[0][0].mul(A[1][1]).sub(A[0][1].mul(A[1][0]));
    return detElim(A).det;
  }
  function detElim(A0) {
    const A = clone(A0); const n = A.length; let swaps = 0; const steps = [];
    for (let c = 0; c < n; c++) {
      let p = -1;
      for (let i = c; i < n; i++) if (!A[i][c].isZero()) { p = i; break; }
      if (p < 0) { steps.push({ title: `No pivot in column ${c + 1} → det = 0`, ops: [], M: clone(A) }); return { det: Frac.ZERO, swaps, steps, U: A, singular: true }; }
      const ops = [];
      if (p !== c) { [A[p], A[c]] = [A[c], A[p]]; swaps++; ops.push(swapOp(p, c) + '\\ \\text{(sign flips)}'); }
      for (let i = c + 1; i < n; i++) {
        if (A[i][c].isZero()) continue;
        const f = A[i][c].div(A[c][c]);
        A[i] = A[i].map((x, k) => x.sub(f.mul(A[c][k])));
        ops.push(replOp(i, c, f.neg()));
      }
      if (ops.length) steps.push({ title: `Column ${c + 1}`, ops, M: clone(A) });
    }
    let d = Frac.ONE;
    for (let i = 0; i < n; i++) d = d.mul(A[i][i]);
    if (swaps % 2) d = d.neg();
    return { det: d, swaps, steps, U: A, pivots: A.map((r, i) => r[i]) };
  }
  // cofactor expansion along row r (or column if byCol)
  function cofactorExpansion(A, idx = 0, byCol = false) {
    const n = A.length;
    const terms = [];
    for (let k = 0; k < n; k++) {
      const i = byCol ? k : idx, j = byCol ? idx : k;
      const Mij = minor(A, i, j);
      const md = det(Mij);
      const sign = (i + j) % 2 === 0 ? 1 : -1;
      const Cij = sign > 0 ? md : md.neg();
      terms.push({ i, j, a: A[i][j], minor: Mij, minorDet: md, sign, C: Cij });
    }
    const total = terms.reduce((s, t) => s.add(t.a.mul(t.C)), Frac.ZERO);
    return { terms, det: total };
  }

  /* ---------- LU with row interchanges ---------- */
  function luSteps(A0) {
    const n = A0.length;
    const U = clone(A0);
    const L = zeros(n, n);
    const perm = Array.from({ length: n }, (_, i) => i);
    const steps = [];
    let failedAt = null;
    for (let k = 0; k < n; k++) {
      const ops = [];
      if (U[k][k].isZero()) {
        let p = -1;
        for (let i = k + 1; i < n; i++) if (!U[i][k].isZero()) { p = i; break; }
        if (p < 0) { steps.push({ title: `Column ${k + 1}: no nonzero pivot available (matrix singular)`, ops: [], U: clone(U), L: clone(L) }); continue; }
        if (failedAt === null) failedAt = { k, U: clone(U) };
        [U[k], U[p]] = [U[p], U[k]];
        [perm[k], perm[p]] = [perm[p], perm[k]];
        for (let j = 0; j < k; j++) [L[k][j], L[p][j]] = [L[p][j], L[k][j]];
        ops.push(`\\text{pivot } u_{${k + 1}${k + 1}} = 0:\\ ` + swapOp(k, p) + '\\ \\text{(also swap multipliers already in } L)');
      }
      for (let i = k + 1; i < n; i++) {
        const l = U[i][k].div(U[k][k]);
        L[i][k] = l;
        if (l.isZero()) continue;
        U[i] = U[i].map((x, j) => x.sub(l.mul(U[k][j])));
        ops.push(replOp(i, k, l.neg()) + `\\quad(\\ell_{${i + 1}${k + 1}} = ${l.tex()})`);
      }
      if (ops.length) steps.push({ title: `Column ${k + 1}`, ops, U: clone(U), L: clone(L) });
    }
    for (let i = 0; i < n; i++) L[i][i] = Frac.ONE;
    const P = zeros(n, n);
    perm.forEach((p, i) => { P[i][p] = Frac.ONE; });
    return { P, L, U, perm, steps, failedAt, needsP: perm.some((p, i) => p !== i) };
  }

  /* ---------- polynomials & eigenvalues ---------- */
  // coefficients of p(λ)=det(λI − A), highest degree first
  function charPoly(A) {
    const n = A.length;
    const c = [Frac.ONE];
    let M = zeros(n, n);
    const I = eye(n);
    for (let k = 1; k <= n; k++) {
      M = add(mul(A, M), scale(c[k - 1], I));
      c.push(trace(mul(A, M)).div(-k).mul(1));
    }
    return c;
  }
  function polyTex(c, v = '\\lambda') {
    const deg = c.length - 1;
    let s = '';
    c.forEach((a, i) => {
      const p = deg - i;
      if (a.isZero()) return;
      const sym = p === 0 ? '' : p === 1 ? v : `${v}^{${p}}`;
      if (p === 0) {
        s += s === '' ? a.tex() : (a.sign() < 0 ? ' - ' : ' + ') + a.abs().tex();
      } else s += termTex(a, sym, s === '');
    });
    return s || '0';
  }
  const polyEval = (c, x) => c.reduce((s, a) => s.mul(x).add(a), Frac.ZERO);
  function deflate(c, r) { // divide by (λ - r)
    const out = [c[0]];
    for (let i = 1; i < c.length - 1; i++) out.push(c[i].add(out[i - 1].mul(r)));
    return out;
  }
  function divisors(n) {
    n = Math.abs(n); const d = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i);
    return d;
  }
  // find rational roots with multiplicity; leftover non-rational part returned
  function rationalRoots(c0) {
    let c = c0.slice();
    const roots = [];
    let guard = 0;
    while (c.length > 1 && guard++ < 50) {
      if (c[c.length - 1].isZero()) { roots.push(Frac.ZERO); c = c.slice(0, -1); continue; }
      const L = c.reduce((l, x) => Frac.lcm(l, x.d), 1);
      const ints = c.map((x) => x.n * (L / x.d));
      let found = null;
      outer: for (const p of divisors(ints[ints.length - 1])) {
        for (const q of divisors(ints[0])) {
          for (const s of [1, -1]) {
            const r = new Frac(s * p, q);
            if (polyEval(c, r).isZero()) { found = r; break outer; }
          }
        }
      }
      if (!found) break;
      roots.push(found);
      c = deflate(c, found);
    }
    return { roots, rest: c };
  }
  function numericRoots(c) { // Durand–Kerner, c real coefficients highest first
    const n = c.length - 1;
    if (n < 1) return [];
    const a = c.map((x) => +x / +c[0]);
    let z = Array.from({ length: n }, (_, k) => ({ re: Math.cos(2 * Math.PI * k / n + 0.4) * 1.3, im: Math.sin(2 * Math.PI * k / n + 0.4) * 1.3 }));
    const cm = (p, q) => ({ re: p.re * q.re - p.im * q.im, im: p.re * q.im + p.im * q.re });
    const cd = (p, q) => { const d = q.re * q.re + q.im * q.im; return { re: (p.re * q.re + p.im * q.im) / d, im: (p.im * q.re - p.re * q.im) / d }; };
    for (let it = 0; it < 500; it++) {
      z = z.map((zi, i) => {
        let num = { re: 1, im: 0 };
        let val = { re: 1, im: 0 };
        for (let k = 1; k <= n; k++) val = { re: cm(val, zi).re + a[k], im: cm(val, zi).im };
        num = val;
        let den = { re: 1, im: 0 };
        z.forEach((zj, j) => { if (j !== i) den = cm(den, { re: zi.re - zj.re, im: zi.im - zj.im }); });
        const q = cd(num, den);
        return { re: zi.re - q.re, im: zi.im - q.im };
      });
    }
    return z;
  }

  /** Full eigen-analysis for a square matrix. */
  function eigen(A) {
    const n = A.length;
    const cp = charPoly(A);
    const { roots, rest } = rationalRoots(cp);
    const groups = [];
    roots.forEach((r) => {
      const g = groups.find((x) => x.value.eq(r));
      if (g) g.am++; else groups.push({ value: r, am: 1 });
    });
    groups.sort((a, b) => +b.value - +a.value);
    groups.forEach((g) => {
      const AmL = sub(A, scale(g.value, eye(n)));
      const nb = nullBasis(AmL);
      g.matrix = AmL;
      g.rref = nb.res.rref;
      g.basis = nb.basis.map((v) => primitive(v));
      g.gm = nb.basis.length;
    });
    let irrational = null;
    if (rest.length === 3) {
      const [a, b, c] = rest;
      const disc = b.mul(b).sub(a.mul(c).mul(4));
      irrational = { quad: rest, disc, real: disc.sign() >= 0 };
      const negb = b.neg().div(a.mul(2));
      const rad = disc.div(a.mul(a).mul(4));
      irrational.tex = disc.sign() >= 0
        ? `${negb.isZero() ? '' : negb.tex()} \\pm ${sqrtFracTex(rad)}`
        : `${negb.tex()} \\pm ${sqrtFracTex(rad.neg())}\\,i`;
      const r1 = +negb + Math.sqrt(Math.max(0, +rad)), r2 = +negb - Math.sqrt(Math.max(0, +rad));
      irrational.approx = disc.sign() >= 0 ? [r1, r2] : null;
    } else if (rest.length > 3) {
      irrational = { numeric: numericRoots(rest) };
    }
    const allRational = rest.length === 1;
    const diagonalizable = allRational && groups.every((g) => g.gm === g.am);
    let P = null, D = null;
    if (diagonalizable) {
      const cols = []; const dvals = [];
      groups.forEach((g) => g.basis.forEach((v) => { cols.push(v); dvals.push(g.value); }));
      P = fromCols(cols);
      D = zeros(n, n).map((r, i) => r.map((x, j) => (i === j ? dvals[i] : Frac.ZERO)));
    }
    return { cp, groups, irrational, allRational, diagonalizable, P, D };
  }
  // factored form like (λ-2)^2(λ-5)
  function factoredTex(groups, v = '\\lambda') {
    return groups.map((g) => {
      const r = g.value;
      const base = r.isZero() ? v : `(${v} ${r.sign() < 0 ? '+' : '-'} ${r.abs().tex()})`;
      return g.am > 1 ? `${base}^{${g.am}}` : base;
    }).join('');
  }

  /* ---------- orthogonality ---------- */
  function gramSchmidt(xs, clearFractions = true) {
    const vs = []; const steps = [];
    xs.forEach((x, k) => {
      let v = x.slice();
      const coefs = [];
      vs.forEach((u, j) => {
        const c = dot(x, u).div(dot(u, u));
        coefs.push({ j, num: dot(x, u), den: dot(u, u), c });
        v = subV(v, scaleV(c, u));
      });
      const raw = v.slice();
      if (isZeroV(v)) { steps.push({ k, coefs, raw, v, dependent: true }); return; }
      const scaled = clearFractions ? primitive(v) : v;
      // keep the sign of the raw vector
      const sgn = dot(scaled, raw).sign() < 0 ? -1 : 1;
      const vv = scaleV(F(sgn), scaled);
      steps.push({ k, coefs, raw, v: vv, scaledFrom: !eqM([vv], [raw]) });
      vs.push(vv);
    });
    return { vs, steps };
  }
  function isOrthogonalSet(vs) {
    for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) if (!dot(vs[i], vs[j]).isZero()) return false;
    return true;
  }
  function projectOnto(y, us) { // us must be orthogonal
    const coefs = us.map((u) => ({ num: dot(y, u), den: dot(u, u), c: dot(y, u).div(dot(u, u)) }));
    let yhat = y.map(() => Frac.ZERO);
    us.forEach((u, i) => { yhat = addV(yhat, scaleV(coefs[i].c, u)); });
    const z = subV(y, yhat);
    return { coefs, yhat, z, dist2: dot(z, z) };
  }

  /* ---------- SVD / pseudo-inverse helpers (exact when eigenvalues of AᵀA are rational) ---------- */
  function svd(A) {
    const m = A.length, n = A[0].length;
    const At = transpose(A);
    const AtA = mul(At, A);
    const eg = eigen(AtA);
    if (!eg.allRational) return { ok: false, AtA, eg };
    const vs = []; // {lambda, w (integer, orthogonal within eigenspace)}
    eg.groups.forEach((g) => {
      const gs = gramSchmidt(g.basis).vs;
      gs.forEach((w) => vs.push({ lambda: g.value, w }));
    });
    vs.sort((a, b) => +b.lambda - +a.lambda);
    const r = vs.filter((x) => !x.lambda.isZero()).length;
    const us = vs.slice(0, r).map((x) => {
      const Aw = mulV(A, x.w); // u = A w / (σ |w|), direction = Aw
      return { w: Aw, sigma2: x.lambda, wnorm2: dot(x.w, x.w) };
    });
    // complete U with basis of Nul(Aᵀ)
    let extra = [];
    if (r < m) {
      const nb = nullBasis(At).basis;
      extra = gramSchmidt(nb).vs;
    }
    // pseudoinverse A+ = Σ (1/λ_i) v_i v_iᵀ Aᵀ, with v_i v_iᵀ = w wᵀ / (w·w)
    let Aplus = zeros(n, m);
    vs.slice(0, r).forEach((x) => {
      const wwT = x.w.map((a) => x.w.map((b) => a.mul(b)));
      const coef = Frac.ONE.div(x.lambda.mul(dot(x.w, x.w)));
      Aplus = add(Aplus, scale(coef, mul(wwT, At)));
    });
    return { ok: true, AtA, eg, vs, r, us, extra, Aplus, m, n };
  }

  const LA = {
    Frac, F, toM, clone, zeros, eye, transpose, col, fromCols, dot, scaleV, addV, subV, isZeroV, add, sub, scale, mul, mulV, eqM, trace, sub2, dims,
    texM, texV, texRowV, coefTex, termTex, radical, sqrtIntTex, sqrtFracTex, primitive, unitTex,
    rrefSteps, rref, rank, analyseSystem, solutionTex, generalTex, nullBasis, colBasis,
    inverseSteps, inverse, minor, det, detElim, cofactorExpansion, luSteps,
    charPoly, polyTex, polyEval, rationalRoots, eigen, factoredTex,
    gramSchmidt, isOrthogonalSet, projectOnto, svd,
  };
  root.LA = LA;
  if (typeof module !== 'undefined') module.exports = LA;
})(typeof window !== 'undefined' ? window : globalThis);
