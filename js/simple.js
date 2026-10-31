// Plain-English guide: every topic explained with everyday pictures and one tiny hand-worked example.
// Written as String.raw so LaTeX backslashes stay single.
(function () {
  const R = String.raw;
  const box = (type, title, html) => `<div class="box ${type}">${title ? `<span class="h">${title}</span>` : ''}${html}</div>`;

  window.SIMPLE = [
    {
      id: 'bigpicture', emoji: '🗺️', title: 'The big picture (read this first)', asg: 'All',
      line: 'A matrix is a machine. Every topic asks a different question about that machine.',
      html: R`
${box('key', 'The one idea that ties everything together', R`<p>A <b>vector</b> is just a list of numbers, like \((3, 1)\). Picture it as an arrow from the origin, or as a point.</p>
<p>A <b>matrix</b> \(A\) is a <b>machine</b>: you feed in a vector \(x\), and it gives you back a new vector \(Ax\). It can stretch, rotate, flip, shear or squash space.</p>`)}
<h2>Every topic is just a question about the machine</h2>
<table class="simple-map">
<tr><th>Topic</th><th>The question it answers, in plain words</th></tr>
<tr><td>1. Linear systems (you know this ✓)</td><td>Which input \(x\) gives this output \(b\)? Solve \(Ax=b\) with row reduction.</td></tr>
<tr><td>2. Block multiplication</td><td>Can I multiply big matrices by chopping them into smaller pieces? (Yes.)</td></tr>
<tr><td>3. LU factorization</td><td>Can I write down my row reduction so I can reuse it?</td></tr>
<tr><td>4. Linear transformations</td><td>What does the machine do to space? Does it lose information? Can it reach every output?</td></tr>
<tr><td>5. Vector spaces</td><td>What are all the outputs it can make (Col A)? What inputs does it crush to zero (Nul A)?</td></tr>
<tr><td>6. Determinants</td><td>By how much does the machine scale area or volume? Is it 0 (squashed flat, so no inverse)?</td></tr>
<tr><td>7. Eigenvalues</td><td>Which directions does the machine only stretch, without turning? By how much?</td></tr>
<tr><td>8. Orthogonality</td><td>Which vectors are perpendicular? What is the "shadow" of one vector on another?</td></tr>
<tr><td>9. Symmetric &amp; quadratic forms</td><td>Is a formula like \(5x^2+4xy+2y^2\) always positive (a bowl), always negative (a dome), or mixed (a saddle)?</td></tr>
<tr><td>10. SVD</td><td>Can ANY matrix (even a rectangular one) be split into rotate → stretch → rotate?</td></tr>
</table>
${box('good', 'Good news: you already know the most important skill', R`<p>Row reduction (RREF) from Assignment 1 is the <b>master key</b>. It is how you:</p>
<ul><li>build \(U\) in LU (topic 3);</li>
<li>find Nul A and Col A (topic 5), and one-to-one/onto (topic 4);</li>
<li>find eigenvectors (topic 7): solving \((A-\lambda I)v = 0\) is just a system with free variables!</li>
<li>change basis (topic 5): row reduce \([\,C \mid B\,]\).</li></ul>
<p>So most new topics are "set up a matrix, then do the row reduction you already know".</p>`)}
<h2>Which assignment uses which topics</h2>
<ul>
<li><b>Assignment 1 Part B:</b> block multiplication (topic 2)</li>
<li><b>Assignment 2:</b> LU (3), Col/Nul and rank (5), transformations: shear then rotate, images and pre-images (4)</li>
<li><b>Assignment 3:</b> subspaces, basis, coordinates, change of basis, kernel and range (5), determinants and Cramer's rule (6)</li>
<li><b>Homework 4:</b> eigenvalues and diagonalization (7), orthogonality, projection and Gram–Schmidt (8)</li>
<li><b>Homework 5:</b> symmetric matrices and quadratic forms (9), SVD, pseudoinverse and left/right inverses (10)</li>
</ul>`,
    },
    {
      id: 'block', emoji: '🧱', title: 'Block multiplication', asg: 'Assignment 1B',
      line: 'Multiply big matrices by cutting them into tiles, then multiplying tiles like single numbers.',
      html: R`
${box('key', 'In one sentence', R`<p>Cut each matrix into rectangular <b>blocks</b> (tiles). Then multiply as if each tile were a single number, using the ordinary row × column rule.</p>`)}
<h2>Everyday picture</h2>
<p>Think of a big Excel sheet split into four regions. Instead of multiplying cell by cell, you multiply region by region. The answer comes out the same.</p>
<h2>The rule you must remember</h2>
<p>For \(A = \begin{bmatrix} A_{11} & A_{12} \\ A_{21} & A_{22}\end{bmatrix}\) and \(B = \begin{bmatrix} B_{1} \\ B_{2}\end{bmatrix}\):</p>
$$AB = \begin{bmatrix} A_{11}B_1 + A_{12}B_2 \\ A_{21}B_1 + A_{22}B_2\end{bmatrix}$$
${box('warn', 'Two traps', R`<ol><li><b>The cuts must line up:</b> the way you cut A's <b>columns</b> must match the way you cut B's <b>rows</b>. If A's columns are split 2 | 1, then B's rows must be split 2 | 1.</li>
<li><b>Order matters:</b> write \(A_{11}B_1\), never \(B_1A_{11}\). Tiles are matrices, and matrices don't commute.</li></ol>`)}
<h2>Tiny example by hand</h2>
<p>\(A = \left[\begin{array}{cc|c} 1&0&2\\0&1&3\end{array}\right]\), with columns cut 2 | 1, so \(A_1 = I\) and \(A_2 = \begin{bmatrix}2\\3\end{bmatrix}\).</p>
<p>\(B = \left[\begin{array}{cc} 1&1\\2&0\\\hline 1&1\end{array}\right]\), with rows cut 2 | 1, so \(B_1 = \begin{bmatrix}1&1\\2&0\end{bmatrix}\) and \(B_2 = \begin{bmatrix}1&1\end{bmatrix}\).</p>
$$AB = A_1B_1 + A_2B_2 = \begin{bmatrix}1&1\\2&0\end{bmatrix} + \begin{bmatrix}2&2\\3&3\end{bmatrix} = \begin{bmatrix}3&3\\5&3\end{bmatrix}$$
<p>Check with normal multiplication: row 1 of A · column 1 of B \(= 1+0+2 = 3\) ✓.</p>
${box('recipe', 'In the exam', R`<ol><li>Write down the size of every block.</li><li>Check that A's column cuts = B's row cuts ("compatible").</li><li>Multiply block by block, keeping the order.</li><li>Verify one or two entries with ordinary multiplication.</li></ol>`)}`,
    },
    {
      id: 'lu', emoji: '🧾', title: 'LU factorization (PA = LU)', asg: 'Assignment 2',
      line: 'Do the row reduction you already know, and keep a receipt of what you did.',
      html: R`
${box('key', 'In one sentence', R`<p>\(A = LU\): \(U\) is the <b>staircase (echelon) form</b> you get from row reduction, and \(L\) is the <b>receipt</b> that records the multipliers you used.</p>`)}
<h2>Everyday picture</h2>
<p>You did a long calculation once. Instead of redoing it for every new \(b\), you saved your work (\(L\) and \(U\)). Solving with triangular matrices is then super fast: you just substitute.</p>
<h2>Tiny example by hand</h2>
<p>\(A = \begin{bmatrix}2&1\\6&8\end{bmatrix}\). Eliminate the 6 below the pivot with \(R_2 \to R_2 - 3R_1\):</p>
$$U = \begin{bmatrix}2&1\\0&5\end{bmatrix}, \qquad L = \begin{bmatrix}1&0\\ \mathbf{3}&1\end{bmatrix}$$
<p>The <b>3</b> you subtracted goes into \(L\) in the same spot (row 2, column 1), as a <b>positive</b> 3. \(L\) has 1s on the diagonal.</p>
<p>Check: \(LU = \begin{bmatrix}2&1\\6&3+5\end{bmatrix} = A\) ✓</p>
<h2>Using it to solve \(Ax = b\), with \(b = (3, 19)\)</h2>
<ol><li><b>Forward</b>, solve \(Ly = b\): \(y_1 = 3\), then \(3(3) + y_2 = 19 \Rightarrow y_2 = 10\).</li>
<li><b>Backward</b>, solve \(Ux = y\): \(5x_2 = 10 \Rightarrow x_2 = 2\), then \(2x_1 + 2 = 3 \Rightarrow x_1 = \tfrac12\).</li></ol>
<p>Check in the original: \(2(\tfrac12) + 2 = 3\) ✓ and \(6(\tfrac12) + 8(2) = 19\) ✓.</p>
${box('warn', 'When do you need P?', R`<p>If a pivot position becomes <b>0</b>, you can't divide by it, so you must <b>swap rows</b>. \(P\) is the identity matrix with the same rows swapped. Then you factor \(PA = LU\) instead of \(A = LU\).</p>
<p>Tip: do the swap first on A (and on b), then eliminate normally.</p>`)}
${box('recipe', 'In the exam', R`<ol><li>Is a zero pivot coming? Then swap first and write P.</li><li>Eliminate column by column using only "row − (multiplier)×pivot row".</li><li>Put each multiplier into L in the matching position.</li><li>Check that \(LU\) equals \(A\) (or \(PA\)).</li><li>If a \(b\) is given: solve \(Ly = Pb\), then \(Ux = y\).</li></ol>`)}`,
    },
    {
      id: 'transform', emoji: '🔄', title: 'Linear transformations', asg: 'Assignment 2 & 3',
      line: 'The matrix moves every point of space. Look at what it does to the basic arrows.',
      html: R`
${box('key', 'In one sentence', R`<p>\(T(x) = Ax\) moves every point. "Linear" means straight lines stay straight, the grid stays evenly spaced, and the origin stays put.</p>`)}
<h2>The trick for finding the matrix</h2>
<p>Just ask: where do the basic arrows \(e_1 = (1,0)\) and \(e_2 = (0,1)\) go? <b>Those images are the columns of A.</b></p>
<p>Example: rotate 90° counter-clockwise. \(e_1 \to (0,1)\) and \(e_2 \to (-1,0)\), so</p>
$$A = \begin{bmatrix}0&-1\\1&0\end{bmatrix}$$
<p>A horizontal shear by \(k\): \(e_1 \to (1,0)\) and \(e_2 \to (k,1)\), so \(A = \begin{bmatrix}1&k\\0&1\end{bmatrix}\).</p>
${box('warn', 'Doing two moves in a row ("shear THEN rotate")', R`<p>The first move goes on the <b>right</b>: \(\text{total} = R \cdot S\) (rotate × shear). Read it like functions, \(R(S(x))\): the shear happens to \(x\) first.</p>`)}
<h2>Words you'll see, in plain English</h2>
<ul>
<li><b>Image of x:</b> where x lands. Just compute \(Ax\).</li>
<li><b>Pre-image of b:</b> which x lands on b? Solve \(Ax = b\) with row reduction (Assignment 1 skill!).</li>
<li><b>Kernel:</b> all inputs that get crushed to 0. This is the same as Nul A.</li>
<li><b>Range:</b> all possible outputs. This is the same as Col A.</li>
<li><b>One-to-one:</b> no two inputs land on the same spot, so no information is lost. Test: there is a <b>pivot in every column</b> (no free variables), i.e. the kernel is only \(\{0\}\).</li>
<li><b>Onto:</b> every output can be reached. Test: there is a <b>pivot in every row</b>.</li>
</ul>
${box('recipe', 'Is T linear?', R`<p>Quick fail test: \(T(0)\) must be \(0\). For example, \(T(x) = x + 1\) is <b>not</b> linear, because \(T(0) = 1\).</p><p>Full test: \(T(u+v) = T(u) + T(v)\) and \(T(cu) = cT(u)\).</p>`)}`,
    },
    {
      id: 'spaces', emoji: '🧪', title: 'Vector spaces, basis, Col A, Nul A', asg: 'Assignment 2 & 3',
      line: 'Ingredients and recipes: what can you build, and what is redundant?',
      html: R`
${box('key', 'Cooking picture (this makes everything click)', R`<ul>
<li><b>Vectors</b> are ingredients. A <b>linear combination</b> is a recipe: \(2v_1 + 3v_2\).</li>
<li><b>Span</b> is every dish you can possibly cook from these ingredients.</li>
<li><b>Linearly independent</b> means no ingredient is redundant: none can be made from the others.</li>
<li><b>Basis</b> is the smallest set of ingredients that can still cook everything in the space.</li>
<li><b>Dimension</b> is how many ingredients are in a basis.</li>
<li><b>Coordinates</b> \([x]_B\) are the recipe: how much of each basis ingredient you need to make x.</li>
</ul>`)}
<h2>Subspace: a "room" through the origin</h2>
<p>A set H is a subspace if it passes all three checks:</p>
<ol><li>It contains the zero vector.</li><li>Adding two members keeps you inside.</li><li>Scaling a member keeps you inside.</li></ol>
<p>A line or plane through the origin passes. A line that misses the origin fails (no 0). Sets with conditions like "\(x \ge 0\)" fail too, because scaling by \(-1\) takes you outside.</p>
<h2>The two famous spaces of a matrix</h2>
<ul>
<li><b>Col A</b> (column space) is all possible outputs of the machine. Basis = the <b>pivot columns of the ORIGINAL A</b> (not of the RREF!).</li>
<li><b>Nul A</b> (null space) is all inputs crushed to 0, i.e. solve \(Ax = 0\). Basis = one vector per <b>free variable</b>.</li>
</ul>
<h2>Tiny example by hand</h2>
<p>\(A = \begin{bmatrix}1&2&3\\2&4&7\end{bmatrix} \xrightarrow{R_2-2R_1} \begin{bmatrix}1&2&3\\0&0&1\end{bmatrix} \xrightarrow{R_1-3R_2} \begin{bmatrix}1&2&0\\0&0&1\end{bmatrix}\)</p>
<p>The pivots are in columns 1 and 3, and \(x_2\) is free.</p>
<ul><li>Col A basis: \(\left\{\begin{bmatrix}1\\2\end{bmatrix}, \begin{bmatrix}3\\7\end{bmatrix}\right\}\), taken from the original A.</li>
<li>Nul A: \(x_1 = -2x_2\) and \(x_3 = 0\), so \(x = x_2\begin{bmatrix}-2\\1\\0\end{bmatrix}\). Basis: \(\{(-2,1,0)\}\).</li>
<li><b>Rank theorem:</b> rank (2) + nullity (1) = number of columns (3) ✓</li></ul>
<h2>Coordinates: find the recipe</h2>
<p>Take \(B = \{(1,1), (1,-1)\}\) and \(x = (3,1)\). Solve \(c_1(1,1) + c_2(1,-1) = (3,1)\): \(c_1 + c_2 = 3\) and \(c_1 - c_2 = 1\), so \(c_1 = 2\) and \(c_2 = 1\).</p>
<p>So \([x]_B = (2, 1)\): "2 of the first ingredient plus 1 of the second". Check: \(2(1,1) + (1,-1) = (3,1)\) ✓</p>
${box('recipe', 'Change of basis \\(P_{C\\leftarrow B}\\) (converts B-recipes into C-recipes)', R`<ol><li>Write the augmented matrix \([\,c_1\ c_2 \mid b_1\ b_2\,]\): new basis on the left, old basis on the right.</li><li>Row reduce until the left side is \(I\).</li><li>The right side is now \(P_{C\leftarrow B}\). Then \([x]_C = P_{C\leftarrow B}[x]_B\).</li></ol>`)}`,
    },
    {
      id: 'det', emoji: '📐', title: 'Determinants & Cramer’s rule', asg: 'Assignment 3',
      line: 'One number: how much the machine scales area. Zero means squashed flat, so no inverse.',
      html: R`
${box('key', 'In one sentence', R`<p>\(\det A\) tells you how much A <b>scales area</b> (2D) or volume (3D). If \(\det A = 0\), the machine squashes space flat, so you can't undo it and <b>A has no inverse</b>.</p>`)}
<h2>2×2: one line</h2>
$$\det\begin{bmatrix}a&b\\c&d\end{bmatrix} = ad - bc, \qquad \det\begin{bmatrix}3&1\\2&4\end{bmatrix} = 12 - 2 = 10$$
<p>So this machine makes every shape 10 times bigger in area.</p>
<h2>3×3 and bigger: cofactor expansion</h2>
<p>Pick the row or column with the <b>most zeros</b>. For each entry, multiply: entry × sign × det(the smaller matrix left after deleting its row and column). The signs follow a checkerboard:</p>
$$\begin{bmatrix}+&-&+\\-&+&-\\+&-&+\end{bmatrix}$$
<h2>How row operations change det (very common in exams)</h2>
<table class="simple-map">
<tr><th>Row operation</th><th>Effect on det</th></tr>
<tr><td>Swap two rows</td><td>Sign flips (× −1)</td></tr>
<tr><td>Multiply a row by k</td><td>det is multiplied by k</td></tr>
<tr><td>Add a multiple of one row to another</td><td>No change</td></tr>
</table>
<p>A triangular matrix has det = product of the diagonal. So the fast method is: reduce to triangular form and keep track of swaps and scalings.</p>
${box('good', 'Rules worth free marks', R`<p>\(\det(AB) = \det A \cdot \det B\), \(\det(A^T) = \det A\), \(\det(A^{-1}) = 1/\det A\), and \(\det(kA) = k^n \det A\) for an \(n\times n\) matrix.</p>`)}
<h2>Cramer's rule: solve \(Ax = b\) with determinants</h2>
<p>\(x_i = \dfrac{\det A_i}{\det A}\), where \(A_i\) is A with column i <b>replaced by b</b>.</p>
<p>Example: \(A = \begin{bmatrix}3&1\\2&4\end{bmatrix}\) and \(b = (5, 10)\), with \(\det A = 10\).</p>
<p>\(x_1 = \det\begin{bmatrix}5&1\\10&4\end{bmatrix}/10 = 10/10 = 1\) and \(x_2 = \det\begin{bmatrix}3&5\\2&10\end{bmatrix}/10 = 20/10 = 2\).</p>
<p>Check: \(3(1) + 2 = 5\) ✓ and \(2(1) + 4(2) = 10\) ✓</p>`,
    },
    {
      id: 'eigen', emoji: '🎯', title: 'Eigenvalues, eigenvectors, diagonalization', asg: 'Homework 4',
      line: 'Special directions the machine only stretches without turning. λ is the stretch amount.',
      html: R`
${box('key', 'In one sentence', R`<p>Most arrows get <b>turned</b> by the machine. An <b>eigenvector</b> \(v\) is a special arrow that stays on its own line and only gets stretched: \(Av = \lambda v\). The <b>eigenvalue</b> \(\lambda\) is the stretch factor (negative means it flips).</p>`)}
<h2>Everyday picture</h2>
<p>Stretch a rubber sheet horizontally. Horizontal arrows just get longer (eigenvectors!). Vertical arrows stay the same (also eigenvectors, with \(\lambda = 1\)). Diagonal arrows get tilted, so they are not eigenvectors.</p>
<h2>Recipe, with a tiny example: \(A = \begin{bmatrix}2&1\\1&2\end{bmatrix}\)</h2>
<ol>
<li><b>Find the eigenvalues:</b> solve \(\det(A - \lambda I) = 0\).<br>
\((2-\lambda)^2 - 1 = 0 \Rightarrow 2 - \lambda = \pm 1 \Rightarrow \lambda = 1, 3\).</li>
<li><b>Find the eigenvectors:</b> for each \(\lambda\), solve \((A - \lambda I)v = 0\). This is just a Nul space problem, using RREF and free variables, which you know!<br>
For \(\lambda = 3\): \(\begin{bmatrix}-1&1\\1&-1\end{bmatrix}\) gives \(v_1 = v_2\), so \(v = (1,1)\).<br>
For \(\lambda = 1\): \(\begin{bmatrix}1&1\\1&1\end{bmatrix}\) gives \(v_1 = -v_2\), so \(v = (1,-1)\).</li>
<li><b>Check:</b> \(A(1,1) = (3,3) = 3(1,1)\) ✓</li>
</ol>
${box('good', 'Free self-checks', R`<p><b>Sum of the eigenvalues = trace</b> (the diagonal sum): \(1 + 3 = 2 + 2\) ✓</p><p><b>Product of the eigenvalues = det:</b> \(1 \cdot 3 = 4 - 1\) ✓</p><p>For a <b>triangular</b> matrix, the eigenvalues are simply the diagonal entries.</p>`)}
<h2>Diagonalization: \(A = PDP^{-1}\)</h2>
<p>\(P\) has the eigenvectors as its columns. \(D\) is diagonal, with the eigenvalues <b>in the same order</b>.</p>
$$P = \begin{bmatrix}1&1\\1&-1\end{bmatrix},\quad D = \begin{bmatrix}3&0\\0&1\end{bmatrix}$$
<p>Why bother? Powers become easy: \(A^{k} = PD^{k}P^{-1}\), and \(D^k\) just raises each diagonal number to the power k.</p>
${box('warn', 'When can you NOT diagonalize?', R`<p>You need \(n\) independent eigenvectors for an \(n\times n\) matrix.</p><ul><li>All eigenvalues different ⇒ always diagonalizable ✓</li><li>Repeated eigenvalue: count its eigenvectors (the number of free variables). If that is less than the number of repeats, the matrix is <b>not</b> diagonalizable. Example: \(\begin{bmatrix}1&1\\0&1\end{bmatrix}\) has \(\lambda = 1\) twice but only one eigenvector.</li></ul>`)}
<p class="muted small">Words: <b>AM</b> (algebraic multiplicity) is how many times λ repeats as a root. <b>GM</b> (geometric multiplicity) is how many independent eigenvectors it has. Diagonalizable ⇔ GM = AM for every λ.</p>`,
    },
    {
      id: 'orth', emoji: '📏', title: 'Orthogonality, projection, Gram–Schmidt', asg: 'Homework 4',
      line: 'Perpendicular vectors, shadows, and how to straighten a slanted set of vectors.',
      html: R`
${box('key', 'In one sentence', R`<p>The <b>dot product</b> \(u\cdot v\) measures how much two arrows point the same way. \(u\cdot v = 0\) means they are <b>perpendicular</b> (orthogonal).</p>`)}
<h2>Basics</h2>
<ul><li>Dot product: multiply matching entries and add. \((1,2)\cdot(3,4) = 3 + 8 = 11\).</li>
<li>Length: \(\|v\| = \sqrt{v\cdot v}\). For example, \(\|(3,4)\| = 5\).</li>
<li>Unit vector: divide by the length, \(v/\|v\|\), so the length becomes 1. This is called "normalizing".</li>
<li><b>Orthogonal set:</b> every pair has dot product 0. <b>Orthonormal:</b> also every length is 1.</li></ul>
<h2>Projection = shadow</h2>
<p>Shine a light straight down onto the line of \(u\). The shadow of \(y\) is</p>
$$\text{proj}_u\, y = \frac{y\cdot u}{u\cdot u}\, u$$
<p>Example: \(y = (7,6)\) and \(u = (4,2)\). Then \(y\cdot u = 40\) and \(u\cdot u = 20\), so the shadow is \(2u = (8,4)\).</p>
<p>The leftover \(z = y - \text{shadow} = (-1, 2)\) is perpendicular to \(u\): \(z\cdot u = -4 + 4 = 0\) ✓. The <b>distance</b> from y to the line is \(\|z\| = \sqrt5\).</p>
<h2>Gram–Schmidt = remove the shadows one by one</h2>
<p>Turns a slanted basis into a perpendicular one, which spans the same space.</p>
<p>Example: \(x_1 = (1,1,0)\) and \(x_2 = (1,0,1)\).</p>
<ol><li>\(v_1 = x_1 = (1,1,0)\)</li>
<li>\(v_2 = x_2 - \dfrac{x_2\cdot v_1}{v_1\cdot v_1}v_1 = (1,0,1) - \tfrac12(1,1,0) = (\tfrac12, -\tfrac12, 1)\). Scale by 2 to clear fractions: \((1,-1,2)\).</li>
<li>Check: \((1,1,0)\cdot(1,-1,2) = 1 - 1 + 0 = 0\) ✓</li></ol>
<p>For a third vector, subtract its shadow on <b>both</b> \(v_1\) and \(v_2\). For an orthonormal basis, divide each \(v\) by its length at the end.</p>
${box('good', 'Orthogonal matrix Q (columns orthonormal)', R`<p>\(Q^TQ = I\), so \(Q^{-1} = Q^T\): the inverse is free, just transpose! Q preserves lengths and angles (it only rotates or reflects).</p>`)}
${box('recipe', 'Coordinates in an orthogonal basis: no row reduction needed', R`<p>\(c_i = \dfrac{y\cdot u_i}{u_i\cdot u_i}\). Each coefficient is just a "shadow amount".</p>`)}`,
    },
    {
      id: 'symm', emoji: '🥣', title: 'Symmetric matrices & quadratic forms', asg: 'Homework 5',
      line: 'Mirror-image matrices; is a formula a bowl, a dome, or a saddle?',
      html: R`
${box('key', 'In one sentence', R`<p>A <b>symmetric</b> matrix is its own mirror image across the diagonal (\(A = A^T\)). Superpower: its eigenvalues are real and its eigenvectors are <b>perpendicular</b>. So \(A = PDP^T\), with \(P\) orthogonal.</p>`)}
<h2>Orthogonal diagonalization recipe</h2>
<ol><li>Find the eigenvalues and eigenvectors exactly as in topic 7.</li>
<li>The eigenvectors for different λ are automatically perpendicular (check with a dot product).</li>
<li><b>Normalize</b> each one (divide by its length) to get the columns of P.</li>
<li>Then \(A = PDP^T\). No inverse needed, because \(P^{-1} = P^T\).</li></ol>
<p class="muted small">If a λ repeats, use Gram–Schmidt on its eigenvectors to make them perpendicular.</p>
<h2>Quadratic forms: formulas with only squares and cross terms</h2>
<p>\(Q(x) = x^TAx\). For example, \(5x_1^2 + 4x_1x_2 + 2x_2^2\).</p>
${box('recipe', 'Formula → matrix (the #1 exam step)', R`<ul><li><b>Square terms</b> go on the diagonal: \(5\) and \(2\).</li><li>The <b>cross-term</b> coefficient is <b>split in half</b> into the two off-diagonal spots: \(4 \to 2\) and \(2\).</li></ul>
$$5x_1^2 + 4x_1x_2 + 2x_2^2 \;\Rightarrow\; A = \begin{bmatrix}5&2\\2&2\end{bmatrix}$$`)}
<h2>Classify it: bowl, dome or saddle? Look at the eigenvalues</h2>
<table class="simple-map">
<tr><th>Eigenvalues</th><th>Name</th><th>Shape</th></tr>
<tr><td>all \(> 0\)</td><td>positive definite</td><td>bowl 🥣: always positive (except at 0)</td></tr>
<tr><td>all \(< 0\)</td><td>negative definite</td><td>dome ⛰️: always negative</td></tr>
<tr><td>some +, some −</td><td>indefinite</td><td>saddle 🐴</td></tr>
<tr><td>\(\ge 0\) with a 0</td><td>positive semidefinite</td><td>bowl with a flat valley</td></tr>
</table>
<p>Example: \(A = \begin{bmatrix}5&2\\2&2\end{bmatrix}\) has trace 7 and det 6, so \(\lambda = 1, 6\) (they add to 7 and multiply to 6). Both are positive, so it is <b>positive definite</b>.</p>
<h2>Change of variable \(x = Py\): kill the cross term</h2>
<p>With P from the normalized eigenvectors, \(Q = \lambda_1 y_1^2 + \lambda_2 y_2^2\). Here, \(Q = 1\,y_1^2 + 6\,y_2^2\) (the order must match the columns of P).</p>
${box('good', 'Constrained max/min (with \\(\\|x\\| = 1\\))', R`<p>The <b>max</b> of \(x^TAx\) is the <b>largest eigenvalue</b>, reached at its unit eigenvector. The <b>min</b> is the <b>smallest eigenvalue</b>, reached at its unit eigenvector. In the example, max = 6 and min = 1.</p>`)}`,
    },
    {
      id: 'svd', emoji: '🧩', title: 'SVD, pseudoinverse, left/right inverses', asg: 'Homework 5',
      line: 'Any matrix = rotate → stretch → rotate. Works even for rectangular matrices.',
      html: R`
${box('key', 'In one sentence', R`<p>Every matrix, even a non-square one, can be written as \(A = U\Sigma V^T\): <b>rotate</b> (\(V^T\)), then <b>stretch</b> along the axes (\(\Sigma\)), then <b>rotate</b> (\(U\)). The stretch amounts \(\sigma_1 \ge \sigma_2 \ge \dots \ge 0\) are the <b>singular values</b>.</p>`)}
<h2>Recipe (memorize these 5 steps)</h2>
<ol><li>Compute \(A^TA\). It is symmetric, so topic 9 applies.</li>
<li>Find its eigenvalues and sort them big → small. Then \(\sigma_i = \sqrt{\lambda_i}\).</li>
<li>Find the <b>unit</b> eigenvectors of \(A^TA\). These are the columns of \(V\).</li>
<li>For each \(\sigma_i \ne 0\): \(u_i = \dfrac{1}{\sigma_i}Av_i\). These are the columns of \(U\).</li>
<li>If \(U\) needs more columns, add unit vectors perpendicular to the ones you have.</li></ol>
<p>\(\Sigma\) has the <b>same shape as A</b>, with the σ's on its diagonal and zeros elsewhere.</p>
<h2>Example: \(A = \begin{bmatrix}3&0\\4&5\end{bmatrix}\)</h2>
<ol><li>\(A^TA = \begin{bmatrix}25&20\\20&25\end{bmatrix}\)</li>
<li>Trace 50 and det 225, so \(\lambda = 45, 5\). That gives \(\sigma_1 = \sqrt{45} = 3\sqrt5\) and \(\sigma_2 = \sqrt5\).</li>
<li>\(v_1 = \tfrac{1}{\sqrt2}(1,1)\) and \(v_2 = \tfrac{1}{\sqrt2}(1,-1)\)</li>
<li>\(u_1 = \frac{1}{3\sqrt5}A v_1 = \frac{1}{\sqrt{10}}(1,3)\) and \(u_2 = \frac{1}{\sqrt5}Av_2 = \frac{1}{\sqrt{10}}(3,-1)\). Check: \(u_1\cdot u_2 = 3 - 3 = 0\) ✓</li></ol>
${box('good', 'What SVD tells you instantly', R`<ul><li><b>Rank</b> = the number of nonzero σ's.</li><li>The biggest stretch of the machine is \(\sigma_1\).</li><li>The first r columns of U form a basis for Col A.</li></ul>`)}
<h2>Pseudoinverse \(A^+\): the "best possible inverse"</h2>
<p>\(A^+ = V\Sigma^+U^T\). To build \(\Sigma^+\), flip each nonzero σ to \(1/\sigma\), then transpose the shape. \(x = A^+b\) gives the best (least-squares) answer even when \(Ax = b\) has no exact solution.</p>
${box('recipe', 'Left vs right inverse', R`<ul><li><b>Tall</b> matrix (more rows than columns) with independent columns has a <b>left inverse</b> \(L = (A^TA)^{-1}A^T\), so \(LA = I\).</li><li><b>Wide</b> matrix (more columns than rows) with independent rows has a <b>right inverse</b> \(R = A^T(AA^T)^{-1}\), so \(AR = I\).</li><li>Memory trick: the small square matrix \(A^TA\) or \(AA^T\) is the one you invert.</li></ul>`)}`,
    },
  ];
})();
