#!/usr/bin/env bash
# One-time setup for kairvilighting.com on an Ubuntu VPS with nginx.
# Run as root (or with sudo) from the repo root on the VPS, or copy this folder over:
#   sudo DEPLOY_USER=deploy EMAIL=you@example.com bash deploy/setup-vps.sh
# Point the DNS A records for kairvilighting.com and www.kairvilighting.com at this
# server BEFORE running, so Let's Encrypt can issue the certificate.
set -euo pipefail

DOMAIN="kairvilighting.com"
WEBROOT="/var/www/kairvilighting/html"
DEPLOY_USER="${DEPLOY_USER:-${SUDO_USER:-root}}"
EMAIL="${EMAIL:-info@kairvilighting.com}"
HERE="$(cd "$(dirname "$0")" && pwd)"

echo "==> Packages"
command -v nginx >/dev/null || { apt-get update -y && apt-get install -y nginx; }
command -v certbot >/dev/null || { apt-get update -y && apt-get install -y certbot python3-certbot-nginx; }
command -v rsync >/dev/null || apt-get install -y rsync

echo "==> Web root ($WEBROOT, owned by $DEPLOY_USER)"
mkdir -p "$WEBROOT"
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$(dirname "$WEBROOT")"
[ -f "$WEBROOT/index.html" ] || echo '<!doctype html><title>Kairvi Lighting</title><p>Deploying…</p>' > "$WEBROOT/index.html"

echo "==> nginx site"
cp "$HERE/nginx-kairvilighting.com.conf" "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t
systemctl reload nginx

echo "==> Firewall (if ufw is active)"
if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then ufw allow 'Nginx Full'; fi

echo "==> SSL (Let's Encrypt)"
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --redirect --agree-tos -m "$EMAIL" --non-interactive
systemctl reload nginx

echo "Done. https://$DOMAIN is served from $WEBROOT — GitHub Actions deploys into it on every push to main."
