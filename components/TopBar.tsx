"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDb } from "./DbProvider";

const STATUS_TEXT: Record<string, string> = {
  loading: "Loading…",
  saved: "All changes saved",
  dirty: "Unsaved changes…",
  saving: "Saving…",
  error: "Save failed — is the dev server running?",
  conflict: "File changed on disk",
};

export function TopBar() {
  const path = usePathname();
  const { status, reloadFromDisk, overwriteDisk } = useDb();
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">R</span> Resume Studio
      </div>
      <nav className="tabs">
        <Link className={path === "/" ? "active" : ""} href="/">
          Builder
        </Link>
        <Link className={path.startsWith("/library") ? "active" : ""} href="/library">
          Library
        </Link>
      </nav>
      <div className={`save-status s-${status}`}>
        <span className="dot" />
        {STATUS_TEXT[status]}
        {status === "conflict" && (
          <>
            <button className="btn sm" onClick={reloadFromDisk}>
              Load file version
            </button>
            <button className="btn sm ghost" onClick={overwriteDisk}>
              Keep mine
            </button>
          </>
        )}
      </div>
    </header>
  );
}
