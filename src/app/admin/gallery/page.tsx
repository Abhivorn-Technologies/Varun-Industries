"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "../admin.module.css";

interface GalleryItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  caption: string;
  dimensions?: string;
  material?: string;
  imageUrl: string;
  alt?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

const CATEGORIES = [
  "All",
  "Precision Housings & Brackets",
  "Enclosures & Heavy Casings",
  "Plates, Tooling & Fixtures",
  "Turned Rings & Precision Fittings",
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    category: "Precision Housings & Brackets",
    caption: "",
    dimensions: "",
    material: "Aluminium Alloy 6061-T6",
    imageUrl: "",
    alt: "",
    order: 0,
    isActive: true,
  });

  async function loadGallery(cat = categoryFilter) {
    try {
      const params = new URLSearchParams();
      if (cat !== "All") params.set("category", cat);

      const res = await fetch(`/api/admin/gallery?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setItems(json.items || []);
      }
    } catch (err) {
      console.error("Error loading gallery:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const params = new URLSearchParams();
        if (categoryFilter !== "All") params.set("category", categoryFilter);

        const res = await fetch(`/api/admin/gallery?${params.toString()}`);
        if (!ignore && res.ok) {
          const json = await res.json();
          setItems(json.items || []);
        }
      } catch (err) {
        console.error("Error loading gallery items:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, [categoryFilter]);

  function handleFilterChange(cat: string) {
    setCategoryFilter(cat);
    setCurrentPage(1);
  }

  function openCreateModal() {
    setEditingItem(null);
    setModalError("");
    setForm({
      title: "",
      category: categoryFilter !== "All" ? categoryFilter : "Precision Housings & Brackets",
      caption: "",
      dimensions: "",
      material: "Aluminium Alloy 6061-T6",
      imageUrl: "",
      alt: "",
      order: items.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  }

  function openEditModal(item: GalleryItem) {
    setEditingItem(item);
    setModalError("");
    setForm({
      title: item.title,
      category: item.category,
      caption: item.caption,
      dimensions: item.dimensions || "",
      material: item.material || "Aluminium Alloy 6061-T6",
      imageUrl: item.imageUrl,
      alt: item.alt || "",
      order: item.order,
      isActive: item.isActive,
    });
    setModalOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setModalError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.ok) {
        setForm((prev) => ({
          ...prev,
          imageUrl: json.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        }));
      } else {
        setModalError(json.message || "Failed to upload file");
      }
    } catch {
      setModalError("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    setModalError("");
    if (!form.imageUrl) {
      setModalError("Please upload an image or provide an image URL");
      return;
    }

    try {
      const url = editingItem
        ? `/api/admin/gallery/${editingItem._id}`
        : `/api/admin/gallery`;
      const method = editingItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setModalOpen(false);
        loadGallery(categoryFilter);
      } else {
        const json = await res.json();
        setModalError(json.message || "Failed to save component");
      }
    } catch {
      setModalError("Error saving gallery item. Please try again.");
    }
  }

  async function handleToggleActive(item: GalleryItem) {
    try {
      const res = await fetch(`/api/admin/gallery/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, isActive: !item.isActive } : i))
        );
      }
    } catch (err) {
      console.error("Error toggling item status:", err);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/gallery/${deleteTarget._id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }

  // Pagination calculation
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);
  const startNum = totalItems > 0 ? startIndex + 1 : 0;
  const endNum = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div>
      <div className={styles.sectionCard}>
        {/* Header Bar */}
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Precision Parts & Components Gallery ({items.length})
          </div>

          <div className={styles.cardActions}>
            <button type="button" onClick={openCreateModal} className={styles.btnPrimary}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add New Part
            </button>
          </div>
        </div>

        {/* Categories Tab Strip */}
        <div className={styles.filterBar}>
          <div className={styles.tabsContainer} style={{ width: "100%", overflowX: "auto" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleFilterChange(cat)}
                className={`${styles.tabBtn} ${categoryFilter === cat ? styles.tabBtnActive : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
            Loading gallery parts...
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#64748b" }}>
            No components catalogued in this category yet. Click &quot;Add New Part&quot; to upload photographs.
          </div>
        ) : (
          <>
            <div className={styles.galleryGrid}>
              {paginatedItems.map((item) => (
                <div key={item._id} className={styles.galleryCard}>
                  <div className={styles.galleryMedia}>
                    <Image
                      src={item.imageUrl}
                      alt={item.alt || item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div className={styles.galleryBadgeOverlay}>
                      <span
                        className={`${styles.badge} ${
                          item.isActive ? styles.badgeActive : styles.badgeClosed
                        }`}
                      >
                        {item.isActive ? "Visible" : "Hidden"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.galleryContent}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span className={styles.galleryCategory}>{item.category}</span>
                      {item.dimensions && (
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "var(--font-plex-mono)" }}>
                          {item.dimensions}
                        </span>
                      )}
                    </div>
                    <h3 className={styles.galleryTitle}>{item.title}</h3>
                    <p className={styles.galleryCaption}>{item.caption}</p>
                  </div>

                  <div className={styles.galleryFooter}>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      className={styles.btnSecondary}
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                    >
                      {item.isActive ? "Hide" : "Show"}
                    </button>

                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className={styles.btnSecondary}
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className={styles.btnDanger}
                        title="Delete Item"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.paginationBar}>
                <div className={styles.paginationInfo}>
                  Showing {startNum}–{endNum} of {totalItems} catalogued components
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
          </>
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
              Delete Component
            </div>
            <p className={styles.confirmModalDesc}>
              Are you sure you want to remove <strong>&ldquo;{deleteTarget.title}&rdquo;</strong> from the parts gallery? This action cannot be undone.
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveItem}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  {editingItem ? "Edit Part Details" : "Add New Gallery Part"}
                </div>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setModalOpen(false)}>
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                {modalError && (
                  <div
                    style={{
                      padding: "0.65rem 0.85rem",
                      backgroundColor: "#fff1f2",
                      border: "1px solid #fecdd3",
                      color: "#be123c",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {modalError}
                  </div>
                )}

                {/* Upload Image Section */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Upload Component Photo</label>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={styles.btnSecondary}
                      disabled={uploading}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {uploading ? "Uploading..." : "Choose Image File"}
                    </button>
                    {form.imageUrl && (
                      <span style={{ fontSize: "0.78rem", color: "#166534", fontWeight: 500 }}>
                        ✓ Image Attached
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="img-url">
                    Image URL Path
                  </label>
                  <input
                    id="img-url"
                    type="text"
                    required
                    className={styles.formInput}
                    placeholder="/images/parts/your-part.jpg"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="part-title">
                      Part Title / Name
                    </label>
                    <input
                      id="part-title"
                      type="text"
                      required
                      className={styles.formInput}
                      placeholder="e.g. Housing Range & Milled Brackets"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="part-cat">
                      Catalogue Category
                    </label>
                    <select
                      id="part-cat"
                      className={styles.formSelect}
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="part-caption">
                    Caption & Engineering Description
                  </label>
                  <textarea
                    id="part-caption"
                    required
                    className={styles.formTextarea}
                    placeholder="Describe machining operations, pocket depths, tight tolerances..."
                    value={form.caption}
                    onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="part-dims">
                      Dimensions / Sizing
                    </label>
                    <input
                      id="part-dims"
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. 300mm × 420mm"
                      value={form.dimensions}
                      onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="part-mat">
                      Machining Material
                    </label>
                    <input
                      id="part-mat"
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. Aluminium 6061-T6"
                      value={form.material}
                      onChange={(e) => setForm({ ...form, material: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="part-order">
                      Sort Order
                    </label>
                    <input
                      id="part-order"
                      type="number"
                      className={styles.formInput}
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    <span style={{ fontSize: "0.85rem", color: "#334155", fontWeight: 500 }}>
                      Publish on Public Website Gallery
                    </span>
                  </label>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setModalOpen(false)} className={styles.btnSecondary}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  {editingItem ? "Update Part" : "Publish Part to Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
