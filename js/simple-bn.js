// বাংলা সহজ গাইড — same ids as js/simple.js. Technical terms stay in English because the exam uses them.
(function () {
  const R = String.raw;
  const box = (type, title, html) => `<div class="box ${type}">${title ? `<span class="h">${title}</span>` : ''}${html}</div>`;

  window.SIMPLE_BN = {
    bigpicture: {
      title: 'বড় ছবিটা (আগে এটা পড়ো)', asg: 'সব',
      line: 'Matrix হলো একটা মেশিন। প্রতিটা topic ওই মেশিন নিয়ে আলাদা একটা প্রশ্ন।',
      html: R`
${box('key', 'যে একটা আইডিয়া সব কিছুকে জোড়া লাগায়', R`<p><b>Vector</b> মানে শুধু কয়েকটা সংখ্যার লিস্ট, যেমন \((3, 1)\)। এটাকে origin থেকে একটা তীর (arrow) বা একটা বিন্দু হিসেবে ভাবো।</p>
<p><b>Matrix</b> \(A\) হলো একটা <b>মেশিন</b>: তুমি একটা vector \(x\) ঢোকাও, মেশিন তোমাকে নতুন একটা vector \(Ax\) ফেরত দেয়। এটা জায়গাকে (space) টানতে, ঘোরাতে, উল্টাতে, বাঁকাতে (shear) বা চ্যাপ্টা করে দিতে পারে।</p>`)}
<h2>প্রতিটা topic আসলে মেশিনটা নিয়ে একটা প্রশ্ন</h2>
<table class="simple-map">
<tr><th>Topic</th><th>সহজ ভাষায় কোন প্রশ্নের উত্তর দেয়</th></tr>
<tr><td>1. Linear systems (এটা তুমি পারো ✓)</td><td>কোন input \(x\) দিলে output \(b\) পাওয়া যায়? Row reduction দিয়ে \(Ax=b\) সমাধান।</td></tr>
<tr><td>2. Block multiplication</td><td>বড় matrix-কে ছোট টুকরো করে কি গুণ করা যায়? (হ্যাঁ।)</td></tr>
<tr><td>3. LU factorization</td><td>Row reduction-এর হিসাবটা কি লিখে রেখে বারবার ব্যবহার করা যায়?</td></tr>
<tr><td>4. Linear transformations</td><td>মেশিনটা space-এর সাথে কী করে? কোনো তথ্য হারায় কি? সব output-এ কি পৌঁছানো যায়?</td></tr>
<tr><td>5. Vector spaces</td><td>মেশিন কোন কোন output বানাতে পারে (Col A)? কোন input-গুলোকে শূন্য বানিয়ে দেয় (Nul A)?</td></tr>
<tr><td>6. Determinants</td><td>মেশিন ক্ষেত্রফল/আয়তন কতগুণ বাড়ায়? 0 হলে সব চ্যাপ্টা, তাই inverse নেই।</td></tr>
<tr><td>7. Eigenvalues</td><td>কোন দিকগুলো মেশিন শুধু লম্বা করে, ঘোরায় না? কতটা লম্বা করে?</td></tr>
<tr><td>8. Orthogonality</td><td>কোন vector-গুলো লম্ব (perpendicular)? একটা vector-এর উপর আরেকটার "ছায়া" কত?</td></tr>
<tr><td>9. Symmetric ও quadratic forms</td><td>\(5x^2+4xy+2y^2\)-এর মতো সূত্র সবসময় ধনাত্মক (বাটি), সবসময় ঋণাত্মক (গম্বুজ), নাকি মিশ্র (ঘোড়ার জিন/saddle)?</td></tr>
<tr><td>10. SVD</td><td>যেকোনো matrix (আয়তাকার হলেও) কি ঘোরানো → টানা → ঘোরানো এই তিন ধাপে ভাঙা যায়?</td></tr>
</table>
${box('good', 'ভালো খবর: সবচেয়ে জরুরি skill-টা তুমি অলরেডি পারো', R`<p>Assignment 1-এর row reduction (RREF) হলো <b>মাস্টার চাবি</b>। এটা দিয়েই তুমি:</p>
<ul><li>LU-তে \(U\) বানাবে (topic 3);</li>
<li>Nul A, Col A এবং one-to-one/onto বের করবে (topic 4, 5);</li>
<li>eigenvector বের করবে (topic 7): \((A-\lambda I)v = 0\) সমাধান করা মানে free variable-ওয়ালা একটা system!</li>
<li>change of basis করবে (topic 5): \([\,C \mid B\,]\)-কে row reduce করো।</li></ul>
<p>তাই বেশিরভাগ নতুন topic মানে: "একটা matrix সাজাও, তারপর তোমার জানা row reduction চালাও"।</p>`)}
<h2>কোন assignment-এ কোন topic</h2>
<ul>
<li><b>Assignment 1 Part B:</b> block multiplication (topic 2)</li>
<li><b>Assignment 2:</b> LU (3), Col/Nul ও rank (5), transformation: shear তারপর rotate, image ও pre-image (4)</li>
<li><b>Assignment 3:</b> subspace, basis, coordinates, change of basis, kernel ও range (5), determinant ও Cramer's rule (6)</li>
<li><b>Homework 4:</b> eigenvalue ও diagonalization (7), orthogonality, projection ও Gram–Schmidt (8)</li>
<li><b>Homework 5:</b> symmetric matrix ও quadratic form (9), SVD, pseudoinverse ও left/right inverse (10)</li>
</ul>`,
    },
    block: {
      title: 'Block multiplication', asg: 'Assignment 1B',
      line: 'বড় matrix-কে টাইলের মতো টুকরো করো, তারপর টুকরোগুলোকে সাধারণ সংখ্যার মতো গুণ করো।',
      html: R`
${box('key', 'এক কথায়', R`<p>প্রতিটা matrix-কে আয়তাকার <b>block</b> (টাইল)-এ কাটো। তারপর প্রতিটা টাইলকে একটা সংখ্যা ধরে সাধারণ row × column নিয়মে গুণ করো।</p>`)}
<h2>দৈনন্দিন উদাহরণ</h2>
<p>একটা বড় Excel শিটকে চারটা অংশে ভাগ করো। ঘর-ঘর গুণ না করে অংশ-অংশ গুণ করলেও উত্তর একই আসে।</p>
<h2>যে নিয়মটা মনে রাখতেই হবে</h2>
<p>\(A = \begin{bmatrix} A_{11} & A_{12} \\ A_{21} & A_{22}\end{bmatrix}\) এবং \(B = \begin{bmatrix} B_{1} \\ B_{2}\end{bmatrix}\) হলে:</p>
$$AB = \begin{bmatrix} A_{11}B_1 + A_{12}B_2 \\ A_{21}B_1 + A_{22}B_2\end{bmatrix}$$
${box('warn', 'দুইটা ফাঁদ', R`<ol><li><b>কাটা মিলতে হবে:</b> A-এর <b>column</b> যেভাবে কাটবে, B-এর <b>row</b> ঠিক সেভাবে কাটতে হবে। A-এর column 2 | 1 হলে B-এর row-ও 2 | 1।</li>
<li><b>ক্রম (order) গুরুত্বপূর্ণ:</b> \(A_{11}B_1\) লেখো, কখনো \(B_1A_{11}\) না। টাইলগুলো matrix, আর matrix-এর গুণে জায়গা বদলানো যায় না।</li></ol>`)}
<h2>হাতে করা ছোট উদাহরণ</h2>
<p>\(A = \left[\begin{array}{cc|c} 1&0&2\\0&1&3\end{array}\right]\), column কাটা 2 | 1, তাই \(A_1 = I\) এবং \(A_2 = \begin{bmatrix}2\\3\end{bmatrix}\)।</p>
<p>\(B = \left[\begin{array}{cc} 1&1\\2&0\\\hline 1&1\end{array}\right]\), row কাটা 2 | 1, তাই \(B_1 = \begin{bmatrix}1&1\\2&0\end{bmatrix}\) এবং \(B_2 = \begin{bmatrix}1&1\end{bmatrix}\)।</p>
$$AB = A_1B_1 + A_2B_2 = \begin{bmatrix}1&1\\2&0\end{bmatrix} + \begin{bmatrix}2&2\\3&3\end{bmatrix} = \begin{bmatrix}3&3\\5&3\end{bmatrix}$$
<p>সাধারণ গুণ দিয়ে যাচাই: A-এর row 1 · B-এর column 1 \(= 1+0+2 = 3\) ✓</p>
${box('recipe', 'পরীক্ষায় যা করবে', R`<ol><li>প্রতিটা block-এর size লিখে ফেলো।</li><li>দেখাও A-এর column কাটা = B-এর row কাটা ("compatible")।</li><li>Order ঠিক রেখে block ধরে ধরে গুণ করো।</li><li>সাধারণ গুণ দিয়ে এক-দুইটা entry যাচাই করো।</li></ol>`)}`,
    },
    lu: {
      title: 'LU factorization (PA = LU)', asg: 'Assignment 2',
      line: 'তোমার জানা row reduction-ই করো, শুধু কী কী করলে তার একটা রসিদ রাখো।',
      html: R`
${box('key', 'এক কথায়', R`<p>\(A = LU\): row reduction করে যে <b>সিঁড়ির মতো (echelon) form</b> পাও সেটা \(U\), আর যে multiplier-গুলো ব্যবহার করেছ তার <b>রসিদ</b> হলো \(L\)।</p>`)}
<h2>দৈনন্দিন উদাহরণ</h2>
<p>একটা লম্বা হিসাব একবার করেছ। প্রতিটা নতুন \(b\)-এর জন্য আবার না করে হিসাবটা (\(L\) আর \(U\)) save করে রাখো। Triangular matrix দিয়ে সমাধান খুব দ্রুত, শুধু মান বসিয়ে যাও।</p>
<h2>হাতে করা ছোট উদাহরণ</h2>
<p>\(A = \begin{bmatrix}2&1\\6&8\end{bmatrix}\)। Pivot-এর নিচের 6-কে শূন্য করো: \(R_2 \to R_2 - 3R_1\)।</p>
$$U = \begin{bmatrix}2&1\\0&5\end{bmatrix}, \qquad L = \begin{bmatrix}1&0\\ \mathbf{3}&1\end{bmatrix}$$
<p>যে <b>3</b> দিয়ে বিয়োগ করেছ, সেটা \(L\)-এর একই জায়গায় (row 2, column 1) <b>ধনাত্মক</b> 3 হিসেবে বসে। \(L\)-এর কর্ণে (diagonal) সব 1।</p>
<p>যাচাই: \(LU = \begin{bmatrix}2&1\\6&3+5\end{bmatrix} = A\) ✓</p>
<h2>এটা দিয়ে \(Ax = b\) সমাধান, যেখানে \(b = (3, 19)\)</h2>
<ol><li><b>সামনের দিকে (forward)</b>, \(Ly = b\): \(y_1 = 3\), তারপর \(3(3) + y_2 = 19 \Rightarrow y_2 = 10\)।</li>
<li><b>পেছনের দিকে (backward)</b>, \(Ux = y\): \(5x_2 = 10 \Rightarrow x_2 = 2\), তারপর \(2x_1 + 2 = 3 \Rightarrow x_1 = \tfrac12\)।</li></ol>
<p>মূল সমীকরণে যাচাই: \(2(\tfrac12) + 2 = 3\) ✓ এবং \(6(\tfrac12) + 8(2) = 19\) ✓</p>
${box('warn', 'P কখন লাগে?', R`<p>কোনো pivot-এর জায়গায় <b>0</b> চলে এলে তা দিয়ে ভাগ করা যায় না, তাই <b>row swap</b> করতে হয়। \(P\) হলো identity matrix, যার row-গুলো একইভাবে swap করা। তখন \(A = LU\)-এর বদলে \(PA = LU\) লেখো।</p>
<p>টিপস: আগে A-তে (আর b-তে) swap করে নাও, তারপর স্বাভাবিকভাবে eliminate করো।</p>`)}
${box('recipe', 'পরীক্ষায় যা করবে', R`<ol><li>শূন্য pivot আসছে? আগে swap করে P লেখো।</li><li>Column ধরে ধরে শুধু "row − (multiplier)×pivot row" দিয়ে eliminate করো।</li><li>প্রতিটা multiplier L-এর মিলে যাওয়া জায়গায় বসাও।</li><li>\(LU\) = \(A\) (বা \(PA\)) কিনা যাচাই করো।</li><li>\(b\) দেওয়া থাকলে: আগে \(Ly = Pb\), তারপর \(Ux = y\)।</li></ol>`)}`,
    },
    transform: {
      title: 'Linear transformations', asg: 'Assignment 2 ও 3',
      line: 'Matrix space-এর প্রতিটা বিন্দুকে সরায়। মূল তীরগুলোর কী হয় সেটা দেখো।',
      html: R`
${box('key', 'এক কথায়', R`<p>\(T(x) = Ax\) প্রতিটা বিন্দুকে সরায়। "Linear" মানে সরল রেখা সরলই থাকে, grid সমান ফাঁকে থাকে, আর origin নড়ে না।</p>`)}
<h2>Matrix বের করার কৌশল</h2>
<p>শুধু জিজ্ঞেস করো: মূল তীর \(e_1 = (1,0)\) আর \(e_2 = (0,1)\) কোথায় যায়? <b>ওই ফলাফলগুলোই A-এর column।</b></p>
<p>উদাহরণ: ঘড়ির কাঁটার উল্টো দিকে 90° ঘোরানো। \(e_1 \to (0,1)\) এবং \(e_2 \to (-1,0)\), তাই</p>
$$A = \begin{bmatrix}0&-1\\1&0\end{bmatrix}$$
<p>\(k\) পরিমাণ horizontal shear: \(e_1 \to (1,0)\) এবং \(e_2 \to (k,1)\), তাই \(A = \begin{bmatrix}1&k\\0&1\end{bmatrix}\)।</p>
${box('warn', 'পরপর দুইটা কাজ ("আগে shear, তারপর rotate")', R`<p>যেটা <b>আগে</b> হয় সেটা <b>ডান দিকে</b> বসে: \(\text{মোট} = R \cdot S\) (rotate × shear)। Function-এর মতো পড়ো, \(R(S(x))\): \(x\)-এর উপর আগে shear হয়।</p>`)}
<h2>যে শব্দগুলো দেখবে, সহজ ভাষায়</h2>
<ul>
<li><b>x-এর image:</b> x কোথায় গিয়ে পড়ে। শুধু \(Ax\) হিসাব করো।</li>
<li><b>b-এর pre-image:</b> কোন x গিয়ে b-তে পড়ে? Row reduction দিয়ে \(Ax = b\) সমাধান করো (Assignment 1-এর skill!)।</li>
<li><b>Kernel:</b> যে input-গুলো চ্যাপ্টা হয়ে 0 হয়ে যায়। এটা Nul A-এর সমান।</li>
<li><b>Range:</b> সম্ভাব্য সব output। এটা Col A-এর সমান।</li>
<li><b>One-to-one:</b> দুইটা আলাদা input কখনো একই জায়গায় পড়ে না, তাই কোনো তথ্য হারায় না। পরীক্ষা: <b>প্রতিটা column-এ pivot</b> (কোনো free variable নেই), অর্থাৎ kernel শুধু \(\{0\}\)।</li>
<li><b>Onto:</b> প্রতিটা output-এ পৌঁছানো যায়। পরীক্ষা: <b>প্রতিটা row-তে pivot</b>।</li>
</ul>
${box('recipe', 'T কি linear?', R`<p>দ্রুত বাতিলের পরীক্ষা: \(T(0)\) অবশ্যই \(0\) হতে হবে। যেমন \(T(x) = x + 1\) linear <b>না</b>, কারণ \(T(0) = 1\)।</p><p>পূর্ণ পরীক্ষা: \(T(u+v) = T(u) + T(v)\) এবং \(T(cu) = cT(u)\)।</p>`)}`,
    },
    spaces: {
      title: 'Vector spaces, basis, Col A, Nul A', asg: 'Assignment 2 ও 3',
      line: 'উপকরণ আর রেসিপি: কী কী রান্না করা যায়, আর কোনটা বাড়তি?',
      html: R`
${box('key', 'রান্নার উদাহরণ (এতেই সব পরিষ্কার হবে)', R`<ul>
<li><b>Vector</b> হলো উপকরণ। <b>Linear combination</b> হলো রেসিপি: \(2v_1 + 3v_2\)।</li>
<li><b>Span</b> হলো এই উপকরণগুলো দিয়ে যত রকম খাবার রান্না করা সম্ভব, সব।</li>
<li><b>Linearly independent</b> মানে কোনো উপকরণ বাড়তি নয়: কোনোটাই বাকিগুলো দিয়ে বানানো যায় না।</li>
<li><b>Basis</b> হলো সবচেয়ে ছোট উপকরণের সেট, যা দিয়ে তবুও পুরো space রান্না করা যায়।</li>
<li><b>Dimension</b> হলো basis-এ কয়টা উপকরণ।</li>
<li><b>Coordinates</b> \([x]_B\) হলো রেসিপি: x বানাতে প্রতিটা basis উপকরণ কতটুকু লাগে।</li>
</ul>`)}
<h2>Subspace: origin-এর মধ্য দিয়ে যাওয়া একটা "ঘর"</h2>
<p>H একটা subspace, যদি তিনটা পরীক্ষাতেই পাস করে:</p>
<ol><li>এতে zero vector আছে।</li><li>দুইটা সদস্য যোগ করলেও ভেতরেই থাকে।</li><li>একটা সদস্যকে কোনো সংখ্যা দিয়ে গুণ করলেও ভেতরেই থাকে।</li></ol>
<p>Origin দিয়ে যাওয়া রেখা বা তল পাস করে। Origin-কে মিস করা রেখা ফেল করে (0 নেই)। "\(x \ge 0\)"-এর মতো শর্তওয়ালা সেটও ফেল করে, কারণ \(-1\) দিয়ে গুণ করলে বাইরে চলে যায়।</p>
<h2>Matrix-এর বিখ্যাত দুইটা space</h2>
<ul>
<li><b>Col A</b> (column space) হলো মেশিনের সম্ভাব্য সব output। Basis = <b>মূল A-এর pivot column</b> (RREF-এর না!)।</li>
<li><b>Nul A</b> (null space) হলো যে input-গুলো 0 হয়ে যায়, অর্থাৎ \(Ax = 0\) সমাধান করো। Basis = প্রতিটা <b>free variable</b>-এর জন্য একটা vector।</li>
</ul>
<h2>হাতে করা ছোট উদাহরণ</h2>
<p>\(A = \begin{bmatrix}1&2&3\\2&4&7\end{bmatrix} \xrightarrow{R_2-2R_1} \begin{bmatrix}1&2&3\\0&0&1\end{bmatrix} \xrightarrow{R_1-3R_2} \begin{bmatrix}1&2&0\\0&0&1\end{bmatrix}\)</p>
<p>Pivot আছে column 1 ও 3-এ, আর \(x_2\) free।</p>
<ul><li>Col A-এর basis: \(\left\{\begin{bmatrix}1\\2\end{bmatrix}, \begin{bmatrix}3\\7\end{bmatrix}\right\}\), মূল A থেকে নেওয়া।</li>
<li>Nul A: \(x_1 = -2x_2\) এবং \(x_3 = 0\), তাই \(x = x_2\begin{bmatrix}-2\\1\\0\end{bmatrix}\)। Basis: \(\{(-2,1,0)\}\)।</li>
<li><b>Rank theorem:</b> rank (2) + nullity (1) = column সংখ্যা (3) ✓</li></ul>
<h2>Coordinates: রেসিপিটা বের করো</h2>
<p>\(B = \{(1,1), (1,-1)\}\) এবং \(x = (3,1)\) নাও। \(c_1(1,1) + c_2(1,-1) = (3,1)\) সমাধান করো: \(c_1 + c_2 = 3\) এবং \(c_1 - c_2 = 1\), তাই \(c_1 = 2\), \(c_2 = 1\)।</p>
<p>অর্থাৎ \([x]_B = (2, 1)\): "প্রথম উপকরণ 2 ভাগ আর দ্বিতীয়টা 1 ভাগ"। যাচাই: \(2(1,1) + (1,-1) = (3,1)\) ✓</p>
${box('recipe', 'Change of basis \\(P_{C\\leftarrow B}\\) (B-এর রেসিপিকে C-এর রেসিপিতে রূপান্তর)', R`<ol><li>Augmented matrix লেখো \([\,c_1\ c_2 \mid b_1\ b_2\,]\): বাঁয়ে নতুন basis, ডানে পুরনো basis।</li><li>বাঁ দিক \(I\) না হওয়া পর্যন্ত row reduce করো।</li><li>ডান দিকে এখন \(P_{C\leftarrow B}\)। তারপর \([x]_C = P_{C\leftarrow B}[x]_B\)।</li></ol>`)}`,
    },
    det: {
      title: 'Determinants ও Cramer’s rule', asg: 'Assignment 3',
      line: 'একটা সংখ্যা: মেশিন ক্ষেত্রফল কতগুণ করে। শূন্য মানে চ্যাপ্টা, তাই inverse নেই।',
      html: R`
${box('key', 'এক কথায়', R`<p>\(\det A\) বলে A <b>ক্ষেত্রফল</b> (2D) বা আয়তন (3D) কতগুণ করে। \(\det A = 0\) হলে মেশিন space-কে চ্যাপ্টা করে দেয়, ফেরত আনা যায় না, তাই <b>A-এর inverse নেই</b>।</p>`)}
<h2>2×2: এক লাইনে</h2>
$$\det\begin{bmatrix}a&b\\c&d\end{bmatrix} = ad - bc, \qquad \det\begin{bmatrix}3&1\\2&4\end{bmatrix} = 12 - 2 = 10$$
<p>অর্থাৎ এই মেশিন যেকোনো আকৃতির ক্ষেত্রফল 10 গুণ করে দেয়।</p>
<h2>3×3 বা বড়: cofactor expansion</h2>
<p>যে row বা column-এ <b>সবচেয়ে বেশি শূন্য</b>, সেটা বেছে নাও। প্রতিটা entry-র জন্য গুণ করো: entry × চিহ্ন × det(ওই entry-র row ও column মুছে যে ছোট matrix থাকে)। চিহ্নগুলো দাবার বোর্ডের মতো:</p>
$$\begin{bmatrix}+&-&+\\-&+&-\\+&-&+\end{bmatrix}$$
<h2>Row operation-এ det কীভাবে বদলায় (পরীক্ষায় খুব কমন)</h2>
<table class="simple-map">
<tr><th>Row operation</th><th>det-এর উপর প্রভাব</th></tr>
<tr><td>দুইটা row swap</td><td>চিহ্ন উল্টে যায় (× −1)</td></tr>
<tr><td>একটা row-কে k দিয়ে গুণ</td><td>det-ও k দিয়ে গুণ হয়</td></tr>
<tr><td>এক row-এর গুণিতক আরেক row-এ যোগ</td><td>কোনো পরিবর্তন নেই</td></tr>
</table>
<p>Triangular matrix-এর det = কর্ণের (diagonal) সংখ্যাগুলোর গুণফল। তাই দ্রুত পদ্ধতি: triangular বানাও, আর swap ও scaling-এর হিসাব রাখো।</p>
${box('good', 'ফ্রি নম্বরের নিয়ম', R`<p>\(\det(AB) = \det A \cdot \det B\), \(\det(A^T) = \det A\), \(\det(A^{-1}) = 1/\det A\), এবং \(n\times n\) matrix-এর জন্য \(\det(kA) = k^n \det A\)।</p>`)}
<h2>Cramer's rule: determinant দিয়ে \(Ax = b\) সমাধান</h2>
<p>\(x_i = \dfrac{\det A_i}{\det A}\), যেখানে \(A_i\) হলো A-এর column i-এর <b>জায়গায় b বসানো</b>।</p>
<p>উদাহরণ: \(A = \begin{bmatrix}3&1\\2&4\end{bmatrix}\), \(b = (5, 10)\), এবং \(\det A = 10\)।</p>
<p>\(x_1 = \det\begin{bmatrix}5&1\\10&4\end{bmatrix}/10 = 10/10 = 1\) এবং \(x_2 = \det\begin{bmatrix}3&5\\2&10\end{bmatrix}/10 = 20/10 = 2\)।</p>
<p>যাচাই: \(3(1) + 2 = 5\) ✓ এবং \(2(1) + 4(2) = 10\) ✓</p>`,
    },
    eigen: {
      title: 'Eigenvalues, eigenvectors, diagonalization', asg: 'Homework 4',
      line: 'বিশেষ কিছু দিক, যেগুলোকে মেশিন না ঘুরিয়ে শুধু লম্বা করে। λ হলো কতটা লম্বা করে।',
      html: R`
${box('key', 'এক কথায়', R`<p>বেশিরভাগ তীরকে মেশিন <b>ঘুরিয়ে</b> দেয়। <b>Eigenvector</b> \(v\) হলো বিশেষ একটা তীর, যেটা নিজের রেখাতেই থাকে আর শুধু লম্বা/খাটো হয়: \(Av = \lambda v\)। <b>Eigenvalue</b> \(\lambda\) হলো কতগুণ লম্বা হলো (ঋণাত্মক হলে উল্টে যায়)।</p>`)}
<h2>দৈনন্দিন উদাহরণ</h2>
<p>একটা রাবারের শিটকে পাশাপাশি টানো। আনুভূমিক তীরগুলো শুধু লম্বা হয় (eigenvector!)। উল্লম্ব তীরগুলো একই থাকে (এরাও eigenvector, \(\lambda = 1\))। কোনাকুনি তীরগুলো হেলে যায়, তাই ওগুলো eigenvector না।</p>
<h2>রেসিপি, ছোট উদাহরণসহ: \(A = \begin{bmatrix}2&1\\1&2\end{bmatrix}\)</h2>
<ol>
<li><b>Eigenvalue বের করো:</b> \(\det(A - \lambda I) = 0\) সমাধান করো।<br>
\((2-\lambda)^2 - 1 = 0 \Rightarrow 2 - \lambda = \pm 1 \Rightarrow \lambda = 1, 3\)।</li>
<li><b>Eigenvector বের করো:</b> প্রতিটা \(\lambda\)-এর জন্য \((A - \lambda I)v = 0\) সমাধান করো। এটা শুধু একটা Nul space সমস্যা, RREF আর free variable দিয়ে, যেটা তুমি পারো!<br>
\(\lambda = 3\): \(\begin{bmatrix}-1&1\\1&-1\end{bmatrix}\) থেকে \(v_1 = v_2\), তাই \(v = (1,1)\)।<br>
\(\lambda = 1\): \(\begin{bmatrix}1&1\\1&1\end{bmatrix}\) থেকে \(v_1 = -v_2\), তাই \(v = (1,-1)\)।</li>
<li><b>যাচাই:</b> \(A(1,1) = (3,3) = 3(1,1)\) ✓</li>
</ol>
${box('good', 'ফ্রি নিজে-যাচাই', R`<p><b>Eigenvalue-গুলোর যোগফল = trace</b> (কর্ণের যোগফল): \(1 + 3 = 2 + 2\) ✓</p><p><b>Eigenvalue-গুলোর গুণফল = det:</b> \(1 \cdot 3 = 4 - 1\) ✓</p><p><b>Triangular</b> matrix-এর eigenvalue হলো শুধু কর্ণের সংখ্যাগুলো।</p>`)}
<h2>Diagonalization: \(A = PDP^{-1}\)</h2>
<p>\(P\)-এর column হলো eigenvector-গুলো। \(D\) হলো diagonal, যেখানে eigenvalue-গুলো <b>একই ক্রমে</b> বসে।</p>
$$P = \begin{bmatrix}1&1\\1&-1\end{bmatrix},\quad D = \begin{bmatrix}3&0\\0&1\end{bmatrix}$$
<p>কেন করব? Power সহজ হয়ে যায়: \(A^{k} = PD^{k}P^{-1}\), আর \(D^k\) মানে কর্ণের প্রতিটা সংখ্যার power k নেওয়া।</p>
${box('warn', 'কখন diagonalize করা যায় না?', R`<p>\(n\times n\) matrix-এর জন্য \(n\) টা independent eigenvector লাগে।</p><ul><li>সব eigenvalue আলাদা ⇒ সবসময় diagonalizable ✓</li><li>Eigenvalue পুনরাবৃত্ত হলে: তার কয়টা eigenvector (কয়টা free variable) গুনো। সেটা পুনরাবৃত্তির সংখ্যার চেয়ে কম হলে matrix-টা diagonalizable <b>না</b>। উদাহরণ: \(\begin{bmatrix}1&1\\0&1\end{bmatrix}\)-এ \(\lambda = 1\) দুইবার, কিন্তু eigenvector মাত্র একটা।</li></ul>`)}
<p class="muted small">শব্দ: <b>AM</b> (algebraic multiplicity) হলো λ root হিসেবে কয়বার আসে। <b>GM</b> (geometric multiplicity) হলো তার কয়টা independent eigenvector। Diagonalizable ⇔ প্রতিটা λ-এর জন্য GM = AM।</p>`,
    },
    orth: {
      title: 'Orthogonality, projection, Gram–Schmidt', asg: 'Homework 4',
      line: 'লম্ব vector, ছায়া, আর হেলানো vector-গুলোকে সোজা করার পদ্ধতি।',
      html: R`
${box('key', 'এক কথায়', R`<p><b>Dot product</b> \(u\cdot v\) মাপে দুইটা তীর কতটা একই দিকে। \(u\cdot v = 0\) মানে তারা <b>লম্ব</b> (orthogonal)।</p>`)}
<h2>মূল বিষয়</h2>
<ul><li>Dot product: মিলে যাওয়া entry-গুলো গুণ করে যোগ করো। \((1,2)\cdot(3,4) = 3 + 8 = 11\)।</li>
<li>দৈর্ঘ্য: \(\|v\| = \sqrt{v\cdot v}\)। যেমন \(\|(3,4)\| = 5\)।</li>
<li>Unit vector: দৈর্ঘ্য দিয়ে ভাগ করো, \(v/\|v\|\), তাহলে দৈর্ঘ্য 1 হয়। একে "normalize করা" বলে।</li>
<li><b>Orthogonal set:</b> প্রতি জোড়ার dot product 0। <b>Orthonormal:</b> সাথে প্রতিটার দৈর্ঘ্যও 1।</li></ul>
<h2>Projection = ছায়া</h2>
<p>\(u\)-এর রেখার উপর সোজা উপর থেকে আলো ফেলো। \(y\)-এর ছায়া হলো</p>
$$\text{proj}_u\, y = \frac{y\cdot u}{u\cdot u}\, u$$
<p>উদাহরণ: \(y = (7,6)\) এবং \(u = (4,2)\)। তাহলে \(y\cdot u = 40\) এবং \(u\cdot u = 20\), তাই ছায়া \(2u = (8,4)\)।</p>
<p>বাকি অংশ \(z = y - \text{ছায়া} = (-1, 2)\), যা \(u\)-এর উপর লম্ব: \(z\cdot u = -4 + 4 = 0\) ✓। y থেকে রেখাটার <b>দূরত্ব</b> হলো \(\|z\| = \sqrt5\)।</p>
<h2>Gram–Schmidt = একটা একটা করে ছায়া বাদ দাও</h2>
<p>হেলানো একটা basis-কে লম্ব basis বানায়, যেটা একই space span করে।</p>
<p>উদাহরণ: \(x_1 = (1,1,0)\) এবং \(x_2 = (1,0,1)\)।</p>
<ol><li>\(v_1 = x_1 = (1,1,0)\)</li>
<li>\(v_2 = x_2 - \dfrac{x_2\cdot v_1}{v_1\cdot v_1}v_1 = (1,0,1) - \tfrac12(1,1,0) = (\tfrac12, -\tfrac12, 1)\)। ভগ্নাংশ এড়াতে 2 দিয়ে গুণ করো: \((1,-1,2)\)।</li>
<li>যাচাই: \((1,1,0)\cdot(1,-1,2) = 1 - 1 + 0 = 0\) ✓</li></ol>
<p>তৃতীয় vector থাকলে \(v_1\) আর \(v_2\) <b>দুইটার উপরের</b> ছায়াই বাদ দাও। Orthonormal basis চাইলে শেষে প্রতিটা \(v\)-কে তার দৈর্ঘ্য দিয়ে ভাগ করো।</p>
${box('good', 'Orthogonal matrix Q (column-গুলো orthonormal)', R`<p>\(Q^TQ = I\), তাই \(Q^{-1} = Q^T\): inverse ফ্রি, শুধু transpose করো! Q দৈর্ঘ্য আর কোণ ঠিক রাখে (শুধু ঘোরায় বা উল্টায়)।</p>`)}
${box('recipe', 'Orthogonal basis-এ coordinates: row reduction লাগে না', R`<p>\(c_i = \dfrac{y\cdot u_i}{u_i\cdot u_i}\)। প্রতিটা coefficient শুধু একটা "ছায়ার পরিমাণ"।</p>`)}`,
    },
    symm: {
      title: 'Symmetric matrices ও quadratic forms', asg: 'Homework 5',
      line: 'আয়নার প্রতিবিম্বের মতো matrix; সূত্রটা বাটি, গম্বুজ, নাকি saddle?',
      html: R`
${box('key', 'এক কথায়', R`<p><b>Symmetric</b> matrix কর্ণ বরাবর নিজের আয়নার প্রতিবিম্ব (\(A = A^T\))। এর বিশেষ ক্ষমতা: eigenvalue-গুলো real আর eigenvector-গুলো <b>পরস্পর লম্ব</b>। তাই \(A = PDP^T\), যেখানে \(P\) orthogonal।</p>`)}
<h2>Orthogonal diagonalization-এর রেসিপি</h2>
<ol><li>Topic 7-এর মতোই eigenvalue আর eigenvector বের করো।</li>
<li>আলাদা λ-এর eigenvector-গুলো আপনাআপনি লম্ব হয় (dot product দিয়ে যাচাই করো)।</li>
<li>প্রতিটাকে <b>normalize</b> করো (দৈর্ঘ্য দিয়ে ভাগ), এগুলোই P-এর column।</li>
<li>তাহলে \(A = PDP^T\)। কোনো inverse লাগে না, কারণ \(P^{-1} = P^T\)।</li></ol>
<p class="muted small">কোনো λ পুনরাবৃত্ত হলে, তার eigenvector-গুলোকে লম্ব বানাতে Gram–Schmidt ব্যবহার করো।</p>
<h2>Quadratic form: শুধু বর্গ আর cross term-ওয়ালা সূত্র</h2>
<p>\(Q(x) = x^TAx\)। যেমন \(5x_1^2 + 4x_1x_2 + 2x_2^2\)।</p>
${box('recipe', 'সূত্র → matrix (পরীক্ষার ১ নম্বর ধাপ)', R`<ul><li><b>বর্গ পদগুলো</b> কর্ণে বসে: \(5\) এবং \(2\)।</li><li><b>Cross term</b>-এর coefficient <b>অর্ধেক করে</b> দুইটা off-diagonal জায়গায় বসাও: \(4 \to 2\) এবং \(2\)।</li></ul>
$$5x_1^2 + 4x_1x_2 + 2x_2^2 \;\Rightarrow\; A = \begin{bmatrix}5&2\\2&2\end{bmatrix}$$`)}
<h2>শ্রেণিবিভাগ: বাটি, গম্বুজ, নাকি saddle? Eigenvalue দেখো</h2>
<table class="simple-map">
<tr><th>Eigenvalue</th><th>নাম</th><th>আকৃতি</th></tr>
<tr><td>সব \(> 0\)</td><td>positive definite</td><td>বাটি 🥣: সবসময় ধনাত্মক (0 ছাড়া)</td></tr>
<tr><td>সব \(< 0\)</td><td>negative definite</td><td>গম্বুজ ⛰️: সবসময় ঋণাত্মক</td></tr>
<tr><td>কিছু +, কিছু −</td><td>indefinite</td><td>saddle 🐴 (ঘোড়ার জিন)</td></tr>
<tr><td>\(\ge 0\) এবং একটা 0</td><td>positive semidefinite</td><td>সমতল উপত্যকাওয়ালা বাটি</td></tr>
</table>
<p>উদাহরণ: \(A = \begin{bmatrix}5&2\\2&2\end{bmatrix}\)-এর trace 7 আর det 6, তাই \(\lambda = 1, 6\) (যোগফল 7, গুণফল 6)। দুটোই ধনাত্মক, তাই এটা <b>positive definite</b>।</p>
<h2>Change of variable \(x = Py\): cross term উধাও</h2>
<p>Normalize করা eigenvector দিয়ে P বানালে \(Q = \lambda_1 y_1^2 + \lambda_2 y_2^2\)। এখানে \(Q = 1\,y_1^2 + 6\,y_2^2\) (ক্রম P-এর column-এর সাথে মিলতে হবে)।</p>
${box('good', 'শর্তসাপেক্ষ max/min (\\(\\|x\\| = 1\\) হলে)', R`<p>\(x^TAx\)-এর <b>max</b> হলো <b>সবচেয়ে বড় eigenvalue</b>, তার unit eigenvector-এ পাওয়া যায়। <b>Min</b> হলো <b>সবচেয়ে ছোট eigenvalue</b>, তার unit eigenvector-এ। উদাহরণে max = 6, min = 1।</p>`)}`,
    },
    svd: {
      title: 'SVD, pseudoinverse, left/right inverse', asg: 'Homework 5',
      line: 'যেকোনো matrix = ঘোরাও → টানো → ঘোরাও। আয়তাকার matrix-এও কাজ করে।',
      html: R`
${box('key', 'এক কথায়', R`<p>প্রতিটা matrix, বর্গাকার না হলেও, লেখা যায় \(A = U\Sigma V^T\): <b>ঘোরাও</b> (\(V^T\)), তারপর অক্ষ বরাবর <b>টানো</b> (\(\Sigma\)), তারপর আবার <b>ঘোরাও</b> (\(U\))। টানার পরিমাণগুলো \(\sigma_1 \ge \sigma_2 \ge \dots \ge 0\) হলো <b>singular values</b>।</p>`)}
<h2>রেসিপি (এই ৫টা ধাপ মুখস্থ করো)</h2>
<ol><li>\(A^TA\) হিসাব করো। এটা symmetric, তাই topic 9 খাটে।</li>
<li>এর eigenvalue বের করে বড় → ছোট সাজাও। তারপর \(\sigma_i = \sqrt{\lambda_i}\)।</li>
<li>\(A^TA\)-এর <b>unit</b> eigenvector বের করো। এগুলোই \(V\)-এর column।</li>
<li>প্রতিটা \(\sigma_i \ne 0\)-এর জন্য: \(u_i = \dfrac{1}{\sigma_i}Av_i\)। এগুলোই \(U\)-এর column।</li>
<li>\(U\)-তে আরও column লাগলে, আগেরগুলোর সাথে লম্ব unit vector যোগ করো।</li></ol>
<p>\(\Sigma\)-এর <b>আকার A-এর সমান</b>, কর্ণে σ-গুলো আর বাকি সব শূন্য।</p>
<h2>উদাহরণ: \(A = \begin{bmatrix}3&0\\4&5\end{bmatrix}\)</h2>
<ol><li>\(A^TA = \begin{bmatrix}25&20\\20&25\end{bmatrix}\)</li>
<li>Trace 50 আর det 225, তাই \(\lambda = 45, 5\)। ফলে \(\sigma_1 = \sqrt{45} = 3\sqrt5\) এবং \(\sigma_2 = \sqrt5\)।</li>
<li>\(v_1 = \tfrac{1}{\sqrt2}(1,1)\) এবং \(v_2 = \tfrac{1}{\sqrt2}(1,-1)\)</li>
<li>\(u_1 = \frac{1}{3\sqrt5}A v_1 = \frac{1}{\sqrt{10}}(1,3)\) এবং \(u_2 = \frac{1}{\sqrt5}Av_2 = \frac{1}{\sqrt{10}}(3,-1)\)। যাচাই: \(u_1\cdot u_2 = 3 - 3 = 0\) ✓</li></ol>
${box('good', 'SVD থেকে সাথে সাথে যা জানা যায়', R`<ul><li><b>Rank</b> = শূন্য নয় এমন σ-এর সংখ্যা।</li><li>মেশিনের সবচেয়ে বড় টান হলো \(\sigma_1\)।</li><li>U-এর প্রথম r টা column হলো Col A-এর basis।</li></ul>`)}
<h2>Pseudoinverse \(A^+\): "সম্ভাব্য সেরা inverse"</h2>
<p>\(A^+ = V\Sigma^+U^T\)। \(\Sigma^+\) বানাতে প্রতিটা শূন্য-নয় σ-কে \(1/\sigma\) করো, তারপর আকারটা transpose করো। \(Ax = b\)-এর সঠিক সমাধান না থাকলেও \(x = A^+b\) সবচেয়ে ভালো (least-squares) উত্তর দেয়।</p>
${box('recipe', 'Left বনাম right inverse', R`<ul><li><b>লম্বা</b> matrix (column-এর চেয়ে row বেশি), যার column-গুলো independent, তার <b>left inverse</b> আছে: \(L = (A^TA)^{-1}A^T\), তাই \(LA = I\)।</li><li><b>চওড়া</b> matrix (row-এর চেয়ে column বেশি), যার row-গুলো independent, তার <b>right inverse</b> আছে: \(R = A^T(AA^T)^{-1}\), তাই \(AR = I\)।</li><li>মনে রাখার কৌশল: ছোট বর্গাকার matrix \(A^TA\) বা \(AA^T\)-টাকেই inverse করো।</li></ul>`)}`,
    },
  };
})();
