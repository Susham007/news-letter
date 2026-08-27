# NTER Chronicle

The public Chronicle newsletter for **nter.pro**, designed as an editorial microsite and deployed through the existing Cloudflare Worker `aged-waterfall-14da`.

## Structure

- `public/index.html` — current newsletter edition
- `public/assets/style.css` — editorial UI system
- `public/assets/app.js` — navigation, charts, waitlist, coupon generation and Google Form recording
- `public/assets/map-data.js` — map geometry/data
- `public/assets/*.{webp,png}` — banner, logo and article photography
- `wrangler.jsonc` — Cloudflare Worker/static assets config

## Publishing each new edition

1. Replace/update `public/index.html` and any article assets.
2. Commit the changes.
3. Push to `main`.
4. Once Cloudflare Builds is connected to this GitHub repo, each push to `main` can automatically run `npm run deploy`.

## Waitlist / Google Form

The on-site waitlist remains fully branded. On submission it generates a deterministic `NTER-30-...` coupon and mirrors **Name, Email ID, Contact, What brings you here, and Coupon Code** into the configured Google Form using a hidden form POST.
