# CSE 903 Mid-1 — Interactive Exam Prep

## Run (progress saved to `progress.json`)
```bash
cd LinAlg-Exam-Prep
node server.js
# open http://localhost:3000
```
No `npm install` needed. You can also just open `index.html` in a browser; progress is then kept in the browser (export/import it from the "Progress file" page).

## What's inside
| Section | What it does |
|---|---|
| Topics (10) | Exam-focused notes: definitions, recipes for full marks, traps |
| Solved assignments | Every question from the 6 PDFs in `MID 1/`, fully worked, with verification |
| Step-by-step solvers | 22 tools (RREF, inverse, block multiply, PA=LU, Col/Nul, change of basis, det, Cramer, eigen, Gram–Schmidt, projection, quadratic forms, SVD, left/right inverse, transformation visualiser…) |
| Concept quiz | 88 True/False + MCQ questions with justifications |
| Random problems | Unlimited fresh problems, exact answer checking, worked solutions |
| Flashcards, mistakes review, formula sheet | Last-minute revision |

## Files
- `index.html` – page shell
- `css/style.css` – styles (light/dark)
- `js/fraction.js`, `js/linalg.js` – exact-fraction linear-algebra engine that records steps
- `js/ui.js` – renders engine results as exam-style write-ups
- `js/topics.js`, `js/solutions.js`, `js/quiz-bank.js` – content
- `js/tools.js`, `js/practice.js` – interactive solvers & problem generator
- `js/progress.js`, `server.js` – progress saving (`progress.json`)
- `js/app.js` – router and pages
