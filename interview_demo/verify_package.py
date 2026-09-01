#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path, PurePosixPath


EXPECTED = {
    "00_START_HERE.html",
    "01_README_FIRST.txt",
    "02_INTERVIEW_SCRIPT.md",
    "03_PROJECT_CONTEXT.md",
    "04_DATA_AND_MODEL_NOTICE.txt",
    "05_VERIFICATION.json",
    "06_CHECKSUMS_SHA256.txt",
}
REQUIRED_CHECKS = {
    "lint",
    "typecheck",
    "defaultTestsNoNetwork",
    "productionBuild",
    "offlineSingleFileBuild",
    "offlineBrowserRender",
    "offlineHtmlPresent",
}


def sha256(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest().upper()


def main() -> int:
    if len(sys.argv) != 2:
        raise SystemExit("usage: verify_package.py <demo.zip>")

    zip_path = Path(sys.argv[1]).resolve()
    if not zip_path.is_file():
        raise FileNotFoundError(zip_path)

    with zipfile.ZipFile(zip_path) as archive:
        names = set(archive.namelist())
        if names != EXPECTED:
            raise AssertionError(f"unexpected archive entries: {sorted(names ^ EXPECTED)}")
        if archive.testzip() is not None:
            raise AssertionError("ZIP CRC validation failed")

        for name in names:
            path = PurePosixPath(name)
            if path.is_absolute() or ".." in path.parts or ":" in name or len(name) > 180:
                raise AssertionError(f"unsafe ZIP path: {name}")

        payloads = {name: archive.read(name) for name in names}
        checksum_lines = payloads["06_CHECKSUMS_SHA256.txt"].decode("utf-8").splitlines()
        listed: dict[str, str] = {}
        for line in checksum_lines:
            digest, filename = line.split(" *", 1)
            if filename in listed:
                raise AssertionError(f"duplicate checksum entry: {filename}")
            listed[filename] = digest
        expected_checksums = EXPECTED - {"06_CHECKSUMS_SHA256.txt"}
        if set(listed) != expected_checksums:
            raise AssertionError("checksum manifest does not exactly cover package payloads")
        for filename in expected_checksums:
            if listed.get(filename) != sha256(payloads[filename]):
                raise AssertionError(f"checksum mismatch: {filename}")

        html = payloads["00_START_HERE.html"].decode("utf-8")
        if re.search(r"<script[^>]+src=", html, re.I):
            raise AssertionError("HTML contains a non-inlined script")
        if re.search(r"<link[^>]+href=", html, re.I):
            raise AssertionError("HTML contains a non-inlined linked resource")
        if re.search(r"<(?:iframe|frame|embed|object)\b", html, re.I):
            raise AssertionError("HTML contains an embeddable external-resource element")
        if re.search(r"<(?:img|source|video|audio)[^>]+(?:src|srcset)=['\"]https?", html, re.I):
            raise AssertionError("HTML contains an automatic external media request")
        if re.search(r"url\(\s*['\"]?https?://", html, re.I):
            raise AssertionError("HTML CSS contains an external URL")
        for forbidden in (
            "api.openai.com",
            "/api/ai/impact",
            "OPENAI_API_KEY",
            "Authorization: Bearer",
            "sourceMappingURL=",
            "fetch(",
            "XMLHttpRequest",
            "WebSocket(",
            "EventSource(",
            "sendBeacon(",
        ):
            if forbidden.lower() in html.lower():
                raise AssertionError(f"forbidden runtime or secret marker in HTML: {forbidden}")
        if re.search(r"sk-(?:proj-)?[A-Za-z0-9_-]{16,}", html):
            raise AssertionError("possible OpenAI secret in HTML")

        for filename, payload in payloads.items():
            text = payload.decode("utf-8-sig", errors="ignore")
            if re.search(r"sk-(?:proj-)?[A-Za-z0-9_-]{16,}", text):
                raise AssertionError(f"possible OpenAI secret in package file: {filename}")
            if re.search(r"Authorization\s*[:=]\s*Bearer\s+[A-Za-z0-9._-]{12,}", text, re.I):
                raise AssertionError(f"possible authorization token in package file: {filename}")

        for marker in (
            "离线演示模式",
            "离线预置分析",
            "不调用模型",
            "由你决定",
            "不是实时",
            "维持原判断",
            "改为需要重看",
            "先补证据再决定",
            "这条判断已不成立",
        ):
            if marker not in html:
                raise AssertionError(f"missing demo marker: {marker}")

        verification = json.loads(payloads["05_VERIFICATION.json"].decode("utf-8-sig"))
        if verification.get("demo", {}).get("mode") != "OFFLINE_FIXTURE":
            raise AssertionError("verification mode is not OFFLINE_FIXTURE")
        if verification.get("sourceRevision", {}).get("workingTreeDirty") is not False:
            raise AssertionError("package was not produced from a clean source revision")
        checks = verification.get("implementationChecks", {})
        if set(checks) != REQUIRED_CHECKS or any(value != "PASS" for value in checks.values()):
            raise AssertionError("implementation checks are missing or not PASS")
        live_status = verification.get("liveModelSmoke", {}).get("status")
        if live_status not in {"NOT_RUN", "VERIFIED"}:
            raise AssertionError(f"invalid liveModelSmoke status: {live_status}")
        if live_status == "VERIFIED" and not verification["liveModelSmoke"].get("verifiedAt"):
            raise AssertionError("VERIFIED live smoke has no timestamp")

    size = zip_path.stat().st_size
    digest = sha256(zip_path.read_bytes())
    print(f"verified entries={len(EXPECTED)} bytes={size} sha256={digest} live={live_status}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
