"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { UserIcon } from "@/components/icons";
import AuthModal from "./AuthModal";

export default function AccountButton() {
  const { user, loading, signOut, deleteAccountAndData } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-surface-2" />;
  }

  if (!user) {
    return (
      <>
        <button onClick={() => setModalOpen(true)} className="btn-ghost hidden h-9 items-center rounded-lg px-3 text-sm font-medium sm:flex">
          Sign in
        </button>
        <button onClick={() => setModalOpen(true)} aria-label="Sign in" className="btn-ghost flex h-9 w-9 items-center justify-center rounded-lg sm:hidden">
          <UserIcon width={16} height={16} />
        </button>
        <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  const initial = (user.displayName ?? user.email ?? "?").charAt(0).toUpperCase();

  function closeMenu() {
    setMenuOpen(false);
    setConfirmDelete(false);
    setDeleteError(null);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccountAndData();
      closeMenu();
    } catch (e) {
      const code = (e as { code?: string }).code;
      setDeleteError(
        code === "auth/requires-recent-login"
          ? "For security, please sign out and sign back in, then try deleting again."
          : "Couldn't delete your account. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground"
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt={user.displayName ?? "Account"} className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </button>
      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={closeMenu} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -4 }}
              transition={{ duration: 0.15 }}
              className="glass absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-xl"
            >
              <div className="border-b border-border/60 px-4 py-3">
                <p className="truncate text-sm font-semibold text-foreground">{user.displayName ?? "Account"}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
              <button
                onClick={() => { signOut(); closeMenu(); }}
                className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-surface-2"
              >
                Sign out
              </button>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full border-t border-border/60 px-4 py-2.5 text-left text-sm text-danger hover:bg-surface-2"
                >
                  Delete account & data
                </button>
              ) : (
                <div className="border-t border-border/60 p-3">
                  <p className="text-xs text-muted">
                    This permanently deletes your account and synced favorites/history. This can't be undone.
                  </p>
                  {deleteError && <p className="mt-2 text-xs text-danger">{deleteError}</p>}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 rounded-lg bg-danger px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {deleting ? "Deleting…" : "Yes, delete"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
