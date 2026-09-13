"use client";

import { Check, Copy, Mail, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

export function ShareActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(currentUrl);

  useEffect(() => setCurrentUrl(window.location.href), []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      track("share", { method: "copy", title });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be unavailable in private browsing; share links remain available.
    }
  }

  function trackShare(method: string) {
    track("share", { method, title });
  }

  return (
    <div className="share-actions" aria-label="Share this guide">
      <button className="button button-secondary" type="button" onClick={copyLink}>
        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy link"}
      </button>
      <a className="button button-secondary" href={currentUrl ? `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` : undefined} target="_blank" rel="noreferrer" onClick={() => trackShare("whatsapp")}>
        WhatsApp
      </a>
      <a className="button button-secondary" href={currentUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` : undefined} target="_blank" rel="noreferrer" onClick={() => trackShare("facebook")}>
        Facebook
      </a>
      <a className="button button-secondary" href={currentUrl ? `https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}` : undefined} target="_blank" rel="noreferrer" onClick={() => trackShare("x")}>
        X
      </a>
      <a className="button button-secondary" href={currentUrl ? `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}` : undefined} target="_blank" rel="noreferrer" onClick={() => trackShare("reddit")}>
        Reddit
      </a>
      <a className="button button-secondary" href={currentUrl ? `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` : undefined} target="_blank" rel="noreferrer" onClick={() => trackShare("telegram")}>
        Telegram
      </a>
      <a className="button button-secondary" href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} onClick={() => trackShare("email")}>
        <Mail size={14} /> Email
      </a>
      <button className="button button-secondary" type="button" onClick={() => { if (navigator.share) void navigator.share({ title, url: window.location.href }); else void copyLink(); trackShare("native"); }}>
        <Share2 size={14} /> Share
      </button>
    </div>
  );
}
