# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## cPanel CI/CD (GitHub Actions)

This repo includes `.github/workflows/deploy-cpanel.yml` to automate build + deploy to cPanel over FTP.

### What it does

- Runs on push to `main` (and manual trigger)
- Installs dependencies, builds with `npm run build`
- Prepares a deploy folder with:
  - `dist/*`
  - `public/.htaccess`
  - `public/api/*`
  - `public/jobs.php`, `public/jobs.json`, `public/events.json`, `public/resources.json`
- Uploads to your cPanel target directory via FTP

### Required GitHub repository secrets

Add these in GitHub: `Settings -> Secrets and variables -> Actions`

- `CPANEL_FTP_SERVER` (example: `ftp.yourdomain.com`)
- `CPANEL_FTP_USERNAME`
- `CPANEL_FTP_PASSWORD`
- `CPANEL_FTP_TARGET_DIR` (example: `/public_html/`)

Template values are in `.github/workflows/deploy-cpanel.yml.example-secrets`.

### Important note about `.env`

CI/CD does not upload your server `.env` for security. Keep it manually on cPanel at:

- `/home/<cpanel_user>/.env`

The backend config loader now checks common cPanel locations automatically.
