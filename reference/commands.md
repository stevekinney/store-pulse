# Codex Slash Commands

Slash commands are in-session controls for Codex. They let you change models,
inspect context, review changes, manage permissions, open configuration
pickers, and control the current conversation without writing a natural
language prompt.

This guide was written against `codex-cli 0.130.0`. Codex changes quickly, so
the most reliable live reference is the command picker inside Codex: type `/`
at the start of the composer and browse the list.

> [!NOTE]
> In `codex-cli 0.130.0`, `/help` is not a built-in command. Type `/` by itself
> to open the command picker.

## How Slash Commands Work

Slash commands run when the first line of your message starts with `/`.

Some commands run immediately:

```text
/status
```

Some commands accept inline arguments:

```text
/review focus on missing tests and behavior regressions
```

Some commands open a picker or settings panel:

```text
/model
```

Some commands are feature-gated, platform-specific, or only useful in
debug/development builds. If a command is not visible in the picker, your
current Codex build, feature flags, platform, or conversation state may not
support it.

## Best Defaults

These are the commands workshop participants should learn first:

| Command | Use it when |
| --- | --- |
| `/status` | You want to understand the current model, permissions, token usage, and session state. |
| `/model` | You want to switch model or reasoning effort for the next work. |
| `/permissions` | You want to adjust what Codex is allowed to do. |
| `/review` | You want Codex to review the current diff for bugs, regressions, and missing tests. |
| `/diff` | You want a quick view of current repository changes. |
| `/init` | You want Codex to draft an `AGENTS.md` file for the repository. |
| `/compact` | The conversation is getting long and you want to preserve the important context. |
| `/new` | You want a clean conversation without leaving Codex. |
| `/resume` | You want to continue an earlier conversation. |
| `/fork` | You want to branch from the current conversation context without losing the original. |
| `/copy` | You want the last Codex response as Markdown. |
| `/quit` | You are done with the session. |

## Workflow Commands

### `/status`

Shows current session configuration and token usage.

Use it when you want to answer questions like:

- Which model and reasoning effort am I using?
- What directory is Codex working in?
- How much context is left?
- What are the current permission and sandbox settings?

Best use:

```text
/status
```

Run this before a long task if you are unsure which model, directory, or
permission profile is active.

### `/model`

Opens the model picker.

Use it when a task needs a different tradeoff:

- A faster model for simple edits.
- A stronger model for planning, debugging, or deep code review.
- A different reasoning effort for complex work.

Best use:

```text
/model
```

Pick the model before giving the task prompt. Do not switch models in the
middle of a fragile debugging loop unless you have a reason.

### `/fast`

Toggles Fast mode, when the feature is enabled.

Supported inline forms:

```text
/fast on
/fast off
/fast status
```

Use it for small, low-risk tasks where latency matters more than deep
reasoning. Avoid it for large refactors, ambiguous bugs, schema changes, or
security-sensitive work.

### `/permissions`

Opens the permissions picker.

Use it when Codex needs different access than the current session allows:

- More filesystem access.
- Different command approval behavior.
- A safer mode for exploratory review.

Best use:

```text
/permissions
```

For workshop demos, this command is useful because it makes the safety model
visible. Pair it with `/status` so participants can see both the current
settings and the available choices.

### `/review`

Starts a review of the current changes. With no arguments, Codex opens the
review flow for the current diff. With arguments, Codex uses the text as custom
review instructions.

Best use:

```text
/review
```

More focused:

```text
/review focus on behavior regressions, missing tests, and violations of AGENTS.md
```

Use `/review` after implementation but before committing or opening a pull
request. It is most useful when there is already a meaningful diff.

### `/diff`

Shows the current Git diff, including untracked files.

Best use:

```text
/diff
```

Use this before asking for review, before summarizing work, or when you need to
check whether Codex touched more files than expected.

### `/compact`

Summarizes the conversation so Codex can continue without hitting the context
limit.

Best use:

```text
/compact
```

Use it after a phase completes:

- After a plan is approved.
- After a large implementation lands.
- After a long debugging loop identifies the root cause.

Do not use it in the middle of an unresolved failure unless the current state
has been clearly summarized in the conversation.

### `/init`

Asks Codex to create an `AGENTS.md` file for the current repository. Codex will
skip the command if `AGENTS.md` already exists in the current directory.

Best use:

```text
/init
```

Use it in a repository that does not already have agent instructions. After it
runs, review the file carefully. `AGENTS.md` should describe the real project,
not generic preferences.

### `/plan`

Switches to Plan mode, when collaboration modes are enabled. It can also accept
inline prompt text.

Best use:

```text
/plan
```

With a prompt:

```text
/plan add a regional reporting dashboard, but do not edit files yet
```

