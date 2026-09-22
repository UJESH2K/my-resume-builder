# Resume Studio — notes for Claude

Local Next.js app that builds LaTeX resumes from one JSON library. The user sends career details
(projects, wins, jobs, CGPA changes) one at a time. Put them straight into `data/resume-db.json`.

## Adding or changing data

- NEVER run `scripts/seed.ts` against an existing library — it replaces every edit the user made. Patch `data/resume-db.json` (or PUT `/api/db`) instead.
- Edit `data/resume-db.json` directly. The running app notices the file's mtime change and reloads
  (or shows "File changed on disk" if the user has unsaved edits). Keep 2-space JSON and never add a `rev` field.
- Item shapes are in `lib/types.ts`. Sections: `summary`, `education`, `experience`, `projects`,
  `skills`, `awards`, `achievements`, `leadership`, `certifications`.
- Every item needs a unique `id` (prefix by section, e.g. `proj_<slug>`) and `tags`. Bullets are `{ id, text, tags? }`.
  Bullet ids must be unique across the whole file (`b_<something>`).
- Keep summaries to 2-3 lines (~230 chars). Links: markdown in any text, plus `link` on education and `link`/`linkLabel` on achievements/certifications.
- Tags drive auto-selection: `ai`, `ml`, `llm`, `cv`, `rag`, `sde`, `fullstack`, `backend`, `cloud`,
  `systems`, `distributed`, `web3`, `freelance`, `data`, `iot`, `security`, `mobile`; `all` = every variant.
- Text supports `**bold**`, `__underline__`, `*italic*`, `` `code` ``, `[label](url)`. Plain `&`, `%`, `#`, `_`, `~`, `₹` are escaped automatically.
- Put anything unverified in the item's `note` field (never printed). Don't invent metrics.
- New items are not automatically in existing variants. Add their id to the relevant
  `variants[].sections[].items` arrays, or tell the user to press "Auto-select by tags".

## Code map

- `lib/latex.ts`: section renderers, escaping. `latex/preamble.tex`: template with `%%PAPER%%`, `%%FONTSIZE%%`, `%%ACCENT%%`.
- `lib/server.ts`: DB read/write (rev = file mtime), `pdflatex` runner (strips PATH entries that point at files, which break MiKTeX).
- `app/api/db`, `app/api/compile` (modes: preview | save | tex).
- UI shell: `components/AppShell.tsx` (sidebar, breadcrumb `PageHead`, theme toggle); logo at `public/logo.png`.
- `components/Timeline.tsx` + `lib/dates.ts`: chronological picker; dates are free text, parsed loosely.
- `components/Builder.tsx` (variants + preview), `components/Library.tsx` (schema-driven editor from `SECTION_DEFS` in `lib/sections.ts`).
- Check types with `npx tsc --noEmit`. Compile-test by POSTing `{db, variantId, mode:"save"}` to `/api/compile`.

@AGENTS.md
