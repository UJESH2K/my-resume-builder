import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/server";
import type { Db } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readDb());
}

/** Optimistic concurrency: the client sends the rev it last saw; if the file moved on, reject. */
export async function PUT(req: Request) {
  const { db, force } = (await req.json()) as { db: Db; force?: boolean };
  const current = await readDb();
  if (!force && db.rev !== current.rev) {
    return NextResponse.json(current, { status: 409 });
  }
  const rev = await writeDb(db);
  return NextResponse.json({ rev });
}
