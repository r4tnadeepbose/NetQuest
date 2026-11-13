# NetQuest — Cyber & Networking Mastery

NetQuest is a local-first, data-driven learning app (React + TypeScript + Vite + Tailwind) for networking and cybersecurity mastery: curriculum, flashcards with SRS/ML personalization, daily learning, MCQ arena, challenges/labs, Red/Blue tracks, tools/capstones, and an interactive Visual Lab/Visualizer. All progress is stored in the browser (localStorage).

## Local development

```bash
npm install
npm run dev
```

Or use the one-stop runner:

```bash
python run.py
```

## Build

```bash
npm run build
npm run preview
```

## Publish to GitHub Pages (auto-deploy from `main`)

This repo is preconfigured to build and host itself on GitHub Pages via GitHub Actions.

1. **Push this repository to GitHub** (branch: `main`) with the workflow at `.github/workflows/deploy.yml`.
2. In your GitHub repo go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
   - The included workflow builds with Vite and deploys the `dist` artifact to GitHub Pages on every push to `main` (and `master`) or manual run.
4. Save. After the **Deploy to GitHub Pages** action completes, the site will be live at:
   - `https://r4tnadeepbose.github.io/NetQuest/`

### Notes
- SPA routing uses `HashRouter` and a relative Vite `base: './'`, so routes work correctly on project Pages (`/#/...`, `/#/visualizer?sim=...`) and refresh/direct links are resilient.
- `public/404.html` provides a fallback redirect; `public/.nojekyll` disables Jekyll processing.
- No server or secrets are required; persistence is client-side (`netquest_progress_v1`, `netquest_mcq_stats_v1`, `netquest_prefs_v1`).
- If Pages was previously set to **Deploy from a branch** (Jekyll), switching **Source** to **GitHub Actions** is required for this Vite app to deploy correctly.

## Safety
Practical/attack content is for **authorized, isolated lab environments only**. `sidenav.html` is preserved.
