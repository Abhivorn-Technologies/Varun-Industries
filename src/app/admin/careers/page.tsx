"use client";

import React, { useEffect, useState } from "react";
import styles from "../admin.module.css";

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  jobType: string;
  experience: string;
  openings: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: "active" | "paused" | "closed";
  order: number;
  createdAt: string;
}

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [savingJob, setSavingJob] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [jobForm, setJobForm] = useState({
    title: "",
    department: "Machining & Production",
    location: "Hyderabad, Telangana",
    jobType: "Full Time",
    experience: "1–3 years",
    openings: 1,
    description: "",
    requirements: "",
    responsibilities: "",
    status: "active" as "active" | "paused" | "closed",
  });

  async function loadJobs() {
    try {
      const res = await fetch("/api/admin/careers/jobs");
      if (res.ok) {
        const json = await res.json();
        setJobs(json.jobs || []);
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
    } finally {
      setLoadingJobs(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await fetch("/api/admin/careers/jobs");
        if (!ignore && res.ok) {
          const json = await res.json();
          setJobs(json.jobs || []);
        }
      } catch (err) {
        console.error("Error loading jobs:", err);
      } finally {
        if (!ignore) setLoadingJobs(false);
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, []);

  function openCreateJobModal() {
    setEditingJob(null);
    setJobForm({
      title: "",
      department: "Machining & Production",
      location: "Hyderabad, Telangana",
      jobType: "Full Time",
      experience: "1–3 years",
      openings: 1,
      description: "",
      requirements: "Hands-on experience with CNC VMC milling/turning\nDrawing reading & measurement tools\nDisciplined quality inspection",
      responsibilities: "Operate CNC machine centers safely\nInspect machined dimensions to precision tolerances\nMaintain tooling and daily maintenance",
      status: "active",
    });
    setJobModalOpen(true);
  }

  function openEditJobModal(job: Job) {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      jobType: job.jobType,
      experience: job.experience,
      openings: job.openings,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : "",
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : "",
      status: job.status,
    });
    setJobModalOpen(true);
  }

  async function handleSaveJob(e: React.FormEvent) {
    e.preventDefault();
    setSavingJob(true);
    try {
      const url = editingJob
        ? `/api/admin/careers/jobs/${editingJob._id}`
        : `/api/admin/careers/jobs`;
      const method = editingJob ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm),
      });

      if (res.ok) {
        setJobModalOpen(false);
        loadJobs();
      }
    } catch (err) {
      console.error("Error saving job:", err);
    } finally {
      setSavingJob(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/careers/jobs/${deleteTarget._id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  }

  // Pagination calculation
  const totalItems = jobs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedJobs = jobs.slice(startIndex, startIndex + itemsPerPage);
  const startNum = totalItems > 0 ? startIndex + 1 : 0;
  const endNum = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div>
      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Job Postings & Career Openings ({jobs.length})
          </div>
          <div className={styles.cardActions}>
            <button type="button" onClick={openCreateJobModal} className={styles.btnPrimary}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Post New Opening
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department & Location</th>
                <th>Experience</th>
                <th>Openings</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingJobs ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                    Loading openings...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                    No job postings created yet. Click &quot;Post New Opening&quot; to add career listings.
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.95rem" }}>
                        {job.title}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{job.jobType}</div>
                    </td>
                    <td>
                      <div style={{ color: "#334155", fontWeight: 500 }}>{job.department}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{job.location}</div>
                    </td>
                    <td style={{ fontSize: "0.82rem", color: "#475569" }}>{job.experience}</td>
                    <td>
                      <span style={{ fontFamily: "var(--font-plex-sans)", fontWeight: 700, color: "#1e3a8a" }}>
                        {job.openings}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          job.status === "active"
                            ? styles.badgeActive
                            : job.status === "paused"
                            ? styles.badgeNew
                            : styles.badgeClosed
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          onClick={() => openEditJobModal(job)}
                          className={styles.btnSecondary}
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(job)}
                          className={styles.btnDanger}
                          title="Delete Job"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className={styles.paginationBar}>
            <div className={styles.paginationInfo}>
              Showing {startNum}–{endNum} of {totalItems} job listings
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
              Delete Job Posting
            </div>
            <p className={styles.confirmModalDesc}>
              Are you sure you want to delete the job listing <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>? It will no longer be visible on the public careers page.
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

      {/* Create / Edit Job Modal */}
      {jobModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setJobModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                {editingJob ? `Edit: ${editingJob.title}` : "Create New Job Opening"}
              </div>
              <button type="button" className={styles.modalCloseBtn} onClick={() => setJobModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJob}>
              <div className={styles.modalBody}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="job-title">Job Title</label>
                    <input
                      id="job-title"
                      type="text"
                      required
                      className={styles.formInput}
                      placeholder="e.g. CNC Operator / Machinist"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="job-dept">Department</label>
                    <select
                      id="job-dept"
                      className={styles.formSelect}
                      value={jobForm.department}
                      onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    >
                      <option value="Machining & Production">Machining & Production</option>
                      <option value="Quality Assurance & CMM">Quality Assurance & CMM</option>
                      <option value="Engineering & CAM">Engineering & CAM</option>
                      <option value="Maintenance & Plant Operations">Maintenance & Plant Operations</option>
                      <option value="Tooling & Fixtures">Tooling & Fixtures</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="job-loc">Location</label>
                    <input
                      id="job-loc"
                      type="text"
                      className={styles.formInput}
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="job-type">Job Type</label>
                    <select
                      id="job-type"
                      className={styles.formSelect}
                      value={jobForm.jobType}
                      onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Shift Basis">Shift Basis</option>
                      <option value="Contract">Contract</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="job-exp">Required Experience</label>
                    <input
                      id="job-exp"
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. 2–4 years"
                      value={jobForm.experience}
                      onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="job-openings">Number of Openings</label>
                    <input
                      id="job-openings"
                      type="number"
                      min={1}
                      className={styles.formInput}
                      value={jobForm.openings}
                      onChange={(e) => setJobForm({ ...jobForm, openings: Number(e.target.value) || 1 })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="job-status">Status</label>
                    <select
                      id="job-status"
                      className={styles.formSelect}
                      value={jobForm.status}
                      onChange={(e) => setJobForm({ ...jobForm, status: e.target.value as "active" | "paused" | "closed" })}
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="paused">Paused (Hiring on Hold)</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="job-desc">Job Description & Role Summary</label>
                  <textarea
                    id="job-desc"
                    required
                    className={styles.formTextarea}
                    placeholder="Describe role responsibilities, machine types, and workshop expectations..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="job-reqs">Requirements (one per line)</label>
                  <textarea
                    id="job-reqs"
                    className={styles.formTextarea}
                    placeholder="Enter qualifications & requirements separated by newlines..."
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setJobModalOpen(false)} className={styles.btnSecondary}>
                  Cancel
                </button>
                <button type="submit" disabled={savingJob} className={styles.btnPrimary}>
                  {savingJob ? "Saving..." : editingJob ? "Update Opening" : "Publish Opening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
