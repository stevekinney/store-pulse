# Useful Plugins for Codex

**Plugins** package skills, app integrations, and MCP servers into reusable
Codex workflows. A plugin can teach Codex a workflow, connect it to an external
service, expose extra tools, or bundle all of those together.

Use plugins when Codex needs capabilities beyond the local repository. Do not
install plugins just because they sound useful. Each plugin adds a tool surface,
and some plugins connect to private data.

## Why Use Plugins

Use plugins when Codex needs a reusable capability that is bigger than a prompt
or local skill. Plugins can bundle skills, authenticated app connections, MCP
servers, hooks, and assets so Codex can use an integration consistently across
threads and projects.

Plugins are most valuable when Codex needs to work with external systems:
GitHub pull requests, Slack messages, Google Drive files, Gmail threads,
browser automation, security review, analytics, or artifact generation.

Do not install a plugin just to make a local code task feel more powerful. If
files, tests, and a focused prompt solve the problem, keep the workflow local.

## Skills, Plugins, Apps, And MCP

These terms overlap, but they are not interchangeable:

| Surface       | What it is                                                                      | Use it when                                                |
| ------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Skill         | Reusable instructions, references, and optional scripts                         | Codex needs a repeatable workflow                          |
| Plugin        | Installable bundle that can contain skills, apps, MCP servers, hooks, or assets | You want to distribute a workflow or integration           |
| App connector | Authenticated connection to a private service                                   | Codex needs Slack, Gmail, Drive, Calendar, or similar data |
| MCP server    | Tool server that exposes structured capabilities to Codex                       | Codex needs custom tools or live data                      |

For Store Pulse, a local skill is often enough. Use a plugin when the workflow
needs external tools or should be shared across multiple Codex setups.

## Installing Plugins

In the Codex app, open **Plugins** and install from the plugin directory. In the
CLI, open Codex and use:

```text
/plugins
```

After installing a plugin:

- Complete any required authentication.
- Start a new thread if the plugin does not appear immediately.
- Mention the plugin explicitly with `@PluginName` when you want to force the
  tool choice.
- Let Codex choose the plugin when the task description is clear and the plugin
  is already installed.

## Useful Plugins For Store Pulse

### Browser

Use the Browser plugin for local web verification in the in-app browser.

Good tasks:

- Open `http://localhost:3000`.
- Check responsive layout.
- Reproduce a visible UI bug.
- Leave or address browser comments.
- Verify that a route renders after a change.

For the one-hour smart reorder workshop, Browser is the most useful optional
plugin because it lets participants see the dashboard result without leaving
Codex.

### Chrome

Use the Chrome plugin when Codex needs your signed-in Chrome profile.

Good tasks:

- Work with an internal dashboard.
- Inspect a signed-in staging page.
- Use browser extensions or cookies from your Chrome profile.

Avoid using Chrome for simple Store Pulse localhost work. Use the in-app
browser instead.

### GitHub

Use GitHub when Codex needs pull request, issue, review-thread, or CI context.

Good tasks:

- Summarize a pull request.
- Inspect failing GitHub Actions logs.
- Address review comments.
- Open or update issues.
- Prepare a pull request after local verification.

For workshops, GitHub is useful after the local feature is complete. It is not
required for the one-hour implementation loop.

### Codex Security

Use Codex Security for security-focused repository review.

Good tasks:

- Scan staged changes for concrete security issues.
- Review a branch for likely vulnerabilities.
- Validate whether a finding is exploitable before filing work.

Do not use it as a substitute for normal unit tests, lint, or human review.

### Google Drive, Docs, Sheets, And Slides

Use Google Drive plugins when workshop materials live in Google Workspace.

Good tasks:

- Find a workshop document.
- Summarize a Google Doc.
- Update a Google Sheet.
- Draft or clean up Slides content.

Do not use web search for private Drive content. Use the connector.

### Gmail, Slack, And Google Calendar

Use communication plugins when Codex needs authenticated workspace context.

Good tasks:

- Summarize relevant Slack channel activity.
- Draft a Slack reply.
- Triage unread Gmail threads.
- Prepare for a meeting from Calendar context.

For teaching, keep these separate from Store Pulse feature work. They introduce
private data and permission questions that can distract from the coding loop.

### Data Analytics

Use Data Analytics for source-backed quantitative reports and dashboards.

Good tasks:

- Analyze product or business metrics.
- Build a dashboard artifact.
- Investigate a metric movement.
- Design KPI reporting.

This is useful for analytics lessons, not for the default Store Pulse feature.

### Product Design

Use Product Design for product UI ideation, audits, mockups, or image-to-code
flows.

Good tasks:

- Explore alternate UI directions.
- Review a flow for interaction issues.
- Build from a supplied screenshot or mockup.

For Store Pulse, use it only if the lesson shifts from code workflow to product
design workflow.

### Documents, Presentations, And Spreadsheets

Use these plugins when the deliverable is a file artifact rather than source
code.

Good tasks:

- Create a Word document.
- Build a PowerPoint deck.
- Generate or modify a spreadsheet.

They are useful for workshop support materials, but not for editing the Store
Pulse application.

### Sites

Use Sites when Codex needs to create and deploy a hosted website, web app, or
game. This is a separate publishing workflow. Store Pulse is a local demo app,
so Sites is out of scope unless the workshop explicitly becomes a deployment
exercise.

## Choosing A Plugin

Ask these questions before installing a plugin:

- Does the task require data outside the repository?
- Is there a structured connector for that data?
- Does the plugin need write access?
- Is the data private or sensitive?
- Can the same result be achieved with files, tests, or local commands?
- Will participants have the plugin installed and authorized?

If the plugin is not required, keep the workflow local.

## Plugin Safety

Plugins expand what Codex can see and do.

Use these rules:

- Install the fewest plugins needed for the task.
- Prefer read-only access before write access.
- Keep private-data plugins out of public demos unless the data is prepared.
- Review authentication prompts.
- Start a new thread after installing or enabling a plugin.
- Disable plugins that are irrelevant to a workshop.
- Do not treat plugin output as automatically correct. Verify with source data
  and review the result.

## Store Pulse Recommendation

For the one-hour Store Pulse workshop:

- Required: no plugin is strictly required.
- Useful: Browser for local rendered verification.
- Optional after the feature: GitHub for pull request or CI workflows.
- Avoid during the coding hour: Gmail, Slack, Drive, Calendar, and broad
  private-data connectors unless the lesson is explicitly about connectors.
