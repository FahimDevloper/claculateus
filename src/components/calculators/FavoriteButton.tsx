"use client";

import { useEffect, useState } from "react";
import { getFavoriteCalculators, toggleFavoriteCalculator, DATA_MERGED_EVENT } from "@/lib/storage";
import { StarIcon } from "@/components/icons";

export default function FavoriteButton({ slug }: { slug: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(getFavoriteCalculators().includes(slug));
    function onMerge() {
      setIsFavorite(getFavoriteCalculators().includes(slug));
    }
    window.addEventListener(DATA_MERGED_EVENT, onMerge);
    return () => window.removeEventListener(DATA_MERGED_EVENT, onMerge);
  }, [slug]);

  function toggle() {
    const updated = toggleFavoriteCalculator(slug);
    setIsFavorite(updated.includes(slug));
  }

  return (
    <button
      onClick={toggle}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
        isFavorite ? "border-warning bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] text-warning" : "border-border text-muted hover:text-warning"
      }`}
    >
      <StarIcon width={16} height={16} filled={isFavorite} />
    </button>
  );
}
