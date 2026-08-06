"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { pullAndMergeFromCloud, pushSnapshotToCloud } from "@/lib/firebase/sync";
import { SYNC_EVENT, DATA_MERGED_EVENT } from "@/lib/storage";

export default function SyncEngine() {
  const { user } = useAuth();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mergedForUid = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      mergedForUid.current = null;
      return;
    }
    if (mergedForUid.current === user.uid) return;
    mergedForUid.current = user.uid;
    pullAndMergeFromCloud(user.uid)
      .then(() => window.dispatchEvent(new Event(DATA_MERGED_EVENT)))
      .catch(() => {
        // offline or permission error — local data still works fine
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    function onChange() {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (user) pushSnapshotToCloud(user.uid).catch(() => {});
      }, 1500);
    }
    window.addEventListener(SYNC_EVENT, onChange);
    return () => {
      window.removeEventListener(SYNC_EVENT, onChange);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [user]);

  return null;
}
