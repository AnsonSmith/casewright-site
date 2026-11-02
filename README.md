# casewright.ai landing page

Static site for GitHub Pages. No build step: `index.html`, `privacy.html`, `404.html` and
`assets/` are served as-is. HTTPS comes from GitHub Pages, which requests and renews a
Let's Encrypt certificate for `casewright.ai` automatically once DNS is correct.

```
index.html        landing page (exported from the design canvas)
privacy.html      privacy notice for the signup form  (fill in [DATE] and [CONTACT EMAIL])
404.html          not-found page
assets/site.css   page basics, focus styles, skip link
assets/site.js    signup form: validation + submit to Formspree
assets/favicon.svg
CNAME             tells GitHub Pages the custom domain (casewright.ai)
.nojekyll         serve files as-is, no Jekyll processing
robots.txt, sitemap.xml
```

## 1. Connect the signup form (5 minutes)

GitHub Pages can't store form submissions, so the form posts to [Formspree](https://formspree.io).

1. Create a Formspree account and a new form; set the notification email to your inbox.
2. Copy the form ID (the part after `/f/` in its endpoint).
3. In `index.html`, replace `YOUR_FORM_ID` in `<form id="signup-form" action="https://formspree.io/f/YOUR_FORM_ID">`.
4. In Formspree's form settings, restrict submissions to the `casewright.ai` domain.

Until step 3 is done, the form validates input but tells visitors signups aren't connected yet.
To use a different provider, change the form `action` and the `connect-src` / `form-action`
entries in the Content-Security-Policy `<meta>` tag at the top of `index.html`.

## 2. Create the repository

```bash
cd casewright-site
git init -b main
git add .
git commit -m "Casewright landing page"
gh repo create casewright-site --public --source=. --push   # or create it on github.com and push
```

GitHub Pages on a free account needs a **public** repository. The site contains nothing
private, but if you'd rather keep the repo private you need GitHub Pro.

## 3. Verify the domain with GitHub (prevents domain takeover)

GitHub profile → **Settings → Pages → Add a domain** → `casewright.ai`. GitHub shows a TXT
record (`_github-pages-challenge-<username>.casewright.ai`). Add it at your DNS host, then
click **Verify**. Do this before step 5.

## 4. DNS records at your registrar

Remove any parking-page or forwarding records on `@` and `www` first; leftover records can
block the certificate.

| Type  | Host | Value |
|-------|------|-------|
| A     | @    | 185.199.108.153 |
| A     | @    | 185.199.109.153 |
| A     | @    | 185.199.110.153 |
| A     | @    | 185.199.111.153 |
| AAAA  | @    | 2606:50c0:8000::153 |
| AAAA  | @    | 2606:50c0:8001::153 |
| AAAA  | @    | 2606:50c0:8002::153 |
| AAAA  | @    | 2606:50c0:8003::153 |
| CNAME | www  | `<your-github-username>.github.io` (no repository name) |

If the registrar has CAA records on the domain, include one allowing `letsencrypt.org`
(or remove CAA records entirely).

Check propagation: `dig +short casewright.ai A` and `dig +short www.casewright.ai CNAME`.

## 5. Turn on Pages and HTTPS

Repository → **Settings → Pages**

1. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
2. Custom domain: `casewright.ai` (already filled from the `CNAME` file). Save.
3. Wait for the DNS check to pass and the certificate to be issued (minutes to about an hour).
   If it stalls, remove the custom domain, save, re-enter it and save again.
4. Tick **Enforce HTTPS**.

`www.casewright.ai` then redirects to `https://casewright.ai` automatically.

## 6. Before you announce it

- [ ] `YOUR_FORM_ID` replaced and a test submission received
- [ ] `[NUMBER]` (pilot spots) and `Anson [LAST NAME]` filled in `index.html`
- [ ] `[DATE]` and `[CONTACT EMAIL]` filled in `privacy.html`
- [ ] Trademark search on "Casewright" (USPTO classes 9 and 42)
- [ ] Security claims in the page match what the service actually does at launch

## Updating the page

The design source lives in the Casewright design canvas. After changing it there, re-export
with the converter script, or edit `index.html` directly and push; GitHub Pages redeploys
in about a minute.
