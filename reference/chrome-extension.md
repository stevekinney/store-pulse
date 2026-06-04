# The Codex Chrome Extension

The Codex Chrome extension lets Codex use your Chrome browser profile for
browser tasks that need signed-in state, existing cookies, extensions, or a
specific Chrome profile.

Use it when the in-app browser is not enough. For local development servers,
file previews, and public unauthenticated pages, start with the in-app browser.

## Why Use The Chrome Extension

Use the Chrome extension when the task depends on your real Chrome context:
signed-in sessions, cookies, browser extensions, internal tools, or a specific
Chrome profile. The in-app browser intentionally does not carry that state.

The extension is useful when Codex needs to inspect or operate the same website
you would use manually. That might mean checking a staging dashboard, reading an
internal tool, or validating a flow that depends on your authenticated browser.

Do not use Chrome for ordinary local preview work. If `localhost` or a public
page can be opened in the in-app browser, keep the task inside Codex.

## Browser Tool Choice

Choose the narrowest browser surface that fits the task.

| Surface | Use it for | Avoid it for |
| ------- | ---------- | ------------ |
| In-app browser | Localhost, file-backed previews, public pages, visual comments, basic browser verification | Signed-in pages, Chrome extensions, existing cookies |
| Chrome extension | Signed-in Chrome workflows, internal tools, profile-specific state, pages that need browser extensions | Simple local preview work |
| Computer Use | Desktop workflows or UI flows that are not covered by browser tooling | Repeatable data access when a plugin or MCP server exists |

Codex can move between tools when needed, but the prompt should name the
surface when the distinction matters.

## Setup

Set up Chrome from the Codex app plugin flow:

- Open **Plugins** in Codex.
- Add the **Chrome** plugin.
- Follow the setup flow to install the Codex Chrome extension.
- Approve the Chrome permission prompts.
- Confirm the extension shows **Connected** in the Chrome toolbar.
- Start a new Codex thread before trying the first Chrome task.

Direct prompt:

```text
@Chrome open the signed-in internal dashboard and summarize the failed import
job. Do not change anything yet.
```

For Store Pulse, you usually do not need Chrome. The app is local and does not
have authentication, so the in-app browser is the better default.

## Website Access

Codex asks before it interacts with a new website. The prompt is scoped to the
host, such as `example.com`.

When Codex asks, choose one of these intentionally:

- Allow the website for the current chat.
- Always allow the host.
- Decline the website.

Use always-allow sparingly. A website can contain prompt-injection content, and
signed-in actions may affect your account.

## Allowlist And Blocklist

Codex settings include allowed and blocked website lists for browser use.

- Removing a site from the allowlist makes Codex ask again.
- Removing a site from the blocklist lets Codex ask again instead of treating
  it as blocked.
- Blocking a site is useful when a host is unrelated, sensitive, or risky for
  agent operation.

For workshop machines, keep the allowlist small. Localhost workflows should use
the in-app browser rather than a broad Chrome allowlist.

## Browser History

Chrome history can include sensitive telemetry, internal URLs, search terms, and
activity from signed-in devices. Codex may ask to use browser history when it is
relevant to a task.

Treat history access as sensitive:

- Scope it to a task.
- Do not always-allow it.
- Review what Codex is trying to find.
- Avoid using history when a direct URL or bookmark would work.

## Data And Security

Chrome extension permissions are broad because browser automation requires
broad browser capability. Chrome may ask for permissions such as reading and
changing website data, managing downloads, communicating with native apps, or
viewing tab groups.

Those Chrome permissions do not mean Codex can freely use every website without
Codex-level confirmation. Codex still uses app settings, allowlists,
blocklists, and task prompts to scope behavior.

OpenAI stores browser activity only when it becomes part of the Codex context,
such as page text, screenshots, tool calls, summaries, or messages included in
the thread. Avoid asking Codex to process secrets or highly sensitive pages
unless the task truly requires it and you are present.

## Uploading Files

If a Chrome task needs to upload a local file, Chrome may need file URL access:

- Open Chrome extensions management.
- Open the Codex extension details.
- Enable **Allow access to file URLs**.
- Start the Chrome task again.

Do this only when the upload workflow actually needs local files.

## Troubleshooting

If Codex cannot use Chrome:

- Confirm the Chrome plugin is installed and enabled in Codex.
- Confirm the extension shows **Connected** in Chrome.
- Check that the target website is not blocked in Codex settings.
- Confirm you are using the Chrome profile where the extension is installed.
- Start a new Codex thread and try the task again.
- Restart Chrome and Codex if the connection state looks stale.
- Reinstall the Chrome plugin and extension if the native host is missing.

If the extension is connected but Codex still cannot use Chrome, use `/feedback`
from Codex and include the thread context.

## Store Pulse Recommendation

For this workshop:

- Use the in-app browser for `http://localhost:3000`.
- Use Chrome only when demonstrating signed-in browser workflows.
- Do not require Chrome for the one-hour smart reorder feature.
- Keep browser permissions explicit and reversible.
