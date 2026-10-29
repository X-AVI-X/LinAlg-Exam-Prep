// Study notes for every Mid-1 topic. Written as String.raw so LaTeX backslashes stay single.
(function () {
  const R = String.raw;
  window.TOPICS = [
    {
      id: 'systems', n: 1, title: 'Linear Systems & Row Reduction',
      summary: 'Echelon form, RREF, pivots, basic/free variables, solution types, inverse by Gauss–Jordan',
      tools: ['system', 'rref', 'inverse'], solutions: ['a1q1', 'a1q2', 'a1q3'],
      html: R`
<h2>Three elementary row operations</h2>
<ol>
<li><b>Replacement:</b> \(R_i \to R_i + cR_j\) (does not change the determinant)</li>
<li><b>Interchange:</b> \(R_i \leftrightarrow R_j\) (flips the sign of det)</li>
<li><b>Scaling:</b> \(R_i \to cR_i,\ c\neq 0\) (multiplies det by \(c\))</li>
</ol>
<p>Row operations are reversible, so row-equivalent augmented matrices have the <b>same solution set</b>.</p>

<h2>Echelon form vs. RREF</h2>
<div class="box key"><span class="h">Echelon form (REF)</span>
<ol><li>All nonzero rows are above any zero rows.</li><li>Each leading entry is in a column to the right of the leading entry above it.</li><li>All entries below a leading entry are zero.</li></ol>
<b>Reduced</b> echelon form (RREF) adds: <b>4.</b> every leading entry is 1, <b>5.</b> each leading 1 is the only nonzero entry in its column. The RREF of a matrix is <b>unique</b>; echelon forms are not.</div>
<p>A <b>pivot position</b> is a location that holds a leading 1 in the RREF. A <b>pivot column</b> is a column containing a pivot position. <b>rank</b> = number of pivots.</p>

<h2>Row-reduction algorithm (what to write in the exam)</h2>
<div class="box recipe"><span class="h">Recipe</span>
<b>Forward phase</b> (→ echelon): leftmost nonzero column is a pivot column; swap a nonzero entry to the top if needed; use replacements to create zeros <i>below</i> the pivot; cover that row and repeat.<br>
<b>Backward phase</b> (→ RREF): starting from the rightmost pivot, scale to make it 1 and create zeros <i>above</i> it; work up and to the left.<br>
<b>Always label each operation</b>, e.g. \(R_2 \to R_2 - 2R_1\). Unlabelled work loses marks.</div>

<h2>Basic & free variables; solution types</h2>
<ul>
<li><b>Basic variables</b> correspond to pivot columns; <b>free variables</b> to non-pivot columns of the coefficient matrix.</li>
<li>Write the general solution by solving each nonzero RREF row for its basic variable in terms of free variables.</li>
</ul>
<table class="tbl"><tr><th>RREF of \([A\,|\,\mathbf b]\)</th><th>Solutions</th></tr>
<tr><td>A row \([0\ 0\ \cdots\ 0\ |\ b]\) with \(b\ne0\) (pivot in last column)</td><td><b>None</b> (inconsistent)</td></tr>
<tr><td>Consistent and <b>every</b> variable column is a pivot column</td><td><b>Exactly one</b></td></tr>
<tr><td>Consistent and at least one free variable</td><td><b>Infinitely many</b></td></tr></table>
<div class="box warn"><span class="h">Classic trap</span>If one equation is a multiple of another (e.g. \(2x+2y+2z = 9\) vs \(x+y+z=4\)) check the right-hand side: same multiple ⇒ redundant (free variable); different ⇒ inconsistent.</div>

<h2>Parametric vector form</h2>
<p>Example: \(x_1 = 1 - x_3,\ x_2 = 1 + x_3,\ x_3\) free ⇒ \(\mathbf x = \begin{bmatrix}1\\1\\0\end{bmatrix} + x_3\begin{bmatrix}-1\\1\\1\end{bmatrix}\): a line through \(\mathbf p\) in the direction \(\mathbf v\).</p>

<h2>Inverse by Gauss–Jordan</h2>
<div class="box recipe"><span class="h">Recipe</span>Row reduce \([A\,|\,I]\). If A is row-equivalent to I then \([A\,|\,I] \sim [I\,|\,A^{-1}]\). Otherwise A is not invertible. <b>Verify</b> by computing \(AA^{-1}\) and showing it equals \(I\) (this is worth marks!).</div>
<p>2×2 shortcut: \(\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1} = \dfrac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}\), valid when \(ad-bc\neq0\).</p>
<p><b>Invertible Matrix Theorem</b> (n×n A): A invertible ⇔ A has n pivots ⇔ \(A\mathbf x=\mathbf 0\) has only the trivial solution ⇔ columns linearly independent ⇔ columns span \(\mathbb R^n\) ⇔ \(\det A\neq0\) ⇔ 0 is not an eigenvalue ⇔ rank A = n ⇔ Nul A = {0}.</p>
`,
    },
    {
      id: 'block', n: 2, title: 'Block Matrix Multiplication',
      summary: 'Partitioning, compatibility, column-row expansion, uneven partitions',
      tools: ['block', 'blockdims', 'matmul'], solutions: ['b1', 'b2'],
      html: R`
<h2>Idea</h2>
<p>Split a matrix into rectangular sub-matrices (blocks) by horizontal and vertical lines. Then multiply as if blocks were numbers — <b>keeping the order</b> (\(A_{ik}B_{kj}\), never \(B_{kj}A_{ik}\)).</p>
\[\begin{bmatrix}A_{11}&A_{12}\\A_{21}&A_{22}\end{bmatrix}\begin{bmatrix}B_{11}&B_{12}\\B_{21}&B_{22}\end{bmatrix} = \begin{bmatrix}A_{11}B_{11}+A_{12}B_{21} & A_{11}B_{12}+A_{12}B_{22}\\ A_{21}B_{11}+A_{22}B_{21} & A_{21}B_{12}+A_{22}B_{22}\end{bmatrix}\]
<p>General: \(C_{ij} = \sum_k A_{ik}B_{kj}\). With a 3×3 grid of blocks: \(C_{11} = A_{11}B_{11} + A_{12}B_{21} + A_{13}B_{31}\), \(C_{23} = A_{21}B_{13} + A_{22}B_{23} + A_{23}B_{33}\).</p>

<div class="box key"><span class="h">Compatibility rule</span>
The <b>column partition of A must match the row partition of B</b>. Then every product \(A_{ik}B_{kj}\) is defined: if \(A_{ik}\) is \(p\times q\) then \(B_{kj}\) must be \(q\times s\), giving \(p\times s\).<br>
For a sum \(A_{11}B_{11}+A_{12}B_{21}\): each product must be defined <i>and</i> all products must have the <b>same size</b>.</div>

<h2>Column–row expansion</h2>
<p>If \(A = [A_1\ A_2]\) (side by side) and \(B = \begin{bmatrix}B_1\\B_2\end{bmatrix}\) (stacked) then \(AB = A_1B_1 + A_2B_2\). Extreme case: \(AB = \sum_k \operatorname{col}_k(A)\operatorname{row}_k(B)\) — a sum of rank-1 (outer-product) matrices.</p>

<h2>Exam recipe</h2>
<div class="box recipe"><span class="h">For full marks</span>
<ol><li>Write out every block with its dimensions (e.g. \(A_{11}\) is 2×2).</li>
<li>Write the formula for each \(C_{ij}\) before substituting.</li>
<li>Compute each block product separately, then add.</li>
<li>Assemble C and <b>verify</b> at least one entry by ordinary row×column multiplication.</li></ol></div>
<div class="box warn"><span class="h">Uneven partitions</span>With blocks of size 2 and 3 in a 5×5: \(A_{11}\) is 2×2, \(A_{12}\) 2×3, \(A_{21}\) 3×2, \(A_{22}\) 3×3. Then \(C_{11}\) is 2×2, \(C_{12}\) 2×3, \(C_{21}\) 3×2, \(C_{22}\) 3×3 — together 5×5 ✓.</div>
<h2>Why we do this (AI context)</h2>
<p>Block multiplication lets huge matrix products be split across cores/GPUs and caches; it is how BLAS libraries and transformer kernels tile matrix multiplication.</p>
`,
    },
    {
      id: 'lu', n: 3, title: 'LU Factorization (PA = LU)',
      summary: 'Elimination as matrix factorisation, multipliers, row exchanges and permutation matrices',
      tools: ['lu'], solutions: ['a2q1'],
      html: R`
<h2>What it is</h2>
<p>\(A = LU\) with \(L\) <b>unit lower triangular</b> (1s on diagonal) and \(U\) an <b>upper triangular echelon form</b> of A obtained using only row replacements (adding multiples of a row to rows <i>below</i> it).</p>
<div class="box key"><span class="h">Building L — the trick</span>
If you do \(R_i \to R_i - \ell_{ij} R_j\), the multiplier \(\ell_{ij}\) goes into position \((i,j)\) of L. Example: \(R_2 \to R_2 - 2R_1\) ⇒ \(\ell_{21} = 2\). (Careful with signs: L stores the number you <b>subtract</b>.)</div>

<h2>When does plain LU fail?</h2>
<p>If during elimination a <b>pivot position becomes 0</b> while there is a nonzero entry below it, you must swap rows. Plain \(A=LU\) does not exist; instead there is a permutation matrix P with \(PA = LU\).</p>
<div class="box recipe"><span class="h">Recipe for PA = LU</span>
<ol><li>Eliminate column 1 and record multipliers.</li>
<li>When you meet a zero pivot, <b>explain</b>: “the (2,2) pivot is 0, cannot divide, a row exchange is needed”.</li>
<li>Swap rows (in U, and the already-recorded multipliers in L). P = identity with the same rows swapped.</li>
<li>Continue elimination. Put 1s on the diagonal of L.</li>
<li><b>Verify</b> \(PA = LU\) by multiplying both sides.</li></ol>
Shortcut: you may also find P first (swap rows of A), then do ordinary LU on PA.</div>

<h2>Permutation matrices</h2>
<p>P = identity with rows reordered. \(PA\) reorders the rows of A in the same way. \(P^{-1} = P^T\). Swapping rows 2 and 3: \(P=\begin{bmatrix}1&0&0\\0&0&1\\0&1&0\end{bmatrix}\).</p>

<h2>Why use LU?</h2>
<p>To solve \(A\mathbf x=\mathbf b\) for many \(\mathbf b\): solve \(L\mathbf y=\mathbf b\) (forward substitution) then \(U\mathbf x=\mathbf y\) (back substitution). With P: \(L\mathbf y = P\mathbf b\). Also \(\det A = \pm\prod u_{ii}\).</p>
`,
    },
    {
      id: 'transform', n: 4, title: 'Linear Transformations',
      summary: 'Standard matrix, composition, one-to-one / onto, image, pre-image, range',
      tools: ['lt', 'ltviz'], solutions: ['a2q3', 'a2q4'],
      html: R`
<h2>Definition</h2>
<p>\(T\) is linear if \(T(\mathbf u+\mathbf v) = T(\mathbf u)+T(\mathbf v)\) and \(T(c\mathbf u) = cT(\mathbf u)\). Consequences: \(T(\mathbf 0)=\mathbf 0\) and \(T(c\mathbf u+d\mathbf v)=cT(\mathbf u)+dT(\mathbf v)\).</p>
<div class="box key"><span class="h">Standard matrix</span>
\[A = \big[\,T(\mathbf e_1)\ \ T(\mathbf e_2)\ \cdots\ T(\mathbf e_n)\,\big]\]
Find where each standard basis vector goes; those images are the columns.</div>

<h2>Common 2-D transformations</h2>
<table class="tbl">
<tr><th>Transformation</th><th>Matrix</th></tr>
<tr><td>Horizontal shear (top of unit square moves right k)</td><td>\(\begin{bmatrix}1&k\\0&1\end{bmatrix}\): \(\mathbf e_1\mapsto\mathbf e_1,\ \mathbf e_2\mapsto(k,1)\)</td></tr>
<tr><td>Vertical shear</td><td>\(\begin{bmatrix}1&0\\k&1\end{bmatrix}\)</td></tr>
<tr><td>Rotation by θ CCW</td><td>\(\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}\); 90°: \(\begin{bmatrix}0&-1\\1&0\end{bmatrix}\)</td></tr>
<tr><td>Reflection in x-axis / y-axis</td><td>\(\begin{bmatrix}1&0\\0&-1\end{bmatrix}\) / \(\begin{bmatrix}-1&0\\0&1\end{bmatrix}\)</td></tr>
<tr><td>Reflection in y = x</td><td>\(\begin{bmatrix}0&1\\1&0\end{bmatrix}\)</td></tr>
<tr><td>Projection onto x-axis</td><td>\(\begin{bmatrix}1&0\\0&0\end{bmatrix}\)</td></tr></table>

<h2>Composition — order matters!</h2>
<div class="box warn"><span class="h">Most common mistake</span>“First \(S\), then \(R\)” means \(T(\mathbf x) = R(S(\mathbf x))\), so the matrix is \(A = RS\) — the <b>first</b> transformation is on the <b>right</b>.</div>
<p>Check by tracking \(\mathbf e_1, \mathbf e_2\): \(T(\mathbf e_1) = R(S\mathbf e_1)\), etc.</p>

<h2>One-to-one and onto</h2>
<table class="tbl"><tr><th></th><th>One-to-one</th><th>Onto \(\mathbb R^m\)</th></tr>
<tr><td>Meaning</td><td>each \(\mathbf b\) is the image of <b>at most one</b> \(\mathbf x\)</td><td>each \(\mathbf b\) is the image of <b>at least one</b> \(\mathbf x\)</td></tr>
<tr><td>Test</td><td>columns of A linearly independent ⇔ \(A\mathbf x=\mathbf 0\) only trivial ⇔ pivot in every <b>column</b> ⇔ \(\ker T = \{\mathbf 0\}\)</td><td>columns span \(\mathbb R^m\) ⇔ pivot in every <b>row</b></td></tr></table>
<p>For square A: one-to-one ⇔ onto ⇔ \(\det A\neq 0\).</p>

<h2>Image, pre-image, range</h2>
<ul><li><b>Image</b> of \(\mathbf u\): just compute \(A\mathbf u\).</li>
<li><b>Pre-image</b> of \(\mathbf b\): solve \(A\mathbf x = \mathbf b\) by row reducing \([A\,|\,\mathbf b]\).</li>
<li>\(\mathbf b\) is in the <b>range</b> ⇔ \(A\mathbf x=\mathbf b\) is consistent ⇔ \(\mathbf b\in\operatorname{Col}A\). A pivot in the last column of \([A|\mathbf b]\) ⇒ not in the range.</li></ul>
`,
    },
    {
      id: 'spaces', n: 5, title: 'Vector Spaces, Bases & Change of Basis',
      summary: 'Subspaces, Nul A / Col A, basis, dimension, rank theorem, coordinates, change of basis, kernel & range',
      tools: ['spaces', 'span', 'coords', 'cob'], solutions: ['a2q2', 'a3q1', 'a3q2', 'a3q3', 'a3q4'],
      html: R`
<h2>Subspace test (3 properties)</h2>
<div class="box recipe"><span class="h">To prove H is a subspace</span>
<ol><li><b>Zero vector:</b> \(\mathbf 0\in H\).</li>
<li><b>Closed under addition:</b> \(\mathbf u,\mathbf v\in H \Rightarrow \mathbf u+\mathbf v\in H\).</li>
<li><b>Closed under scalar multiplication:</b> \(\mathbf u\in H \Rightarrow c\mathbf u\in H\).</li></ol>
Show each with general vectors (not examples!). To show something is <b>not</b> a subspace, one specific counterexample suffices — usually “\(\mathbf 0\notin H\)”.</div>
<p>Example: \(H=\{x+y+z=0\}\): (1) \(0+0+0=0\) ✓ (2) \((x_1+x_2)+(y_1+y_2)+(z_1+z_2) = 0+0 = 0\) ✓ (3) \(cx+cy+cz = c\cdot 0 = 0\) ✓. But \(W=\{x+y+z=1\}\): \(0+0+0 = 0\neq1\), so \(\mathbf 0\notin W\) — not a subspace (also \((1,0,0)\in W\) but \(2(1,0,0)\notin W\)).</p>
<div class="box key"><span class="h">Shortcuts</span>
<b>Nul A</b> = \(\{\mathbf x: A\mathbf x = \mathbf 0\}\) is always a subspace of \(\mathbb R^n\) (n = # columns). Any set defined by <b>homogeneous</b> linear equations is a null space.<br>
<b>Col A</b> = span of the columns, a subspace of \(\mathbb R^m\) (m = # rows). Any set of the form \(\{(a-b,\ b+2c,\dots)\}\) is a column space — put the coefficients of a, b, c in columns.<br>
<b>Span</b> of any vectors is a subspace.</div>

<h2>Bases</h2>
<p>A <b>basis</b> of H is a linearly independent set that spans H. <b>dim H</b> = number of vectors in any basis.</p>
<table class="tbl"><tr><th>Space</th><th>Basis</th><th>Dimension</th></tr>
<tr><td>Col A</td><td><b>pivot columns of the original A</b> (not of the RREF!)</td><td>rank A = # pivots</td></tr>
<tr><td>Nul A</td><td>vectors in the parametric vector form of the solution of \(A\mathbf x = \mathbf 0\)</td><td># free variables</td></tr>
<tr><td>Row A</td><td>nonzero rows of an echelon form</td><td>rank A</td></tr></table>
<div class="box key"><span class="h">Rank Theorem</span>\[\operatorname{rank}A + \dim\operatorname{Nul}A = n\ (\text{number of columns})\]</div>
<p><b>Spanning set theorem:</b> if a vector in a spanning set is a combination of the others, remove it — the span is unchanged. Read the dependencies off the RREF: e.g. if column 4 of RREF is \((1,1,0)\) then \(\mathbf v_4 = \mathbf v_1 + \mathbf v_3\).</p>
<p><b>Basis theorem:</b> in a p-dimensional space, any p linearly independent vectors form a basis (and any p vectors that span form a basis). To <b>extend</b> a basis of H to \(\mathbb R^n\): add standard vectors \(\mathbf e_i\) and check independence (det ≠ 0 or n pivots).</p>
<p>Every vector in Nul A is orthogonal to every row of A (since \(A\mathbf x = \mathbf 0\) means each row · x = 0): \((\operatorname{Row}A)^\perp = \operatorname{Nul}A\).</p>

<h2>Coordinates</h2>
<p>If \(\mathcal B = \{\mathbf b_1,\dots,\mathbf b_n\}\) and \(\mathbf x = c_1\mathbf b_1+\dots+c_n\mathbf b_n\), then \([\mathbf x]_\mathcal B = (c_1,\dots,c_n)\).</p>
<div class="box key">\[P_\mathcal B = [\mathbf b_1\ \cdots\ \mathbf b_n],\quad \mathbf x = P_\mathcal B[\mathbf x]_\mathcal B,\quad [\mathbf x]_\mathcal B = P_\mathcal B^{-1}\mathbf x\]
\(P_\mathcal B\) is invertible because its columns form a basis (linearly independent ⇒ n pivots).</div>

<h2>Change of basis</h2>
<div class="box key">\[[\mathbf x]_\mathcal C = \underset{\mathcal C\leftarrow\mathcal B}{P}\,[\mathbf x]_\mathcal B,\qquad \underset{\mathcal C\leftarrow\mathcal B}{P} = \big[\,[\mathbf b_1]_\mathcal C\ \ [\mathbf b_2]_\mathcal C\ \cdots\big],\qquad \underset{\mathcal B\leftarrow\mathcal C}{P} = \Big(\underset{\mathcal C\leftarrow\mathcal B}{P}\Big)^{-1}\]</div>
<ul><li><b>Abstract form</b> (e.g. \(\mathbf b_1 = 2\mathbf c_1 + \mathbf c_2\)): the coefficients of \(\mathbf b_j\) form <b>column j</b> of \(\underset{\mathcal C\leftarrow\mathcal B}{P}\). Careful: columns, not rows!</li>
<li><b>In \(\mathbb R^n\)</b>: row reduce \([\,\mathbf c_1\ \mathbf c_2\ |\ \mathbf b_1\ \mathbf b_2\,] \sim [\,I\ |\ \underset{\mathcal C\leftarrow\mathcal B}{P}\,]\). (“new basis on the left, old on the right”.)</li></ul>

<h2>Kernel & range of \(T(\mathbf x)=A\mathbf x\)</h2>
<p>\(\ker T = \operatorname{Nul}A\) (subspace of the domain \(\mathbb R^n\)); range \(T = \operatorname{Col}A\) (subspace of the codomain \(\mathbb R^m\)). T is one-to-one ⇔ \(\ker T = \{\mathbf 0\}\).</p>
`,
    },
    {
      id: 'det', n: 6, title: 'Determinants',
      summary: 'Cofactor expansion, row-operation properties, (−1)ʳ·pivots, Cramer’s rule, volume',
      tools: ['det', 'cramer'], solutions: ['a3q5'],
      html: R`
<h2>Cofactor expansion</h2>
<div class="box key">\[\det A = a_{i1}C_{i1} + a_{i2}C_{i2} + \cdots + a_{in}C_{in},\qquad C_{ij} = (-1)^{i+j}\det A_{ij}\]
\(A_{ij}\) = A with row i and column j deleted. Sign pattern: \(\begin{bmatrix}+&-&+\\-&+&-\\+&-&+\end{bmatrix}\). Expand along the row/column with the <b>most zeros</b>.</div>
<p>2×2: \(\det\begin{bmatrix}a&b\\c&d\end{bmatrix} = ad - bc\). Triangular: det = product of diagonal entries.</p>

<h2>Row operations & properties</h2>
<table class="tbl"><tr><th>Operation / property</th><th>Effect</th></tr>
<tr><td>Replacement \(R_i\to R_i + cR_j\)</td><td>det unchanged</td></tr>
<tr><td>Interchange two rows</td><td>det changes <b>sign</b></td></tr>
<tr><td>Scale a row by k</td><td>det multiplied by k</td></tr>
<tr><td>\(\det A^T\)</td><td>\(= \det A\)</td></tr>
<tr><td>\(\det(AB)\)</td><td>\(= \det A\cdot\det B\) (multiplicative property)</td></tr>
<tr><td>\(\det(A^{-1})\)</td><td>\(= 1/\det A\)</td></tr>
<tr><td>\(\det(kA)\) for n×n</td><td>\(= k^n\det A\)</td></tr>
<tr><td>\(\det(A^TA)\)</td><td>\(= (\det A)^2\)</td></tr></table>
<div class="box key"><span class="h">Elimination formula</span>Reduce A to echelon form U using only replacements and r interchanges:
\[\det A = (-1)^r\cdot(\text{product of pivots of } U)\]
A is invertible ⇔ \(\det A \neq 0\).</div>

<h2>Cramer's rule</h2>
<p>If \(\det A\neq0\), the unique solution of \(A\mathbf x = \mathbf b\) is \(x_i = \dfrac{\det A_i(\mathbf b)}{\det A}\), where \(A_i(\mathbf b)\) = A with <b>column i replaced by b</b>.</p>
<p>Inverse formula: \(A^{-1} = \dfrac{1}{\det A}\operatorname{adj}A\), \(\operatorname{adj}A = [C_{ji}]\) (transpose of cofactor matrix).</p>

<h2>Geometry</h2>
<p>|det A| = <b>area</b> of the parallelogram (2×2) or <b>volume</b> of the parallelepiped (3×3) spanned by the columns. For a linear map, area(T(S)) = |det A| · area(S).</p>
<div class="box warn"><span class="h">Watch out</span>Volume is \(|\det A|\) — never negative. A negative determinant gives a positive volume.</div>
`,
    },
    {
      id: 'eigen', n: 7, title: 'Eigenvalues & Diagonalization',
      summary: 'Characteristic equation, eigenspaces, algebraic vs geometric multiplicity, A = PDP⁻¹, powers',
      tools: ['eigen', 'power'], solutions: ['h4a', 'h4b'],
      html: R`
<h2>Definitions</h2>
<p>\(A\mathbf x = \lambda\mathbf x\) with \(\mathbf x\neq\mathbf 0\). \(\lambda\) is an <b>eigenvalue</b>, \(\mathbf x\) an <b>eigenvector</b>. (Eigenvectors are <b>never</b> zero; eigenvalues <b>can</b> be 0.)</p>
<div class="box recipe"><span class="h">Recipe</span>
<ol><li>Characteristic equation \(\det(A-\lambda I) = 0\). For 2×2: \(\lambda^2 - (\operatorname{tr}A)\lambda + \det A = 0\).</li>
<li>Solve for λ. For triangular A, the eigenvalues are the diagonal entries (no determinant needed).</li>
<li>For each λ, row reduce \(A - \lambda I\) and solve \((A-\lambda I)\mathbf x=\mathbf 0\). The basis of this null space = basis of the <b>eigenspace</b>.</li></ol></div>
<p>Useful checks: sum of eigenvalues = trace; product of eigenvalues = det A. λ = 0 is an eigenvalue ⇔ A is singular.</p>

<h2>Multiplicities</h2>
<ul><li><b>Algebraic multiplicity (AM)</b>: how many times λ is a root of the characteristic polynomial.</li>
<li><b>Geometric multiplicity (GM)</b>: dim of the eigenspace = number of free variables in \((A-\lambda I)\mathbf x = \mathbf 0\).</li>
<li>Always \(1 \le \text{GM} \le \text{AM}\).</li></ul>

<h2>Diagonalization</h2>
<div class="box key"><span class="h">Diagonalization theorem</span>
A (n×n) is diagonalizable ⇔ A has n linearly independent eigenvectors ⇔ GM = AM for every eigenvalue (and they sum to n).<br>
Then \(A = PDP^{-1}\): columns of P = eigenvectors, D = diagonal of the matching eigenvalues <b>in the same order</b>.<br>
n <b>distinct</b> eigenvalues ⇒ diagonalizable (sufficient, not necessary).</div>
<p>Instead of computing \(P^{-1}\), verify \(AP = PD\).</p>
<p><b>Powers:</b> \(A^k = PD^kP^{-1}\), \(D^k\) = diagonal of \(\lambda_i^k\).</p>
<div class="box warn"><span class="h">Classic non-diagonalizable example</span>\(\begin{bmatrix}5&1\\0&5\end{bmatrix}\): λ = 5 with AM = 2 but \(A - 5I = \begin{bmatrix}0&1\\0&0\end{bmatrix}\) has 1 free variable ⇒ GM = 1 < 2 ⇒ not diagonalizable.</div>
`,
    },
    {
      id: 'orth', n: 8, title: 'Orthogonality, Projections & Gram–Schmidt',
      summary: 'Dot product, orthogonal sets, projections, distance, orthogonal matrices, Gram–Schmidt',
      tools: ['proj', 'orthset', 'gs'], solutions: ['h4c'],
      html: R`
<h2>Basics</h2>
<p>\(\mathbf u\cdot\mathbf v = \mathbf u^T\mathbf v\), \(\|\mathbf v\| = \sqrt{\mathbf v\cdot\mathbf v}\), \(\operatorname{dist}(\mathbf u,\mathbf v) = \|\mathbf u-\mathbf v\|\). Orthogonal ⇔ \(\mathbf u\cdot\mathbf v = 0\). Unit vector: \(\mathbf v/\|\mathbf v\|\).</p>
<p><b>Orthogonal complement</b> \(W^\perp\): all vectors orthogonal to every vector of W. For the plane \(ax+by+cz=0\), the normal \(\mathbf n = (a,b,c)\) spans \(W^\perp\); a line along d is ⟂ W ⇔ d is a multiple of n.</p>
<div class="box key"><span class="h">Fundamental subspaces</span>\[(\operatorname{Row}A)^\perp = \operatorname{Nul}A,\qquad (\operatorname{Col}A)^\perp = \operatorname{Nul}A^T\]
(Not \(\operatorname{Nul}A\)! — a favourite True/False trap.)</div>

<h2>Orthogonal sets</h2>
<p>An orthogonal set of <b>nonzero</b> vectors is linearly independent. If \(\{\mathbf u_1,\dots,\mathbf u_p\}\) is an orthogonal basis then weights come for free — no system to solve:</p>
\[\mathbf y = c_1\mathbf u_1+\cdots+c_p\mathbf u_p,\qquad c_j = \frac{\mathbf y\cdot\mathbf u_j}{\mathbf u_j\cdot\mathbf u_j}\]

<h2>Orthogonal projection</h2>
<div class="box key">Onto a line: \(\hat{\mathbf y} = \dfrac{\mathbf y\cdot\mathbf u}{\mathbf u\cdot\mathbf u}\mathbf u\).<br>
Onto W with <b>orthogonal</b> basis: \(\hat{\mathbf y} = \dfrac{\mathbf y\cdot\mathbf u_1}{\mathbf u_1\cdot\mathbf u_1}\mathbf u_1 + \cdots + \dfrac{\mathbf y\cdot\mathbf u_p}{\mathbf u_p\cdot\mathbf u_p}\mathbf u_p\).<br>
\(\mathbf z = \mathbf y - \hat{\mathbf y} \in W^\perp\). Distance from y to W = \(\|\mathbf y-\hat{\mathbf y}\|\).</div>
<p><b>Best approximation theorem:</b> \(\hat{\mathbf y}\) is the closest point of W to y: \(\|\mathbf y - \hat{\mathbf y}\| < \|\mathbf y - \mathbf v\|\) for every other \(\mathbf v\in W\). (This is the basis of least squares.)</p>
<div class="box warn">Always check \(\mathbf z\cdot\mathbf u_i = 0\) — it catches arithmetic errors and earns the verification mark.</div>

<h2>Orthonormal columns & orthogonal matrices</h2>
<p>U has orthonormal columns ⇔ \(U^TU = I\). Then \(\|U\mathbf x\| = \|\mathbf x\|\) and \((U\mathbf x)\cdot(U\mathbf y) = \mathbf x\cdot\mathbf y\) (lengths and angles preserved). A <b>square</b> such U is an <b>orthogonal matrix</b>: \(U^{-1} = U^T\).</p>

<h2>Gram–Schmidt</h2>
<div class="box recipe">\[\mathbf v_1 = \mathbf x_1,\quad \mathbf v_2 = \mathbf x_2 - \frac{\mathbf x_2\cdot\mathbf v_1}{\mathbf v_1\cdot\mathbf v_1}\mathbf v_1,\quad \mathbf v_3 = \mathbf x_3 - \frac{\mathbf x_3\cdot\mathbf v_1}{\mathbf v_1\cdot\mathbf v_1}\mathbf v_1 - \frac{\mathbf x_3\cdot\mathbf v_2}{\mathbf v_2\cdot\mathbf v_2}\mathbf v_2\]
You may scale any \(\mathbf v_k\) to clear fractions. Then normalise: \(\mathbf u_k = \mathbf v_k/\|\mathbf v_k\|\).</div>
`,
    },
    {
      id: 'symm', n: 9, title: 'Symmetric Matrices & Quadratic Forms',
      summary: 'Spectral theorem, A = PDPᵀ, quadratic forms, change of variable, definiteness, constrained optimisation',
      tools: ['eigen', 'quad'], solutions: ['h5a', 'h5b', 'h5c'],
      html: R`
<h2>Spectral theorem</h2>
<div class="box key"><span class="h">For a symmetric matrix \(A = A^T\) (n×n)</span>
<ol><li>A has n <b>real</b> eigenvalues (counting multiplicity).</li>
<li>GM = AM for every eigenvalue.</li>
<li>Eigenvectors for <b>different</b> eigenvalues are <b>orthogonal</b>.</li>
<li>A is <b>orthogonally diagonalizable</b>: \(A = PDP^T\) with P orthogonal (\(P^{-1} = P^T\)).</li></ol>
And conversely: orthogonally diagonalizable ⇔ symmetric. (So “every diagonalizable matrix is orthogonally diagonalizable” is <b>False</b>.)</div>
<p><b>Spectral decomposition:</b> \(A = \lambda_1\mathbf u_1\mathbf u_1^T + \cdots + \lambda_n\mathbf u_n\mathbf u_n^T\). Each \(\mathbf u_j\mathbf u_j^T\) is a <b>rank-1 projection matrix</b>: \((\mathbf u_j\mathbf u_j^T)\mathbf x = (\mathbf u_j\cdot\mathbf x)\mathbf u_j\) is the projection of x onto Span{u_j}.</p>
<div class="box recipe"><span class="h">Recipe: orthogonally diagonalize</span>Eigenvalues → eigenvectors → (Gram–Schmidt inside a repeated eigenspace if needed) → <b>normalize</b> → P = [u₁ u₂ …], D = diag(λ₁, λ₂, …).</div>

<h2>Quadratic forms</h2>
<p>\(Q(\mathbf x) = \mathbf x^TA\mathbf x\), A symmetric. <b>Diagonal</b> entries = coefficients of \(x_i^2\); <b>off-diagonal</b> \(a_{ij} = a_{ji}\) = <b>half</b> the coefficient of \(x_ix_j\).</p>
<p>Example: \(2x_1^2 - 3x_2^2 + 5x_3^2 + 6x_1x_2 - 4x_2x_3 \Rightarrow A = \begin{bmatrix}2&3&0\\3&-3&-2\\0&-2&5\end{bmatrix}\).</p>
<p><b>Change of variable</b> \(\mathbf x = P\mathbf y\) (P orthogonally diagonalizes A): \(\mathbf x^TA\mathbf x = \mathbf y^TD\mathbf y = \lambda_1y_1^2 + \cdots + \lambda_ny_n^2\) — no cross terms. The value is unchanged: compute \(\mathbf y = P^T\mathbf x\).</p>

<h2>Classification (definiteness)</h2>
<table class="tbl"><tr><th>Eigenvalues of A</th><th>Q is</th><th>\(Q(\mathbf x)=c\) in \(\mathbb R^2\)</th></tr>
<tr><td>all &gt; 0</td><td>positive definite (Q(x) &gt; 0 for x ≠ 0)</td><td>c &gt; 0: ellipse · c = 0: only the origin · c &lt; 0: empty</td></tr>
<tr><td>all &lt; 0</td><td>negative definite</td><td>c &lt; 0: ellipse · c &gt; 0: empty</td></tr>
<tr><td>mixed signs</td><td>indefinite</td><td>hyperbola (c≠0) · two lines (c = 0)</td></tr>
<tr><td>≥ 0 with some 0</td><td>positive semidefinite</td><td>—</td></tr></table>

<h2>Constrained optimisation</h2>
<div class="box key">On the unit sphere \(\mathbf x^T\mathbf x = 1\) with eigenvalues \(\lambda_1\ge\lambda_2\ge\cdots\ge\lambda_n\):
<ul style="margin:6px 0 0"><li>\(\max \mathbf x^TA\mathbf x = \lambda_1\) at \(\mathbf u_1\); \(\min = \lambda_n\) at \(\mathbf u_n\).</li>
<li>Subject also to \(\mathbf x^T\mathbf u_1 = 0\): max = \(\lambda_2\) at \(\mathbf u_2\).</li>
<li>Subject to \(\mathbf x\perp\mathbf u_1,\mathbf u_2\): max = \(\lambda_3\) at \(\mathbf u_3\).</li></ul></div>
<p><b>Justification inequality</b> (diagonal case \(Q = 8x_1^2+5x_2^2+2x_3^2\)): \(Q \le 8x_1^2 + 8x_2^2 + 8x_3^2 = 8(x_1^2+x_2^2+x_3^2) = 8\), and \(Q \ge 2(x_1^2+x_2^2+x_3^2) = 2\).</p>
`,
    },
    {
      id: 'svd', n: 10, title: 'SVD, Pseudoinverse, Left & Right Inverses',
      summary: 'Singular values, A = UΣVᵀ, reduced SVD, A⁺, (AᵀA)⁻¹Aᵀ, Aᵀ(AAᵀ)⁻¹',
      tools: ['svd', 'leftright'], solutions: ['h5d'],
      html: R`
<h2>Singular values</h2>
<p>\(A^TA\) is symmetric with eigenvalues \(\lambda_i \ge 0\). The <b>singular values</b> are \(\sigma_i = \sqrt{\lambda_i}\) (lengths \(\|A\mathbf v_i\|\)), ordered \(\sigma_1\ge\sigma_2\ge\cdots\ge0\).</p>
<div class="box warn">The singular values are the <b>square roots</b> of the eigenvalues of \(A^TA\) — not the eigenvalues themselves (True/False trap).</div>
<p>Geometry: \(\mathbf x\mapsto A\mathbf x\) sends the unit circle/sphere to an ellipse/ellipsoid. \(\max_{\|\mathbf x\|=1}\|A\mathbf x\| = \sigma_1\), attained at \(\mathbf v_1\); the point on the ellipse is \(A\mathbf v_1\).</p>

<h2>Constructing \(A = U\Sigma V^T\)</h2>
<div class="box recipe"><span class="h">Recipe</span>
<ol><li>Compute \(A^TA\); find its eigenvalues (descending) and <b>unit</b> eigenvectors \(\mathbf v_1,\dots,\mathbf v_n\) → \(V = [\mathbf v_1\ \cdots\ \mathbf v_n]\).</li>
<li>\(\sigma_i = \sqrt{\lambda_i}\). Σ has the <b>same size as A</b> (m×n) with \(\sigma_1,\dots,\sigma_r\) on the diagonal, zeros elsewhere.</li>
<li>\(\mathbf u_i = \dfrac{1}{\sigma_i}A\mathbf v_i\) for each nonzero \(\sigma_i\) (automatically orthonormal).</li>
<li>If r &lt; m, extend \(\{\mathbf u_1,\dots,\mathbf u_r\}\) to an orthonormal basis of \(\mathbb R^m\) (find vectors orthogonal to all of them: solve \(\mathbf u_i^T\mathbf x = 0\), i.e. Nul \(A^T\), or use the cross product in \(\mathbb R^3\); normalize).</li>
<li>\(A = U\Sigma V^T\).</li></ol></div>
<p>rank A = number of nonzero singular values.</p>
<p><b>Reduced SVD:</b> \(A = U_rDV_r^T\) with only the first r columns, \(D = \operatorname{diag}(\sigma_1,\dots,\sigma_r)\).</p>

<h2>Pseudoinverse</h2>
<div class="box key">\[A^+ = V_rD^{-1}U_r^T\]
\(\hat{\mathbf x} = A^+\mathbf b\) is the minimum-length least-squares solution. If A is <b>square and invertible</b>, \(A^+ = A^{-1}\).</div>

<h2>Left & right inverses</h2>
<table class="tbl"><tr><th></th><th>Left inverse \(L\) (\(LA = I_n\))</th><th>Right inverse \(R\) (\(AR = I_m\))</th></tr>
<tr><td>Exists when</td><td>columns independent (rank = n), typical for tall m &gt; n</td><td>rows independent (rank = m), typical for wide m &lt; n</td></tr>
<tr><td>Formula</td><td>\(L = (A^TA)^{-1}A^T\)</td><td>\(R = A^T(AA^T)^{-1}\)</td></tr></table>
<p>A tall 3×2 A has no right inverse: \(\operatorname{rank}(AR)\le\operatorname{rank}A\le2 < 3 = \operatorname{rank}I_3\).</p>
<p>For full column rank, the left inverse equals \(A^+\); for full row rank, the right inverse equals \(A^+\).</p>
`,
    },
  ];
})();
