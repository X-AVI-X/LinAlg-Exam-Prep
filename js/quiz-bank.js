// Concept questions (True/False + multiple choice) and flashcards, grouped by topic.
(function () {
  const R = String.raw;
  // [topic, type, question, answer, explanation, options?]
  // tf: answer is true/false. mcq: answer is the index of the correct option.
  const Q = [
    // ---------- systems ----------
    ['systems', 'tf', R`Every matrix has a unique echelon form.`, false, R`Echelon forms are <b>not</b> unique (you can scale rows, add rows above). The <b>reduced</b> echelon form is unique.`],
    ['systems', 'tf', R`If the RREF of \([A|\mathbf b]\) has a row \([0\ 0\ 0\ |\ 5]\), the system is inconsistent.`, true, R`That row says \(0 = 5\).`],
    ['systems', 'tf', R`A consistent system with more unknowns than equations has infinitely many solutions.`, true, R`At most (#equations) pivots &lt; #unknowns ⇒ at least one free variable; consistent ⇒ infinitely many.`],
    ['systems', 'tf', R`A system of 3 equations in 3 unknowns always has exactly one solution.`, false, R`It can have none or infinitely many (e.g. Assignment 1 Q1(a) and (b)).`],
    ['systems', 'mcq', R`A 3×5 coefficient matrix has 3 pivots. How many free variables does \(A\mathbf x = \mathbf 0\) have?`, 1, R`Free variables = columns − pivots = 5 − 3 = 2.`, ['1', '2', '3', '5']],
    ['systems', 'mcq', R`Which row operation is <b>not</b> elementary?`, 3, R`Replacing a row by a multiple of <i>another</i> row (without keeping the original) is not allowed — it can destroy information. Replacement must be \(R_i \to R_i + cR_j\).`, [R`\(R_1\leftrightarrow R_3\)`, R`\(R_2\to 5R_2\)`, R`\(R_3 \to R_3 - 2R_1\)`, R`\(R_2 \to 3R_1\)`]],
    ['systems', 'tf', R`If an n×n matrix A has n pivots, then \(A\) is invertible.`, true, R`Invertible Matrix Theorem: n pivots ⇔ A ~ I ⇔ invertible.`],
    ['systems', 'mcq', R`Basic variables correspond to…`, 0, R`Basic = pivot columns; free = non-pivot columns.`, ['pivot columns', 'non-pivot columns', 'zero rows', 'the last column']],
    ['systems', 'tf', R`When computing \(A^{-1}\) by reducing \([A|I]\), if the left block cannot be reduced to I then A is singular.`, true, R`A is invertible ⇔ A is row equivalent to I.`],
    ['systems', 'mcq', R`\(\begin{bmatrix}2&1\\5&3\end{bmatrix}^{-1} = \)`, 2, R`\(\frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}\) with \(ad-bc = 6-5 = 1\).`, [R`\(\begin{bmatrix}3&1\\5&2\end{bmatrix}\)`, R`\(\begin{bmatrix}-3&1\\5&-2\end{bmatrix}\)`, R`\(\begin{bmatrix}3&-1\\-5&2\end{bmatrix}\)`, R`\(\begin{bmatrix}2&-5\\-1&3\end{bmatrix}\)`]],

    // ---------- block ----------
    ['block', 'tf', R`For block multiplication AB, the column partition of A must match the row partition of B.`, true, R`That makes every \(A_{ik}B_{kj}\) defined.`],
    ['block', 'mcq', R`With 2×2 block partitions, \(C_{21} = \)`, 1, R`Row-block 2 of A times column-block 1 of B: \(A_{21}B_{11} + A_{22}B_{21}\).`, [R`\(A_{21}B_{12}+A_{22}B_{22}\)`, R`\(A_{21}B_{11}+A_{22}B_{21}\)`, R`\(B_{11}A_{21}+B_{21}A_{22}\)`, R`\(A_{11}B_{21}+A_{12}B_{22}\)`]],
    ['block', 'mcq', R`\(A_{11}\) is 3×2, \(A_{12}\) is 3×4, \(B_{11}\) is 2×5, \(B_{21}\) is 4×5. \(A_{11}B_{11} + A_{12}B_{21}\) is…`, 2, R`(3×2)(2×5) = 3×5 and (3×4)(4×5) = 3×5; same size ⇒ sum is 3×5.`, ['undefined', '3×4', '3×5', '5×3']],
    ['block', 'mcq', R`\(A_{12}\) is 3×3 and \(B_{21}\) is 4×5. Then \(A_{12}B_{21}\) is…`, 0, R`Inner dimensions 3 ≠ 4.`, ['undefined', '3×5', '3×4', '4×3']],
    ['block', 'tf', R`In block multiplication we may write \(A_{12}B_{21}\) as \(B_{21}A_{12}\).`, false, R`Blocks are matrices; matrix multiplication is not commutative. Keep the order.`],
    ['block', 'tf', R`If \(A = [A_1\ A_2]\) and \(B = \begin{bmatrix}B_1\\B_2\end{bmatrix}\) with compatible sizes, then \(AB = A_1B_1 + A_2B_2\).`, true, R`Column–row expansion.`],
    ['block', 'mcq', R`A 6×6 matrix is partitioned as a 3×3 grid of 2×2 blocks. How many block products are summed to get one block \(C_{ij}\)?`, 2, R`\(C_{ij} = A_{i1}B_{1j} + A_{i2}B_{2j} + A_{i3}B_{3j}\).`, ['1', '2', '3', '9']],

    // ---------- lu ----------
    ['lu', 'tf', R`Every invertible matrix has an LU factorization without row exchanges.`, false, R`E.g. \(\begin{bmatrix}0&1\\1&0\end{bmatrix}\) is invertible but its (1,1) pivot is 0. You need \(PA = LU\).`],
    ['lu', 'mcq', R`During elimination you do \(R_3 \to R_3 - 4R_1\). Which entry of L is 4?`, 1, R`The multiplier subtracted, \(\ell_{31} = 4\), sits in row 3, column 1.`, [R`\(\ell_{13}\)`, R`\(\ell_{31}\)`, R`\(\ell_{33}\)`, R`\(u_{31}\)`]],
    ['lu', 'tf', R`L in an LU factorization has 1s on its diagonal.`, true, R`Unit lower triangular (Doolittle form, as in class).`],
    ['lu', 'tf', R`A permutation matrix satisfies \(P^{-1} = P^T\).`, true, R`Its columns are orthonormal standard vectors.`],
    ['lu', 'mcq', R`To solve \(A\mathbf x = \mathbf b\) with \(PA = LU\) you first solve…`, 0, R`\(LU\mathbf x = P\mathbf b\): forward-solve \(L\mathbf y = P\mathbf b\), then back-solve \(U\mathbf x = \mathbf y\).`, [R`\(L\mathbf y = P\mathbf b\)`, R`\(U\mathbf y = \mathbf b\)`, R`\(L\mathbf y = \mathbf b\)`, R`\(P\mathbf y = U\mathbf b\)`]],
    ['lu', 'mcq', R`For \(A = \begin{bmatrix}1&2&3\\2&4&5\\1&3&4\end{bmatrix}\), plain LU fails because…`, 3, R`After \(R_2-2R_1\), row 2 becomes \((0,0,-1)\): the (2,2) pivot is 0 while the entry below is 1.`, ['det A = 0', 'A is not symmetric', 'the (1,1) entry is 1', 'a zero appears in the (2,2) pivot position']],

    // ---------- transform ----------
    ['transform', 'tf', R`A transformation with \(T(\mathbf 0) \neq \mathbf 0\) cannot be linear.`, true, R`\(T(\mathbf 0) = T(0\cdot\mathbf 0) = 0\cdot T(\mathbf 0) = \mathbf 0\) for linear T.`],
    ['transform', 'mcq', R`T first applies S, then R. The standard matrix is…`, 1, R`\(T(\mathbf x) = R(S\mathbf x)\), so the first map is on the right: RS.`, ['SR', 'RS', 'S + R', R`\(S^TR\)`]],
    ['transform', 'mcq', R`The matrix of a 90° counter-clockwise rotation is…`, 0, R`\(\mathbf e_1 \mapsto (0,1)\) and \(\mathbf e_2\mapsto(-1,0)\).`, [R`\(\begin{bmatrix}0&-1\\1&0\end{bmatrix}\)`, R`\(\begin{bmatrix}0&1\\-1&0\end{bmatrix}\)`, R`\(\begin{bmatrix}-1&0\\0&-1\end{bmatrix}\)`, R`\(\begin{bmatrix}0&1\\1&0\end{bmatrix}\)`]],
    ['transform', 'tf', R`\(T(\mathbf x) = A\mathbf x\) is one-to-one iff the columns of A are linearly independent.`, true, R`One-to-one ⇔ \(A\mathbf x = \mathbf 0\) has only the trivial solution.`],
    ['transform', 'tf', R`A linear map \(\mathbb R^2\to\mathbb R^3\) can be onto.`, false, R`A 3×2 matrix has at most 2 pivots, but onto needs a pivot in each of the 3 rows.`],
    ['transform', 'tf', R`A linear map \(\mathbb R^3\to\mathbb R^2\) can be one-to-one.`, false, R`2×3 matrix: at most 2 pivots for 3 columns ⇒ a free variable ⇒ not one-to-one.`],
    ['transform', 'mcq', R`\(\mathbf b\) is in the range of \(\mathbf x\mapsto A\mathbf x\) exactly when…`, 2, R`Range = Col A; b is in it iff the system is consistent.`, [R`\(\det A \neq 0\)`, R`\(A\mathbf b = \mathbf 0\)`, R`\(A\mathbf x = \mathbf b\) is consistent`, R`\(\mathbf b\) is orthogonal to the columns of A`]],
    ['transform', 'mcq', R`A shear that holds the base of the unit square fixed and pushes its top right by 3 has matrix…`, 1, R`\(\mathbf e_1\mapsto(1,0)\), \(\mathbf e_2\mapsto(3,1)\).`, [R`\(\begin{bmatrix}1&0\\3&1\end{bmatrix}\)`, R`\(\begin{bmatrix}1&3\\0&1\end{bmatrix}\)`, R`\(\begin{bmatrix}3&0\\0&1\end{bmatrix}\)`, R`\(\begin{bmatrix}1&3\\3&1\end{bmatrix}\)`]],

    // ---------- spaces ----------
    ['spaces', 'tf', R`\(\{(x,y,z): x + y + z = 1\}\) is a subspace of \(\mathbb R^3\).`, false, R`It does not contain the zero vector.`],
    ['spaces', 'tf', R`The null space of an m×n matrix is a subspace of \(\mathbb R^m\).`, false, R`Nul A ⊂ \(\mathbb R^n\) (vectors x with Ax defined). Col A ⊂ \(\mathbb R^m\).`],
    ['spaces', 'tf', R`The pivot columns of the RREF of A form a basis for Col A.`, false, R`Use the pivot columns of the <b>original</b> A. Row operations change the column space.`],
    ['spaces', 'mcq', R`A is 5×7 with rank 3. dim Nul A = ?`, 2, R`Rank theorem: 7 − 3 = 4.`, ['2', '3', '4', '5']],
    ['spaces', 'mcq', R`\(\{(a - b,\ b + 2c,\ 3a + c,\ -c)\}\) is Col B for which B?`, 0, R`Columns = coefficient vectors of a, b, c.`, [R`\(\begin{bmatrix}1&-1&0\\0&1&2\\3&0&1\\0&0&-1\end{bmatrix}\)`, R`\(\begin{bmatrix}1&0&3&0\\-1&1&0&0\\0&2&1&-1\end{bmatrix}\)`, R`\(\begin{bmatrix}1&-1\\1&2\\3&1\\0&-1\end{bmatrix}\)`, R`\(\begin{bmatrix}1&1&3\\-1&2&0\end{bmatrix}\)`]],
    ['spaces', 'tf', R`Any 3 linearly independent vectors in \(\mathbb R^3\) form a basis of \(\mathbb R^3\).`, true, R`Basis theorem: p independent vectors in a p-dimensional space.`],
    ['spaces', 'mcq', R`If \(\mathbf b_1 = 2\mathbf c_1 + \mathbf c_2\) and \(\mathbf b_2 = -\mathbf c_1 + 3\mathbf c_2\), then \(\underset{\mathcal C\leftarrow\mathcal B}{P} =\)`, 1, R`Coordinates of \(\mathbf b_j\) in C go in column j.`, [R`\(\begin{bmatrix}2&1\\-1&3\end{bmatrix}\)`, R`\(\begin{bmatrix}2&-1\\1&3\end{bmatrix}\)`, R`\(\begin{bmatrix}3&1\\-1&2\end{bmatrix}\)`, R`\(\begin{bmatrix}2&1\\1&3\end{bmatrix}\)`]],
    ['spaces', 'mcq', R`To find \(\underset{\mathcal C\leftarrow\mathcal B}{P}\) in \(\mathbb R^n\), row reduce…`, 0, R`\([\mathcal C\ |\ \mathcal B] \sim [I\ |\ \underset{\mathcal C\leftarrow\mathcal B}{P}]\).`, [R`\([\,\mathbf c_1\cdots\mathbf c_n\ |\ \mathbf b_1\cdots\mathbf b_n\,]\)`, R`\([\,\mathbf b_1\cdots\mathbf b_n\ |\ \mathbf c_1\cdots\mathbf c_n\,]\)`, R`\([\,\mathbf b_1\cdots\mathbf b_n\ |\ I\,]\)`, R`\([\,I\ |\ \mathbf c_1\cdots\mathbf c_n\,]\)`]],
    ['spaces', 'tf', R`The kernel of \(T(\mathbf x) = A\mathbf x\) is Nul A and the range is Col A.`, true, R`Definitions.`],
    ['spaces', 'tf', R`Every vector in Nul A is orthogonal to every row of A.`, true, R`\(A\mathbf x = \mathbf 0\) means (row i)·x = 0 for each i.`],
    ['spaces', 'tf', R`\(\{\mathbf v_1, \mathbf v_2, \mathbf v_3\}\) with \(\mathbf v_3 = \mathbf v_1 + \mathbf v_2\) can still be a basis of its span.`, false, R`It is linearly dependent; remove \(\mathbf v_3\) (Spanning Set Theorem).`],

    // ---------- det ----------
    ['det', 'tf', R`Swapping two rows of A leaves det A unchanged.`, false, R`It changes the sign.`],
    ['det', 'tf', R`Adding a multiple of one row to another does not change the determinant.`, true, R`Row replacement property.`],
    ['det', 'mcq', R`A is 3×3 with det A = 2. det(3A) = ?`, 3, R`\(\det(kA) = k^n\det A = 27\cdot2 = 54\).`, ['6', '18', '8', '54']],
    ['det', 'mcq', R`det A = −41. The volume of the parallelepiped spanned by the columns is…`, 1, R`Volume = |det A|.`, ['−41', '41', '1681', R`\(\sqrt{41}\)`]],
    ['det', 'mcq', R`det A = −1. det(AᵀA) and det(A⁻¹) are…`, 0, R`\((\det A)^2 = 1\) and \(1/\det A = -1\).`, ['1 and −1', '−1 and −1', '1 and 1', '−1 and 1']],
    ['det', 'tf', R`det(A + B) = det A + det B.`, false, R`Only the multiplicative property holds: det(AB) = det A · det B.`],
    ['det', 'mcq', R`Echelon form reached with 1 row interchange; pivots 1, 1, 1. det A = ?`, 1, R`\((-1)^1\cdot1\cdot1\cdot1 = -1\).`, ['1', '−1', '3', '0']],
    ['det', 'tf', R`In Cramer's rule, \(A_i(\mathbf b)\) replaces <b>row</b> i of A by b.`, false, R`It replaces <b>column</b> i.`],
    ['det', 'mcq', R`The cofactor \(C_{23}\) has sign…`, 1, R`\((-1)^{2+3} = -1\).`, ['+', '−', 'depends on the entry', 'always zero']],

    // ---------- eigen ----------
    ['eigen', 'tf', R`An eigenvector can be the zero vector.`, false, R`Eigenvectors are nonzero by definition.`],
    ['eigen', 'tf', R`0 is an eigenvalue of A ⇔ A is not invertible.`, true, R`\(A\mathbf x = 0\mathbf x\) has a nontrivial solution ⇔ A is singular.`],
    ['eigen', 'tf', R`The eigenvalues of a triangular matrix are its diagonal entries.`, true, R`\(\det(A-\lambda I)\) is the product of the diagonal entries \(a_{ii}-\lambda\).`],
    ['eigen', 'tf', R`The geometric multiplicity of an eigenvalue can exceed its algebraic multiplicity.`, false, R`\(1\le GM\le AM\).`],
    ['eigen', 'tf', R`A 3×3 matrix with 3 distinct eigenvalues is diagonalizable.`, true, R`Distinct eigenvalues ⇒ independent eigenvectors.`],
    ['eigen', 'tf', R`A diagonalizable matrix must have distinct eigenvalues.`, false, R`E.g. the identity, or HW4 Q7 (λ = 2 repeated, still diagonalizable since GM = AM = 2).`],
    ['eigen', 'mcq', R`Eigenvalues of \(\begin{bmatrix}4&1\\2&3\end{bmatrix}\):`, 0, R`\(\lambda^2 - 7\lambda + 10 = (\lambda-2)(\lambda-5)\).`, ['2 and 5', '4 and 3', '1 and 6', '−2 and −5']],
    ['eigen', 'mcq', R`\(\begin{bmatrix}5&1\\0&5\end{bmatrix}\) is…`, 2, R`λ = 5 has AM 2 but GM 1.`, ['diagonalizable with P = I', 'orthogonally diagonalizable', 'not diagonalizable', 'singular']],
    ['eigen', 'mcq', R`If \(A = PDP^{-1}\), then \(A^5 = \)`, 1, R`\(A^k = PD^kP^{-1}\).`, [R`\(P^5D^5P^{-5}\)`, R`\(PD^5P^{-1}\)`, R`\(5PDP^{-1}\)`, R`\(P^{-1}D^5P\)`]],
    ['eigen', 'mcq', R`The sum of the eigenvalues of A equals…`, 0, R`Trace = sum of eigenvalues; det = product.`, ['the trace of A', 'det A', 'rank A', 'the largest entry']],

    // ---------- orth ----------
    ['orth', 'tf', R`An orthogonal set of nonzero vectors is linearly independent.`, true, R`Dot the dependence relation with each vector.`],
    ['orth', 'tf', R`For an m×n matrix, \((\operatorname{Col}A)^\perp = \operatorname{Nul}A\).`, false, R`\((\operatorname{Col}A)^\perp = \operatorname{Nul}A^T\); \((\operatorname{Row}A)^\perp = \operatorname{Nul}A\).`],
    ['orth', 'tf', R`If U is square with orthonormal columns, then \(U^{-1} = U^T\).`, true, R`\(U^TU = I\) and U is square.`],
    ['orth', 'mcq', R`Projection of \(\mathbf y = (7,4)\) onto \(\mathbf u = (1,2)\):`, 2, R`\(\frac{15}{5}(1,2) = (3,6)\).`, ['(7,8)', '(1,2)', '(3,6)', '(15,30)']],
    ['orth', 'mcq', R`Distance from \(\mathbf y = (7,4)\) to Span{(1,2)}:`, 1, R`\(\mathbf z = (4,-2)\), \(\|\mathbf z\| = \sqrt{20} = 2\sqrt5\).`, ['20', R`\(2\sqrt5\)`, R`\(\sqrt{15}\)`, '0']],
    ['orth', 'tf', R`The projection formula \(\hat{\mathbf y} = \sum\frac{\mathbf y\cdot\mathbf u_i}{\mathbf u_i\cdot\mathbf u_i}\mathbf u_i\) works for any basis of W.`, false, R`Only for an <b>orthogonal</b> basis. Otherwise apply Gram–Schmidt first.`],
    ['orth', 'mcq', R`Gram–Schmidt on \(\mathbf x_1 = (1,1,1),\ \mathbf x_2 = (1,2,3)\) gives \(\mathbf v_2 = \)`, 3, R`\(\mathbf x_2 - \frac{6}{3}\mathbf x_1 = (1,2,3) - (2,2,2) = (-1,0,1)\).`, ['(1,2,3)', '(0,1,2)', '(2,2,2)', '(−1,0,1)']],
    ['orth', 'tf', R`If U has orthonormal columns then \(\|U\mathbf x\| = \|\mathbf x\|\).`, true, R`\(\|U\mathbf x\|^2 = \mathbf x^TU^TU\mathbf x = \mathbf x^T\mathbf x\).`],
    ['orth', 'mcq', R`The line through 0 with direction (4,−2,6) relative to the plane \(2x - y + 3z = 0\) is…`, 0, R`(4,−2,6) = 2(2,−1,3) = 2n, parallel to the normal ⇒ orthogonal to the plane.`, ['orthogonal to the plane', 'contained in the plane', 'neither', 'parallel to the plane but not in it']],

    // ---------- symm ----------
    ['symm', 'tf', R`Eigenvectors of a symmetric matrix for different eigenvalues are orthogonal.`, true, R`Spectral theorem.`],
    ['symm', 'tf', R`Every diagonalizable matrix is orthogonally diagonalizable.`, false, R`Only symmetric matrices are.`],
    ['symm', 'tf', R`An n×n symmetric matrix has n real eigenvalues (counting multiplicity).`, true, R`Spectral theorem.`],
    ['symm', 'mcq', R`The matrix of \(Q = 5x_1^2 + 4x_1x_2 + 2x_2^2\) is…`, 1, R`Off-diagonal = half of 4 = 2.`, [R`\(\begin{bmatrix}5&4\\4&2\end{bmatrix}\)`, R`\(\begin{bmatrix}5&2\\2&2\end{bmatrix}\)`, R`\(\begin{bmatrix}5&4\\0&2\end{bmatrix}\)`, R`\(\begin{bmatrix}5&1\\1&2\end{bmatrix}\)`]],
    ['symm', 'mcq', R`A symmetric matrix has eigenvalues 3 and −2. Q(x) = xᵀAx is…`, 2, R`Mixed signs ⇒ indefinite.`, ['positive definite', 'negative definite', 'indefinite', 'positive semidefinite']],
    ['symm', 'mcq', R`Eigenvalues 7, 3, −2. Max of xᵀAx on the unit sphere subject to \(\mathbf x\perp\mathbf u_1\):`, 1, R`The next largest eigenvalue.`, ['7', '3', '−2', '0']],
    ['symm', 'mcq', R`Q positive definite on \(\mathbb R^2\). The set \(Q(\mathbf x) = 0\) is…`, 3, R`Q(x) &gt; 0 for x ≠ 0, so only x = 0.`, ['an ellipse', 'a hyperbola', 'empty', 'just the origin']],
    ['symm', 'tf', R`Each term \(\mathbf u_j\mathbf u_j^T\) in a spectral decomposition is a projection onto Span{u_j}.`, true, R`\((\mathbf u_j\mathbf u_j^T)\mathbf x = (\mathbf u_j\cdot\mathbf x)\mathbf u_j\).`],
    ['symm', 'mcq', R`Under \(\mathbf x = P\mathbf y\), \(Q = 3x_1^2 + 4x_1x_2\) (eigenvalues 4, −1) becomes…`, 0, R`\(\mathbf y^TD\mathbf y\).`, [R`\(4y_1^2 - y_2^2\)`, R`\(3y_1^2 + 4y_1y_2\)`, R`\(4y_1^2 + y_2^2\)`, R`\(16y_1^2 + y_2^2\)`]],

    // ---------- svd ----------
    ['svd', 'tf', R`The singular values of A are the eigenvalues of AᵀA.`, false, R`They are the <b>square roots</b> of those eigenvalues.`],
    ['svd', 'tf', R`A 3×2 matrix with linearly independent columns has a left inverse but no right inverse.`, true, R`\((A^TA)^{-1}A^T\) exists; rank 2 &lt; 3 rules out a right inverse.`],
    ['svd', 'mcq', R`\(A^TA\) has eigenvalues 3 and 1. The singular values of A are…`, 2, R`\(\sqrt3\) and 1.`, ['3 and 1', '9 and 1', R`\(\sqrt3\) and 1`, R`\(\frac13\) and 1`]],
    ['svd', 'mcq', R`If A is m×n, then Σ in \(A = U\Sigma V^T\) is…`, 0, R`Σ has the same shape as A.`, ['m×n', 'n×n', 'm×m', 'n×m']],
    ['svd', 'mcq', R`\(\mathbf u_i\) in the SVD is computed as…`, 1, R`\(\mathbf u_i = A\mathbf v_i/\sigma_i\).`, [R`\(\sigma_iA\mathbf v_i\)`, R`\(\frac{1}{\sigma_i}A\mathbf v_i\)`, R`\(A^T\mathbf v_i\)`, R`\(\frac{1}{\sigma_i}A^T\mathbf v_i\)`]],
    ['svd', 'tf', R`If A is square and invertible then \(A^+ = A^{-1}\).`, true, R`Full rank square ⇒ \(VD^{-1}U^T = A^{-1}\).`],
    ['svd', 'mcq', R`The right inverse of a full-row-rank B is…`, 3, R`\(R = B^T(BB^T)^{-1}\).`, [R`\((B^TB)^{-1}B^T\)`, R`\(B^T\)`, R`\(B^{-1}\)`, R`\(B^T(BB^T)^{-1}\)`]],
    ['svd', 'mcq', R`The maximum of \(\|A\mathbf x\|\) over unit vectors x is…`, 0, R`σ₁, attained at v₁.`, [R`\(\sigma_1\)`, R`\(\sigma_1^2\)`, R`\(\lambda_1(A)\)`, R`\(\|A\|_F\)`]],
    ['svd', 'mcq', R`C = [[1,2],[2,4]] has rank 1. Its singular values are…`, 1, R`\(C^TC = \begin{bmatrix}5&10\\10&20\end{bmatrix}\): eigenvalues 25, 0 ⇒ σ = 5, 0.`, ['1 and 4', '5 and 0', '25 and 0', R`\(\sqrt5\) and 0`]],
  ];

  window.QUIZ = Q.map(([topic, type, q, answer, explain, options], i) => ({ id: `${topic}-${i}`, topic, type, q, answer, explain, options }));

  // Flashcards: definitions & formulas worth memorising
  window.FLASH = [
    ['systems', 'When does a linear system have infinitely many solutions?', R`It is consistent (no pivot in the augmented column) and has at least one free variable.`],
    ['systems', 'Invertible Matrix Theorem (5 equivalents)', R`n pivots ⇔ A ~ I ⇔ Ax = 0 only trivial ⇔ columns independent ⇔ det A ≠ 0 (⇔ 0 not an eigenvalue).`],
    ['systems', '2×2 inverse', R`\(\frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}\)`],
    ['block', 'Block product C₁₂ (2×2 blocks)', R`\(C_{12} = A_{11}B_{12} + A_{12}B_{22}\)`],
    ['block', 'Compatibility rule', R`Column partition of A = row partition of B; inner block sizes must match.`],
    ['lu', 'Where does the multiplier go?', R`Operation \(R_i \to R_i - \ell R_j\) ⇒ \(L_{ij} = \ell\).`],
    ['lu', 'When is P needed?', R`When a zero appears in a pivot position during elimination (row interchange required): \(PA = LU\).`],
    ['transform', 'Standard matrix', R`\(A = [T(\mathbf e_1)\ \cdots\ T(\mathbf e_n)]\)`],
    ['transform', '“First S then R” matrix', R`\(RS\)`],
    ['transform', 'One-to-one vs onto test', R`One-to-one: pivot in every column. Onto: pivot in every row.`],
    ['spaces', 'Subspace test', R`Contains 0; closed under +; closed under scalar ×.`],
    ['spaces', 'Basis for Col A', R`Pivot columns of the ORIGINAL A.`],
    ['spaces', 'Rank Theorem', R`rank A + dim Nul A = n (number of columns).`],
    ['spaces', 'Change of basis', R`\(\underset{\mathcal C\leftarrow\mathcal B}{P} = [[\mathbf b_1]_\mathcal C\ \cdots]\); reduce \([\mathcal C|\mathcal B]\sim[I|P]\).`],
    ['det', 'Effect of row ops on det', R`Replacement: none. Swap: × (−1). Scale row by k: × k.`],
    ['det', 'Elimination formula', R`\(\det A = (-1)^r\times\)(product of pivots).`],
    ['det', "Cramer's rule", R`\(x_i = \det A_i(\mathbf b)/\det A\)`],
    ['eigen', 'Characteristic polynomial (2×2)', R`\(\lambda^2 - (\operatorname{tr}A)\lambda + \det A\)`],
    ['eigen', 'Diagonalizable iff…', R`GM = AM for every eigenvalue (n independent eigenvectors).`],
    ['eigen', 'Aᵏ', R`\(PD^kP^{-1}\)`],
    ['orth', 'Projection onto a line', R`\(\hat{\mathbf y} = \frac{\mathbf y\cdot\mathbf u}{\mathbf u\cdot\mathbf u}\mathbf u\)`],
    ['orth', 'Gram–Schmidt v₂', R`\(\mathbf v_2 = \mathbf x_2 - \frac{\mathbf x_2\cdot\mathbf v_1}{\mathbf v_1\cdot\mathbf v_1}\mathbf v_1\)`],
    ['orth', '(Col A)⊥ = ?', R`\(\operatorname{Nul}A^T\)`],
    ['symm', 'Spectral theorem (4 facts)', R`Real eigenvalues; GM = AM; eigenvectors of distinct λ orthogonal; \(A = PDP^T\).`],
    ['symm', 'Quadratic form matrix entries', R`Diagonal = coefficient of \(x_i^2\); off-diagonal = ½ coefficient of \(x_ix_j\).`],
    ['symm', 'Max/min of xᵀAx on unit sphere', R`\(\lambda_{\max}\) at \(\mathbf u_1\), \(\lambda_{\min}\) at \(\mathbf u_n\).`],
    ['svd', 'Singular values', R`\(\sigma_i = \sqrt{\lambda_i(A^TA)}\)`],
    ['svd', 'uᵢ formula', R`\(\mathbf u_i = \frac{1}{\sigma_i}A\mathbf v_i\)`],
    ['svd', 'Pseudoinverse', R`\(A^+ = V_rD^{-1}U_r^T\)`],
    ['svd', 'Left / right inverse', R`\(L = (A^TA)^{-1}A^T\), \(R = A^T(AA^T)^{-1}\)`],
  ].map(([topic, front, back]) => ({ topic, front, back }));
})();
