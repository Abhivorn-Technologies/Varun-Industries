"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./admin.module.css";

interface DashboardData {
  dbConfigured: boolean;
  dbConnected: boolean;
  dbError?: string;
  stats: {
    totalLeads: number;
    newLeads: number;
    totalApplications: number;
    newApplications: number;
    activeJobs: number;
    totalGalleryItems: number;
  };
  recentLeads: Array<{
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    service?: string;
    message: string;
    status: string;
    createdAt: string;
  }>;
  recentApplications: Array<{
    _id: string;
    reference: string;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    experience: string;
    status: string;
    resumeUrl?: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<DashboardData["recentLeads"][0] | null>(null);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await fetch("/api/admin/stats");
        if (!ignore && res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, []);



  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
        Loading dashboard metrics...
      </div>
    );
  }

  const stats = data?.stats || {
    totalLeads: 0,
    newLeads: 0,
    totalApplications: 0,
    newApplications: 0,
    activeJobs: 0,
    totalGalleryItems: 0,
  };

  return (
    <div>
      {/* Show configuration banner only if database is offline */}
      {!data?.dbConnected && (
        <div className={`${styles.dbBanner} ${styles.dbBannerAlert}`}>
          <div className={styles.dbBannerLeft}>
            <div className={styles.dbBannerIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <div className={styles.dbBannerTitle}>
                Database Connection Notice
              </div>
              <div className={styles.dbBannerText}>
                The database is currently unreachable. Live operations will resume automatically once the connection is re-established.
              </div>
            </div>
          </div>
          <div className={styles.dbBannerAction}>
            <button
              type="button"
              onClick={loadDashboard}
              className={styles.btnSecondary}
              style={{ fontSize: "0.82rem" }}
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}



      {/* Stats Cards Grid */}
      <div className={styles.statsGrid}>
        {/* Contact Leads */}
        <div className={styles.statCard} style={{ ["--stat-glow" as string]: "#38bdf8" }}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Contact Leads</span>
            <div className={styles.statIconBox}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalLeads}</div>
          <div className={styles.statSub}>
            <span className={styles.statSubHighlight}>{stats.newLeads} new</span> awaiting response
          </div>
        </div>

        {/* Career Applications */}
        <div className={styles.statCard} style={{ ["--stat-glow" as string]: "#a855f7" }}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Job Applications</span>
            <div className={styles.statIconBox} style={{ color: "#c084fc" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalApplications}</div>
          <div className={styles.statSub}>
            <span className={styles.statSubHighlight} style={{ color: "#c084fc" }}>
              {stats.newApplications} new
            </span> candidates submitted
          </div>
        </div>

        {/* Active Job Openings */}
        <div className={styles.statCard} style={{ ["--stat-glow" as string]: "#10b981" }}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Active Careers</span>
            <div className={styles.statIconBox} style={{ color: "#34d399" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.activeJobs}</div>
          <div className={styles.statSub}>
            Open positions on site
          </div>
        </div>

        {/* Gallery Items */}
        <div className={styles.statCard} style={{ ["--stat-glow" as string]: "#f59e0b" }}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Parts in Gallery</span>
            <div className={styles.statIconBox} style={{ color: "#fbbf24" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalGalleryItems}</div>
          <div className={styles.statSub}>
            Machined parts catalogued
          </div>
        </div>
      </div>

      {/* Two-column layout for Recent Inquiries & Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "1.75rem" }}>
        {/* Recent Inquiries */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Recent Contact Leads
            </div>
            <Link href="/admin/leads" className={styles.btnSecondary} style={{ fontSize: "0.78rem" }}>
              View All ({stats.totalLeads})
            </Link>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service / Sector</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentLeads && data.recentLeads.length > 0 ? (
                  data.recentLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{lead.fullName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{lead.company || lead.email}</div>
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "#475569" }}>{lead.service || "General Machining"}</td>
                      <td>
                        <span className={`${styles.badge} ${lead.status === "new" ? styles.badgeNew : styles.badgeContacted}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className={styles.btnSecondary}
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                      No contact leads received yet. Form submissions on /contact will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Job Applications */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Recent Job Applications
            </div>
            <Link href="/admin/career-leads" className={styles.btnSecondary} style={{ fontSize: "0.78rem" }}>
              View All ({stats.totalApplications})
            </Link>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Position</th>
                  <th>Experience</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentApplications && data.recentApplications.length > 0 ? (
                  data.recentApplications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{app.fullName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{app.email}</div>
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "#334155", fontWeight: 500 }}>{app.position}</td>
                      <td style={{ fontSize: "0.82rem", color: "#475569" }}>{app.experience}</td>
                      <td>
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.btnSecondary}
                            style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                          >
                            PDF
                          </a>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>None</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                      No candidate applications yet. Submissions from /careers will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Lead Modal */}
      {selectedLead && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedLead(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Inquiry from {selectedLead.fullName}</div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedLead(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span className={styles.formLabel}>Email</span>
                  <div style={{ color: "#38bdf8" }}>{selectedLead.email}</div>
                </div>
                <div>
                  <span className={styles.formLabel}>Phone</span>
                  <div>{selectedLead.phone || "—"}</div>
                </div>
                <div>
                  <span className={styles.formLabel}>Company</span>
                  <div>{selectedLead.company || "—"}</div>
                </div>
                <div>
                  <span className={styles.formLabel}>Service</span>
                  <div>{selectedLead.service || "General Machining"}</div>
                </div>
              </div>

              <div>
                <span className={styles.formLabel}>Message</span>
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    marginTop: "0.35rem",
                    color: "#1e293b",
                  }}
                >
                  {selectedLead.message}
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Link href="/admin/leads" className={styles.btnPrimary} style={{ fontSize: "0.85rem" }}>
                Go to Full Leads Manager
              </Link>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className={styles.btnSecondary}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
