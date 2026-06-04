# Store Pulse Codex Reference

These documents support the Store Pulse Codex workshop. The main workshop is a
one-hour follow-along run that takes one feature from repository inspection to
verified diff.

## Main Workshop Path

Start here:

1. [One-Hour Store Pulse Codex Workshop](./one-hour-workshop.md): The primary
   60-minute runbook. Participants use Codex to add smart reorder suggestions
   while practicing inspection, planning, TDD, implementation, verification,
   review, and final handoff.
2. [Getting Started](./getting-started.md): Setup and preflight. Use this before
   the workshop when participants need to install dependencies, verify the local
   database, or confirm Codex session state.
3. [Next Feature Prompts](./next-prompts.md): The canonical smart reorder prompt
   plus optional extension prompts for participants who finish early or want
   extra practice.

The one-hour workshop should not require participants to read every reference
document below. Use the extended references only when the facilitator wants to
explain a concept in more depth or debug a specific failure.

## Codex Capabilities In Depth

These are the deeper Codex topics most useful after the one-hour feature run:

- [Using Subagents in Codex](./subagents.md): Parallel agent threads,
  delegation boundaries, ownership rules, review patterns, and Store Pulse
  examples.
- [Using Hooks with Codex](./hooks.md): Lifecycle hooks, matchers, payloads,
  trust review, local scripts, testing hooks, and workshop-safe hook ideas.
- [Using Environments with Codex](./environments.md): Cloud environments,
  local environments, setup scripts, secrets, caching, internet access, and
  Store Pulse environment defaults.
- [Computer Use with Codex](./computer-use.md): When Codex should operate
  graphical apps, how permissions work, what it can see and do, and how to keep
  desktop tasks scoped.
- [The Codex Chrome Extension](./chrome-extension.md): When to use Chrome
  instead of the in-app browser, setup, website permissions, browser history,
  file uploads, and troubleshooting.
- [Codex Settings You Want to Know About and Might Want to Change](./settings.md):
  App settings, profiles, `config.toml`, Git settings, MCP, browser use,
  Computer Use, memories, and workshop-safe defaults.
- [`config.toml` Deep Dive](./config-toml-deep-dive.md): Configuration
  precedence, user versus project config, profile files, feature flags,
  sandboxing, shell environment policy, MCP, hooks, and Store Pulse examples.
- [Best Practices for Skills with Codex](./skills.md): How skills trigger, where
  they live, how they differ from plugins, and Store Pulse-specific skill
  examples.
- [Useful Plugins for Codex](./plugins.md): Browser, Chrome, GitHub, Codex
  Security, Google Workspace, Slack, Gmail, Calendar, Data Analytics, Product
  Design, Sites, and when to avoid plugins.
- [Using Automations with Codex](./automations.md): Thread automations,
  standalone automations, worktree isolation, sandbox behavior, durable prompts,
  testing, and cleanup.
- [Plan Mode and Goals in Codex](./plan-mode-and-goals.md): When to use
  `/plan`, how to shape a plan before implementation, how to enable the
  `features.goals` flag, and how to use `/goal` for persistent objectives.

## Extended Reference

- [Codex Safety Model](./safety.md): Sandboxing, approvals, network access, and
  trust boundaries.
- [Codex Configuration](./configuration.md): Local `config.toml` settings,
  profiles, features, MCP servers, and project documentation discovery.
- [Codex Slash Commands](./commands.md): In-session controls such as `/status`,
  `/diff`, `/review`, `/compact`, and `/permissions`.
- [AGENTS.md Best Practices](./agents-md-best-practices.md): How to write a
  project briefing that gives Codex durable repository truth.
- [Context Management with Codex](./context-management.md): How to keep Codex
  focused on the right files, evidence, and session state.
- [Prompting Best Practices for Codex](./prompting-best-practices.md): Prompt
  patterns for planning, implementation, debugging, review, and documentation.
- [Review and Verification with Codex](./review-and-verification.md): How to
  inspect a diff, choose quality gates, diagnose failures, and finish with a
  known repository state.
- [Using Hooks with Codex](./hooks.md): Lifecycle commands that can inject
  context, enforce guardrails, or remind participants to verify work.
- [Using Subagents in Codex](./subagents.md): Splitting bounded work across
  additional agent threads when a larger task justifies it.
- [Git Worktrees with Codex](./worktrees.md): Isolating branches, Codex
  sessions, and dev servers in separate working directories.
- [Troubleshooting Codex Sessions](./troubleshooting.md): Recovery prompts and
  diagnosis paths when setup, tests, build, Prisma, or Codex context goes wrong.

## Facilitator Rule Of Thumb

Use the main path for the hour. Pull in the extended reference only when it
helps answer a question participants are already asking.
