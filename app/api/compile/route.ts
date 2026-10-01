import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { compileFitted, OUTPUT_DIR, slug, texFor } from "@/lib/server";
import type { Db } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * body: { db, variantId, mode: "preview" | "save" | "tex" }
 * The client sends its in-memory db so the preview reflects unsaved edits too.
 */
export async function POST(req: Request) {
  const { db, variantId, mode = "preview" } = (await req.json()) as {
    db: Db;
    variantId: string;
    mode?: "preview" | "save" | "tex";
  };

  let built;
  try {
    built = await texFor(db, variantId);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  const { variant } = built;
  const fileBase = `${slug(db.profile.name)}_${slug(variant.name)}`;

  const maxPages = variant.maxPages ?? 2;
  const res = await compileFitted(db, variantId, maxPages);

  // the .tex download is the fitted source, so Overleaf gives the same PDF
  if (mode === "tex") {
    return new Response(res.tex, {
      headers: {
        "Content-Type": "application/x-tex; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileBase}.tex"`,
      },
    });
  }

  if (!res.ok || !res.pdf) {
    return NextResponse.json({ error: "LaTeX compile failed", log: res.log }, { status: 422 });
  }

  let savedTo = "";
  if (mode === "save") {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    savedTo = path.join(OUTPUT_DIR, `${fileBase}.pdf`);
    await fs.writeFile(savedTo, res.pdf);
    await fs.writeFile(path.join(OUTPUT_DIR, `${fileBase}.tex`), res.tex, "utf8");
  }

  return new Response(new Uint8Array(res.pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "X-Pages": String(res.pages ?? 0),
      "X-Max-Pages": String(maxPages),
      "X-Fit": encodeURIComponent(JSON.stringify({ label: res.fitLabel, notes: res.fitNotes, ok: res.fitOk, attempts: res.attempts })),
      "X-Overflows": String(res.overflows ?? 0),
      "X-Saved-To": encodeURIComponent(savedTo),
      "X-File-Name": `${fileBase}.pdf`,
    },
  });
}