Use Plan mode when the task has design choices, schema changes, broad
refactors, or unclear ownership. Exit planning only after the plan names files,
tests, commands, risks, and a completion signal.

### `/goal`

Sets or opens the goal for a long-running task, when goals are enabled.

Common forms:

```text
/goal
/goal finish the regional dashboard and leave the repository green
/goal pause
/goal resume
/goal clear
```

Use it when Codex is expected to keep working across multiple turns or
checkpoints. A good goal is outcome-oriented and verifiable.

### `/collab`

Changes collaboration mode, when collaboration modes are enabled.

Best use:

```text
/collab
```

Use it when you want to switch between working styles, such as planning,
default implementation, or other collaboration modes available in your Codex
build.

## Conversation Management

### `/new`

Starts a new chat during a conversation.

Best use:

```text
/new
```

Use it when the next task is unrelated and prior context would distract Codex.
Do not use it when the next task depends on the current diff or debugging
history.

### `/clear`

Clears the terminal and starts a new chat.

Best use:

```text
/clear
```

Use it when the terminal display is noisy and you want a clean screen. Treat it
as a stronger reset than `/new`.

### `/resume`

Opens a picker for saved chats. It can also accept a session id or name.

Best use:

```text
/resume
```

With an id or name:

```text
/resume <session-id-or-name>
```

Use it when returning to a previous thread of work. After resuming, ask Codex
to re-check current repository state before editing, because files may have
changed since the earlier session.

### `/fork`

Forks the current chat.

Best use:

```text
/fork
```

Use it when you want to explore an alternate approach without losing the
original thread. This is useful for comparing implementation strategies or
trying a risky refactor in a separate conversation path.

### `/rename`

Renames the current thread. With no arguments, it opens a prompt. With
arguments, it renames directly.

Best use:

```text
/rename store-pulse reorder suggestions
```

Use concrete names that will make sense later in `/resume`.

### `/side`

Starts a side conversation in an ephemeral fork. With arguments, it starts the
side conversation with that question.

Best use:

```text
/side explain the risk in this migration without changing files
```

Use side conversations for quick questions that should not derail the main
thread. They are useful for explanations, tradeoff checks, and small
investigations while the main task remains intact.

### `/agent` and `/subagents`

Switch the active agent thread.

Best use:

```text
/agent
```

Use these when working in a Codex session that has multiple agent threads or
subagents. For a beginner workshop, mention the concept but do not start here.

### `/quit` and `/exit`

Exit Codex.

Best use:

```text
/quit
```

`/exit` is equivalent. Use whichever is easier to remember.

### `/logout`

Logs out of Codex.

Best use:

```text
/logout
```

Use this when changing accounts, clearing credentials, or preparing a shared
machine. It is not part of normal day-to-day project work.

## Context And Input Commands

### `/mention`

Inserts `@` so you can mention a file.

Best use:

```text
/mention
```

Use mentions when a prompt should anchor to a specific file, image, skill, or
other selectable context item. For code work, this is often better than
describing a file path loosely.

### `/ide`

Includes current selection, open files, and other context from your IDE when
IDE integration is available.

Best use:

```text
/ide
```

Some builds support inline arguments for IDE behavior. The safest pattern is
to open the command and follow the UI.

Use it when you want Codex to see the code you are looking at in the editor.
Do not assume IDE context replaces repository inspection; still ask Codex to
read the owning files before making changes.

### `/copy`

Copies the last Codex response as Markdown.

Best use:

```text
/copy
```

Use it for plans, review summaries, generated prompts, or documentation drafts
that you want to paste elsewhere.

### `/raw`

Toggles raw scrollback mode for copy-friendly terminal selection.

Supported inline forms:

```text
/raw on
/raw off
```

Use it when terminal styling is getting in the way of copying text. Turn it off
when you want the normal Codex TUI rendering back.

## Configuration And Interface Commands

### `/keymap`

Opens the keymap picker.

Common forms:

```text
/keymap
/keymap debug
```

Use it when keyboard shortcuts conflict with your terminal, editor habits, or
accessibility needs. `/keymap debug` is useful when a custom keymap is not
behaving as expected.

### `/vim`

Toggles Vim mode for the composer.

Best use:

```text
/vim
```

Use it if you prefer Vim-style editing while composing prompts. If students are
new to terminal editing, leave it off.

### `/theme`

Chooses a syntax highlighting theme.

Best use:

```text
/theme
```

Use it when code blocks or diffs are hard to read in your terminal theme.

### `/title`

Configures which items appear in the terminal title.

Best use:

```text
/title
```

Useful when you run multiple Codex sessions and want browser or terminal tabs
to identify the current project, branch, or thread.

### `/statusline`

Configures which items appear in the status line.

Best use:

```text
/statusline
```

Use it to tune the always-visible session summary. For workshops, the status
line can make model, directory, and context state easier to discuss.

### `/personality`

