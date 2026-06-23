import React, { useState } from "react";
import { useAuth } from "./useAuth";

interface LoginPageProps {
  onBypassLocal?: () => void;
  showBypass?: boolean;
}

export function LoginPage({ onBypassLocal, showBypass = false }: LoginPageProps) {
  const { signInWithMagicLink, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage(null);
    try {
      await signInWithMagicLink(email.trim());
      setMessage({
        type: "success",
        text: "Magic link sent! Check your email inbox to sign in."
      });
      setEmail("");
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Failed to send magic link. Please check your credentials."
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setMessage(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Failed to initialize Google login."
      });
      setLoading(false);
    }
  }

  return (
    <div className="qilife-modal-backdrop" style={{ background: "radial-gradient(circle at top, #1f1437 0%, #09090f 70%)" }}>
      <div className="qilife-modal" style={{ maxWidth: "420px", padding: "32px", border: "1px solid rgba(192, 132, 252, 0.15)" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div className="qilife-brand-mark" style={{ margin: "0 auto 16px", width: "48px", height: "48px", borderRadius: "14px", fontSize: "20px" }}>
            Q
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: 850, letterSpacing: "-0.04em", margin: "0 0 8px" }}>
            Welcome to QiLife
          </h2>
          <p style={{ color: "var(--qi-muted)", margin: 0, fontSize: "14px" }}>
            Personal life command center shell
          </p>
        </div>

        {message && (
          <div 
            className={message.type === "success" ? "qilife-empty" : "qilife-error"} 
            style={{ 
              marginBottom: "18px", 
              padding: "12px 16px", 
              fontSize: "13px",
              borderColor: message.type === "success" ? "rgba(74, 222, 128, 0.3)" : undefined,
              color: message.type === "success" ? "var(--qi-status-green)" : undefined
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleMagicLink} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <label className="qilife-label" style={{ marginBottom: 0 }}>
            <span>Sign in via Email Magic Link</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ background: "#06060a" }}
            />
          </label>

          <button
            type="submit"
            className="qilife-btn primary"
            disabled={loading || !email}
            style={{ width: "100%", justifyContent: "center", display: "flex", height: "42px", alignItems: "center" }}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: "var(--qi-faint)", fontSize: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--qi-border)" }} />
          <span style={{ padding: "0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--qi-border)" }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="qilife-btn"
          disabled={loading}
          style={{ width: "100%", justifyContent: "center", display: "flex", gap: "10px", height: "42px", alignItems: "center", background: "#0d0c14" }}
        >
          <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign in with Google
        </button>

        {showBypass && onBypassLocal && (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <button
              onClick={onBypassLocal}
              style={{
                background: "none",
                border: "none",
                color: "var(--qi-green-2)",
                cursor: "pointer",
                fontSize: "13px",
                textDecoration: "underline",
                padding: 0
              }}
            >
              Proceed in Offline Local Mode
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
