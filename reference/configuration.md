# Codex Configuration

Codex reads persistent local settings from `config.toml`. Use it for tool
behavior: model defaults, sandboxing, approvals, feature flags, MCP servers,
profiles, terminal behavior, hooks, and local trust.

Use `AGENTS.md` for repository instructions. Use `config.toml` for the local
Codex environment.

For this workshop, the useful mental model is:

- `AGENTS.md` explains how the project works.
- `reference/*.md` explains how to use Codex well.
- `~/.codex/config.toml` controls how Codex behaves on this machine.
- `.codex/config.toml`, when present in a trusted project, can add narrow
  project-specific Codex settings.

This guide is written against `codex-cli 0.130.0`.

## What `config.toml` Is

`config.toml` is a TOML file that Codex loads before it starts a session. It is
where you make durable local choices that should apply across prompts instead of
passing flags every time.

Common examples:

- Choose the default reasoning effort.
- Define named profiles for different workflows.
- Set the default sandbox and approval behavior.
- Enable stable features such as hooks or plugins.
- Register MCP servers.
- Control shell environment inheritance.
- Set terminal interface preferences.
- Trust specific project directories.

The file is local machine policy. It should not become a dumping ground for
project requirements, credentials, or one-off prompt instructions.

## Where It Lives

The main file is:

```text
~/.codex/config.toml
```

Codex can also read project-local configuration from:

```text
.codex/config.toml
```

Project-local configuration is only loaded from trusted projects. That matters
because repository contents can come from other people. Codex intentionally
disables project-local configuration, hooks, and execution policies when a
project is not trusted.

A project can be marked trusted in the user-level configuration:

```toml
[projects."/Users/you/Developer/store-pulse"]
trust_level = "trusted"
```

Related files often live beside `config.toml`:

- `~/.codex/hooks.json` for user-wide hook definitions.
- `.codex/hooks.json` for trusted project-specific hook definitions.
- `~/.codex/history.jsonl` for local prompt history when history is enabled.
- `~/.codex/log/` for local logs.
- `~/.codex/auth.json` or the system keychain for credentials, depending on
  credential-store settings.

`config.toml` is configuration. It is not the only state Codex keeps.

## Configuration Layers

Codex combines configuration from multiple places. The practical order to
remember is:

1. User configuration in `~/.codex/config.toml` provides the usual defaults.
2. Trusted project configuration in `.codex/config.toml` can add project-local
   settings.
3. CLI flags and session overrides win for the current invocation.
4. Managed or administrative requirements may constrain what lower layers can
   do.

Temporary overrides are useful when you want to test a setting without editing
the file:

```bash
codex -c 'model_reasoning_effort="high"'
codex --profile review
codex --enable hooks
codex --disable memories
```

The `-c` flag accepts dotted keys and parses values as TOML:

```bash
codex -c 'shell_environment_policy.inherit="core"'
codex -c 'features.hooks=true'
```

## Project-Local Limits

Project-local configuration is intentionally restricted. A repository should not
be able to silently change your provider, endpoint, notification command, global
profiles, or telemetry behavior.

Do not put these settings in `.codex/config.toml`:

- `openai_base_url`
- `chatgpt_base_url`
- `model_provider`
- `model_providers`
- `notify`
- `profile`
- `profiles`
- `experimental_realtime_ws_base_url`
- `otel`

Keep shared project configuration narrow. Good candidates are small,
project-specific feature toggles or tool settings that are safe for every
contributor who trusts the project.

For Store Pulse, `AGENTS.md` already carries the important repository guidance:
use `npm`, match the existing Next.js and Prisma structure, keep database access
in `lib/`, and prefer unit tests for pure helpers. Do not duplicate those rules
in `config.toml`.

## Model And Reasoning

The most common personal configuration is the default model behavior.

```toml
model_reasoning_effort = "medium"
plan_mode_reasoning_effort = "high"
model_reasoning_summary = "auto"
model_verbosity = "medium"
```

Supported reasoning effort values are:

```text
none, minimal, low, medium, high, xhigh
```

Supported reasoning summary values are:

```text
auto, concise, detailed, none
```

