---
name: lymo-meeting
description: Start, facilitate, and close a Lymo product or engineering meeting with a live side ledger. Use only when the user explicitly invokes $lymo-meeting to discuss a bounded topic or to turn that discussion into a meeting note, canonical-document updates, a commit, and a dev-targeted PR.
---

# Lymo Meeting

Run the meeting in the current Codex task. Treat the meeting note as historical evidence; keep current project truth in `AGENTS.md`, `docs/PROJECT_CONTEXT.md`, `docs/OPEN_QUESTIONS.md`, contracts, and ADRs.

Treat every committed meeting artifact as potentially public. If repository visibility cannot be verified, use the public-safe default described below.

## Choose the mode

- `start <topic>`: start or frame a meeting. If the invocation has no subcommand, infer `start` only when the user is clearly opening a meeting; otherwise ask whether they want to start or close one.
- `close`: finalize and publish the meeting record. Only this explicit invocation authorizes creating documentation, committing it, pushing the meeting branch, and opening the PR.

Remind the user at start to finish with `$lymo-meeting close`. Discussion between those two invocations may proceed normally without repeating the skill name, but closing and publication always require the explicit close invocation.

## Start and facilitate

1. Read the repository `AGENTS.md`, `docs/DEVELOPMENT_CONVENTIONS.md`, `docs/PROJECT_CONTEXT.md`, `docs/OPEN_QUESTIONS.md`, and any ADR or contract directly relevant to the topic. If a required file does not exist, identify the missing prerequisite instead of inventing its contents.
2. State the meeting topic, desired decision, known constraints, and a compact agenda. Ask only questions whose answers can materially change the decision.
3. During discussion, distinguish:
   - verified facts and their evidence;
   - assumptions or items needing verification;
   - proposals and rejected alternatives;
   - decisions the user explicitly accepts;
   - follow-up actions and unresolved questions.
4. Do not silently turn a proposal into a decision. Do not promise platform or provider behavior that has not been verified.
5. Keep a concise rolling ledger in the live side preview described below when a decision, reversal, action item, or open question appears. Do not write a transcript or mutate the repository during the active meeting; the temporary ledger state is outside the repository.
6. Identify material that is not safe for a public repository while the meeting is active. Do not repeat sensitive details merely to classify them.

## Live side ledger

At meeting start, launch the reusable [live ledger server](scripts/serve_live_ledger.py) with the meeting topic. It creates a small JSON state file in a private temporary directory and prints its path and a loopback-only URL:

```bash
python3 .agents/skills/lymo-meeting/scripts/serve_live_ledger.py --topic "<meeting topic>"
```

Keep the running command's session ID and the printed state path for the duration of the meeting. Open the printed URL as a rendered page in the visible in-app browser on the right and preserve that tab for the meeting. Never open [the HTML template](assets/live-ledger.html) as a file target because that displays source code instead of the ledger. If the local server or browser requires approval, request it at action time. If a rendered side preview is unavailable, keep the rolling ledger in the conversation and state that limitation rather than claiming the preview is live.

The JSON state has this stable shape:

```json
{
  "version": 1,
  "topic": "<meeting topic>",
  "status": "논의 중",
  "updatedAt": "<ISO 8601 timestamp with Asia/Seoul offset>",
  "decisions": ["<accepted decision>"],
  "actions": [{"text": "<observable action>", "owner": "<owner>"}],
  "open": ["<unresolved question>"],
  "deferred": ["<rejected, deferred, or superseded alternative and brief reason>"]
}
```

Update only this small state file and only after a material ledger change. Keep entries short, move superseded decisions to `deferred`, and set `updatedAt` to the actual change time. Do not update timestamps for unchanged discussion, copy the transcript, reread or rewrite the HTML template, or spend model turns refreshing the browser: the page polls the JSON locally and updates its relative clock without model work. Apply the public-safe exclusions to the temporary state as well as the final record.

## Public-safe records

