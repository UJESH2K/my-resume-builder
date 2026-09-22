"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Db } from "@/lib/types";

type Status = "loading" | "saved" | "dirty" | "saving" | "error" | "conflict";

interface Ctx {
  db: Db | null;
  status: Status;
  update: (fn: (draft: Db) => void) => void;
  reloadFromDisk: () => Promise<void>;
  overwriteDisk: () => Promise<void>;
}

const DbContext = createContext<Ctx | null>(null);

export function useDb() {
  const ctx = useContext(DbContext);
  if (!ctx) throw new Error("useDb outside DbProvider");
  return ctx;
}

/**
 * Holds the whole resume database in memory, autosaves to data/resume-db.json,
 * and picks up edits made to that file from outside the app (e.g. by Claude).
 */
export function DbProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<Db | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const ref = useRef<Db | null>(null);
  const dirty = useRef(false);
  const saving = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const replace = (d: Db) => {
    ref.current = d;
    dirty.current = false;
    setDb(d);
    setStatus("saved");
  };

  const fetchDb = async () => (await (await fetch("/api/db", { cache: "no-store" })).json()) as Db;

  const save = useCallback(async (force = false) => {
    if (saving.current || !ref.current) return;
    saving.current = true;
    const snap = ref.current;
    setStatus("saving");
    try {
      const r = await fetch("/api/db", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ db: snap, force }),
      });
      if (r.status === 409) {
        setStatus("conflict");
        return;
      }
      if (!r.ok) throw new Error(await r.text());
      const { rev } = await r.json();
      snap.rev = rev;
      if (ref.current !== snap) ref.current.rev = rev; // edits made while saving
      dirty.current = ref.current !== snap;
      setStatus(dirty.current ? "dirty" : "saved");
    } catch {
      setStatus("error");
    } finally {
      saving.current = false;
      if (dirty.current) timer.current = setTimeout(() => save(), 400);
    }
  }, []);

  const update = useCallback(
    (fn: (draft: Db) => void) => {
      if (!ref.current) return;
      const next = structuredClone(ref.current);
      fn(next);
      ref.current = next;
      dirty.current = true;
      setDb(next);
      setStatus((s) => (s === "conflict" ? s : "dirty"));
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => save(), 600);
    },
    [save]
  );

  const reloadFromDisk = useCallback(async () => replace(await fetchDb()), []);

  const overwriteDisk = useCallback(async () => {
    await save(true);
  }, [save]);

  useEffect(() => {
    fetchDb().then(replace);
    // Pick up outside edits whenever the tab regains focus or every few seconds while idle.
    const check = async () => {
      if (dirty.current || saving.current || !ref.current) return;
      const fresh = await fetchDb().catch(() => null);
      if (fresh && fresh.rev !== ref.current.rev && !dirty.current) replace(fresh);
    };
    const onVis = () => document.visibilityState === "visible" && check();
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", onVis);
    const iv = setInterval(check, 5000);
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("beforeunload", beforeUnload);
      clearInterval(iv);
    };
  }, []);

  return (
    <DbContext.Provider value={{ db, status, update, reloadFromDisk, overwriteDisk }}>{children}</DbContext.Provider>
  );
}
