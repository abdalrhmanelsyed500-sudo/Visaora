"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="container not-found-page"><div><span className="not-found-code"><AlertTriangle size={14} style={{ verticalAlign: "-2px" }} /> SOMETHING WENT WRONG</span><h1>Let's try that again.</h1><p>The page could not load. Your saved local favorites are safe. Please retry or return to the directory.</p><div className="not-found-actions"><button className="button button-primary" type="button" onClick={() => reset()}><RefreshCw size={15} /> Try again</button></div></div></div>;
}