Chooses a communication style for Codex, when the feature is enabled.

Best use:

```text
/personality
```

Use it to change how Codex communicates, not what it is allowed to do.
Technical constraints still belong in the prompt or `AGENTS.md`.

### `/experimental`

Opens experimental feature toggles.

Best use:

```text
/experimental
```

Use it intentionally. Experimental features may change behavior, availability,
or UI. For a classroom demo, keep the environment stable unless the feature is
part of the lesson.

## Tools, Integrations, And Extensions

### `/skills`

Opens the skills menu.

Best use:

```text
/skills
```

Use it when a task matches a skill, such as documentation authoring, skill
creation, browser automation, or a project-specific workflow. Skills are most
valuable when they carry repeated process or domain context.

### `/hooks`

Views and manages lifecycle hooks.

Best use:

```text
/hooks
```

Use it to inspect automation around prompt submission, tool use, planning
gates, and other Codex lifecycle events. Hooks can explain why a workflow is
being blocked or why extra context appears.

### `/memories`

Configures memory use and generation.

Best use:

```text
/memories
```

Use it when you want to understand or adjust how Codex uses saved memory.
Memory can improve continuity across sessions, but it should not replace
repository inspection or explicit task prompts.

### `/mcp`

Lists configured MCP tools. With `verbose`, it shows more detail.

Common forms:

```text
/mcp
/mcp verbose
```

Use it before asking the user to do something manually. If a configured MCP
server or tool can inspect the data, Codex should usually try that first.

### `/apps`

Manages apps/connectors, when connector support is enabled.

Best use:

```text
/apps
```

Use it when the task needs connected data or actions from services such as
calendar, email, Slack, GitHub, or other installed connectors.

### `/plugins`

Browses plugins, when plugin support is enabled.

Best use:

```text
/plugins
```

Use it when you need to discover or enable plugin-provided skills, tools, or
workflows.

## Review, Diagnostics, And Process Commands

### `/debug-config`

Shows configuration layers and requirement sources for debugging.

Best use:

```text
/debug-config
```

Use it when Codex behavior does not match your expectations. It can help answer
where a setting came from: local configuration, managed requirements, feature
flags, or another layer.

### `/ps`

Lists background terminals.

Best use:

```text
/ps
```

Use it when Codex started development servers, test watchers, or long-running
commands and you need to see what is still alive.

### `/stop` and `/clean`

Stops all background terminals.

Best use:

```text
/stop
```

`/clean` is an alias for `/stop`.

Use it when a task is finished and background processes should be cleaned up,
or when a stale server is interfering with the next run.

### `/approve`

Approves one retry of a recent auto-review denial.

Best use:

```text
/approve
```

Use it only when you understand why auto-review denied a previous action and
you want to allow one retry. Do not use it to bypass a real safety concern.

### `/feedback`

Sends logs or feedback to maintainers, when feedback is enabled.

Best use:

```text
/feedback
```

Use it for Codex product feedback, confusing behavior, or reproducible issues
with the tool itself. Do not use it for normal project questions.

### `/rollout`

Prints the rollout file path in debug builds.

Best use:

```text
/rollout
```

This is mainly useful for debugging Codex sessions or locating the local
conversation artifact. It may not be visible in release builds.

## Voice And Realtime Commands

### `/realtime`

Toggles realtime voice mode, when the experimental feature is enabled.

Best use:

```text
/realtime
```

Use it when voice interaction is part of the workflow. For code review,
documentation, and classroom demos, text prompts are usually easier to audit.

### `/settings`

Configures realtime microphone and speaker settings, when audio device
selection is enabled.

Best use:

```text
/settings
```

Use it with `/realtime`, not as a general Codex settings command.

## Platform-Specific Commands

### `/setup-default-sandbox`

Sets up elevated agent sandboxing on supported Windows configurations.

Best use:

```text
/setup-default-sandbox
```

This command is platform-specific and should not appear on macOS or Linux in a
normal release build.

### `/sandbox-add-read-dir`

Allows the Windows sandbox to read an absolute directory path.

Best use:

```text
/sandbox-add-read-dir C:\path\to\directory
```

Use it only when a Windows sandboxed session needs read access outside the
current workspace.

## Internal Or Debug Commands

These commands exist in the command enum but are not good workshop material.
Avoid them unless you are debugging Codex itself.

| Command | Notes |
| --- | --- |
| `/test-approval` | Debug command for approval request testing. |
| `/debug-m-drop` | Internal memory maintenance command marked "DO NOT USE" in the source. |
| `/debug-m-update` | Internal memory maintenance command marked "DO NOT USE" in the source. |

## Command Availability Rules

Not every command is available all the time.

**Feature-gated:** `/plan`, `/collab`, `/goal`, `/fast`, `/personality`,
`/realtime`, `/settings`, `/apps`, and `/plugins` depend on enabled features or
configured integrations.

