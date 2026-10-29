"use client";

import React, { useEffect, useState } from "react";
import styles from "../admin.module.css";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("varunindustries2013@gmail.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/admin/profile");
        if (res.ok) {
          const json = await res.json();
          if (json.profile) {
            setUsername(json.profile.username || "admin");
            setEmail(json.profile.email || "varunindustries2013@gmail.com");
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!currentPassword) {
      setErrorMsg("Please enter your current password to authorize changes.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg("New password and confirmation password do not match.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          currentPassword,
          newPassword: newPassword || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(json.message || "Failed to update profile settings.");
      } else {
        setSuccessMsg("Admin credentials and client email updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        if (json.profile) {
          setUsername(json.profile.username);
          setEmail(json.profile.email);
        }
      }
    } catch {
      setErrorMsg("Network error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
        Loading account settings...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "760px" }}>
      <div className={styles.sectionCard} style={{ padding: "1.75rem 2rem" }}>
        <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "1.25rem", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1e3a8a",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                Admin Account & Credentials
              </h1>
              <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0.2rem 0 0 0" }}>
                Update your login username, client email address, and administrative password.
              </p>
            </div>
          </div>
        </div>

        {successMsg && (
          <div
            style={{
              padding: "0.85rem 1rem",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#15803d",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              padding: "0.85rem 1rem",
              backgroundColor: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#be123c",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Identity Section */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e293b", marginBottom: "1rem" }}>
              Administrator Identity & Client Email
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="admin-username">
                  Admin Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  required
                  className={styles.formInput}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                />
                <span style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                  Used to log in directly into the portal.
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="admin-email">
                  Client Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  className={styles.formInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="varunindustries2013@gmail.com"
                />
                <span style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                  You can also log in using this client email.
                </span>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div style={{ marginBottom: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e293b", marginBottom: "1rem" }}>
              Security & Password
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="admin-new-pass">
                  New Password (Optional)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="admin-new-pass"
                    type={showNewPassword ? "text" : "password"}
                    className={styles.formInput}
                    style={{ width: "100%", paddingRight: "2.5rem" }}
                    placeholder="Leave blank to keep current password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: "0.2rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                    aria-label="Toggle new password visibility"
                  >
                    {showNewPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="admin-confirm-pass">
                  Confirm New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="admin-confirm-pass"
                    type={showConfirmPassword ? "text" : "password"}
                    className={styles.formInput}
                    style={{ width: "100%", paddingRight: "2.5rem" }}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: "0.2rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "1.25rem",
                marginTop: "1.25rem",
              }}
            >
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label className={styles.formLabel} htmlFor="admin-cur-pass" style={{ color: "#0f172a", fontWeight: 600 }}>
                  Current Password (Required to Save Any Changes)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="admin-cur-pass"
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    className={styles.formInput}
                    style={{ width: "100%", paddingRight: "2.5rem" }}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: "0.2rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                    aria-label="Toggle current password visibility"
                  >
                    {showCurrentPassword ? (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.35rem", display: "block" }}>
                  Required to verify authorization before saving changes to username, client email, or password.
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button
              type="submit"
              disabled={saving}
              className={styles.btnPrimary}
              style={{ padding: "0.65rem 1.5rem" }}
            >
              {saving ? "Updating..." : "Save Credentials"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