Supported verbosity values are:

```text
low, medium, high
```

Avoid pinning a specific model in shared workshop material unless the lesson
requires it. Model names and availability change over time, while the workflow
lesson usually does not.

If you do set a model locally, keep it in your user configuration or a named
profile. Use a model name from the current Codex model picker or from the
official documentation, not a copied value from old workshop material.

## Profiles

Profiles are named bundles of settings. They are the cleanest way to switch
between workflows without repeatedly editing the base configuration.

```toml
profile = "workshop"

[profiles.workshop]
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
approval_policy = "on-request"

[profiles.review]
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "untrusted"

[profiles.automation]
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
approval_policy = "never"
```

Use a profile for a durable mode of work:

- `workshop` for normal guided development.
- `review` for read-only code review.
- `automation` for non-interactive runs where the environment already supplies
  guardrails.

Run a profile with:

```bash
codex --profile review
```

## Sandbox And Approvals

The sandbox controls what commands can touch. The approval policy controls when
Codex asks before doing something.

```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

Supported sandbox modes:

- `read-only`: commands can inspect, but not write.
- `workspace-write`: commands can write inside the workspace and configured
  writable roots.
- `danger-full-access`: commands run without filesystem sandboxing.

Supported approval policies:

- `untrusted`: only known safe read commands run automatically.
- `on-request`: Codex decides when it needs user approval.
- `never`: Codex never asks; failures are returned to the model.

`on-failure` exists for older workflows, but it is deprecated. Prefer
`on-request` for interactive work and `never` only for controlled
non-interactive automation.

For most workshops, this is the right default:

```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

You can tune workspace-write behavior:

```toml
[sandbox_workspace_write]
writable_roots = ["/Users/you/Developer/store-pulse"]
network_access = false
exclude_tmpdir_env_var = true
exclude_slash_tmp = true
```

Best practice: use the narrowest sandbox that still lets Codex complete the
task. Use `read-only` for review and exploration. Use `workspace-write` for
normal implementation. Reserve `danger-full-access` for trusted local
environments where other controls already exist.

## Features

Feature flags let you enable or disable Codex capabilities.

```toml
[features]
hooks = true
plugins = true
tool_search = true
memories = true
```

Check available features:

```bash
codex features list
```

Temporarily enable or disable a feature for one run:

```bash
codex --enable hooks
codex --disable memories
```

Best practice: enable stable features intentionally and avoid building workshop
instructions around under-development features unless the lesson is specifically
about that feature.

## Hooks

Hooks are enabled through configuration:

```toml
[features]
hooks = true
```

Hook definitions usually belong in `hooks.json` rather than inline TOML:

- `~/.codex/hooks.json` for user-wide hooks.
- `.codex/hooks.json` for project-specific hooks in a trusted project.

Codex can also read hook definitions from `config.toml`, but use one
representation per layer. If the same layer contains both `hooks.json` and TOML
hooks, Codex will load both and warn that the layer should use one format.

For more detail, see `reference/hooks.md`.

## MCP Servers

MCP servers connect Codex to external tools and data sources. You can edit
`config.toml` directly, but the safer path is to use the Codex MCP commands:

```bash
codex mcp list
codex mcp add
codex mcp get <server-name>
codex mcp remove <server-name>
```

A local standard input/output server looks like this:

```toml
[mcp_servers.local_tasks]
command = "/Users/you/.local/bin/tasks-mcp"
args = ["--cwd", "/Users/you/Developer/store-pulse"]
startup_timeout_sec = 10
tool_timeout_sec = 30
default_tools_approval_mode = "prompt"
enabled_tools = ["tasks/list", "tasks/read"]
```

An HTTP server looks like this:

```toml
[mcp_servers.company_docs]
url = "https://mcp.example.com/mcp"
bearer_token_env_var = "COMPANY_DOCS_MCP_TOKEN"
startup_timeout_sec = 10
tool_timeout_sec = 30
default_tools_approval_mode = "prompt"
```

Use environment variables for secrets. Do not paste tokens directly into
`config.toml`.

Common MCP settings:

