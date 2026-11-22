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

### First launch (unsigned builds)

The apps aren't code-signed yet, so the OS will warn you the first time:

- **macOS:** right-click the app → **Open** → **Open**. If it says the app is "damaged", run `xattr -cr "/Applications/Wavie Fresh.app"` in Terminal.
- **Windows:** on the SmartScreen prompt click **More info** → **Run anyway**.

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
