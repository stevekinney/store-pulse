# Store Pulse Codex Reference

These documents support the Store Pulse workshop. They are ordered for teaching: each one builds on the ideas in the documents above it. If you are running the workshop, follow this sequence. If you are reading on your own, the same order works as a self-study path.

## Teaching Order

1. [Getting Started](./getting-started.md): Workshop preflight. Get every participant into the same working state—repository cloned, Codex installed, environment verified—before anything else.
2. [Codex Safety Model](./safety.md): How Codex scopes its power through sandboxing, approvals, and trust. Understand the guardrails before you start handing Codex real work.
3. [Codex Configuration](./configuration.md): The `config.toml` file and persistent local settings. Model defaults, sandboxing, MCP servers, and profiles all live here.
4. [Codex Slash Commands](./commands.md): In-session controls for changing models, inspecting context, reviewing changes, and managing the current conversation.
5. [AGENTS.md Best Practices](./agents-md-best-practices.md): The project briefing that tells Codex how to work safely and effectively in _this_ repository before it guesses from training data.
6. [Context Management with Codex](./context-management.md): How to feed Codex the right context—and only the right context. The difference between a focused collaborator and a model guessing from stale fragments.
7. [Prompting Best Practices for Codex](./prompting-best-practices.md): Treating the prompt as a working agreement: the job, the boundaries, the evidence Codex should gather, and the signals that prove the task is done.
8. [Review and Verification with Codex](./review-and-verification.md): Implementation is not done when Codex stops typing. How to confirm the diff is understood, the right checks pass, and remaining risk is explicit.
9. [Using Hooks with Codex](./hooks.md): Local commands that Codex runs at specific lifecycle points. Use them to inject context, enforce guardrails, and catch workflow mistakes early.
10. [Codex Subagents](./subagents.md): Splitting a task into smaller agent threads—for parallel work or specialist reviewers running alongside the main thread.
11. [Git Worktrees with Codex](./worktrees.md): Multiple working directories from one repository, each with its own branch, dev server, and Codex session. The substrate for parallel work.
12. [Store Pulse Skill Ideas](./skills.md): Operational briefs that help Codex remember _this_ project. Skills are most useful where the same context or failure mode keeps recurring.
13. [Troubleshooting Codex Sessions](./troubleshooting.md): Recovering deliberately when things go wrong, instead of stacking another speculative patch on top of the problem.
14. [Next Feature Prompts](./next-prompts.md): Self-contained feature requests for participants to hand to Codex. Use these once everything above is in place.
