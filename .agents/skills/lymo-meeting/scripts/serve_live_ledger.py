#!/usr/bin/env python3
"""Serve the Lymo live meeting ledger on a loopback-only HTTP server."""

from __future__ import annotations

import argparse
import json
import shutil
import tempfile
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
from zoneinfo import ZoneInfo


SEOUL = ZoneInfo("Asia/Seoul")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--topic", default="Lymo 회의", help="Initial meeting topic")
    parser.add_argument("--state", type=Path, help="Existing ledger JSON file")
    parser.add_argument("--port", type=int, default=0, help="Loopback port; 0 chooses a free port")
    return parser.parse_args()


def create_state(topic: str) -> tuple[Path, Path]:
    session_dir = Path(tempfile.mkdtemp(prefix="lymo-meeting-ledger-"))
    state_path = session_dir / "ledger.json"
    state = {
        "version": 1,
        "topic": topic,
        "status": "논의 중",
        "updatedAt": datetime.now(SEOUL).isoformat(timespec="seconds"),
        "decisions": [],
        "actions": [],
        "open": [],
        "deferred": [],
    }
    state_path.write_text(
        json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return state_path, session_dir


def load_state(state_path: Path) -> bytes:
    raw = state_path.read_text(encoding="utf-8")
    json.loads(raw)
    return raw.encode("utf-8")


def make_handler(html: bytes, state_path: Path) -> type[BaseHTTPRequestHandler]:
    class LedgerHandler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:  # noqa: N802 - stdlib handler API
            path = urlparse(self.path).path
            if path in {"/", "/index.html"}:
                self._respond(200, "text/html; charset=utf-8", html)
                return
            if path == "/state.json":
                try:
                    payload = load_state(state_path)
                except (OSError, json.JSONDecodeError) as error:
                    payload = json.dumps(
                        {"error": f"ledger state unavailable: {error}"},
                        ensure_ascii=False,
                    ).encode("utf-8")
                    self._respond(503, "application/json; charset=utf-8", payload)
                    return
                self._respond(200, "application/json; charset=utf-8", payload)
                return
            if path == "/health":
                self._respond(200, "application/json; charset=utf-8", b'{"ok":true}')
                return
            self._respond(404, "text/plain; charset=utf-8", b"Not found")

        def _respond(self, status: int, content_type: str, payload: bytes) -> None:
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store")
            self.send_header(
                "Content-Security-Policy",
                "default-src 'self'; script-src 'self' 'unsafe-inline'; "
                "style-src 'self' 'unsafe-inline'; connect-src 'self'; "
                "img-src 'none'; object-src 'none'; base-uri 'none'",
            )
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            self.wfile.write(payload)

        def log_message(self, format: str, *args: object) -> None:
            return

    return LedgerHandler


def main() -> int:
    args = parse_args()
    html_path = Path(__file__).resolve().parent.parent / "assets" / "live-ledger.html"
    html = html_path.read_bytes()

    owned_session_dir: Path | None = None
    if args.state:
        state_path = args.state.resolve()
        load_state(state_path)
    else:
        state_path, owned_session_dir = create_state(args.topic)

    server = ThreadingHTTPServer(
        ("127.0.0.1", args.port), make_handler(html, state_path)
    )
    host, port = server.server_address
    print(
        json.dumps(
            {
                "statePath": str(state_path),
                "url": f"http://{host}:{port}/",
            },
            ensure_ascii=False,
        ),
        flush=True,
    )

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        if owned_session_dir is not None:
            shutil.rmtree(owned_session_dir, ignore_errors=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