- Record decisions, rationale, impact, rejected or deferred alternatives, follow-up actions, unresolved questions, and sanitized evidence. Do not publish a transcript.
- Exclude secrets, credentials, personal or account identifiers, private provider communications, unapproved business details, exploit-ready unpublished vulnerability details, full shared URLs, full lyrics, raw logs, and large recordings.
- Include screenshots only when they materially support a conclusion and sensitive information has been removed.
- If sensitive information is necessary to understand a decision, do not silently omit it and produce a misleading record. Ask whether to publish an agreed public-safe summary or stop publication and keep the material in an approved private location.
- Never assume that deleting a committed artifact removes it from Git history or existing forks.

## Close and document

Before publishing, check that the conversation contains enough information to distinguish decisions from proposals. Ask a focused question if ownership, decision status, public-safe wording, or a material ambiguity is missing. Never fill gaps by guessing.

Set the live ledger status to `종결 정리 중` before preparing the record. After successful publication, set it to `종결`, allow the preview to receive the last state, then stop the retained server session. The server removes the temporary state it created when it exits. If publication fails, keep the live ledger and its server available with the other recovery artifacts.

Then perform the following workflow:

1. Re-read the applicable repository instructions and current canonical documents. Fetch `origin/dev`.
2. Create a uniquely named `docs/<short-kebab-case>` branch directly from the latest `origin/dev` in an isolated temporary worktree. Name it after the primary published outcome, not the meeting process. Use `docs/meeting-<yyyymmdd>-<topic>` only when the meeting record is the primary change, and add a date or numeric suffix when needed for uniqueness. Do not reuse the caller's branch, stage its files, or copy its uncommitted changes.
3. Require `AGENTS.md`, `docs/DEVELOPMENT_CONVENTIONS.md`, `docs/PROJECT_CONTEXT.md`, and `docs/OPEN_QUESTIONS.md` in that worktree. If they are absent, stop and report which prerequisite branch or PR must land first.
4. Create `docs/meetings/YYYY-MM-DD-<topic>.md` from [the meeting-note template](assets/meeting-note-template.md). Use the Asia/Seoul calendar date and a short lowercase ASCII kebab-case topic. Summarize decisions and their necessary context faithfully rather than dumping the transcript.
5. Update canonical documents in the same change when the meeting changed current truth:
   - use an ADR for decisions required by the repository conventions;
   - update `docs/PROJECT_CONTEXT.md` for current support or technical direction;
   - add unresolved implementation or validation questions to `docs/OPEN_QUESTIONS.md`;
   - remove a resolved open question only after its result is captured in an ADR or the appropriate canonical document.
6. Every question newly added to `docs/OPEN_QUESTIONS.md` must end with an origin link in this exact shape:

   ```markdown
   - <미결 질문> — 출처: [<YYYY-MM-DD 회의 제목>](meetings/<YYYY-MM-DD-topic>.md#미결-사항)
   ```

   The meeting note's `미결 사항` section must contain the same question. Existing legacy questions do not need a fabricated meeting origin.
7. Run `python3 .agents/skills/lymo-meeting/scripts/validate_open_question_origins.py --base-ref origin/dev` from the isolated worktree. Resolve every failure before committing.
8. Review the diff for factual attribution, public-repository suitability, accidental secrets or sensitive data, unrelated changes, and broken relative links. Confirm that every committed detail may remain in Git history, and stage only files created or changed by this meeting.
9. Commit and title the PR according to the repository convention, using a scope and summary that describe the primary published outcome. Use `docs(meeting): <한국어 회의 요약>을 기록한다.` only when the meeting record is the primary change. Push the branch and create a PR targeting `dev`; never push directly to `dev`, merge the PR, force-push, or delete branches.
10. Use the repository PR template. Include the meeting-note path, canonical documents changed, validation command and result, remaining risks, and any dependency on another PR.
11. Report the meeting-note path, decision and open-question counts, commit, branch, PR URL, checks run, and anything not verified. Remove the temporary worktree only after confirming it is clean and the branch and PR are available remotely.

If fetch, push, authentication, or PR creation fails, keep the local commit and worktree intact and report the exact recovery command. Do not claim publication succeeded.
