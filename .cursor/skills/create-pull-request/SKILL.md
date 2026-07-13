---
name: create-pull-request
description: >-
  Create a GitHub pull request from a source branch/hash to a target
  branch/hash using gh. Asks for source and target, drafts a Conventional
  Commits title (user-written or agent-written), and writes a concise PR
  description. Use only when explicitly invoked for creating a pull request.
disable-model-invocation: true
---

# Create Pull Request

Interactive workflow to open a GitHub PR from one ref to another.

## Workflow

Copy this checklist and track progress:

```
PR Progress:
- [ ] 1. Confirm source and target
- [ ] 2. Inspect changes
- [ ] 3. Confirm title authorship
- [ ] 4. Finalize title (Conventional Commits)
- [ ] 5. Draft description
- [ ] 6. Push if needed and create PR
- [ ] 7. Return PR URL
```

### 1. Confirm source and target

Ask the user for:

- **Source**: branch name or commit hash (head of the PR)
- **Target**: branch name or commit hash (base of the PR)

Do not assume `main`/`master` or the current branch. Wait for explicit answers.

If the user gives a hash for either side, use it as-is with `gh pr create` (`--head` / `--base` accept refs GitHub understands). Prefer branch names when both are available.

### 2. Inspect changes

Gather context for the title and description. Run in parallel:

```bash
git status
git log --oneline <target>..<source>
git diff <target>...<source>
```

Also check whether the source branch is pushed and tracks a remote.

If there are no commits between target and source, stop and tell the user.

### 3. Confirm title authorship

Ask:

> Do you want to write the PR title yourself, or should I draft it?

- **User writes it**: wait for their title, then validate it against Conventional Commits (step 4). If invalid, explain what’s wrong and ask them to revise.
- **Agent drafts it**: propose one short title, then ask for approval or edits before creating the PR.

### 4. Title — Conventional Commits (required)

The PR title MUST follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/#specification):

```
<type>[optional scope][optional !]: <description>
```

Rules:

- Prefix with a type (`feat`, `fix`, or another allowed type such as `docs`, `refactor`, `chore`, `perf`, `test`, `ci`, `build`, `style`), then optional scope in parentheses, optional `!` for breaking changes, then `: ` and a short description.
- Description is short and concise (aim for ~72 characters or less for the full title).
- Use `feat` for a new feature, `fix` for a bug fix.
- Breaking changes: put `!` before `:` and/or document with a `BREAKING CHANGE:` footer in the PR body.
- Prefer lowercase type; be consistent.
- Do not use a vague title like `update` or `changes`.

Examples:

```
feat(blog): add markdown post listing
fix(db): prevent duplicate pageview inserts
docs: clarify Neon setup in README
feat(api)!: require auth on comments endpoint
```

### 5. Description

Draft the PR body from the inspected diff/log.

- **Single focused change**: one short summary paragraph (2–4 sentences max), or a brief bullet.
- **Multiple distinct changes**: a short intro line plus a bullet list of summaries (one bullet per logical change).

Use this template with `gh pr create`:

```markdown
## Summary
<one paragraph, OR>
- <summary of change 1>
- <summary of change 2>

## Test plan
- [ ] <relevant verification steps>
```

Keep the summary factual and tied to the diff. Do not pad with fluff.

### 6. Create the PR

Only after the user has confirmed the title (and had a chance to adjust the description):

1. Push the source branch if it is not on the remote: `git push -u origin <source>` (skip if source is only a remote-reachable hash and already exists on the remote).
2. Create the PR:

```bash
gh pr create --base <target> --head <source> --title "<title>" --body "$(cat <<'EOF'
## Summary
...

## Test plan
- [ ] ...

EOF
)"
```

If `--base` / `--head` fail because a hash is not a valid GitHub base/head ref, ask the user for branch names instead (or create a branch pointing at the hash).

### 7. Return the PR URL

Always end by showing the pull request URL.

## Constraints

- Never update git config.
- Do not force-push unless the user explicitly asks.
- Do not create the PR until source, target, and title are confirmed.
- Do not skip Conventional Commits validation on the title.
