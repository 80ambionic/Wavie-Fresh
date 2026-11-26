# Wavie Fresh

Graphical WAV sample browser & organizer — a 2D similarity map of your samples with audition, tagging, BPM/key editing and organized export.

It runs three ways from the same code (`dist/index.html`):

| Version | How to get it |
|---|---|
| **Web** | Hosted on GitHub Pages: `https://80ambionic.github.io/Wavie-Fresh/` |
| **macOS** | `.dmg` installer (Apple Silicon and Intel) |
| **Windows** | `-setup.exe` or `.msi` installer |

## Downloading the desktop apps

- **Latest build:** open the **Actions** tab → **Build Desktop Apps (macOS + Windows)** → the newest green run → download from **Artifacts** at the bottom.
- **Releases:** push a version tag (e.g. `git tag v2.5.0 && git push origin v2.5.0`). The workflow creates a *draft* release with all installers attached; publish it from the **Releases** page.

### First launch (until Apple signing is set up)

Until the Apple secrets below are added, macOS builds are only ad-hoc signed, so the OS will warn you the first time:

- **macOS (15 Sequoia and later):** open the app once and dismiss the warning, then go to **System Settings → Privacy & Security**, scroll down and click **Open Anyway** next to Wavie Fresh. (The old right-click → Open trick no longer works on macOS 15.) If it says the app is "damaged", run `xattr -cr "/Applications/Wavie Fresh.app"` in Terminal.
- **Windows:** on the SmartScreen prompt click **More info** → **Run anyway**.

### macOS code signing

To make the Mac app open on any Mac with no warning, it has to be signed with a Developer ID and notarized by Apple. This needs a paid Apple Developer Program membership. The build workflow does the rest once these repository secrets exist (GitHub → **Settings → Secrets and variables → Actions → New repository secret**):

| Secret | What to put in it |
|---|---|
| `APPLE_CERTIFICATE` | Your **Developer ID Application** certificate exported from Keychain Access as a `.p12`, base64-encoded: `base64 -i cert.p12 \| pbcopy` |
| `APPLE_CERTIFICATE_PASSWORD` | The password you chose when exporting the `.p12` |
| `APPLE_SIGNING_IDENTITY` | The certificate name, e.g. `Developer ID Application: Your Name (TEAMID)` (see `security find-identity -v -p codesigning`) |
| `APPLE_ID` | Your Apple Account email (for notarization) |
| `APPLE_PASSWORD` | An **app-specific password** from account.apple.com → Sign-In and Security |
| `APPLE_TEAM_ID` | Your 10-character Team ID (developer.apple.com → Membership) |

The first three sign the app; the last three notarize it. The **Report macOS signature** step in each build log shows what was applied.

## What the desktop app adds

- Native folder picker + recursive scanning of real folders on disk
- Local SQLite library (`wavie_fresh.db`) that persists between launches
- Export of organized WAV packs straight into a folder you choose
- Processed (pitched / stretched) WAVs staged to a temp folder for export
- **Drag to DAW:** grab the "Drag to DAW" handle and drop the sample straight into Ableton, FL Studio, Logic, etc. Pitch/tempo changes are rendered into the dragged WAV.

## Developing

Requires Node 18+ and Rust (https://rustup.rs).

```bash
npm install
npm run dev     # run the desktop app with live reload of dist/
npm run build   # build installers for the current OS
```

The desktop shell lives in `src-tauri/` (Tauri v2). The UI is `dist/index.html`.

### Offline assets

Tailwind CSS, the Lucide icons and the Inter / JetBrains Mono fonts are bundled in `dist/assets/`, so the web and desktop apps work with no internet connection. After editing `dist/index.html` (new Tailwind classes or `data-lucide` icons), rebuild them:

```bash
npm run build:web
```

The desktop build and the GitHub Pages deploy run this automatically. The Tailwind theme (fonts, `obsidian` colors) lives in `tailwind.config.cjs`.

If you paste code from the Google Site version (which loads Tailwind from the CDN), replace its `<head>` CDN tags with the three local `assets/` links at the top of `dist/index.html`.

## Notes

- Not wired up yet: in-app auto-updates (needs an update signing key). The app detects that the updater is missing and carries on without it.