- `enabled = false` to keep a server registered but disabled.
- `required = true` when a missing server should fail startup.
- `enabled_tools = [...]` to expose only specific tools.
- `disabled_tools = [...]` to hide risky or noisy tools.
- `default_tools_approval_mode = "prompt"` to require confirmation before tool
  calls from that server.

Best practice: start MCP servers with the smallest tool surface that proves the
workflow. Add more tools only when the workflow needs them.

## Shell Environment

Codex can inherit environment variables from your shell. Tightening this is one
of the simplest ways to avoid accidental credential exposure.

```toml
[shell_environment_policy]
inherit = "core"
ignore_default_excludes = false
exclude = ["*TOKEN*", "*SECRET*", "*KEY*"]
set = { NODE_ENV = "development" }
```

Supported inheritance modes:

- `all`: inherit the full environment.
- `core`: inherit a smaller core environment.
- `none`: inherit nothing unless explicitly set.

Useful settings:

- `exclude` removes matching environment variables.
- `set` adds explicit environment variables.
- `include_only` allows only matching environment variables.
- `experimental_use_profile` can load environment from a shell profile.

Best practice: use `core` for day-to-day work and explicitly add what the
project needs. Never store secrets in `set`.

## Web Search

Web search is useful when the answer can change or when current official
documentation matters.

```toml
web_search = "cached"

[tools.web_search]
context_size = "medium"
allowed_domains = ["developers.openai.com"]
```

Supported web search modes:

- `disabled`
- `cached`
- `live`

You can also enable live search for one invocation:

```bash
codex --search
```

Best practice: keep workshop coding prompts grounded in the repository first.
Use live search when the task depends on current external facts, API behavior,
package documentation, or release status.

## Terminal Interface

Terminal preferences belong in the `tui` table.

```toml
[tui]
alternate_screen = "auto"
notifications = true
notification_condition = "unfocused"
notification_method = "auto"
vim_mode_default = false
```

Useful settings:

- `alternate_screen = "auto" | "always" | "never"` controls whether Codex uses
  the terminal alternate screen.
- `notifications = true` enables local notifications.
- `notification_condition = "unfocused" | "always"` controls when notifications
  appear.
- `notification_method = "auto" | "osc9" | "bel"` controls how notifications
  are sent.
- `vim_mode_default = true` starts interactive Codex in Vim keybinding mode.
- `session_picker_view = "list" | "tui" | "dense"` changes the resume-session
  picker layout.

Best practice: keep interface settings personal. They are not usually project
requirements.

## History And Privacy

History settings control local prompt history.

```toml
[history]
persistence = "save-all"
max_bytes = 10485760
```

To disable saved history:

```toml
[history]
persistence = "none"
```

Credential-store settings control where Codex keeps authentication material:

```toml
cli_auth_credentials_store = "auto"
mcp_oauth_credentials_store = "auto"
```

Supported user credential-store modes include:

```text
auto, file, keyring, ephemeral
```

Best practice: prefer `auto` or `keyring` for normal use. Use `ephemeral` only
when you intentionally want credentials to disappear after the session.

## File Opening

Codex can generate clickable file links for editors that support URI-based file
opening.

```toml
file_opener = "vscode"
```

Supported values include:

```text
vscode, vscode-insiders, windsurf, cursor, none
```

Use the editor your workshop participants already have installed. If the editor
varies across the room, leave this as a personal setting instead of documenting
one shared value.

## Project Documentation Discovery

Codex reads project instruction files such as `AGENTS.md`. You can tune how much
project documentation it reads:

```toml
project_doc_max_bytes = 32768
project_doc_fallback_filenames = ["CLAUDE.md"]
```

For Store Pulse, this usually does not need adjustment. The repository already
has a focused `AGENTS.md`, and the workshop reference material lives in
`reference/`.

Best practice: fix bloated or unclear project instructions at the source before
increasing byte limits. A larger context window is not a substitute for a clear
briefing.

## Plugins, Apps, And Skills

Codex can discover and use plugins, apps, and skills. The exact configuration
surface depends on what is installed, but the common pattern is to enable the
capability and then let Codex discover tools as needed.

```toml
[features]
plugins = true
apps = true
```

