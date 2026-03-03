import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuraLogo from "../components/AuraLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        {/* Left decorative panel */}
        <div className="login-left">
          <div className="login-left-content">
            <div className="login-left-logo">
              <AuraLogo size={36} color="#fff" />
              <span className="login-left-brand">Aura</span>
            </div>
            <div className="login-left-text">
              <h2 className="login-left-heading">
                Manage your business
                <br />
                with clarity.
              </h2>
              <p className="login-left-desc">
                Track proposals, production orders, and audit every change — all
                from one dashboard.
              </p>
            </div>
            <div className="login-left-footer">
              <div className="login-left-dots">
                <span className="login-dot login-dot-active" />
                <span className="login-dot" />
                <span className="login-dot" />
              </div>
            </div>
          </div>
          {/* Subtle gradient orb */}
          <div className="login-left-orb" />
        </div>

        {/* Right form panel */}
        <div className="login-right">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="login-back-btn"
            title="Back to site"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="login-form-container">
            {/* Logo + Title */}
            <div className="login-header">
              <div className="login-logo-wrap">
                <AuraLogo size={38} color="var(--accent, #6366f1)" />
              </div>
              <h1 className="login-title">Welcome back</h1>
              <p className="login-subtitle">Sign in to access your dashboard</p>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="email" className="login-label">
                  Email
                </label>
                <div className="login-input-wrap">
                  <svg
                    className="login-input-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="login-input"
                  />
                </div>
              </div>

              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="password" className="login-label">
                    Password
                  </label>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="login-forgot"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="login-input-wrap">
                  <svg
                    className="login-input-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="login-input login-input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-toggle-pw"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="login-submit">
                {loading ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="login-spinner"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="3"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="#ffffff"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          <p className="login-copyright">
            © {new Date().getFullYear()} Aura ERP
          </p>
        </div>
      </div>

      <style>{`
        .login-page {
          display: flex;
          min-height: 100vh;
          font-family: "DM Sans", "Inter", system-ui, -apple-system, sans-serif;
          background: #fafaf8;
        }

        /* ── Left Panel ── */
        .login-left {
          flex: 0 0 48%;
          position: relative;
          overflow: hidden;
          display: flex;
          background: #111110;
        }

        .login-left-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 48px;
          width: 100%;
        }

        .login-left-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .login-left-brand {
          font-family: "Space Grotesk", "DM Sans", system-ui, sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #f0ede6;
          letter-spacing: -0.04em;
        }

        .login-left-text {
          max-width: 400px;
        }

        .login-left-heading {
          font-family: "Space Grotesk", "DM Sans", system-ui, sans-serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #f0ede6;
          line-height: 1.12;
          letter-spacing: -0.03em;
          margin: 0 0 16px;
        }

        .login-left-desc {
          font-size: 15px;
          color: #7a7770;
          line-height: 1.65;
          margin: 0;
          max-width: 340px;
        }

        .login-left-footer {
          display: flex;
          align-items: center;
        }

        .login-left-dots {
          display: flex;
          gap: 6px;
        }

        .login-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
        }

        .login-dot-active {
          background: rgba(255, 255, 255, 0.5);
          width: 20px;
          border-radius: 3px;
        }

        .login-left-orb {
          position: absolute;
          bottom: -30%;
          right: -20%;
          width: 500px;
          height: 500px;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--accent, #6366f1) 12%, transparent) 0%,
            transparent 70%
          );
          border-radius: 50%;
          filter: blur(60px);
          z-index: 1;
        }

        /* ── Right Panel ── */
        .login-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          position: relative;
          min-height: 100vh;
        }

        .login-back-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: 1px solid #e0ddd6;
          cursor: pointer;
          color: #7a7770;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .login-back-btn:hover {
          color: #1a1a1a;
          border-color: #c5c2bb;
          background: #f0ede6;
        }

        .login-form-container {
          width: 100%;
          max-width: 380px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .login-title {
          font-family: "Space Grotesk", "DM Sans", system-ui, sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }

        .login-subtitle {
          font-size: 14px;
          color: #7a7770;
          margin: 0;
        }

        /* ── Error ── */
        .login-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ── Form ── */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .login-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-label {
          font-size: 13px;
          font-weight: 500;
          color: #3a3a3a;
        }

        .login-forgot {
          font-size: 12px;
          color: var(--accent, #6366f1);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }

        .login-forgot:hover {
          color: #4f46e5;
        }

        .login-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input-icon {
          position: absolute;
          left: 12px;
          color: #a09d96;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          padding: 11px 12px 11px 38px;
          font-size: 14px;
          font-family: inherit;
          border: 1px solid #e0ddd6;
          border-radius: 10px;
          background: #f6f5f1;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          box-sizing: border-box;
        }

        .login-input::placeholder {
          color: #a09d96;
        }

        .login-input:focus {
          border-color: var(--accent, #6366f1);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, #6366f1) 10%, transparent);
          background: #ffffff;
        }

        .login-input-password {
          padding-right: 42px;
        }

        .login-toggle-pw {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #a09d96;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s;
        }

        .login-toggle-pw:hover {
          color: #5c5c5c;
        }

        /* ── Submit ── */
        .login-submit {
          width: 100%;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          color: #ffffff;
          background: var(--accent, #6366f1);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.12s, opacity 0.15s;
          letter-spacing: -0.01em;
          margin-top: 4px;
        }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .login-submit:active:not(:disabled) {
          transform: translateY(0) scale(0.99);
        }

        .login-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* ── Spinner ── */
        .login-spinner {
          animation: login-spin 0.8s linear infinite;
        }

        @keyframes login-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ── Copyright ── */
        .login-copyright {
          position: absolute;
          bottom: 20px;
          font-size: 12px;
          color: #c5c2bb;
          margin: 0;
        }

        /* ── Fade-in ── */
        .login-form-container {
          animation: loginFadeIn 0.45s ease-out;
        }

        @keyframes loginFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .login-left {
            display: none;
          }

          .login-right {
            flex: 1;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .login-left {
            flex: 0 0 40%;
          }

          .login-left-heading {
            font-size: 1.9rem;
          }
        }
      `}</style>
    </>
  );
}
