#!/usr/bin/env python3
"""Validate origin links on open questions added since a Git base ref."""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path


QUESTION_PREFIX = "- "
METADATA_PREFIXES = ("- 기준일:", "- 범위:")
ORIGIN_PATTERN = re.compile(
    r" — 출처: \[(?P<label_date>\d{4}-\d{2}-\d{2}) [^\]]+\]"
    r"\((?P<path>meetings/(?P<path_date>\d{4}-\d{2}-\d{2})"
    r"-[a-z0-9]+(?:-[a-z0-9]+)*\.md)"
    r"#미결-사항\)$"
)
OPEN_ITEMS_PATTERN = re.compile(
    r"^## 미결 사항\s*$\n(?P<body>.*?)(?=^## |\Z)",
    flags=re.MULTILINE | re.DOTALL,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Check that newly added OPEN_QUESTIONS entries link to their meeting."
    )
    parser.add_argument(
        "--base-ref",
        default="origin/dev",
        help="Git ref used as the comparison base (default: origin/dev).",
    )
    return parser.parse_args()


def git_diff(base_ref: str) -> str:
    result = subprocess.run(
        [
            "git",
            "diff",
            "--unified=0",
            "--no-ext-diff",
            base_ref,
            "--",
            "docs/OPEN_QUESTIONS.md",
        ],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        detail = result.stderr.strip() or "git diff failed"
        raise RuntimeError(detail)
    return result.stdout


def added_questions(diff: str) -> list[str]:
    questions: list[str] = []
    for line in diff.splitlines():
        if not line.startswith("+") or line.startswith("+++"):
            continue
        content = line[1:]
        if not content.startswith(QUESTION_PREFIX):
            continue
        if content.startswith(METADATA_PREFIXES):
            continue
        questions.append(content)
    return questions


def validate_question(repo_root: Path, question: str) -> list[str]:
    match = ORIGIN_PATTERN.search(question)
    if match is None:
        return [f"missing or malformed meeting origin: {question}"]

    if match.group("label_date") != match.group("path_date"):
        return [f"meeting label and path dates differ: {question}"]

    linked_path = repo_root / "docs" / match.group("path")
    if not linked_path.is_file():
        return [f"meeting note does not exist: {linked_path.relative_to(repo_root)}"]

    open_items_match = OPEN_ITEMS_PATTERN.search(linked_path.read_text(encoding="utf-8"))
    if open_items_match is None:
        return [f"meeting note has no open-items section: {linked_path.relative_to(repo_root)}"]

    question_text = question.removeprefix(QUESTION_PREFIX).split(" — 출처:", 1)[0]
    meeting_questions = {
        line.strip().removeprefix(QUESTION_PREFIX).strip()
        for line in open_items_match.group("body").splitlines()
        if line.strip().startswith(QUESTION_PREFIX)
    }
    if question_text not in meeting_questions:
        return [
            "open question is missing from the meeting note: "
            f"{linked_path.relative_to(repo_root)}: {question_text}"
        ]
    return []


def main() -> int:
    args = parse_args()
    repo_root_result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        check=False,
        capture_output=True,
        text=True,
    )
    if repo_root_result.returncode != 0:
        print("error: run this script inside a Git worktree", file=sys.stderr)
        return 2

    repo_root = Path(repo_root_result.stdout.strip())
    try:
        diff = git_diff(args.base_ref)
    except RuntimeError as error:
        print(f"error: {error}", file=sys.stderr)
        return 2

    questions = added_questions(diff)
    errors = [
        error
        for question in questions
        for error in validate_question(repo_root, question)
    ]
    if errors:
        for error in errors:
            print(f"error: {error}", file=sys.stderr)
        return 1

    print(f"validated {len(questions)} newly added open question(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
