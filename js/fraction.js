// Exact rational arithmetic so every step shows clean fractions (no 0.3333…)
(function (root) {
  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { const t = a % b; a = b; b = t; }
    return a;
  }

  class Frac {
    constructor(n, d = 1) {
      if (d === 0) throw new Error('Division by zero');
      if (d < 0) { n = -n; d = -d; }
      const g = gcd(n, d) || 1;
      this.n = n / g; this.d = d / g;
      if (this.n === 0) { this.n = 0; this.d = 1; }
    }
    static from(x) {
      if (x instanceof Frac) return x;
      if (typeof x === 'number') {
        if (Number.isInteger(x)) return new Frac(x);
        let d = 1;
        while (!Number.isInteger(x * d) && d < 1e9) d *= 10;
        return new Frac(Math.round(x * d), d);
      }
      const s = String(x).trim().replace(/−/g, '-');
      if (s === '') throw new Error('Empty entry');
      if (s.includes('/')) {
        const [a, b] = s.split('/');
        return Frac.from(a).div(Frac.from(b));
      }
      const v = Number(s);
      if (!isFinite(v)) throw new Error('Cannot read "' + s + '" as a number');
      return Frac.from(v);
    }
    add(o) { o = Frac.from(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { o = Frac.from(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { o = Frac.from(o); return new Frac(this.n * o.n, this.d * o.d); }
    div(o) { o = Frac.from(o); return new Frac(this.n * o.d, this.d * o.n); }
    neg() { return new Frac(-this.n, this.d); }
    inv() { return new Frac(this.d, this.n); }
    abs() { return new Frac(Math.abs(this.n), this.d); }
    isZero() { return this.n === 0; }
    isOne() { return this.n === 1 && this.d === 1; }
    isInt() { return this.d === 1; }
    sign() { return Math.sign(this.n); }
    eq(o) { o = Frac.from(o); return this.n === o.n && this.d === o.d; }
    valueOf() { return this.n / this.d; }
    toString() { return this.d === 1 ? String(this.n) : this.n + '/' + this.d; }
    tex() {
      if (this.d === 1) return String(this.n);
      const s = this.n < 0 ? '-' : '';
      return s + '\\frac{' + Math.abs(this.n) + '}{' + this.d + '}';
    }
  }

  Frac.gcd = gcd;
  Frac.lcm = (a, b) => (a && b ? Math.abs(a * b) / gcd(a, b) : 0);
  Frac.ZERO = new Frac(0);
  Frac.ONE = new Frac(1);

  root.Frac = Frac;
  if (typeof module !== 'undefined') module.exports = Frac;
})(typeof window !== 'undefined' ? window : globalThis);
