# `config.toml` Deep Dive

`config.toml` is Codex's durable local configuration file. It controls how
Codex behaves before a prompt starts: which model it uses, what commands can
touch, when it asks for approval, which tools are enabled, how shell
environment variables are passed through, and which integrations are available.

Use `config.toml` for Codex behavior. Use `AGENTS.md` for repository truth.
That separation keeps project instructions visible in the repository while
keeping personal machine policy local.

## Why Use `config.toml`

Use `config.toml` when you want Codex to behave consistently across threads,
surfaces, and restarts. Without it, every session depends on transient prompt
instructions, command flags, or app settings that are easy to forget.

Good uses:

- Set safe default sandbox and approval behavior.
- Choose default model and reasoning behavior.
- Enable features such as hooks, plugins, memories, or goals.
- Register MCP servers.
- Control shell environment inheritance.
- Define local hooks or point at hook files.
- Configure web search behavior.
- Set terminal interface preferences.
- Trust specific project directories.

Poor uses:

- Storing project rules that belong in `AGENTS.md`.
- Storing secrets or access tokens.
- Hiding one-off task instructions.
- Encoding broad full-access defaults because one command failed.
- Copying another developer's machine-specific paths.

## Where Codex Looks

The main user file is:

```text
~/.codex/config.toml
```

Project-specific configuration can live in trusted repositories:

```text
.codex/config.toml
```

Current Codex also supports profile files under `~/.codex/`:

```text
~/.codex/review.config.toml
~/.codex/setup.config.toml
~/.codex/automation.config.toml
```

Select one with:

```bash
codex --profile review
```

> [!NOTE]
> In current Codex builds, profiles selected with `--profile` are separate
> files such as `~/.codex/review.config.toml`. Do not use legacy
> `[profiles.review]` tables in `config.toml` for new workshop material.

## Configuration Precedence

Codex resolves settings from most specific to least specific:

```text
CLI flags and -c overrides
Project .codex/config.toml files, trusted projects only
Profile file selected with --profile
User ~/.codex/config.toml
System /etc/codex/config.toml, when present
Built-in defaults
```

Managed requirements can still constrain the result. For example, an
organization may prevent `approval_policy = "never"` or disallow full-access
sandbox modes. Treat those as guardrails, not as regular defaults.

Use this precedence intentionally:

- Put personal defaults in `~/.codex/config.toml`.
- Put workflow-specific overrides in profile files.
- Put safe project-local behavior in `.codex/config.toml`.
- Use `-c` for one-off experiments.
- Put shared project instructions in `AGENTS.md`.

## User Config Versus Project Config

Use user config for machine-local behavior:

```toml
# ~/.codex/config.toml
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
approval_policy = "on-request"
web_search = "cached"

[features]
hooks = true
plugins = true
goals = true
```

Use project config only for safe project-local behavior:

```toml
# .codex/config.toml
model_reasoning_effort = "medium"
project_doc_max_bytes = 65536
```

Project config loads only when the project is trusted. A repository should not
be able to silently change provider credentials, telemetry commands, profile
selection, or machine-local notification behavior. Keep project config narrow
and easy to audit.

Do not put these in project config:

- Provider endpoints or provider definitions.
- Credential behavior.
- Telemetry exporters.
- Notification commands.
- Profile selection.
- Secrets.

## One-Off Overrides

Use `-c` or `--config` for temporary changes:

```bash
codex -c 'model_reasoning_effort="high"'
codex -c 'sandbox_workspace_write.network_access=true'
codex -c 'features.hooks=true'
codex -c 'shell_environment_policy.include_only=["PATH","HOME"]'
```

The value after `-c` is parsed as TOML. Quote strings explicitly and quote the
whole argument so your shell does not split it.

Use one-off overrides when:

- You are testing a setting.
- You need network access for one setup command.
- You want higher reasoning for one review.
- You do not want to keep the setting after this run.

If you use the same override every week, promote it into a profile file.

## Profiles

Profiles are separate config files selected with `--profile`.

`~/.codex/review.config.toml`

```toml
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "untrusted"
```

Run it:

```bash
codex --profile review
```

`~/.codex/setup.config.toml`

