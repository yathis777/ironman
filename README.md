# Calculator — CI/CD with GitHub Actions & GitHub Pages

A simple, responsive **vanilla-JavaScript calculator** with a complete **CI/CD pipeline**.
Every push runs automated tests; only tested code on `main` is deployed live to **GitHub Pages**.

This project is a hands-on **DevOps training exercise** covering Git, GitHub, GitHub Actions,
continuous integration, unit testing, build artifacts, and continuous deployment.

---

## 1. Project Overview

The app is a calculator that supports:

- Addition, subtraction, multiplication, division
- Decimal numbers and negative results
- **Clear (AC)** and **Delete (DEL / Backspace)**
- **Equals (=)**
- Full **keyboard support**
- **Division-by-zero** error handling
- A clean, **responsive** design for desktop and mobile

The calculation logic lives in small, pure functions (`add`, `subtract`, `multiply`, `divide`) so
it can be **unit tested independently** of the user interface.

---

## 2. Architecture

```
Developer
   |
   | git push
   v
GitHub Repository
   |
   v
GitHub Actions
   |
   +--> Checkout
   |
   +--> Install Dependencies
   |
   +--> Unit Tests
   |
   +--> Build/Validate
   |
   +--> Deploy
   |
   v
GitHub Pages
   |
   v
Live Calculator
```

---

## 3. Project Structure

```
calculator/
├── index.html                     # Markup + button layout
├── style.css                      # Responsive styling
├── calculator.js                  # Pure math functions + UI logic
├── package.json                   # Scripts + Jest dev dependency
├── README.md                      # This file
├── .gitignore                     # Ignore node_modules, coverage, etc.
├── tests/
│   └── calculator.test.js         # Jest unit tests
└── .github/
    └── workflows/
        └── deploy.yml             # CI (tests) + CD (GitHub Pages)
```

---

## 4. Local Setup

You need **Node.js 18+** (Node 20 recommended) and **Git** installed.

```bash
git clone <your-repo-url>
cd calculator
npm install
npm test
```

### Open the application locally

The app is plain HTML/CSS/JS — no build step is required. Either:

- **Double-click** `index.html`, or
- Serve it with any static server, for example:

```bash
npx serve .
# then open the printed http://localhost:3000 URL
```

---

## 5. Git Workflow

```bash
git add .
git commit -m "Add calculator application"
git push origin main
```

Pushing to `main` triggers the pipeline: tests run first, and if they pass, the site is deployed.

---

## 6. CI/CD Explanation

**What is CI (Continuous Integration)?**
Automatically building and testing every code change as soon as it is pushed or proposed in a pull
request, so problems are caught early.

**What is CD (Continuous Deployment)?**
Automatically releasing code that passes all checks. Here, tested code on `main` is deployed to
GitHub Pages with no manual step.

**What does `actions/checkout` do?**
Clones your repository onto the runner so the workflow can access your files.

**Why do we use `actions/setup-node`?**
It installs a specific Node.js version (and caches npm downloads) so tests run in a consistent
environment.

**Why do we run unit tests?**
To prove the calculator logic is correct before shipping. If a test fails, deployment is blocked.

**What is a GitHub Actions runner?**
A fresh virtual machine (here `ubuntu-latest`) that GitHub provisions to execute your workflow
steps.

**What is an artifact?**
A packaged output produced by a job. The Pages workflow uploads the site as a **Pages artifact**,
which the deploy step then publishes.

**What does `needs: test` do?**
It makes the `deploy` job wait for the `test` job and run **only if tests pass**:

```
Tests PASS  ->  Deployment allowed
Tests FAIL  ->  Deployment blocked
```

**How does GitHub Pages deployment work?**
`configure-pages` prepares Pages, `upload-pages-artifact` packages the site, and `deploy-pages`
publishes it to the `github-pages` environment. The live URL is
`https://<your-username>.github.io/<your-repo>/`.

---

## 7. Pull Request Flow

Pull requests run CI but **do not deploy**.

```
Feature Branch
      ↓
Pull Request
      ↓
GitHub Actions
      ↓
Unit Tests
      ↓
PASS / FAIL
      ↓
Merge to main
```

---

## 8. Deployment Flow

Pushes to `main` run CI and then deploy.

```
main
 ↓
CI
 ↓
Tests
 ↓
Artifact
 ↓
GitHub Pages
 ↓
Live Website
```

---

## 9. Create the Repository & Push to GitHub

### Option A — with the GitHub CLI (`gh`)

```bash
cd calculator
git init
git add .
git commit -m "Add calculator application with CI/CD"
gh repo create calculator --public --source=. --remote=origin --push
```

### Option B — manually

1. Create a new **empty** repository named `calculator` on GitHub (no README).
2. Then run:

```bash
cd calculator
git init
git branch -M main
git add .
git commit -m "Add calculator application with CI/CD"
git remote add origin https://github.com/<your-username>/calculator.git
git push -u origin main
```

> Replace `<your-username>` with your GitHub username. Nothing is hard-coded in the workflow.

---

## 10. GitHub Pages Configuration Steps

1. Push the project to GitHub (see above).
2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Go to the **Actions** tab and watch the `CI/CD to GitHub Pages` workflow run.
5. When the `deploy` job finishes, open the URL it prints (also shown under **Settings → Pages**):

```
https://<your-username>.github.io/<your-repo>/
```

The first deployment can take a minute or two to become available.

---

## 11. How the CI/CD Pipeline Works

The workflow in `.github/workflows/deploy.yml` has two jobs:

| Job | Trigger | Steps |
|-----|---------|-------|
| `test` | pull requests **and** pushes to `main` | checkout → setup Node → `npm ci` → `npm test` |
| `deploy` | **only** pushes to `main` (`needs: test`) | checkout → configure Pages → upload artifact → deploy |

- On a **pull request**, only `test` runs — the code is validated but nothing is published.
- On a **push to `main`**, `test` runs, and if it passes, `deploy` publishes the site.
- The `deploy` job uses the `github-pages` environment and the least-privilege permissions
  (`contents: read`, `pages: write`, `id-token: write`).

---

## 12. Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Deploy step fails: *"Pages site not found"* / *"Get Pages site failed"* | Pages source not set to Actions | **Settings → Pages → Source → GitHub Actions** |
| Workflow runs tests but never deploys | You're on a pull request or a non-`main` branch | Deployment only runs on push to `main` |
| `npm ci` fails: *lockfile not found* | No `package-lock.json` committed | Run `npm install` locally and commit the generated `package-lock.json` |
| Tests fail in CI but pass locally | Different Node version | Use Node 18+ locally (CI uses Node 20) |
| 404 at the Pages URL | First deploy still propagating, or wrong URL | Wait 1–2 min; confirm the URL under **Settings → Pages** |
| Deploy fails: *"Resource not accessible"* | Missing permissions | Keep the `permissions` block (`pages: write`, `id-token: write`) |
| Site loads but is blank | `index.html` not at the uploaded path | Ensure `index.html` is in the repo root (artifact `path: "."`) |
| CSS/JS not loading on Pages | Wrong asset paths | Use relative paths (`style.css`, `calculator.js`) — already done here |

---

## License

MIT — free to use for learning and training.
