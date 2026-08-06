"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { XIcon, GoogleIcon } from "@/components/icons";

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "An account already exists with this email. Try signing in instead.",
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/too-many-requests": "Too many attempts — please wait a moment and try again.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function reset() {
    setError(null);
    setInfo(null);
    setBusy(false);
  }

  async function handleGoogle() {
    reset();
    setBusy(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (e) {
      setError(friendlyError((e as { code?: string }).code ?? ""));
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    setBusy(true);
    try {
      if (mode === "signup") {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      setError(friendlyError((err as { code?: string }).code ?? ""));
    } finally {
      setBusy(false);
    }
  }

  async function handleForgotPassword() {
    reset();
    if (!email) {
      setError("Enter your email above first, then click 'Forgot password?'");
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email);
      setInfo("Password reset email sent — check your inbox.");
    } catch (err) {
      setError(friendlyError((err as { code?: string }).code ?? ""));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="glass w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
              <span className="text-sm font-semibold text-foreground">
                {mode === "signin" ? "Sign in to Calculateus" : "Create your account"}
              </span>
              <button onClick={onClose} aria-label="Close" className="text-muted hover:text-foreground">
                <XIcon width={16} height={16} />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-5">
              <p className="text-xs text-muted">
                Optional — sync your favorites and calculation history across devices. Calculateus still works fully without an account.
              </p>

              <button
                onClick={handleGoogle}
                disabled={busy}
                className="btn-ghost flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {mode === "signup" && (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    aria-label="Name"
                    className="field-input"
                  />
                )}
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  aria-label="Email"
                  className="field-input"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  aria-label="Password"
                  className="field-input"
                />

                {error && <p className="text-xs text-danger">{error}</p>}
                {info && <p className="text-xs text-accent">{info}</p>}

                <button type="submit" disabled={busy} className="btn-primary rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60">
                  {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
                </button>
              </form>

              {mode === "signin" && (
                <button onClick={handleForgotPassword} className="text-center text-xs text-muted hover:text-primary">
                  Forgot password?
                </button>
              )}

              <p className="text-center text-xs text-muted">
                {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); reset(); }}
                  className="font-semibold text-primary hover:underline"
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
