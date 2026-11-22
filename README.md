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

## Developing

Requires Node 18+ and Rust (https://rustup.rs).

```bash
npm install
npm run dev     # run the desktop app with live reload of dist/
npm run build   # build installers for the current OS
```

The desktop shell lives in `src-tauri/` (Tauri v2). The UI is entirely `dist/index.html`.

## Notes

- The UI loads Tailwind, Lucide icons and Google Fonts from CDNs, so the app needs an internet connection to render correctly.
- Not wired up yet: in-app auto-updates (needs an update signing key) and native drag-out to a DAW (needs a drag plugin). The app detects both are missing and carries on without them.