Use these settings when you want to:

- Disable an installed plugin without uninstalling it.
- Keep workshop machines on a known tool surface.
- Avoid loading plugins that are irrelevant to the lesson.

Best practice: for a workshop repository, document which plugins or skills the
lesson uses, but avoid requiring every participant to share your personal
plugin configuration.

Installed plugin keys are specific to the machine. If you disable a plugin in
`config.toml`, use the exact key already present in the local configuration or
the plugin marketplace output.

## Instructions In Configuration

`config.toml` can hold instruction text:

```toml
instructions = "Always keep final responses concise."
developer_instructions = "Prefer narrow, reversible edits."
model_instructions_file = "/Users/you/.codex/instructions.md"
```

Use this sparingly. Repository behavior belongs in `AGENTS.md`, not in every
developer's personal configuration. Personal response preferences can live in
`config.toml`, but project rules should be visible in the project.

Best practice: if a rule matters to everyone working on Store Pulse, put it in
`AGENTS.md`. If it only matters to your local Codex sessions, put it in
`config.toml`.

## Workshop Recipes

These are starting points, not universal defaults.

### Normal Workshop Development

Use this when participants are asking Codex to inspect, plan, edit files, and
run local checks.

```toml
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
approval_policy = "on-request"
web_search = "cached"

[features]
hooks = true
plugins = true
tool_search = true

[tui]
alternate_screen = "auto"
notifications = true
notification_condition = "unfocused"
```

### Read-Only Review

Use this when Codex should review code without making changes.

```toml
[profiles.review]
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "untrusted"
```

Run it with:

```bash
codex --profile review
```

### Controlled Automation

Use this only when the surrounding environment is already constrained and the
task is safe to run without interactive approvals.

```toml
[profiles.automation]
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"
approval_policy = "never"
```

Run it with:

```bash
codex --profile automation exec "Run npm test and summarize the result."
```

### Official Documentation Research

Use this when the task depends on current external documentation.

```toml
[profiles.research]
model_reasoning_effort = "medium"
web_search = "live"

[profiles.research.tools.web_search]
context_size = "medium"
allowed_domains = ["developers.openai.com"]
```

Run it with:

```bash
codex --profile research
```

## Verification

After editing `config.toml`, start with small checks.

Check feature flags:

```bash
codex features list
```

Check MCP server registration:

```bash
codex mcp list
```

Render the model-visible prompt input for a smoke test:

```bash
codex debug prompt-input "Configuration smoke test"
```

Run a one-off override without changing the file:

```bash
codex -c 'model_reasoning_effort="low"' debug prompt-input "Temporary override test"
```

For project-local settings, start Codex from the target repository and confirm
the project is trusted. If a trusted-project setting does not seem to apply,
check whether it is one of the project-local denied keys listed earlier in this
guide.

## Best Practices

Keep user configuration personal. Do not commit `~/.codex/config.toml`, copied
tokens, machine-specific paths, or private provider details into a repository.

Use project-local configuration only for safe project-local behavior. A trusted
project can influence the session, so keep `.codex/config.toml` narrow and easy
to audit.

Prefer profiles over repeated editing. If you switch between workshop,
read-only review, and automation, define profiles and use `codex --profile`.

Use CLI overrides for experiments. If a setting is not worth keeping after the
current session, pass it with `-c`, `--enable`, `--disable`, or the matching
command-line flag.

Keep the sandbox conservative. `workspace-write` is the normal implementation
mode. `read-only` is ideal for review. `danger-full-access` should be a
deliberate exception.

Keep approvals meaningful. `on-request` is a good interactive default. `never`
belongs in automation only when the environment is already safe.

Do not store secrets in configuration. Use environment variables, the keychain,
or the relevant credential-store setting.

Avoid duplicating project instructions. Put repository conventions in
`AGENTS.md`; put local Codex behavior in `config.toml`.

Comment unusual settings. Six months from now, a comment explaining why a
setting exists is more useful than a clever profile name.

Audit enabled tools before a workshop. Run `codex features list` and
`codex mcp list` on the machine you plan to use so the demo environment matches
the lesson.
