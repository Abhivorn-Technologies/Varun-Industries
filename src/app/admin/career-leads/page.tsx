"use client";

import React, { useEffect, useState, useTransition } from "react";
import styles from "../admin.module.css";

interface Application {
  _id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills?: string;
  message?: string;
  resumeFileName?: string;
  resumeUrl?: string;
  status: "new" | "reviewing" | "shortlisted" | "interviewed" | "rejected" | "hired";
  notes?: string;
  createdAt: string;
}

interface ApplicationCounts {
  all: number;
  new: number;
  reviewing: number;
  shortlisted: number;
  interviewed: number;
  hired: number;
  rejected: number;
}

export default function AdminCareerLeadsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [counts, setCounts] = useState<ApplicationCounts>({
    all: 0,
    new: 0,
    reviewing: 0,
    shortlisted: 0,
    interviewed: 0,
    hired: 0,
    rejected: 0,
  });
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusVal, setStatusVal] = useState<Application["status"]>("new");
  const [notesVal, setNotesVal] = useState("");
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function loadApplications(tab = activeTab, query = search) {
    try {
      const params = new URLSearchParams();
      if (tab !== "all") params.set("status", tab);
      if (query.trim()) params.set("search", query.trim());

      const res = await fetch(`/api/admin/careers/applications?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setApplications(json.applications || []);
        if (json.counts) setCounts(json.counts);
      }
    } catch (err) {
      console.error("Error loading candidate applications:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const params = new URLSearchParams();
        if (activeTab !== "all") params.set("status", activeTab);
        if (search.trim()) params.set("search", search.trim());

        const res = await fetch(`/api/admin/careers/applications?${params.toString()}`);
        if (!ignore && res.ok) {
          const json = await res.json();
          setApplications(json.applications || []);
          if (json.counts) setCounts(json.counts);
        }
      } catch (err) {
        console.error("Error loading candidate applications:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    init();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  function handleTabChange(tab: string) {
    startTransition(() => {
      setActiveTab(tab);
      setCurrentPage(1);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCurrentPage(1);
    loadApplications(activeTab, search);
  }

  function openAppModal(app: Application) {
    setSelectedApp(app);
    setStatusVal(app.status);
    setNotesVal(app.notes || "");
  }

  async function handleSaveStatus() {
    if (!selectedApp) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/careers/applications/${selectedApp._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusVal, notes: notesVal }),
      });
      if (res.ok) {
        const json = await res.json();
        setApplications((prev) =>
          prev.map((a) => (a._id === selectedApp._id ? json.application : a))
        );
        setSelectedApp(json.application);
        loadApplications(activeTab, search);
      }
    } catch (err) {
      console.error("Error updating application:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/careers/applications/${deleteTarget._id}`, { method: "DELETE" });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a._id !== deleteTarget._id));
        if (selectedApp?._id === deleteTarget._id) setSelectedApp(null);
        setDeleteTarget(null);
        loadApplications(activeTab, search);
      }
    } catch (err) {
      console.error("Error deleting application:", err);
    }
  }

  function handleExportCsv() {
    if (applications.length === 0) return;
    const headers = [
      "Reference",
      "Date",
      "Full Name",
      "Email",
      "Phone",
      "Position",
      "Experience",
      "Skills",
      "Status",
      "Resume URL",
      "Notes",
    ];
    const rows = applications.map((a) => [
      `"${a.reference || ""}"`,
      `"${new Date(a.createdAt).toISOString()}"`,
      `"${(a.fullName || "").replace(/"/g, '""')}"`,
      `"${(a.email || "").replace(/"/g, '""')}"`,
      `"${(a.phone || "").replace(/"/g, '""')}"`,
      `"${(a.position || "").replace(/"/g, '""')}"`,
      `"${(a.experience || "").replace(/"/g, '""')}"`,
      `"${(a.skills || "").replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${(a.resumeUrl || "").replace(/"/g, '""')}"`,
      `"${(a.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `varun_career_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getStatusBadgeClass(status: string) {
    switch (status) {
      case "new":
        return styles.statusBadgeNew;
      case "reviewing":
        return styles.statusBadgeInProgress;
      case "shortlisted":
        return styles.statusBadgeContacted;
      case "interviewed":
        return styles.statusBadgeContacted;
      case "hired":
        return styles.statusBadgeClosed;
      case "rejected":
        return styles.statusBadgeArchived;
      default:
        return styles.statusBadge;
    }
  }

  // Pagination calculation
  const totalItems = applications.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedApplications = applications.slice(startIndex, startIndex + itemsPerPage);
  const startNum = totalItems > 0 ? startIndex + 1 : 0;
  const endNum = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div>
      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            Career Leads & Candidate Applications ({applications.length})
          </div>

          <div className={styles.cardActions}>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={applications.length === 0}
              className={styles.btnSecondary}
              style={{ fontSize: "0.82rem", opacity: applications.length === 0 ? 0.5 : 1 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Search & Status Tabs Bar */}
        <div className={styles.filterBar}>
          <form onSubmit={handleSearchSubmit} className={styles.searchBox}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by candidate name, position, reference, email..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className={styles.tabsContainer}>
            {[
              { id: "all", label: "All", count: counts.all },
              { id: "new", label: "New", count: counts.new },
              { id: "reviewing", label: "Reviewing", count: counts.reviewing },
              { id: "shortlisted", label: "Shortlisted", count: counts.shortlisted },
              { id: "interviewed", label: "Interviewed", count: counts.interviewed },
              { id: "hired", label: "Hired", count: counts.hired },
              { id: "rejected", label: "Rejected", count: counts.rejected },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference / Date</th>
                <th>Candidate</th>
                <th>Role Applied</th>
                <th>Experience</th>
                <th>Resume</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading || isPending ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                    Loading candidate applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                    No candidate applications found for this filter.
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((app) => {
                  const dateStr = new Date(app.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={app._id}>
                      <td>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1e3a8a", fontFamily: "var(--font-plex-mono)" }}>
                          {app.reference || "APP-REF"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{dateStr}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{app.fullName}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b" }}>{app.phone}</div>
                        <a
                          href={`mailto:${app.email}`}
                          style={{
                            color: "#1e3a8a",
                            textDecoration: "none",
                            fontSize: "0.78rem",
                            display: "block",
                          }}
                        >
                          {app.email}
                        </a>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.88rem" }}>
                          {app.position}
                        </div>
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "#334155" }}>
                        {app.experience}
                      </td>
                      <td>
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.btnSecondary}
                            style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            View CV
                          </a>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No CV</span>
                        )}
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${getStatusBadgeClass(app.status)}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            onClick={() => openAppModal(app)}
                            className={styles.btnSecondary}
                            style={{ padding: "0.4rem 0.75rem", fontSize: "0.78rem" }}
                          >
                            Review
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(app)}
                            className={styles.btnSecondary}
                            style={{ padding: "0.4rem 0.6rem", fontSize: "0.78rem", color: "#dc2626" }}
                            title="Delete Application"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className={styles.paginationBar}>
            <div className={styles.paginationInfo}>
              Showing {startNum}–{endNum} of {totalItems} candidate applications
            </div>

            <div className={styles.paginationControls}>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className={styles.paginationBtn}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`${styles.paginationBtn} ${p === safePage ? styles.paginationBtnActive : ""}`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className={styles.paginationBtn}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Deletion Confirmation Modal */}
      {deleteTarget && (
        <div className={styles.confirmModalBackdrop} onClick={() => setDeleteTarget(null)}>
          <div className={styles.confirmModalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmModalTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Delete Candidate Application
            </div>
            <p className={styles.confirmModalDesc}>
              Are you sure you want to remove the application for <strong>&ldquo;{deleteTarget.fullName}&rdquo;</strong> ({deleteTarget.position})? This action cannot be undone.
            </p>
            <div className={styles.confirmModalActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                style={{ backgroundColor: "#dc2626", borderColor: "#dc2626" }}
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Review Modal */}
      {selectedApp && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedApp(null)}>
          <div
            className={styles.modalContent}
            style={{ maxWidth: "680px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                Candidate Application: {selectedApp.fullName}
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedApp(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <span className={styles.formLabel}>Reference ID</span>
                  <div style={{ fontFamily: "var(--font-plex-mono)", fontWeight: 600, color: "#1e3a8a" }}>
                    {selectedApp.reference || "APP-REF"}
                  </div>
                </div>

                <div>
                  <span className={styles.formLabel}>Role Applied</span>
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>{selectedApp.position}</div>
                </div>

                <div>
                  <span className={styles.formLabel}>Email Address</span>
                  <div>
                    <a
                      href={`mailto:${selectedApp.email}`}
                      style={{ color: "#1e3a8a", textDecoration: "none", fontWeight: 500 }}
                    >
                      {selectedApp.email}
                    </a>
                  </div>
                </div>

                <div>
                  <span className={styles.formLabel}>Contact Phone</span>
                  <div>
                    <a
                      href={`tel:${selectedApp.phone}`}
                      style={{ color: "#0f172a", textDecoration: "none" }}
                    >
                      {selectedApp.phone}
                    </a>
                  </div>
                </div>

                <div>
                  <span className={styles.formLabel}>Relevant Experience</span>
                  <div style={{ color: "#334155" }}>{selectedApp.experience}</div>
                </div>

                <div>
                  <span className={styles.formLabel}>Application Date</span>
                  <div style={{ color: "#475569" }}>
                    {new Date(selectedApp.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </div>

              {selectedApp.skills && (
                <div>
                  <span className={styles.formLabel}>Key Technical Skills</span>
                  <div
                    style={{
                      padding: "0.75rem",
                      backgroundColor: "#f8fafc",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.88rem",
                      color: "#334155",
                    }}
                  >
                    {selectedApp.skills}
                  </div>
                </div>
              )}

              {selectedApp.message && (
                <div>
                  <span className={styles.formLabel}>Candidate Cover Note / Summary</span>
                  <div
                    style={{
                      padding: "0.75rem",
                      backgroundColor: "#f8fafc",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.88rem",
                      color: "#334155",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {selectedApp.message}
                  </div>
                </div>
              )}

              {selectedApp.resumeUrl && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1rem", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#166534", fontSize: "0.9rem" }}>
                      Curriculum Vitae / Resume Attached
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#15803d" }}>
                      {selectedApp.resumeFileName || "Candidate_Resume"}
                    </div>
                  </div>
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.btnPrimary}
                    style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}
                  >
                    Open Resume
                  </a>
                </div>
              )}

              {/* Status Update */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className={styles.formLabel}>Application Status</label>
                  <select
                    className={styles.formSelect}
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value as Application["status"])}
                  >
                    <option value="new">New (Unreviewed)</option>
                    <option value="reviewing">Under Review</option>
                    <option value="shortlisted">Shortlisted for Interview</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="hired">Hired / Offer Sent</option>
                    <option value="rejected">Rejected / Closed</option>
                  </select>
                </div>

                <div>
                  <label className={styles.formLabel}>Actions</label>
                  <div style={{ paddingTop: "0.25rem" }}>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(selectedApp)}
                      className={styles.btnSecondary}
                      style={{ color: "#dc2626", borderColor: "#fecaca", width: "100%", fontSize: "0.82rem" }}
                    >
                      Delete Candidate Record
                    </button>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className={styles.formLabel}>Internal Interview & Evaluation Notes</label>
                <textarea
                  className={styles.formTextarea}
                  rows={3}
                  placeholder="Record interviewer remarks, salary expectations, interview scheduling details..."
                  value={notesVal}
                  onChange={(e) => setNotesVal(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setSelectedApp(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={handleSaveStatus}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Application Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
