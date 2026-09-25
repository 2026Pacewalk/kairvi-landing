# Kairvi Lighting — Landing Page (React + Vite)

## Run
npm install
npm run dev            # local dev at http://localhost:5173

## Build
npm run build          # dist/  -> upload to Netlify / Vercel / Hostinger / cPanel
npm run build:single   # dist-single/index.html -> one self-contained file

## Edit content
src/data.js   — brand/contact details, hero slides, 12 collections & specs, finishes, services
src/App.jsx   — sections (Nav, Hero, Marquee, About, Collections, Strip, Finishes, Services, Contact, Footer)
src/index.css — design tokens at top (:root) — colours, fonts, spacing
src/assets/img — product photography cropped from the 2024–25 catalogue (.webp)

Enquiry form + "Enquire" buttons + floating button open WhatsApp (+91 98146 22737) with a pre-filled message.

## Deploy — kairvilighting.com (VPS)
Static build served by nginx; GitHub Actions (`.github/workflows/deploy-vps.yml`) builds and rsyncs `dist/` to the VPS on every push to `main`.

1. DNS: `A` records for `kairvilighting.com` and `www` → VPS IP (keep existing MX records for email).
2. On the VPS (once): `sudo DEPLOY_USER=<ssh-user> bash deploy/setup-vps.sh` — nginx site + Let's Encrypt SSL, web root `/var/www/kairvilighting/html`.
3. GitHub → Settings → Secrets → Actions: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (private key), optional `VPS_PORT` (22), `VPS_PATH`.
4. Push to `main` or run the workflow manually (Actions → Deploy to VPS → Run workflow).