**Platform-specific:** `/setup-default-sandbox` and `/sandbox-add-read-dir`
are Windows sandbox commands.

**Debug-only:** `/rollout` and `/test-approval` are intended for debug builds.

**Side conversations:** In a side conversation, the visible built-ins are much
narrower. In `codex-cli 0.130.0`, side conversations allow `/ide`, `/copy`,
`/raw`, `/diff`, `/mention`, and `/status`.

**While a task is running:** Some commands are disabled while Codex is actively
working. Safe inspection commands such as `/status`, `/diff`, `/copy`, `/ps`,
`/stop`, `/mcp`, `/apps`, and `/plugins` remain available.

## Recommended Workshop Flow

For the Store Pulse workshop, this is a useful command sequence to demonstrate:

```text
/status
```

Show the current model, directory, and context.

```text
/init
```

Use this only in a repository without `AGENTS.md`. For Store Pulse, point out
that the file already exists and should not be overwritten.

```text
/model
```

Show that model choice is a workflow decision.

```text
/permissions
```

Show that Codex has a safety model and that permissions are explicit.

```text
/review
```

After a feature implementation, use this to review the diff.

```text
/diff
```

Use this to inspect the actual changes.

```text
/compact
```

After a completed phase, compact the thread before continuing.

## Common Mistakes

**Using slash commands as prompts:** `/review` is a command. `Review this code`
is a prompt. Use slash commands to control Codex; use prompts to define the
work.

**Expecting `/help`:** Type `/` to open the command picker.

**Reviewing before there is a diff:** `/review` is most useful after changes
exist.

**Compacting too early:** `/compact` is best after the current state is clear.

**Changing permissions casually:** `/permissions` is powerful. Adjust access to
fit the task, not as a reflex.

**Ignoring feature gates:** If a command is missing, check `/status`,
`/debug-config`, and the command picker before assuming the docs are wrong.

## Quick Reference

| Command | Purpose |
| --- | --- |
| `/agent` | Switch active agent thread. |
| `/apps` | Manage apps/connectors. |
| `/approve` | Approve one retry of a recent auto-review denial. |
| `/clear` | Clear the terminal and start a new chat. |
| `/collab` | Change collaboration mode. |
| `/compact` | Summarize conversation context. |
| `/copy` | Copy the last response as Markdown. |
| `/debug-config` | Show configuration layers and requirement sources. |
| `/debug-m-drop` | Internal memory maintenance command. Do not use in normal work. |
| `/debug-m-update` | Internal memory maintenance command. Do not use in normal work. |
| `/diff` | Show the current Git diff, including untracked files. |
| `/exit` | Exit Codex. |
| `/experimental` | Toggle experimental features. |
| `/fast` | Toggle or inspect Fast mode. |
| `/feedback` | Send logs or feedback to maintainers. |
| `/fork` | Fork the current chat. |
| `/goal` | Set, view, pause, resume, or clear a task goal. |
| `/hooks` | View and manage lifecycle hooks. |
| `/ide` | Include context from IDE integration. |
| `/init` | Create an `AGENTS.md` file when one does not exist. |
| `/keymap` | Configure TUI shortcuts. |
| `/logout` | Log out of Codex. |
| `/mcp` | List configured MCP tools. |
| `/memories` | Configure memory use and generation. |
| `/mention` | Insert a mention. |
| `/model` | Choose model and reasoning effort. |
| `/new` | Start a new chat. |
| `/permissions` | Choose what Codex is allowed to do. |
| `/personality` | Choose communication style. |
| `/plan` | Switch to Plan mode. |
| `/plugins` | Browse plugins. |
| `/ps` | List background terminals. |
| `/quit` | Exit Codex. |
| `/raw` | Toggle raw scrollback mode. |
| `/realtime` | Toggle realtime voice mode. |
| `/rename` | Rename the current thread. |
| `/resume` | Resume a saved chat. |
| `/review` | Review current changes. |
| `/rollout` | Print the rollout file path in debug builds. |
| `/sandbox-add-read-dir` | Grant Windows sandbox read access to an absolute path. |
| `/settings` | Configure realtime microphone/speaker. |
| `/setup-default-sandbox` | Set up elevated sandboxing on supported Windows configurations. |
| `/side` | Start a side conversation. |
| `/skills` | Open the skills menu. |
| `/status` | Show session configuration and token usage. |
| `/statusline` | Configure status line items. |
| `/stop` | Stop background terminals. |
| `/clean` | Alias for `/stop`. |
| `/subagents` | Switch active agent thread. |
| `/test-approval` | Debug approval request command. |
| `/theme` | Choose syntax highlighting theme. |
| `/title` | Configure terminal title items. |
| `/vim` | Toggle Vim mode. |
