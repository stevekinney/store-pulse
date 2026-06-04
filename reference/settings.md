# Codex Settings You Want to Know About and Might Want to Change

Codex has two settings surfaces:

- **Codex app settings:** Everyday controls for the app, plugins, appearance,
  browser use, Computer Use, Git behavior, notifications, and integrations.
- **`config.toml`:** Advanced persistent configuration for model defaults,
  sandboxing, approvals, MCP servers, hooks, plugins, profiles, terminal
  behavior, and environment inheritance.

Use the app settings panel for normal workshop setup. Use `config.toml` when
you need a durable, precise setting that the app UI does not expose clearly.
For a fuller walkthrough of the file format, precedence, profile files, and
safe Store Pulse examples, see `reference/config-toml-deep-dive.md`.

## Why Change Settings

Change Codex settings when the default behavior does not match the work you are
actually doing. Settings let you tune the model, permissions, integrations,
browser access, editor behavior, and background workflow defaults so Codex fits
the environment instead of fighting it.

Good settings changes reduce repeated friction: fewer permission surprises,
clearer file opening, predictable sandbox behavior, and the right plugins
available when a task needs them.

Avoid changing settings to paper over a vague prompt or broken project setup.
If a setting expands what Codex can do without asking, treat it as a safety
decision, not a convenience tweak.

## What Belongs Where

| Need | Best surface |
| ---- | ------------ |
| Change app theme, file opening, notifications, or keyboard shortcuts | Codex app settings |
| Configure model, reasoning, sandbox, approvals, or shell environment | `~/.codex/config.toml` |
| Keep repository-specific instructions | `AGENTS.md` |
| Share safe project-local Codex behavior | `.codex/config.toml` in a trusted project |
| Add a repeated task workflow | Skill |
| Enforce lifecycle checks | Hook |
| Connect external tools | Plugin, app connector, or MCP server |
| Schedule background work | Automation |

Do not put everything in one place. The smallest durable surface is usually the
right one.

## General App Settings

Useful app settings include:

- Where files open.
- How much command output appears in threads.
- Where terminal tabs open.
- Whether multiline prompts require Cmd+Enter.
- Whether the computer should stay awake while a thread runs.

For workshops, make the environment predictable. If participants use different
editors, do not make editor-specific behavior part of the lesson.

## Agent Configuration

Codex agents in the app use the same underlying configuration as the CLI and
IDE extension. Common settings include:

- Default model and reasoning effort.
- Sandbox mode.
- Approval policy.
- Network access.
- MCP servers.
- Hooks.
- Plugins.

For Store Pulse feature work, the useful defaults are:

```toml
# ~/.codex/workshop.config.toml
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

Feature flags still live in the main user configuration:

```toml
# ~/.codex/config.toml
[features]
hooks = true
plugins = true
```

Keep `danger-full-access` and `approval_policy = "never"` out of normal
workshop development. Those settings belong only in externally constrained
automation or disposable environments.

## Profiles

**Profiles** are named bundles of Codex settings. Use them when you switch
between recurring modes of work and do not want to keep editing the same
`config.toml` keys by hand.

Profiles are useful because the right Codex posture changes by task:

- Feature work needs workspace write access and interactive approvals.
- Review work should usually be read-only.
- Setup work may need temporary network access.
- Automation needs explicit guardrails because it can run unattended.
- Documentation research may need web access while normal coding does not.

Example `~/.codex/config.toml`:

```toml
# ~/.codex/workshop.config.toml
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

```toml
# ~/.codex/review.config.toml
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "untrusted"
```

