"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "visaora:favorites";

type Favorite = { type: "country" | "visa"; id: string };

export function FavoriteButton({ type, id, label }: { type: Favorite["type"]; id: string; label: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Favorite[];
      setSaved(favorites.some((favorite) => favorite.type === type && favorite.id === id));
    } catch {
      setSaved(false);
    }
  }, [id, type]);

  function toggle() {
    let favorites: Favorite[] = [];
    try {
      favorites = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Favorite[];
    } catch {
      favorites = [];
    }
    const exists = favorites.some((favorite) => favorite.type === type && favorite.id === id);
    const next = exists ? favorites.filter((favorite) => !(favorite.type === type && favorite.id === id)) : [...favorites, { type, id }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(!exists);
    track("favorite", { type, id, saved: !exists });
  }

  return (
    <button className="favorite-button" type="button" onClick={toggle} aria-pressed={saved} aria-label={saved ? `Remove ${label} from saved items` : `Save ${label}`}>
      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