```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

Run setup with a one-off network override:

```bash
codex --profile setup -c 'sandbox_workspace_write.network_access=true'
```

Use profile files for recurring modes:

| Profile | Use it for | Typical posture |
| --- | --- | --- |
| `workshop` | Normal guided feature work | Workspace write, interactive approvals |
| `review` | Read-only inspection or diff review | Read-only, stricter approvals |
| `setup` | Dependency or browser installation | Workspace write plus temporary network override |
| `automation` | Tested background checks | Narrow write access, explicit rules |
| `research` | Current documentation lookup | Web search enabled only for that run |

## Model And Reasoning Settings

Common model settings:

```toml
# Optional: pin a model from the current Codex model picker.
# model = "gpt-5.5"
model_reasoning_effort = "medium"
model_reasoning_summary = "auto"
model_verbosity = "medium"
```

Use these sparingly in shared workshop material because model names and
availability change. For Store Pulse, the workflow is more important than the
specific model string.

Useful pattern:

- Leave the model default alone for most participants.
- Increase reasoning in a review profile.
- Use lower reasoning only for fast, low-risk scans.
- Use Plan Mode for ambiguous tasks before editing.

Plan Mode can also have its own reasoning setting in current Codex
configuration:

```toml
plan_mode_reasoning_effort = "high"
```

Use that when plans need more careful architecture and risk analysis than
ordinary implementation turns.

## Sandbox And Approvals

The sandbox controls what Codex can access. Approval policy controls when Codex
asks before doing something.

Good interactive default:

```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"

[sandbox_workspace_write]
network_access = false
exclude_tmpdir_env_var = true
exclude_slash_tmp = true
```

Review profile:

```toml
# ~/.codex/review.config.toml
sandbox_mode = "read-only"
approval_policy = "untrusted"
model_reasoning_effort = "high"
```

Avoid this as a default:

```toml
sandbox_mode = "danger-full-access"
approval_policy = "never"
```

That pairing belongs only inside a disposable or externally constrained
environment. It is not a workshop default.

## Permission Profiles

Codex also supports named permission profiles for filesystem and network
policy. These are different from `--profile` config files.

Conceptually:

- **Config profile files:** Named bundles of Codex settings selected with
  `--profile`.
- **Permission profiles:** Reusable filesystem and network access policies.

Use config profiles for workflow posture. Use permission profiles only when you
need reusable, fine-grained filesystem or network policy.

## Feature Flags

Feature flags live under `[features]`:

```toml
[features]
hooks = true
plugins = true
goals = true
memories = false
```

Enable a feature from the CLI:

```bash
codex features enable goals
```

Disable one:

```bash
codex features disable memories
```

Check current feature state:

```bash
codex features list
```

Use canonical feature keys. For example, the command is `/goal`, but the feature
flag is `goals = true`.

## Web Search And Network Access

Web search and shell network access are separate.

Web search setting:

```toml
web_search = "cached"
```

Common values:

- `"cached"`: Use OpenAI's web search cache.
- `"live"`: Fetch current web results.
- `"disabled"`: Disable the web search tool.

Shell network setting:

```toml
[sandbox_workspace_write]
network_access = false
```

For Store Pulse:

- Use cached or disabled web search during normal feature work.
- Use live web search only for current documentation research.
- Keep shell network off except for setup commands such as `npm install` or
  `npx playwright install chromium`.

## Shell Environment Policy

Control which environment variables Codex forwards to subprocesses:

```toml
[shell_environment_policy]
inherit = "core"
exclude = ["*_TOKEN", "*_SECRET", "AWS_*"]
include_only = ["PATH", "HOME", "SHELL"]
set = { STORE_PULSE_MODE = "workshop" }
```

Use this to reduce accidental secret exposure while still giving commands the
paths and flags they need.

Good default:

- Inherit only the core environment.
- Exclude token and secret patterns.
- Add explicit variables with `set`.

Do not rely on shell inheritance for secrets. Prefer keychain-backed auth,
environment variables referenced by tool config, or setup-only secrets in cloud
environments.

## MCP Servers

MCP servers can be configured in `config.toml`:

```toml
[mcp_servers.company_docs]
command = "/Users/you/bin/company-docs-mcp"
args = ["--readonly"]
enabled = true
```

Use MCP when Codex needs structured tools or private data that should not come
from web search.

Guidelines:

- Prefer read-only tools first.
- Use environment variables for tokens.
- Keep server names descriptive.
- Disable servers that are irrelevant to the workshop.
- Run `codex mcp list` after changes.

## Hooks

Hooks can live in `hooks.json` or inline `[hooks]` tables beside active config
layers.

For most teams, prefer:

```text
~/.codex/hooks.json
.codex/hooks.json
```

Use inline TOML only when you have a specific reason to keep the hook definition
inside the same file:

```toml
[[hooks.PreToolUse]]
matcher = "^Bash$"

