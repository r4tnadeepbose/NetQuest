#!/usr/bin/env python3
"""
One-stop runner for NetQuest (Vite + React).
- Ensures dependencies are installed (if node_modules is missing)
- Starts the development server

Usage:
  python run.py            # install deps if needed, then start dev server
  python run.py --install  # force npm install, then start dev server
  python run.py --build    # production build
  python run.py --preview  # preview production build (runs build if dist missing)
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent


def run(cmd: list[str], cwd: Path = ROOT) -> int:
    print(f"\n> {' '.join(cmd)}")
    try:
        proc = subprocess.run(cmd, cwd=str(cwd))
        return proc.returncode
    except KeyboardInterrupt:
        print("\nStopped.")
        return 130
    except FileNotFoundError:
        return 127


def require_npm() -> str:
    npm = shutil.which("npm") or shutil.which("npm.cmd")
    if not npm:
        print("Error: npm was not found on PATH.")
        print("Install Node.js (which includes npm) from https://nodejs.org/ and try again.")
        sys.exit(1)
    return npm


def ensure_deps(npm: str, force: bool = False) -> None:
    node_modules = ROOT / "node_modules"
    if force or not node_modules.exists():
        print("Installing dependencies...")
        code = run([npm, "install"])
        if code != 0:
            sys.exit(code)
    else:
        print("Dependencies found (node_modules). Skipping install.")


def main() -> int:
    parser = argparse.ArgumentParser(description="Run NetQuest locally (one-stop).")
    parser.add_argument("--install", action="store_true", help="Force npm install before running")
    parser.add_argument("--build", action="store_true", help="Create a production build")
    parser.add_argument("--preview", action="store_true", help="Preview production build (builds if needed)")
    parser.add_argument("--host", action="store_true", help="Expose dev server on network (npm run dev -- --host)")
    args = parser.parse_args()

    npm = require_npm()
    ensure_deps(npm, force=args.install)

    if args.build:
        return run([npm, "run", "build"])

    if args.preview:
        if not (ROOT / "dist").exists():
            code = run([npm, "run", "build"])
            if code != 0:
                return code
        return run([npm, "run", "preview"])

    # Default: dev server
    cmd = [npm, "run", "dev"]
    if args.host:
        cmd += ["--", "--host"]
    print("\nStarting NetQuest dev server... (press Ctrl+C to stop)")
    return run(cmd)


if __name__ == "__main__":
    sys.exit(main())