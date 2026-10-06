# RO-CLI-001 — `redditops` command

## Outcome and authority

October 7, 2026: Thomas approved committing and pushing RO-PROXY-BD-001 (`374c139`, pushed to `main`). He asked to reopen Reddit Ops and to start it by opening the Reddit Ops folder and typing `redditops`. The command must work on any device that has the source, including a later cloud deployment. No deployment, cloud services, new dependencies or skills.

## Delivered

- `bin/redditops.mjs`: cross-platform entry point (`package.json` `bin`, `npm start`). It checks Node 22.14+ (below 23) before loading `node:sqlite`, runs the checkout that contains the current folder (otherwise the linked one), and hides only the known SQLite experimental notice.
- `app/launcher.mjs`: options and environment (`--port`/`REDDIT_OPS_PORT`/`PORT`, `--host`/`REDDIT_OPS_HOST`, `--data-dir`/`REDDIT_OPS_DATA_DIR`, `--origin`/`REDDIT_OPS_ORIGIN`), `setup-key`, `--help` and `--version`, plus clear busy-port and permission messages. A public HTTPS origin defaults the host to `0.0.0.0`. A non-loopback host without an HTTPS origin is refused, so the app is never exposed over plain HTTP by accident.
- `app/server.mjs`: `host` option; running `node app/server.mjs` delegates to the launcher. `redditops.cmd` is a Windows shortcut; `Start-Reddit-Ops.ps1`, build (now includes `bin/`, start `node bin/redditops.mjs`) and check (now covers `bin/`) were updated. `.gitattributes` keeps `bin/*` LF and `*.cmd` CRLF.
- This machine: `npm link` created `redditops`, `redditops.cmd` and `redditops.ps1` shims in `C:\Users\LE BINH\AppData\Roaming\npm`, which is already on the user PATH. Remove them with `npm unlink -g reddit-ops`.

## Verification

- `tests/cli.test.mjs` (4 tests) covers: defaults; cloud `PORT`/origin/data-dir; flag precedence; exposure guard and invalid input; serving with first-setup guidance; `setup-key`; busy port; cloud Host/Origin rules on loopback (no firewall prompt); entry points from an outside folder, a checkout subfolder and `node app/server.mjs`; and a refused start that creates no data.
- Full suite 20/20; syntax, build and whitespace passed; all four Edge gates passed.
- Fresh PowerShell, cmd and Git Bash sessions ran `redditops --version` from a folder outside the checkout. The exposure guard was confirmed from the CLI.
- Not tested: an actual cloud host, `0.0.0.0` binding on this workstation (avoided to prevent a firewall prompt), macOS/Linux shells. Shebang and LF handling follow standard npm `bin` behaviour.

## Retrospective

Worked: testing shell resolution before choosing shims showed that an extensionless file blocks `cmd` from finding the `.cmd` shim, and that this tool environment sets `NoDefaultCurrentDirectoryInExePath`. A global npm `bin` link is the reliable cross-shell path. Improvement: avoid top-level `await` when a module dynamically imports a module that imports it back.
