---
name: lymo-meeting
description: Start, facilitate, and close a Lymo product or engineering meeting. Use only when the user explicitly invokes $lymo-meeting to discuss a bounded topic or to turn that discussion into a meeting note, canonical-document updates, a commit, and a dev-targeted PR.
---

# Lymo Meeting

Run the meeting in the current Codex task. Treat the meeting note as historical evidence; keep current project truth in `AGENTS.md`, `docs/PROJECT_CONTEXT.md`, `docs/OPEN_QUESTIONS.md`, contracts, and ADRs.

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
5. Keep a concise rolling ledger in the conversation when a decision, reversal, action item, or open question appears. Do not write a transcript or mutate the repository during the active meeting unless the user separately requests it.

## Close and document

Before publishing, check that the conversation contains enough information to distinguish decisions from proposals. Ask a focused question if ownership, decision status, or a material ambiguity is missing. Never fill gaps by guessing.

Then perform the following workflow:

1. Re-read the applicable repository instructions and current canonical documents. Fetch `origin/dev`.
2. Create a uniquely named `docs/meeting-<yyyymmdd>-<topic>` branch directly from the latest `origin/dev` in an isolated temporary worktree. Do not reuse the caller's branch, stage its files, or copy its uncommitted changes.
3. Require `AGENTS.md`, `docs/DEVELOPMENT_CONVENTIONS.md`, `docs/PROJECT_CONTEXT.md`, and `docs/OPEN_QUESTIONS.md` in that worktree. If they are absent, stop and report which prerequisite branch or PR must land first.
4. Create `docs/meetings/YYYY-MM-DD-<topic>.md` from [the meeting-note template](assets/meeting-note-template.md). Use the Asia/Seoul calendar date and a short lowercase ASCII kebab-case topic. Summarize faithfully rather than dumping the transcript.
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
8. Review the diff for factual attribution, accidental secrets or sensitive data, unrelated changes, and broken relative links. Stage only files created or changed by this meeting.
9. Commit with the repository convention, normally `docs(meeting): <한국어 회의 요약>을 기록한다.` Push the meeting branch and create a PR targeting `dev`; never push directly to `dev`, merge the PR, force-push, or delete branches.
10. Use the repository PR template. Include the meeting-note path, canonical documents changed, validation command and result, remaining risks, and any dependency on another PR.
11. Report the meeting-note path, decision and open-question counts, commit, branch, PR URL, checks run, and anything not verified. Remove the temporary worktree only after confirming it is clean and the branch and PR are available remotely.

If fetch, push, authentication, or PR creation fails, keep the local commit and worktree intact and report the exact recovery command. Do not claim publication succeeded.