```toml
# ~/.codex/setup.config.toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

```toml
# ~/.codex/automation.config.toml
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
approval_policy = "never"
```

Run a profile from the CLI:

```bash
codex --profile review
```

Use command-line overrides for one-off changes:

```bash
codex --profile setup -c 'sandbox_workspace_write.network_access=true'
```

Concrete Store Pulse profile choices:

| Profile | Use it for | Typical settings |
| --- | --- | --- |
| `workshop` | Normal one-hour feature work | `workspace-write`, `on-request`, medium reasoning |
| `review` | Reading code or reviewing a diff | `read-only`, stricter approvals, higher reasoning |
| `setup` | Installing dependencies or Playwright browsers | Workspace write plus temporary network access |
| `automation` | Background checks after the prompt is tested | Workspace write with narrow rules and no broad network access |
| `research` | Current documentation lookup | Web access enabled only for the research run |

Keep shared workshop instructions out of personal profiles. Repository rules
belong in `AGENTS.md`; profiles should describe how Codex is allowed to operate
on this machine.

## Git Settings

Codex app Git settings can standardize branch naming and control force-push
behavior. Use them carefully.

Workshop guidance:

- Branch prefixes are useful when many participants create branches.
- Force pushes should stay off unless the workflow explicitly requires them.
- Commit and pull request prompt templates can help, but they should not hide
  verification requirements.

For this repository, do not open draft pull requests unless explicitly asked.

## Integrations And MCP

Use Integrations and MCP settings to connect tools such as GitHub, Slack,
Google Drive, Gmail, or custom MCP servers.

Good defaults:

- Install only the integrations needed for the lesson.
- Prefer read-only scopes until write access is required.
- Use OAuth or environment variables for credentials.
- Do not paste secrets into `config.toml`.
- Run `/mcp` or inspect plugin settings before asking a participant to do
  manual setup.

## Browser Use Settings

Browser settings cover the bundled Browser plugin, the Codex Chrome extension,
and allowed or blocked websites.

For local app work:

- Install the Browser plugin when participants need Codex to inspect rendered
  pages.
- Use the in-app browser for `localhost`.
- Use Chrome only for signed-in browser state.
- Keep allowlists narrow.
- Remove stale allowlist entries after a demo if the machine is shared.

See `reference/chrome-extension.md` and `reference/computer-use.md` for the
browser and desktop permission model.

## Computer Use Settings

Computer Use settings show desktop-app access and related permissions. On
macOS, Screen Recording and Accessibility are controlled in system settings.

Change these settings only when the workshop intentionally needs desktop UI
automation. Store Pulse does not require Computer Use for the default one-hour
feature.

## Personalization And Memories

Personalization controls Codex tone and custom instructions. Memories, where
available, let Codex carry useful context from past threads.

Use these carefully in a workshop:

- Personal tone preferences can stay personal.
- Repository rules should live in `AGENTS.md`, not in personal instructions.
- Memories may help returning users, but they should not be required for a
  workshop prompt to work.
- When teaching repeatable workflows, persist state in files rather than
  relying on remembered conversation context.

## Context-Aware Suggestions And Archived Threads

Context-aware suggestions can surface follow-up work when you return to Codex.
Archived threads help you restore old conversations.

These are useful for day-to-day work, but they are not a substitute for a clear
prompt, clean git status, and explicit verification commands.

## Settings To Check Before A Workshop

Before teaching Store Pulse, confirm:

- Codex opens from the repository root.
- The project is trusted if project-local `.codex` settings are used.
- Sandbox mode is `workspace-write`.
- Approval policy is interactive, usually `on-request`.
- Network access is not required for feature implementation.
- Hooks and plugins are enabled only if the lesson uses them.
- Browser or Chrome access is configured only when the lesson needs it.
- The file opener works for the editor participants use.
- `npm run lint` and `npm run test` pass from the terminal.

## Settings To Avoid Changing Casually

Avoid casual changes to:

- `approval_policy = "never"`
- `sandbox_mode = "danger-full-access"` or equivalent full access settings
- Broad network access
- Global plugin disablement
- Global MCP credentials
- Browser always-allow settings
- Computer Use always-allow app access
- Shared project-local settings that affect every participant

If a setting changes what Codex can do without asking, slow down and name the
risk before enabling it.
