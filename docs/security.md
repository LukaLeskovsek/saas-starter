# Security Notes

## AI daily budget

Real OpenRouter calls are capped per signed-in user by `AI_DAILY_LIMIT_PER_USER`
(default `20`). Mock mode does not consume budget when `OPENROUTER_API_KEY` is blank.
The database records usage through a locked RPC, so parallel requests cannot all
pass the same budget check.

## Local Claude backend is isolated

`AI_BACKEND=local-claude` runs `claude -p` on the operator's machine. It runs with
`--setting-sources project --strict-mcp-config --tools ""` and its own
`--system-prompt=…`, in a private (0700) temporary folder unless `AI_BRAIN_DIR` is set,
so app users' prompts cannot reach the operator's own plugins, MCP servers, memory or
tools. The prompt goes in on stdin, never as an argument. It is for your own computer
only; deployed apps use OpenRouter.

## Dependency review 2026-10-12

Updated to the same versions as internal-os-starter: Next and eslint-config-next
15.5.27, PostCSS 8.5.29, @tailwindcss/postcss 4.3.3, plus @sentry/nextjs 10.61.0 and
resend 6.14.0, and `npm audit fix` (no `--force`) for compatible lockfile updates.
This removes the Next.js 15.5.19 advisories (two critical remote code execution
issues fixed in 15.5.24, high SSRF/Server Action issues fixed in 15.5.21, cache
poisoning fixed in 15.5.27) and the transitive critical/high findings
(proxy-addr, undici, sharp, js-yaml and others).

`npm run audit:security` now reports **0 critical, 10 high and 1 moderate**, the
same as internal-os-starter, so the check still fails. What remains:

- Next still bundles PostCSS 8.4.31 internally; the top-level PostCSS update does not
  replace it. See [PostCSS advisory](https://github.com/advisories/GHSA-r28c-9q8g-f849).
- braces and its chain (fast-glob, micromatch) come in through build, lint and
  component tooling (eslint-config-next, the shadcn CLI). They don't run in the
  deployed app. See [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

Don't silence the check or run `npm audit fix --force` (it downgrades
eslint-config-next and shadcn to old majors). Dependabot proposes updates; major
version jumps (TypeScript 6, ESLint 10, eslint-config-next 16 with Next 15) are not
merged in this template.
