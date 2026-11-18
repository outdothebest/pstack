---
name: make-bot-ui
description: Assess and build a bot-triggering UI when a supported webhook integration is supplied. Use for make-bot-ui or a dashboard that wakes an agent over a webhook.
---

# Make a bot UI

First establish the bot provider, its documented webhook trigger, authentication mechanism, and the user's authorization to trigger it. Codex does not supply Cursor's webhook routines, `update_state`, or `SendToUser` secret requests. Do not fabricate a routine, a sender key, a provider URL, or instructions for an unavailable UI.

If no supported provider is available, explain the missing integration and ask which provider the user intends. Prepare only provider-independent UI work that is useful within the request. A recurring Codex automation is not a webhook endpoint and must not be created as a substitute.

Once a real integration is available, keep credentials on the server through its supported secret store or environment. Never place them in browser code, chat, logs, or committed configuration. Treat incoming payloads as untrusted data and authorize every action on the server. Choose network exposure from the user's actual deployment requirements; do not install or configure Tailscale or expose a local server merely because the upstream workflow used it.

Verify a harmless end-to-end trigger against the provider before reporting the UI as operational. Report separately what was built, what ran, and any remaining dependency or approval.
