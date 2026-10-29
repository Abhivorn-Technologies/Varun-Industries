"use client";

import React, { useEffect, useState, useTransition } from "react";
import styles from "../admin.module.css";

interface Lead {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  service?: string;
  message: string;
  status: "new" | "contacted" | "in_progress" | "closed" | "archived";
  starred?: boolean;
  notes?: string;
  createdAt: string;
}

interface LeadCounts {
  all: number;
  new: number;
  contacted: number;
  in_progress: number;
  closed: number;
  archived: number;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState<LeadCounts>({
    all: 0,
    new: 0,
    contacted: 0,
    in_progress: 0,
    closed: 0,
    archived: 0,
  });
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusVal, setStatusVal] = useState<Lead["status"]>("new");
  const [notesVal, setNotesVal] = useState("");
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function loadLeads(tab = activeTab, query = search) {
    try {
      const params = new URLSearchParams();
      if (tab !== "all") params.set("status", tab);
      if (query.trim()) params.set("search", query.trim());

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setLeads(json.leads || []);
        if (json.counts) setCounts(json.counts);
      }
    } catch (err) {
      console.error("Error loading leads:", err);
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

        const res = await fetch(`/api/admin/leads?${params.toString()}`);
        if (!ignore && res.ok) {
          const json = await res.json();
          setLeads(json.leads || []);
          if (json.counts) setCounts(json.counts);
        }
      } catch (err) {
        console.error("Error loading leads:", err);
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
    loadLeads(activeTab, search);
  }

  function openLeadModal(lead: Lead) {
    setSelectedLead(lead);
    setStatusVal(lead.status);
    setNotesVal(lead.notes || "");
  }

  async function handleUpdateLead() {
    if (!selectedLead) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusVal, notes: notesVal }),
      });
      if (res.ok) {
        const json = await res.json();
        setLeads((prev) => prev.map((l) => (l._id === selectedLead._id ? json.lead : l)));
        setSelectedLead(json.lead);
        loadLeads(activeTab, search);
      }
    } catch (err) {
      console.error("Error updating lead:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/leads/${deleteTarget._id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l._id !== deleteTarget._id));
        if (selectedLead?._id === deleteTarget._id) setSelectedLead(null);
        setDeleteTarget(null);
        loadLeads(activeTab, search);
      }
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  }

  function handleExportCsv() {
    if (!leads.length) return;

    const headers = ["Date", "Name", "Email", "Phone", "Company", "Service", "Status", "Notes", "Message"];
    const rows = leads.map((l) => [
      new Date(l.createdAt).toLocaleDateString(),
      `"${(l.fullName || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      `"${(l.service || "").replace(/"/g, '""')}"`,
      l.status,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
      `"${(l.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `varun_industries_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Pagination calculation
  const totalItems = leads.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedLeads = leads.slice(startIndex, startIndex + itemsPerPage);
  const startNum = totalItems > 0 ? startIndex + 1 : 0;
  const endNum = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div>
      <div className={styles.sectionCard}>
        {/* Header & Filter Controls */}
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Contact Leads & Enquiries
          </div>

          <div className={styles.cardActions}>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={leads.length === 0}
              className={styles.btnSecondary}
              style={{ fontSize: "0.82rem", opacity: leads.length === 0 ? 0.5 : 1 }}
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

        {/* Search & Tabs Bar */}
        <div className={styles.filterBar}>
          <form onSubmit={handleSearchSubmit} className={styles.searchBox}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by client, email, phone, company..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className={styles.tabsContainer}>
            {[
              { id: "all", label: "All", count: counts.all },
              { id: "new", label: "New", count: counts.new },
              { id: "contacted", label: "Contacted", count: counts.contacted },
              { id: "in_progress", label: "In Progress", count: counts.in_progress },
              { id: "closed", label: "Closed", count: counts.closed },
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

        {/* Leads Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Client / Company</th>
                <th>Contact</th>
                <th>Sector / Requirement</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading || isPending ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                    No leads found matching current filter.
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => {
                  const dateStr = new Date(lead.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={lead._id}>
                      <td style={{ fontSize: "0.8rem", color: "#64748b", fontFamily: "var(--font-plex-mono)" }}>
                        {dateStr}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{lead.fullName}</div>
                        {lead.company && (
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{lead.company}</div>
                        )}
                      </td>
                      <td>
                        <a href={`mailto:${lead.email}`} style={{ color: "#1e3a8a", textDecoration: "none", fontSize: "0.82rem", display: "block", fontWeight: 500 }}>
                          {lead.email}
                        </a>
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} style={{ color: "#64748b", textDecoration: "none", fontSize: "0.75rem" }}>
                            {lead.phone}
                          </a>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: "0.82rem", color: "#334155", fontWeight: 500 }}>
                          {lead.service || "General Machining"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b", maxWidth: "260px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {lead.message}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            lead.status === "new"
                              ? styles.badgeNew
                              : lead.status === "contacted"
                              ? styles.badgeContacted
                              : lead.status === "in_progress"
                              ? styles.badgeInProgress
                              : styles.badgeClosed
                          }`}
                        >
                          {lead.status.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                          <button
                            type="button"
                            onClick={() => openLeadModal(lead)}
                            className={styles.btnSecondary}
                            style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(lead)}
                            className={styles.btnDanger}
                            title="Delete Lead"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
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
              Showing {startNum}–{endNum} of {totalItems} contact leads
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
              Delete Enquiry Lead
            </div>
            <p className={styles.confirmModalDesc}>
              Are you sure you want to delete the enquiry from <strong>&ldquo;{deleteTarget.fullName}&rdquo;</strong>? This record will be permanently deleted.
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

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedLead(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                Inquiry Details: {selectedLead.fullName}
              </div>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setSelectedLead(null)}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span className={styles.formLabel}>Full Name</span>
                  <div style={{ color: "#0f172a", fontWeight: 600 }}>{selectedLead.fullName}</div>
                </div>
                <div>
                  <span className={styles.formLabel}>Company</span>
                  <div style={{ color: "#334155" }}>{selectedLead.company || "Not provided"}</div>
                </div>
                <div>
                  <span className={styles.formLabel}>Email Address</span>
                  <div>
                    <a href={`mailto:${selectedLead.email}`} style={{ color: "#1e3a8a", textDecoration: "none", fontWeight: 500 }}>
                      {selectedLead.email}
                    </a>
                  </div>
                </div>
                <div>
                  <span className={styles.formLabel}>Phone Number</span>
                  <div>
                    <a href={`tel:${selectedLead.phone}`} style={{ color: "#0f172a", textDecoration: "none" }}>
                      {selectedLead.phone || "Not provided"}
                    </a>
                  </div>
                </div>
                <div>
                  <span className={styles.formLabel}>Sector / Service</span>
                  <div style={{ color: "#334155" }}>{selectedLead.service || "General Machining"}</div>
                </div>
                <div>
                  <span className={styles.formLabel}>Received At</span>
                  <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
                    {new Date(selectedLead.createdAt).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div>
                <span className={styles.formLabel}>Client Requirement Message</span>
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    marginTop: "0.35rem",
                    color: "#1e293b",
                  }}
                >
                  {selectedLead.message}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="lead-status-select">
                  Lead Status
                </label>
                <select
                  id="lead-status-select"
                  className={styles.formSelect}
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as Lead["status"])}
                >
                  <option value="new">New (Unread / Needs Review)</option>
                  <option value="contacted">Contacted (Called / Emailed)</option>
                  <option value="in_progress">In Progress (RFQ / Quotation Sent)</option>
                  <option value="closed">Closed (Deal Won / Complete)</option>
                  <option value="archived">Archived / Cancelled</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="lead-notes-area">
                  Internal Notes & Follow-up History
                </label>
                <textarea
                  id="lead-notes-area"
                  className={styles.formTextarea}
                  placeholder="Record quote references, conversation notes, manufacturing lead times given..."
                  value={notesVal}
                  onChange={(e) => setNotesVal(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedLead)}
                className={styles.btnDanger}
                style={{ marginRight: "auto" }}
              >
                Delete
              </button>
              <button type="button" onClick={() => setSelectedLead(null)} className={styles.btnSecondary}>
                Cancel
              </button>
              <button type="button" onClick={handleUpdateLead} disabled={saving} className={styles.btnPrimary}>
                {saving ? "Saving..." : "Save Updates"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
