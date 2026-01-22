"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, FormEvent, useCallback } from "react";
import { getAll, create, update, remove } from "@/lib/firestore";
import { Experience } from "@/types";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Eye,
  Code,
  Languages,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [editLang, setEditLang] = useState<"en" | "ar">("en");
  const [formData, setFormData] = useState({
    company: "",
    company_ar: "",
    role: "",
    role_ar: "",
    location: "",
    location_ar: "",
    date: "",
    description: "",
    description_ar: "",
    order: 0,
  });

  const fetchExperiences = useCallback(async () => {
    try {
      const data = await getAll<Experience>("experiences", "order", "asc");
      setExperiences(data);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If creating new experience and order is 0, auto-assign next order
    let orderValue = formData.order;
    if (!editingId && orderValue === 0) {
      const maxOrder =
        experiences.length > 0
          ? Math.max(...experiences.map((e) => e.order || 0))
          : 0;
      orderValue = maxOrder + 1;
    }

    const dataToSave = {
      company: formData.company,
      company_ar: formData.company_ar,
      role: formData.role,
      role_ar: formData.role_ar,
      location: formData.location,
      location_ar: formData.location_ar,
      date: formData.date,
      description: formData.description,
      description_ar: formData.description_ar,
      order: orderValue,
    };

    try {
      if (editingId) {
        await update("experiences", editingId, dataToSave);
      } else {
        await create("experiences", dataToSave);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setEditLang("en");
      setFormData({
        company: "",
        company_ar: "",
        role: "",
        role_ar: "",
        location: "",
        location_ar: "",
        date: "",
        description: "",
        description_ar: "",
        order: 0,
      });
      fetchExperiences();
    } catch (err) {
      alert("Error saving experience");
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id || null);
    setFormData({
      company: exp.company,
      company_ar: exp.company_ar || "",
      role: exp.role,
      role_ar: exp.role_ar || "",
      location: exp.location,
      location_ar: exp.location_ar || "",
      date: exp.date,
      description: Array.isArray(exp.description)
        ? exp.description.join("\n")
        : exp.description || "",
      description_ar: exp.description_ar || "",
      order: exp.order || 0,
    });
    setEditLang("en");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await remove("experiences", id);
      fetchExperiences();
    }
  };

  const handleMoveUp = async (exp: Experience, index: number) => {
    if (index === 0 || !exp.id) return;

    const prevExp = experiences[index - 1];
    if (!prevExp.id) return;

    // Swap order values
    const currentOrder = exp.order || index + 1;
    const prevOrder = prevExp.order || index;

    await update("experiences", exp.id, { order: prevOrder });
    await update("experiences", prevExp.id, { order: currentOrder });
    fetchExperiences();
  };

  const handleMoveDown = async (exp: Experience, index: number) => {
    if (index === experiences.length - 1 || !exp.id) return;

    const nextExp = experiences[index + 1];
    if (!nextExp.id) return;

    // Swap order values
    const currentOrder = exp.order || index + 1;
    const nextOrder = nextExp.order || index + 2;

    await update("experiences", exp.id, { order: nextOrder });
    await update("experiences", nextExp.id, { order: currentOrder });
    fetchExperiences();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditLang("en");
    setFormData({
      company: "",
      company_ar: "",
      role: "",
      role_ar: "",
      location: "",
      location_ar: "",
      date: "",
      description: "",
      description_ar: "",
      order: 0,
    });
  };

  return (
    <div className="admin-page">
      <div className="header">
        <h1>Work History</h1>
        <button onClick={() => setIsModalOpen(true)} className="add-btn">
          <Plus size={20} /> Add Experience
        </button>
      </div>

      <div className="exp-list">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="exp-card glass">
            <div className="order-controls">
              <button
                onClick={() => handleMoveUp(exp, index)}
                disabled={index === 0}
                className="order-btn"
                title="Move Up"
              >
                <ChevronUp size={18} />
              </button>
              <span className="order-num">{exp.order || index + 1}</span>
              <button
                onClick={() => handleMoveDown(exp, index)}
                disabled={index === experiences.length - 1}
                className="order-btn"
                title="Move Down"
              >
                <ChevronDown size={18} />
              </button>
            </div>
            <div className="exp-info">
              <h3>{exp.company}</h3>
              <p>
                {exp.role} | {exp.date}
              </p>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(exp)}>
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => exp.id && handleDelete(exp.id)}
                className="del"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal glass">
            <div className="modal-header">
              <div className="title-tabs">
                <h2>{editingId ? "Edit Experience" : "Add Experience"}</h2>
                <div className="header-controls">
                  {/* Language Toggle */}
                  <div className="lang-toggle">
                    <button
                      type="button"
                      className={editLang === "en" ? "active" : ""}
                      onClick={() => setEditLang("en")}
                    >
                      <Languages size={14} /> EN
                    </button>
                    <button
                      type="button"
                      className={editLang === "ar" ? "active" : ""}
                      onClick={() => setEditLang("ar")}
                    >
                      AR <Languages size={14} />
                    </button>
                  </div>
                  <div className="tabs">
                    <button
                      type="button"
                      className={!showPreview ? "active" : ""}
                      onClick={() => setShowPreview(false)}
                    >
                      <Code size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      className={showPreview ? "active" : ""}
                      onClick={() => setShowPreview(true)}
                    >
                      <Eye size={14} /> Preview
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {editLang === "en" ? (
                <>
                  <div className="grid">
                    <input
                      placeholder="Company (English)"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      required
                    />
                    <input
                      placeholder="Role (English)"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid">
                    <input
                      placeholder="Location (English)"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Display Order (lower = first)"
                      value={formData.order || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <input
                    placeholder="Date Range (e.g. Aug 2024 - Present)"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                  {!showPreview ? (
                    <textarea
                      placeholder="Responsibilities & Achievements (English - Markdown)
- Led team of 5...
- Integrated AI..."
                      rows={8}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <div className="preview-box glass">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formData.description || "_No description provided_"}
                      </ReactMarkdown>
                    </div>
                  )}
                </>
              ) : (
                <div dir="rtl">
                  <div className="grid">
                    <input
                      placeholder="الشركة (العربية)"
                      value={formData.company_ar}
                      onChange={(e) =>
                        setFormData({ ...formData, company_ar: e.target.value })
                      }
                      className="rtl-input"
                    />
                    <input
                      placeholder="المنصب (العربية)"
                      value={formData.role_ar}
                      onChange={(e) =>
                        setFormData({ ...formData, role_ar: e.target.value })
                      }
                      className="rtl-input"
                    />
                  </div>
                  <input
                    placeholder="الموقع (العربية)"
                    value={formData.location_ar}
                    onChange={(e) =>
                      setFormData({ ...formData, location_ar: e.target.value })
                    }
                    className="rtl-input"
                  />
                  {!showPreview ? (
                    <textarea
                      placeholder="المسؤوليات والإنجازات (العربية - ماركداون)
- قدت فريقاً من 5...
- دمجت الذكاء الاصطناعي..."
                      rows={8}
                      value={formData.description_ar}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description_ar: e.target.value,
                        })
                      }
                      className="rtl-input"
                    />
                  ) : (
                    <div className="preview-box glass" dir="rtl">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formData.description_ar || "_لم يتم تقديم وصف_"}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
              <button type="submit" className="save-btn">
                Save Experience
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #7628e5;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }
        .exp-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .exp-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          gap: 1rem;
        }

        .order-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .order-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .order-btn:hover:not(:disabled) {
          background: rgba(118, 40, 229, 0.2);
          border-color: #7628e5;
          color: white;
        }
        .order-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .order-num {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          min-width: 20px;
          text-align: center;
        }

        .exp-info {
          flex: 1;
        }
        .actions {
          display: flex;
          gap: 10px;
        }
        .actions button {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
        }
        .actions .del:hover {
          color: #ef4444;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .modal {
          width: 100%;
          max-width: 700px;
          padding: 2rem;
          border-radius: 20px;
          background: #111;
          position: relative;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        .title-tabs {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .header-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .lang-toggle {
          display: flex;
          gap: 4px;
          background: #000;
          padding: 4px;
          border-radius: 8px;
        }
        .lang-toggle button {
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.4);
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .lang-toggle button.active {
          background: #7628e5;
          color: white;
        }

        .tabs {
          display: flex;
          gap: 4px;
          background: #000;
          padding: 4px;
          border-radius: 8px;
          width: fit-content;
        }
        .tabs button {
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.4);
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .tabs button.active {
          background: #7628e5;
          color: white;
        }

        .preview-box {
          padding: 1.5rem;
          border-radius: 12px;
          min-height: 150px;
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
        }
        .preview-box :global(ul),
        .preview-box :global(ol) {
          padding-left: 1.2rem;
          margin-bottom: 1rem;
        }
        .preview-box :global(li) {
          margin-bottom: 0.5rem;
        }
        .preview-box :global(strong) {
          color: white;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        input,
        textarea {
          background: #1a1a1a;
          border: 1px solid #333;
          color: white;
          padding: 12px;
          border-radius: 8px;
          outline: none;
        }
        input:focus,
        textarea:focus {
          border-color: #7628e5;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .rtl-input {
          text-align: right;
          direction: rtl;
        }
        .save-btn {
          background: #7628e5;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 1rem;
          transition: 0.3s;
        }
        .save-btn:hover {
          background: #621cc4;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
