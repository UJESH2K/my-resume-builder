# Resume Studio

A local-only resume builder. Every achievement, job, project and skill goes into one library
(`data/resume-db.json`). Each application gets a **variant**: pick the entries (and individual
bullets) it needs, preview the real LaTeX PDF, then save it.

The PDF uses the AlgoUniversity LaTeX template, with the red swapped for a selectable accent
(navy by default).

## Run it

Requirements: Node 20+ and a LaTeX install with `pdflatex` on PATH (MiKTeX on this machine).

```bash
npm install      # first time only
npm run dev      # http://localhost:3000
```

## Workflow

1. **Library** (`/library`): add or edit your profile, summary, education (CGPA lives here),
   experience, projects, skills, achievements, leadership and certifications.
   - Tag every entry with the roles it suits: `ai`, `ml`, `llm`, `sde`, `fullstack`, `backend`,
     `cloud`, `systems`, `web3`, `freelance`…  Use `all` for things every resume needs.
   - Bullets can have their own tags too. A tagged bullet only appears on variants with a
     matching tag; an untagged bullet always appears.
   - Formatting in text: `**bold**`, `__underline__`, `*italic*`, `` `code` ``, `[label](url)`.
   - "Private note" fields are never printed. Use them for reminders.
   - **Links anywhere**: select text in any field or bullet and press **Link**, or type `[label](url)` yourself.
     Education, achievements and certifications also have their own link fields.
2. **Builder** (`/`): pick a variant (Main, AI/ML, Full-stack, Cloud, Web3, Freelance…) or create one.
   - **Auto-select by tags** fills the variant from its target tags.
   - Tick or untick entries, expand an entry to toggle single bullets, and use ↑/↓ to reorder
     entries and sections. Section titles are editable.
   - Choose the accent colour, 10/11pt and Letter/A4.
   - Sections print in the standard order: Summary, Education, Experience, Skills, Projects, then
     Leadership / Achievements / Certifications. If a resume runs to two pages, the toolbar offers
     **Skills above Experience** in one click.
   - The preview recompiles automatically. The page-count badge warns when you pass one page,
     and the overflow badge warns when a heading runs past the margin.
   - **Timeline view** (top right toggle, or `/?view=timeline`): every dated entry on one
     chronological rail, oldest first, with a sticky year marker as you scroll. Filter by role
     (`ai`, `sde`, `web3`…) at the top — an entry tagged both `ai` and `sde` shows under both —
     then tick what belongs on this resume. "Tick all shown" takes everything currently filtered.
   - **Save to output/** writes `output/<name>_<variant>.pdf` plus the `.tex`, so you can also
     paste it into Overleaf.

## Files

| Path | What |
| --- | --- |
| `data/resume-db.json` | Your whole library and all variants. Back this up. |
| `latex/preamble.tex` | The template preamble. Edit it to change fonts, margins or spacing for every variant. |
| `lib/latex.ts` | Turns the library and a variant into LaTeX. |
| `output/` | Saved PDFs (git-ignored). |
| `scripts/seed.ts` | The initial import from your old resumes and GitHub (`npm run seed -- --force` **overwrites** the library). |

Every save copies the previous library into `data/backups/` (last 30 kept), so an edit can never be
lost. Re-running the seed script refuses to touch an existing library unless you pass the explicit
`--i-know-this-erases-my-library` flag, and it backs up first.

`data/resume-db.json` holds your phone number and email. Keep this repo private if you push it.