[[hooks.PreToolUse.hooks]]
type = "command"
command = "python3 /Users/you/.codex/hooks/check-shell-command.py"
timeout = 5
statusMessage = "Checking shell command"
```

If one layer has both `hooks.json` and inline `[hooks]`, Codex can load both and
warn. Prefer one representation per layer.

## Project Documentation Discovery

Codex discovers project instructions such as `AGENTS.md` by walking the
project tree. Useful config keys include:

```toml
project_doc_max_bytes = 65536
project_root_markers = [".git"]
```

Raise `project_doc_max_bytes` only when the repository has genuinely useful
agent guidance that is being truncated. If the file is too large because it
mixes every topic into one place, split task-specific guidance into reference
files and link to them.

## Terminal Interface Settings

Some useful local interface settings:

```toml
[tui]
alternate_screen = "auto"
notifications = true
notification_condition = "unfocused"

[tui.keymap.global]
open_transcript = "ctrl-t"
```

Keep interface settings personal. They should not be required for a repository
to work.

## Store Pulse Example

User default:

```toml
# ~/.codex/config.toml
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
approval_policy = "on-request"
web_search = "cached"

[sandbox_workspace_write]
network_access = false
exclude_tmpdir_env_var = true
exclude_slash_tmp = true

[features]
hooks = true
plugins = true
goals = true

[projects."/Users/you/Developer/store-pulse"]
trust_level = "trusted"
```

Review profile:

```toml
# ~/.codex/review.config.toml
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "untrusted"
```

Research profile:

```toml
# ~/.codex/research.config.toml
model_reasoning_effort = "medium"
web_search = "live"

[tools.web_search]
context_size = "medium"
allowed_domains = ["developers.openai.com"]
```

Setup profile:

```toml
# ~/.codex/setup.config.toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

Run setup with temporary network:

```bash
codex --profile setup -c 'sandbox_workspace_write.network_access=true'
```

## Troubleshooting

**A setting does not seem to apply:** Run `/status`, check `codex debug-config`
when available, and confirm which configuration layers loaded.

**A project setting is ignored:** Confirm the project is trusted and check
whether the key is disallowed in project-local config.

**A profile did not load:** Confirm the file name is
`~/.codex/<name>.config.toml` and that you launched Codex with
`--profile <name>`.

**A `-c` override fails:** Remember that values are TOML. Use quotes for
strings and quote the whole shell argument.

**A command cannot access the network:** Check shell network access under
`[sandbox_workspace_write]`. Web search settings do not grant shell network.

**A hook does not run:** Check `[features].hooks`, hook trust state, hook file
location, and whether the project `.codex/` layer is trusted.

## Verification

After editing configuration, run small checks before starting a long task:

```bash
codex features list
codex mcp list
codex --profile review debug prompt-input "Configuration smoke test"
codex -c 'model_reasoning_effort="low"' debug prompt-input "Temporary override"
```

For Store Pulse itself, confirm the repository gates still work:

```bash
npm run lint
npm run test
```

## Checklist

Before calling a `config.toml` change ready:

- The setting belongs in configuration, not `AGENTS.md` or the prompt.
- Secrets are not embedded in TOML.
- Project-local config contains only safe project-local behavior.
- Profile files use `~/.codex/<name>.config.toml`.
- Full access and non-interactive approvals are not casual defaults.
- Network access is no broader than the workflow requires.
- Hooks and MCP servers are easy to inspect.
- A small smoke test confirms the expected settings loaded.
