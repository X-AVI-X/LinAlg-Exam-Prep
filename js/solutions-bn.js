// বাংলা walkthrough for every solved assignment question, keyed by question id (see js/solutions.js).
// Shown above the English worked solution when বাংলা is selected. Numbers match the engine's output.
(function () {
  const R = String.raw;
  const box = (type, title, html) => `<div class="box ${type}">${title ? `<span class="h">${title}</span>` : ''}${html}</div>`;
  const ask = (html) => box('key', 'প্রশ্নে কী চাওয়া হয়েছে', html);
  const plan = (html) => box('recipe', 'পরিকল্পনা (কীভাবে করবে)', html);
  const answer = (html) => box('good', 'উত্তর', html);
  const trap = (html) => box('warn', 'সাবধান', html);

  window.SOLUTIONS_BN = {
    /* ---------- Assignment 1 Part A ---------- */
    a1q1: ask(R`<p>তিনটা system দেওয়া আছে। প্রতিটার augmented matrix লিখে echelon form → RREF বানাতে হবে, তারপর বলতে হবে সমাধান নেই / একটা / অসীম সংখ্যক।</p>`) +
      plan(R`<ol><li>Augmented matrix \([A\mid b]\) লেখো।</li><li>Row operation দিয়ে pivot-এর নিচে শূন্য বানাও (echelon), তারপর উপরেও শূন্য (RREF)।</li><li>সিদ্ধান্ত: \([0\ 0\ 0 \mid \text{অশূন্য}]\) row এলে <b>সমাধান নেই</b>; free variable থাকলে <b>অসীম</b>; প্রতিটা column-এ pivot থাকলে <b>একটা</b>।</li></ol>`) +
      R`<ul><li><b>(a)</b> দ্বিতীয় সমীকরণ বলে \(x+y+z = 4.5\), কিন্তু প্রথমটা বলে \(4\)। পরস্পরবিরোধী (সমান্তরাল তল), তাই <b>সমাধান নেই</b>। RREF-এ \([0\ 0\ 0\mid \neq 0]\) row আসবে।</li>
<li><b>(b)</b> দ্বিতীয় সমীকরণ = 2 × প্রথম, তাই বাড়তি। 3টা অজানা, কিন্তু স্বাধীন সমীকরণ 2টা ⇒ একটা free variable ⇒ <b>অসীম সংখ্যক</b> সমাধান।</li>
<li><b>(c)</b> সমীকরণ 3 = সমীকরণ 1 + সমীকরণ 2, তাই এটাও <b>অসীম সংখ্যক</b>।</li></ul>` +
      trap(R`<p>প্রশ্নে ইঙ্গিত আছে একটা system-এর unique সমাধান, কিন্তু (c) আসলে অসীম। পরীক্ষায় নিজের row reduction-এ ভরসা রাখো, আর কারণটা (নির্ভরশীল row) স্পষ্ট করে লেখো।</p>`),

    a1q2: ask(R`<p>প্রতিটা matrix-কে echelon form-এ এনে pivot চিহ্নিত করো, rank বলো, আর কোন variable basic (pivot column) আর কোনটা free তা বলো।</p>`) +
      plan(R`<ol><li>Row reduce করো।</li><li>প্রতিটা row-এর প্রথম অশূন্য সংখ্যাই pivot; তার column = pivot column।</li><li><b>Rank</b> = pivot-এর সংখ্যা।</li><li>Pivot column-এর variable = <b>basic</b>, বাকিগুলো = <b>free</b>।</li></ol>`) +
      answer(R`<ul><li><b>A:</b> pivot column 1 ও 3, rank 2। Basic: \(x_1, x_3\); free: \(x_2, x_4\)।</li>
<li><b>B:</b> \(R_2 - 2R_1\) আর \(R_3 - 3R_1\) দুটোই \([0\ 0\ 1]\) দেয়, তাই pivot column 1 ও 3, rank 2। Basic: \(x_1, x_3\); free: \(x_2\)।</li>
<li><b>C:</b> \(R_3 - R_1\), তারপর \(R_3 - R_2\) দিলে \([0\ 0\ 0\ 1]\)। Pivot column 1, 2, 4, rank 3। Basic: \(x_1, x_2, x_4\); free: \(x_3\)।</li></ul>`),

    a1q3: ask(R`<p>Gauss–Jordan দিয়ে \(A^{-1}\) বের করো, তারপর \(AA^{-1} = I\) দেখিয়ে যাচাই করো।</p>`) +
      plan(R`<ol><li>পাশাপাশি লেখো \([A \mid I]\)।</li><li>বাঁ দিক \(I\) না হওয়া পর্যন্ত row operation চালাও; একই operation ডান দিকেও হবে।</li><li>শেষে ডান দিকটাই \(A^{-1}\): \([I \mid A^{-1}]\)।</li></ol>`) +
      answer(R`$$A^{-1} = \begin{bmatrix}-24&18&5\\20&-15&-4\\-5&4&1\end{bmatrix}$$
<p>যাচাই: A-এর row 1 · \(A^{-1}\)-এর column 1 \(= -24 + 40 - 15 = 1\) ✓, row 2 · column 1 \(= 20 - 20 = 0\) ✓।</p>`) +
      box('good', 'টিপস', R`<p>\(\det A = 1\), তাই inverse-এ সব পূর্ণসংখ্যা। ভগ্নাংশ এলে বুঝবে কোথাও হিসাবে ভুল হয়েছে।</p>`),

    /* ---------- Assignment 1 Part B ---------- */
    b1: ask(R`<p>বড় matrix-কে block-এ ভাগ করে গুণ করো: (a) 4×4-কে চারটা 2×2 block-এ, (b) \(A = [A_1\ A_2]\) আর \(B = \begin{bmatrix}B_1\\B_2\end{bmatrix}\) করে \(AB = A_1B_1 + A_2B_2\), (c) 6×6-কে চারটা 3×3 block-এ।</p>`) +
      plan(R`<ol><li>প্রতিটা block কোন row ও column নিয়ে, সেটা লিখে দাও (যেমন \(A_{11}\) = row 1–2, column 1–2)।</li><li>সূত্র: \(C_{ij} = A_{i1}B_{1j} + A_{i2}B_{2j}\)। Block গুলোকে সংখ্যার মতো ধরে row × column করো, কিন্তু order ঠিক রাখো।</li><li>প্রতিটা ছোট গুণ সাধারণ matrix গুণ।</li><li>শেষে কয়েকটা entry সাধারণ গুণ দিয়ে মিলিয়ে দেখো।</li></ol>`) +
      R`<p><b>(b)-এর মূল কথা:</b> \(A_1\) = A-এর প্রথম 3 column (4×3), \(A_2\) = শেষ 3 column; \(B_1\) = B-এর প্রথম 3 row (3×4), \(B_2\) = শেষ 3 row। A-এর column ভাগ (3 | 3) = B-এর row ভাগ (3 | 3), তাই গুণ চলে। ফলাফল 4×4।</p>` +
      trap(R`<p>\(A_{11}B_{11}\) লেখো, \(B_{11}A_{11}\) না। নিচে English অংশে প্রতিটা block-এর গুণ দেওয়া আছে, আর সাধারণ গুণের সাথে মিলিয়ে দেখানো আছে।</p>`),

    b2: ask(R`<p>(a) 5×5 matrix-কে অসমান block (2 আর 3) দিয়ে গুণ করো। (b) 6×6-কে 2×2 block-এর 3×3 grid ধরে শুধু \(C_{11}\) আর \(C_{23}\) বের করো। (c) শুধু মাপ দেখে বলো গুণ সম্ভব কিনা।</p>`) +
      plan(R`<ol><li><b>(a)</b> প্রতিটা block-এর মাপ লেখো: \(C_{11}\) হবে 2×2, \(C_{12}\) 2×3, \(C_{21}\) 3×2, \(C_{22}\) 3×3। একসাথে এরা 5×5 ভরে দেয় ✓।</li>
<li><b>(b)</b> \(C_{11} = A_{11}B_{11} + A_{12}B_{21} + A_{13}B_{31}\), আর \(C_{23} = A_{21}B_{13} + A_{22}B_{23} + A_{23}B_{33}\)। প্রতিটায় তিনটা 2×2 গুণ।</li>
<li><b>(c)</b> প্রতিটা গুণ \((m\times n)(n\times p)\)-এর মাঝের দুই সংখ্যা মিলতে হবে।</li></ol>`) +
      answer(R`<ul><li><b>(c)(i)</b> \(3\times2 \cdot 2\times5\) এবং \(3\times4 \cdot 4\times5\): মাঝের সংখ্যা মেলে, দুটোই 3×5, যোগ করা যায় ⇒ <b>compatible</b>।</li>
<li><b>(c)(ii)</b> \(A_{12}\)-এর <b>3টা column</b> কিন্তু \(B_{21}\)-এর <b>4টা row</b> ⇒ \(A_{12}B_{21}\) সংজ্ঞায়িত নয় ⇒ <b>compatible না</b>। A-এর column ভাগ (2+3 = 5) আর B-এর row ভাগ (2+4 = 6) মেলে না।</li></ul>`),

    /* ---------- Assignment 2 ---------- */
    a2q1: ask(R`<p>\(A = \begin{bmatrix}1&2&3\\2&4&5\\1&3&4\end{bmatrix}\)। (a) কেন row swap ছাড়া LU হয় না ব্যাখ্যা করো। (b) \(PA = LU\) হিসেবে P, L, U বের করো।</p>`) +
      R`<p><b>(a) কেন ব্যর্থ:</b> প্রথম column eliminate করো: \(R_2 - 2R_1\) দেয় \([0\ 0\ -1]\), \(R_3 - R_1\) দেয় \([0\ 1\ 1]\)। এখন (2,2) জায়গায় pivot হওয়ার কথা, কিন্তু সেখানে <b>0</b>। শূন্য দিয়ে ভাগ করে multiplier বানানো যায় না, তাই row swap লাগবেই ⇒ সাধারণ \(A = LU\) নেই।</p>` +
      plan(R`<ol><li>আগে row 2 আর row 3 swap করো। P = identity-র row 2 ও 3 swap করা।</li><li>\(PA = \begin{bmatrix}1&2&3\\1&3&4\\2&4&5\end{bmatrix}\)-এ সাধারণ elimination: \(R_2 - 1\cdot R_1\) (\(\ell_{21} = 1\)), \(R_3 - 2R_1\) (\(\ell_{31} = 2\))।</li><li>ফল আগেই upper triangular, তাই \(\ell_{32} = 0\)।</li></ol>`) +
      answer(R`$$P = \begin{bmatrix}1&0&0\\0&0&1\\0&1&0\end{bmatrix},\quad L = \begin{bmatrix}1&0&0\\1&1&0\\2&0&1\end{bmatrix},\quad U = \begin{bmatrix}1&2&3\\0&1&1\\0&0&-1\end{bmatrix}$$
<p>যাচাই: \(LU\) গুণ করলে \(PA\) পাবে। যেমন \(LU\)-এর row 3 \(= 2\cdot\text{row}_1(U) + 0\cdot\text{row}_2(U) + 1\cdot\text{row}_3(U) = (2,4,6) + (0,0,-1) = (2,4,5)\), যা \(PA\)-এর row 3 ✓</p>`),

    a2q2: ask(R`<p>\(B = \begin{bmatrix}1&-2&0&4\\0&0&1&-3\\2&-4&0&8\end{bmatrix}\)। (a) RREF (b) Col B-এর basis ও dimension (c) Nul B-এর basis ও dimension, parametric vector form-এ (d) Rank Theorem যাচাই।</p>`) +
      plan(R`<ol><li>Row reduce: \(R_3 - 2R_1\) দিলে row 3 পুরো শূন্য। RREF = \(\begin{bmatrix}1&-2&0&4\\0&0&1&-3\\0&0&0&0\end{bmatrix}\)।</li><li>Pivot column 1 ও 3 ⇒ Col B-এর basis = <b>মূল B-এর</b> column 1 ও 3।</li><li>Nul B: RREF থেকে সমীকরণ লেখো, free variable (\(x_2, x_4\)) দিয়ে বাকিগুলো প্রকাশ করো।</li></ol>`) +
      answer(R`<ul><li><b>Col B:</b> basis \(\{(1,0,2),\ (0,1,0)\}\), dim = 2।</li>
<li><b>Nul B:</b> \(x_1 = 2x_2 - 4x_4\), \(x_3 = 3x_4\) ⇒ \(\mathbf x = x_2\begin{bmatrix}2\\1\\0\\0\end{bmatrix} + x_4\begin{bmatrix}-4\\0\\3\\1\end{bmatrix}\)। Basis-এ এই দুইটা vector, dim = 2।</li>
<li><b>Rank Theorem:</b> rank (2) + dim Nul (2) = column সংখ্যা (4) ✓</li></ul>`) +
      trap(R`<p>Col B-এর basis নিতে হয় <b>মূল B</b> থেকে, RREF থেকে না। RREF-এর column 3 হলো \((0,1,0)\), মূল B-এরটাও এখানে \((0,1,0)\), কিন্তু column 1 মূল B-তে \((1,0,2)\)।</p>`),

    a2q3: ask(R`<p>T আগে unit square-কে shear করে (নিচের দিক স্থির, উপরের দিক 2 ঘর ডানে), তারপর 90° ঘড়ির কাঁটার উল্টো দিকে ঘোরায়। (a) Standard matrix বের করো। (b) T কি one-to-one?</p>`) +
      plan(R`<ol><li><b>Shear S:</b> নিচ স্থির ⇒ \(e_1 \to (1,0)\); উপর 2 ঘর ডানে ⇒ \(e_2 = (0,1) \to (2,1)\)। তাই \(S = \begin{bmatrix}1&2\\0&1\end{bmatrix}\)।</li>
<li><b>Rotation R (90°):</b> \(e_1 \to (0,1)\), \(e_2 \to (-1,0)\)। তাই \(R = \begin{bmatrix}0&-1\\1&0\end{bmatrix}\)।</li>
<li><b>একসাথে:</b> আগে shear, তাই S থাকে <b>ডানে</b>: \(A = RS\)।</li></ol>`) +
      answer(R`$$A = RS = \begin{bmatrix}0&-1\\1&0\end{bmatrix}\begin{bmatrix}1&2\\0&1\end{bmatrix} = \begin{bmatrix}0&-1\\1&2\end{bmatrix}$$
<p><b>(b)</b> Column দুইটা \((0,1)\) আর \((-1,2)\) একে অপরের গুণিতক নয় ⇒ independent ⇒ \(A\mathbf x = 0\)-এর শুধু শূন্য সমাধান ⇒ <b>T one-to-one</b>। (\(\det A = 1 \neq 0\), তাই T invertible এবং onto-ও।)</p>`) +
      trap(R`<p>\(SR\) লিখলে মানে হয় "আগে rotate, পরে shear", যা ভুল।</p>`),

    a2q4: ask(R`<p>\(L(\mathbf x) = C\mathbf x\), \(C = \begin{bmatrix}2&-1\\1&4\\3&2\end{bmatrix}\)। (a) \(\mathbf u = (-2,3)\)-এর image বের করো। (b) কোন x দিলে \(L(\mathbf x) = (5,7,11)\)? (c) \(\mathbf v = (3,0,1)\) কি range-এ আছে?</p>`) +
      plan(R`<ul><li><b>Image</b> = শুধু গুণ করো: \(C\mathbf u\)।</li><li><b>Pre-image</b> = \(C\mathbf x = \mathbf b\) সমাধান করো (Assignment 1-এর মতো row reduction)।</li><li><b>Range-এ আছে কিনা</b> = \(C\mathbf x = \mathbf v\)-এর সমাধান আছে কিনা।</li></ul>`) +
      answer(R`<ul><li><b>(a)</b> \(C\mathbf u = (2(-2) - 3,\ -2 + 12,\ -6 + 6) = (-7, 10, 0)\)।</li>
<li><b>(b)</b> \(\mathbf x = (3, 1)\)। যাচাই: \((6-1,\ 3+4,\ 9+2) = (5,7,11)\) ✓</li>
<li><b>(c)</b> প্রথম দুই সমীকরণ থেকে \(x_1 = 4/3,\ x_2 = -1/3\), কিন্তু তৃতীয়তে \(3x_1 + 2x_2 = 10/3 \neq 1\) ⇒ system inconsistent ⇒ <b>v range-এ নেই</b>।</li></ul>`),

    /* ---------- Assignment 3 ---------- */
    a3q1: ask(R`<p>(a) দেখাও \(H = \{x+y+z = 0\}\) subspace, কিন্তু \(W = \{x+y+z = 1\}\) নয়। (b) H-কে Nul A আর W-কে Col B হিসেবে লেখো; \((1,0,0,0)\) কি W-তে আছে?</p>`) +
      plan(R`<p><b>Subspace-এর তিন পরীক্ষা:</b> (1) zero vector আছে, (2) যোগে বন্ধ, (3) scalar গুণে বন্ধ।</p>
<ul><li><b>H:</b> \(0+0+0 = 0\) ✓; দুইটা সদস্য যোগ করলে যোগফল \(0 + 0 = 0\) ✓; c দিয়ে গুণ করলে \(c\cdot 0 = 0\) ✓ ⇒ subspace।</li>
<li><b>W:</b> \(0+0+0 = 0 \neq 1\) ⇒ zero vector নেই ⇒ <b>subspace না</b>।</li></ul>`) +
      R`<p><b>(b) H = Nul A:</b> সব শর্তকে "= 0" আকারে আনো: \(a - b + 2c - d = 0\) এবং \(-a + b - c = 0\)। এদের coefficient-গুলোই A-এর row:</p>
$$A = \begin{bmatrix}1&-1&2&-1\\-1&1&-1&0\end{bmatrix}$$
<p><b>W = Col B:</b> সাধারণ vector-টাকে a, b, c আলাদা করে লেখো: \(a(1,0,3,0) + b(-1,1,0,0) + c(0,2,1,-1)\)। এই তিনটাই B-এর column:</p>
$$B = \begin{bmatrix}1&-1&0\\0&1&2\\3&0&1\\0&0&-1\end{bmatrix}$$` +
      answer(R`<p>\((1,0,0,0) \in W\)? শেষ row থেকে \(-c = 0 \Rightarrow c = 0\); তারপর \(3a + c = 0 \Rightarrow a = 0\); \(b + 2c = 0 \Rightarrow b = 0\); কিন্তু তখন \(a - b = 0 \neq 1\) ⇒ <b>W-তে নেই</b>।</p>`),

    a3q2: ask(R`<p>(a) \(\mathbf b_1 = (2,1),\ \mathbf b_2 = (1,1)\) দিয়ে \(P_\mathcal B\), \(P_\mathcal B^{-1}\), আর \(\mathbf x = (7,4)\)-এর \([\mathbf x]_\mathcal B\) বের করো। (b) চারটা vector-এর span H-এর basis, dimension, বাড়তি vector, আর \(\mathbb R^3\)-এর basis পর্যন্ত বাড়াও।</p>`) +
      plan(R`<ul><li><b>(a)</b> \(P_\mathcal B\) = basis vector-গুলো column হিসেবে। \([\mathbf x]_\mathcal B = P_\mathcal B^{-1}\mathbf x\) (রেসিপিটা বের করা)।</li>
<li><b>(b)</b> Vector-গুলো column করে row reduce করো; pivot column-গুলোই basis। Pivot নেই এমন column = বাড়তি।</li></ul>`) +
      answer(R`<p><b>(a)</b> \(P_\mathcal B = \begin{bmatrix}2&1\\1&1\end{bmatrix}\), det = 1, \(P_\mathcal B^{-1} = \begin{bmatrix}1&-1\\-1&2\end{bmatrix}\)। \([\mathbf x]_\mathcal B = (7-4,\ -7+8) = (3, 1)\)। যাচাই: \(3(2,1) + (1,1) = (7,4)\) ✓</p>
<p><b>(b)</b> \(\mathbf v_2 = 2\mathbf v_1\) আর \(\mathbf v_4 = \mathbf v_1 + \mathbf v_3\) ⇒ এরা বাড়তি। Basis \(\{\mathbf v_1, \mathbf v_3\} = \{(1,2,3), (0,1,1)\}\), <b>dim H = 2</b> (\(\mathbb R^3\)-এ একটা তল)।</p>
<p><b>বাড়ানো:</b> একটা standard vector \(\mathbf e_i\) যোগ করো যাতে \(\det[\mathbf v_1\ \mathbf v_3\ \mathbf e_i] \neq 0\) হয়। তাহলে 3টা independent vector ⇒ \(\mathbb R^3\)-এর basis। (কোন \(\mathbf e_i\) কাজ করে, নিচে English অংশে det দিয়ে দেখানো আছে।)</p>`),

    a3q3: ask(R`<p>Change of basis। (a) \(\mathbf b_1 = 2\mathbf c_1 + \mathbf c_2,\ \mathbf b_2 = -\mathbf c_1 + 3\mathbf c_2\), আর \([\mathbf x]_\mathcal B = (2,1)\); \([\mathbf x]_\mathcal C\) বের করো। (b) \(\mathcal C\) ও \(\mathcal B\)-এর vector সংখ্যায় দেওয়া; \(P_{\mathcal C\leftarrow\mathcal B}\) আর \([\mathbf x]_\mathcal C\) বের করো।</p>`) +
      plan(R`<p>\(P_{\mathcal C\leftarrow\mathcal B}\)-এর column = প্রতিটা B vector-এর C-coordinate। তারপর \([\mathbf x]_\mathcal C = P_{\mathcal C\leftarrow\mathcal B}[\mathbf x]_\mathcal B\)।</p>`) +
      answer(R`<p><b>(a)</b> \(P = \begin{bmatrix}2&-1\\1&3\end{bmatrix}\) (b₁-এর coefficient \((2,1)\) প্রথম <b>column</b>-এ)। \([\mathbf x]_\mathcal C = P(2,1) = (3, 5)\)।<br>যাচাই: \(2\mathbf b_1 + \mathbf b_2 = 4\mathbf c_1 + 2\mathbf c_2 - \mathbf c_1 + 3\mathbf c_2 = 3\mathbf c_1 + 5\mathbf c_2\) ✓</p>
<p><b>(b)</b> \(\left[\begin{array}{cc|cc}1&2&5&2\\2&5&11&6\end{array}\right]\) row reduce করো: \(R_2 - 2R_1\) দেয় \([0\ 1 \mid 1\ 2]\), তারপর \(R_1 - 2R_2\) দেয় \([1\ 0 \mid 3\ {-2}]\)।<br>
\(P_{\mathcal C\leftarrow\mathcal B} = \begin{bmatrix}3&-2\\1&2\end{bmatrix}\), \([\mathbf x]_\mathcal C = P(1,-1) = (5, -1)\)।<br>
যাচাই: \(\mathbf x = \mathbf b_1 - \mathbf b_2 = (3,5)\), আর \(5\mathbf c_1 - \mathbf c_2 = (5,10) - (2,5) = (3,5)\) ✓</p>`) +
      trap(R`<p>Coefficient-গুলো <b>column</b>-এ বসে, row-তে না। \(\begin{bmatrix}2&1\\-1&3\end{bmatrix}\) লেখা সবচেয়ে কমন ভুল।</p>`),

    a3q4: ask(R`<p>(a) \(A = \begin{bmatrix}1&2\\2&4\end{bmatrix}\): kernel, range, one-to-one কিনা, rank + nullity। (b) 3×4 matrix-এর echelon form, pivot, rank, Nul A ও Col A-এর basis, আর দেখাও Nul A-এর vector-গুলো A-এর row-এর উপর লম্ব।</p>`) +
      plan(R`<p>Kernel = Nul A (\(A\mathbf x = 0\) সমাধান), Range = Col A (মূল A-এর pivot column)। One-to-one ⇔ kernel শুধু \(\{0\}\)।</p>`) +
      answer(R`<p><b>(a)</b> Column 2 = 2 × column 1। Kernel = Span\(\{(-2,1)\}\) (domain-এ একটা রেখা)। Range = Span\(\{(1,2)\}\) (codomain-এ একটা রেখা)। Kernel-এ অশূন্য vector আছে ⇒ <b>one-to-one না</b> (যেমন \(T(-2,1) = 0 = T(0)\))। rank 1 + nullity 1 = 2 ✓</p>
<p><b>(b)</b> \(R_2 - 2R_1\) ও \(R_3 - 3R_1\) দুটোই \([0\ 0\ 1\ 3]\) দেয়, তারপর \(R_3 - R_2 = 0\)। Pivot column 1 ও 3, <b>rank 2</b>।<br>
Nul A: \(x_1 = -2x_2 + x_4\), \(x_3 = -3x_4\) ⇒ basis \(\{(-2,1,0,0),\ (1,0,-3,1)\}\)।<br>
Col A basis: \(\{(1,2,3),\ (0,1,1)\}\)।<br>
লম্ব যাচাই: \((-2,1,0,0)\cdot(1,2,0,-1) = 0\) ✓, \((1,0,-3,1)\cdot(1,2,0,-1) = 1 - 1 = 0\) ✓ (প্রতিটা row-এর সাথেই 0 আসবে)।</p>`),

    a3q5: ask(R`<p>(a) একটা 3×3 det বের করো row 1 আর column 1 দুইভাবেই; volume; \(\det A^T\); row swap করলে det। (b) একটা system-এর det elimination দিয়ে, Cramer's rule দিয়ে সমাধান, আর \(\det(A^TA)\), \(\det(A^{-1})\)।</p>`) +
      plan(R`<ul><li><b>Cofactor:</b> entry × দাবার-বোর্ড চিহ্ন × ছোট 2×2-এর det।</li><li><b>Elimination:</b> triangular বানাও; প্রতিটা swap-এ চিহ্ন উল্টাও; det = \((-1)^{\text{swap}}\) × pivot-গুলোর গুণফল।</li><li><b>Cramer:</b> \(x_i = \det A_i / \det A\)।</li></ul>`) +
      answer(R`<p><b>(a)</b> Row 1 ধরে: \(2\big((-1)(5) - 4(2)\big) - 1\big(3(5) - 0\big) + 0 = 2(-13) - 15 = \mathbf{-41}\)। Column 1 ধরেও একই −41 আসবে।<br>
Volume = \(|{-41}| = 41\)। \(\det A^T = -41\) (transpose-এ det বদলায় না)। একটা row swap করলে det = \(+41\) (চিহ্ন উল্টায়)।</p>
<p><b>(b)</b> (1,1) জায়গায় 0, তাই আগে swap লাগবে। \(\det A = -1\)।<br>
Cramer দিয়ে \(\mathbf x = (1, 2, 3)\)। যাচাই: \(2 + 2(3) = 8\) ✓, \(1 + 4 + 3 = 8\) ✓, \(2 + 14 + 27 = 43\) ✓<br>
\(\det(A^TA) = (-1)(-1) = 1\), \(\det(A^{-1}) = 1/(-1) = -1\)।</p>`),

    /* ---------- Homework 4 ---------- */
    h4a: ask(R`<p>True/False কারণসহ, multiplicity-র সংজ্ঞা, আর best approximation (projection)।</p>`) +
      answer(R`<ul>
<li><b>(a) False:</b> eigenvector সংজ্ঞা অনুযায়ী <b>অশূন্য</b> হতে হয়।</li>
<li><b>(b) True:</b> λ = 0 মানে \(A\mathbf x = 0\)-এর অশূন্য সমাধান আছে ⇒ A invertible না।</li>
<li><b>(c) True:</b> 3টা আলাদা eigenvalue ⇒ 3টা independent eigenvector ⇒ diagonalizable।</li>
<li><b>(d) False:</b> সবসময় \(1 \le \text{GM} \le \text{AM}\); GM কখনো AM-এর চেয়ে বড় হয় না।</li>
<li><b>(e) True:</b> অশূন্য orthogonal vector-গুলো সবসময় linearly independent।</li>
<li><b>(f) False:</b> \((\text{Col}A)^\perp = \text{Nul}A^T\); Nul A হলো \((\text{Row}A)^\perp\)।</li>
<li><b>(g) True:</b> বর্গাকার আর orthonormal column ⇒ \(U^{-1} = U^T\)।</li></ul>
<p><b>Q2:</b> <b>AM</b> = characteristic polynomial-এ λ কয়বার root। <b>GM</b> = λ-এর জন্য কয়টা independent eigenvector (\(\text{Nul}(A - \lambda I)\)-এর dim)। প্রতিটা λ-তে GM = AM হলেই diagonalizable।</p>
<p><b>Q3:</b> \(\mathbf z = \mathbf y - \hat{\mathbf y}\) থাকে \(W^\perp\)-এ; আর \(\hat{\mathbf y}\) হলো W-এর মধ্যে y-এর সবচেয়ে কাছের বিন্দু (Best Approximation Theorem)।</p>`),

    h4b: ask(R`<p>Eigenvalue/eigenvector বের করা (Q4), triangular matrix (Q5), diagonalize করা যায় না এমন matrix (Q6), 3×3 diagonalization (Q7), আর \(PD^3P^{-1}\) দিয়ে \(A^3\) (Q8)।</p>`) +
      plan(R`<ol><li>\(\det(A - \lambda I) = 0\) ⇒ eigenvalue।</li><li>প্রতিটা λ-তে \((A - \lambda I)\mathbf v = 0\)-কে row reduce ⇒ eigenvector (free variable থেকে)।</li><li>যথেষ্ট eigenvector থাকলে \(P\) = eigenvector column, \(D\) = eigenvalue (একই ক্রমে)।</li></ol>`) +
      answer(R`<ul>
<li><b>Q4</b> \(A = \begin{bmatrix}4&1\\2&3\end{bmatrix}\): \(\lambda^2 - 7\lambda + 10 = 0\) ⇒ \(\lambda = 5, 2\)। \(\lambda = 5\): \(\mathbf v = (1,1)\); \(\lambda = 2\): \(\mathbf v = (-1,2)\)। (যাচাই: trace 7 = 5 + 2, det 10 = 5·2 ✓)</li>
<li><b>Q5</b> triangular ⇒ eigenvalue = কর্ণের সংখ্যা: 3 (দুইবার), 5, −1। 0 eigenvalue না ⇒ T invertible (\(\det T = -45\))।</li>
<li><b>Q6</b> \(C = \begin{bmatrix}5&1\\0&5\end{bmatrix}\): \(\lambda = 5\) দুইবার (AM 2), কিন্তু \(C - 5I\)-এ free variable একটা ⇒ GM 1 ⇒ <b>diagonalizable না</b>।</li>
<li><b>Q7</b> column 3 ধরে expand: \((2-\lambda)(\lambda - 2)(\lambda - 5)\) ⇒ \(\lambda = 2\) (AM 2), \(5\)। \(\lambda = 2\): \(x_2 = 2x_1\), \(x_3\) free ⇒ \((1,2,0), (0,0,1)\) (GM 2 ✓)। \(\lambda = 5\): \((1,1,1)\)। তাই <b>diagonalizable</b>।</li>
<li><b>Q8</b> \(A^3 = PD^3P^{-1} = \begin{bmatrix}86&39\\78&47\end{bmatrix}\)। যাচাই: \(A^2 = \begin{bmatrix}18&7\\14&11\end{bmatrix}\), \(A^2A\) একই ফল ✓</li></ul>`),

    h4c: ask(R`<p>Orthogonality: তলের normal (Q9), orthogonal basis-এ weight (Q10), রেখায় projection (Q11), তলে projection (Q12), orthogonal matrix (Q13), Gram–Schmidt (Q14)।</p>`) +
      answer(R`<ul>
<li><b>Q9</b> \(2x - y + 3z = 0\)-এর normal \(\mathbf n = (2,-1,3)\) (coefficient-গুলো)। \((1,2,0)\cdot\mathbf n = 0\) ⇒ W-তে আছে ✓। \(\mathbf d = (4,-2,6) = 2\mathbf n\) ⇒ রেখা L, W-এর উপর লম্ব।</li>
<li><b>Q10</b> \(c_i = \dfrac{\mathbf y\cdot\mathbf u_i}{\mathbf u_i\cdot\mathbf u_i}\): \(18/9 = 2\), \(-9/9 = -1\), \(27/9 = 3\) ⇒ \(\mathbf y = 2\mathbf u_1 - \mathbf u_2 + 3\mathbf u_3\)। যাচাই করলে \((6,-3,9)\) ✓</li>
<li><b>Q11</b> \(\mathbf y = (7,4)\), \(\mathbf u = (1,2)\): \(\frac{15}{5} = 3\) ⇒ ছায়া \((3,6)\), বাকি \(\mathbf z = (4,-2)\), \(\mathbf z\cdot\mathbf u = 0\) ✓। দূরত্ব \(\|\mathbf z\| = 2\sqrt5\)।</li>
<li><b>Q12</b> \(\mathbf y = (2,4,6)\)-কে দুই orthogonal vector-এর উপর আলাদা ছায়া নিয়ে যোগ: \(4(1,1,1) + (-1)(1,-1,0) = (3,5,4)\)। বাকি \((-1,-1,2)\) দুটোর উপরেই লম্ব ✓</li>
<li><b>Q13</b> \(U^TU = I\) ⇒ column-গুলো orthonormal; \(U^{-1} = U^T\); \(\|U\mathbf x\| = \|\mathbf x\| = 5\sqrt5\) (দৈর্ঘ্য অপরিবর্তিত)।</li>
<li><b>Q14</b> Gram–Schmidt: \(\mathbf v_1 = (1,1,1)\); \(\mathbf v_2 = (1,2,3) - \frac{6}{3}(1,1,1) = (-1,0,1)\)। যাচাই: \(\mathbf v_1\cdot\mathbf v_2 = 0\) ✓। Orthonormal চাইলে দৈর্ঘ্য (\(\sqrt3\), \(\sqrt2\)) দিয়ে ভাগ করো।</li></ul>`),

    /* ---------- Homework 5 ---------- */
    h5a: ask(R`<p>True/False কারণসহ, spectral decomposition, আর কখন \(A^+ = A^{-1}\)।</p>`) +
      answer(R`<ul>
<li><b>(a) True:</b> symmetric matrix-এ আলাদা eigenvalue-এর eigenvector-গুলো লম্ব।</li>
<li><b>(b) False:</b> শুধু <b>symmetric</b> matrix-ই orthogonally diagonalizable।</li>
<li><b>(c) True:</b> real symmetric n×n-এর n টা real eigenvalue (multiplicity ধরে)।</li>
<li><b>(d) True:</b> সব eigenvalue ধনাত্মক ⇒ positive definite।</li>
<li><b>(e) True:</b> unit x-এ \(\mathbf x^TA\mathbf x\)-এর max = সবচেয়ে বড় eigenvalue।</li>
<li><b>(f) False:</b> singular value = \(A^TA\)-এর eigenvalue-এর <b>বর্গমূল</b>।</li>
<li><b>(g) True:</b> independent column ⇒ left inverse আছে; rank 2 বলে right inverse নেই।</li></ul>
<p><b>Q2:</b> \(A = \lambda_1\mathbf u_1\mathbf u_1^T + \dots + \lambda_n\mathbf u_n\mathbf u_n^T\)। প্রতিটা \(\mathbf u_j\mathbf u_j^T\) একটা rank-1 projection matrix: x-কে \(\mathbf u_j\)-এর রেখায় projection করে।</p>
<p><b>Q3:</b> A বর্গাকার আর invertible হলে \(A^+ = A^{-1}\)।</p>`),

    h5b: ask(R`<p>Symmetric matrix-এর orthogonal diagonalization ও spectral decomposition (Q4), quadratic form ও change of variable (Q5), 3 variable-এর quadratic form-এর matrix (Q6), আর শ্রেণিবিভাগ ও level set (Q7)।</p>`) +
      answer(R`<ul>
<li><b>Q4</b> \(A = \begin{bmatrix}3&2\\2&0\end{bmatrix}\): \(\lambda = 4\) (\(\mathbf v = (2,1)\)), \(\lambda = -1\) (\(\mathbf v = (-1,2)\))। দুটো লম্ব ✓, দৈর্ঘ্য \(\sqrt5\)। \(P = \frac{1}{\sqrt5}\begin{bmatrix}2&-1\\1&2\end{bmatrix}\), \(D = \text{diag}(4,-1)\), \(A = PDP^T\)।</li>
<li><b>Q5</b> \(Q = 3x_1^2 + 4x_1x_2\); \(\mathbf x = P\mathbf y\) দিলে \(Q = 4y_1^2 - y_2^2\)। \(Q(1,2) = 11\), আর y দিয়ে হিসাব করলেও 11 ✓</li>
<li><b>Q6</b> বর্গের coefficient কর্ণে, cross term অর্ধেক করে: \(A = \begin{bmatrix}2&3&0\\3&-3&-2\\0&-2&5\end{bmatrix}\)। \(Q(1,-1,2) = 2 - 3 + 20 - 6 + 8 = 21\)।</li>
<li><b>Q7</b> \(A = \begin{bmatrix}5&2\\2&2\end{bmatrix}\), eigenvalue 6 ও 1, দুটোই ধনাত্মক ⇒ <b>positive definite</b>। \(Q = 6y_1^2 + y_2^2\): c = 12 হলে ellipse, c = 0 হলে শুধু origin, c = −3 হলে খালি সেট।</li></ul>`),

    h5c: ask(R`<p>\(\|\mathbf x\| = 1\) শর্তে quadratic form-এর max ও min।</p>`) +
      plan(R`<p>নিয়ম: max = সবচেয়ে বড় eigenvalue, min = সবচেয়ে ছোট, আর এগুলো পাওয়া যায় সংশ্লিষ্ট unit eigenvector-এ। Diagonal form হলে eigenvalue = coefficient-গুলোই।</p>`) +
      answer(R`<ul>
<li><b>Q8</b> \(Q = 8x_1^2 + 5x_2^2 + 2x_3^2\): <b>max 8</b> at \((\pm1,0,0)\), <b>min 2</b> at \((0,0,\pm1)\)। কারণ: \(Q \le 8(x_1^2 + x_2^2 + x_3^2) = 8\) আর \(Q \ge 2(\dots) = 2\)। \(\mathbf u_1\)-এর উপর লম্ব শর্তে (\(x_1 = 0\)) max = <b>5</b> at \((0,\pm1,0)\)।</li>
<li><b>Q9</b> eigenvalue 7, 3, −2: (a) max 7 at \(\mathbf u_1\), min −2 at \(\mathbf u_3\); (b) \(\mathbf x \perp \mathbf u_1\) হলে max 3 at \(\mathbf u_2\); (c) \(\mathbf u_1, \mathbf u_2\) দুটোর উপর লম্ব হলে শুধু \(\pm\mathbf u_3\) বাকি ⇒ মান −2।</li></ul>`),

    h5d: ask(R`<p>\(A = \begin{bmatrix}1&0\\0&1\\1&1\end{bmatrix}\)-এর জন্য \(\|A\mathbf x\|\)-এর max (Q10) আর পূর্ণ SVD (Q11); \(C = \begin{bmatrix}1&2\\2&4\end{bmatrix}\)-এর SVD আর \(C^+\) (Q12); left/right inverse (Q13)।</p>`) +
      plan(R`<ol><li>\(A^TA\) বের করো, তার eigenvalue বড় → ছোট সাজাও, \(\sigma = \sqrt\lambda\)।</li><li>Unit eigenvector ⇒ V।</li><li>\(\mathbf u_i = A\mathbf v_i/\sigma_i\) ⇒ U; দরকার হলে লম্ব unit vector দিয়ে U পূর্ণ করো।</li></ol>`) +
      answer(R`<ul>
<li><b>Q10</b> \(A^TA = \begin{bmatrix}2&1\\1&2\end{bmatrix}\), eigenvalue 3 ও 1। \(\|A\mathbf x\|^2\)-এর max = 3 ⇒ <b>max \(\|A\mathbf x\| = \sqrt3\)</b>, at \(\mathbf v_1 = \frac{1}{\sqrt2}(1,1)\)।</li>
<li><b>Q11</b> \(\sigma_1 = \sqrt3,\ \sigma_2 = 1\)। \(\mathbf u_1 = \frac{1}{\sqrt6}(1,1,2)\), \(\mathbf u_2 = \frac{1}{\sqrt2}(-1,1,0)\), আর \(\mathbf u_3 = \frac{1}{\sqrt3}(-1,-1,1)\) (প্রথম দুটোর উপর লম্ব)। \(\Sigma\) 3×2, কর্ণে \(\sqrt3, 1\)।</li>
<li><b>Q12</b> \(\sigma_1 = 5,\ \sigma_2 = 0\) (rank 1)। \(C = \left(\frac{1}{\sqrt5}(1,2)\right)[5]\left(\frac{1}{\sqrt5}(1,2)\right)^T\)। \(C^+ = \frac{1}{25}\begin{bmatrix}1&2\\2&4\end{bmatrix}\)।</li>
<li><b>Q13</b> লম্বা A (3×2, independent column) ⇒ left inverse \((A^TA)^{-1}A^T = \frac13\begin{bmatrix}2&-1&1\\-1&2&1\end{bmatrix}\)। চওড়া B (2×3, independent row) ⇒ right inverse \(B^T(BB^T)^{-1} = \frac13\begin{bmatrix}2&-1\\-1&2\\1&1\end{bmatrix}\)।<br>
(c) A-এর right inverse নেই: \(AR = I_3\) হলে rank 3 লাগত, কিন্তু rank A ≤ 2। Col A-এর সব vector \((a, b, a+b)\) আকারের, তাই যেমন \((1,1,-1)\) Col A-তে নেই।</li></ul>`),
  };
})();
