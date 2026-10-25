# Remindr landing site: plan

## Tech
- Plain `index.html`, `styles.css`, `script.js` (under ~40 lines, no deps). No build step. GitHub Pages from repo root (`main`, `/`). Add empty `.nojekyll`.
- Font: Google Fonts "Inter" 400/600 with `display=swap`; fallback `"Segoe UI Variable", "Segoe UI", system-ui, sans-serif`.
- All paths relative (`assets/screenshots/...`, `styles.css`), never leading `/`.
- Favicon: inline SVG data URI (rounded square, `--accent` to `--blob-2` gradient, white bell/check). `<link rel="icon" type="image/svg+xml">`.
- OG/Twitter meta: title, description, `og:image` = `assets/screenshots/month-light.png` (1280x800), `twitter:card=summary_large_image`. Note: crawlers need an absolute og:image URL, so fill it in once the Pages URL is known.

## Design tokens (from Tokens.xaml, Glass.*.xaml, BlobBackdrop.cs)
```
:root { --radius-panel:20px; --radius-small:12px;
  --space-4..32: 4/8/12/16/24/32px; --gutter:16px (PagePaddingCompact), 32px at >=768px;
  --accent:#3B82F6; --blob-1:#3B82F6; --blob-2:#8B5CF6; --blob-3:#EC4899; --blob-4:#10B981;
  --important:#D13438; --cat-work:#F59E0B; --blob-opacity:.35; }
light: --bg:#F3F3F3; --surface:rgba(255,255,255,.72) (#B8FFFFFF); --surface-hi:rgba(255,255,255,.18);
  --stroke-a:rgba(255,255,255,.70); --stroke-b:rgba(255,255,255,.10); --pill:rgba(255,255,255,.60);
  --text-backing:rgba(255,255,255,.80); --text:#1A1A1A; --text-2:#5C5C5C;
dark:  --bg:#1F1F21; --surface:rgba(28,28,30,.65) (#A61C1C1E); --surface-hi:rgba(255,255,255,.18);
  --stroke-a:rgba(255,255,255,.35); --stroke-b:rgba(255,255,255,.05); --pill:rgba(255,255,255,.15);
  --text-backing:rgba(28,28,30,.70); --text:#FFFFFF; --text-2:#C5C5C5;
```
- Theme: `@media (prefers-color-scheme: dark)` sets dark vars on `:root:not([data-theme=light])`; `[data-theme=dark]` forces dark. Toggle button (System/Light/Dark cycle) in header; script stores choice in `localStorage`, applies it via inline `<head>` snippet to avoid flash.
- Glass card: `background: linear-gradient(to bottom, var(--surface-hi), transparent 33%), var(--surface)`, 1px border via `border-image`-free trick (padding-box/border-box double background with stroke-a to stroke-b, 135deg), `backdrop-filter: blur(24px)`, radius 20. Buttons/pills radius 12.
- Backdrop: 4 fixed, blurred radial blobs (blob-1..4, opacity .35) slowly drifting via CSS keyframes; `prefers-reduced-motion: reduce` disables drift and smooth scroll.

## Slice 1 (the whole page)
Goal: complete, responsive, accessible single page. Files: `index.html`, `styles.css`, `script.js`, `.nojekyll`.
Sections (each a `<section id>` with glass cards, anchor nav in header):
1. Hero: `hero.svg` (alt "Remindr: calm, private reminders for you and your family"), pitch from README intro, big Download button to `https://github.com/Randomstufteam/Remindr/releases/latest/download/Remindr-Installer.exe`, meta line "v0.3.1 · Windows 10 (2004+) and 11 · ~94 MB", small "What's new in 0.3.1: faster start-up, lower memory".
2. Features: grid of README "What it does" items (profiles+PIN, Month/Week/Agenda, 120 pictures, Important badge, welcome, 32 languages + RTL, Light/Dark/System glass, updates verified with SHA-256, report a bug). No emoji; small SVG or color dot icons.
3. Gallery: 4 `<figure>`s with captions, README alt text, `width`/`height` set, `loading="lazy"` (except first). 1 column <768px, 2 columns above. Click opens full image (plain link to file).
4. Install: ordered steps; warning callout for SmartScreen ("Windows protected your PC" -> More info -> Run anyway, with why: not code-signed yet); verify block with `Get-FileHash .\Remindr-Installer.exe -Algorithm SHA256` vs `Remindr-Installer.exe.sha256` on releases/latest; Copy button (script, Clipboard API, falls back silently). Per-user, no admin; uninstall keeps data.
5. Privacy: local `%AppData%\Remindr`, no account/cloud/tracking, only optional update check, PINs PBKDF2 (privacy screen, not strong security).
6. System requirements: Windows 10 2004+ / 11, x64, ~94 MB download, no .NET install needed (self-contained).
7. Coming next: notifications (with snooze), tray icon, start with Windows, recurring reminders, search, offline AI assistant.
8. Footer: GitHub repo, Issues, MIT License (`/blob/main/LICENSE`), Fluent UI Emoji credit.
Rules: 375px works with 16px gutters, `max-width:100%` on images, `overflow-wrap:anywhere` on code, `pre` scrolls internally; visible focus ring (2px accent, offset 3px); skip link; one `h1`; contrast >= 4.5:1 (use `--text-backing` behind text over blobs).

## How to test
- Open `index.html` directly from disk: all images, CSS, JS load (proves relative paths).
- DevTools 375px: no horizontal scroll (`document.documentElement.scrollWidth === 375`), gutters 16px.
- Toggle theme: System/Light/Dark each correct; reload keeps choice; OS dark mode honored when System.
- Emulate `prefers-reduced-motion: reduce`: blobs static.
- Keyboard: Tab through skip link, nav, Download, Copy, footer; focus always visible.
- Lighthouse: Accessibility and Best Practices >= 95, no console errors.
- Download link starts the installer download; footer links resolve.
- After push: Pages URL renders; check OG preview with a link-preview tool.

## Risks / early decisions
- og:image needs an absolute URL: decide repo name (`remindr-site` vs `<user>.github.io`) or a custom domain first.
- `backdrop-filter` cost on low-end machines: keep blob count at 4, blur fixed elements only.
- "~94 MB" and version are hardcoded; update per release (or accept drift).
- Google Fonts is a third-party request; drop it for a stricter privacy story (system fonts look fine on Windows).
