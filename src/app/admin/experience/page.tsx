"use client";
import { useState, useEffect, FormEvent, useCallback } from "react";
import { getAll, create, update, remove } from "@/lib/firestore";
import { Experience } from "@/types";
import { Plus, Trash2, Edit2, X, Eye, Code } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    date: "",
    description: "", // List separated by newlines
  });

  const fetchExperiences = useCallback(async () => {
    try {
      const data = await getAll<Experience>("experiences", "createdAt");
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
    // We store the description as an array for backward compatibility if needed, 
    // but we can also store it as a single string and use ReactMarkdown.
    // For now, let's store it as an array by splitting if the user uses newlines, 
    // but better yet, let's just use it as markdown on the frontend.
    const dataToSave = {
      company: formData.company,
      role: formData.role,
      location: formData.location,
      date: formData.date,
      description: formData.description, // Store as markdown string
    };

    try {
      if (editingId) {
        await update("experiences", editingId, dataToSave);
      } else {
        await create("experiences", dataToSave);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ company: "", role: "", location: "", date: "", description: "" });
      fetchExperiences();
    } catch (err) {
      alert("Error saving experience");
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id || null);
    setFormData({
      company: exp.company,
      role: exp.role,
      location: exp.location,
      date: exp.date,
      description: Array.isArray(exp.description) ? exp.description.join("\n") : (exp.description || "")
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await remove("experiences", id);
      fetchExperiences();
    }
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
        {experiences.map((exp) => (
          <div key={exp.id} className="exp-card glass">
            <div className="exp-info">
              <h3>{exp.company}</h3>
              <p>{exp.role} | {exp.date}</p>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(exp)}><Edit2 size={18} /></button>
              <button onClick={() => exp.id && handleDelete(exp.id)} className="del"><Trash2 size={18} /></button>
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
                <div className="tabs">
                  <button type="button" className={!showPreview ? "active" : ""} onClick={() => setShowPreview(false)}><Code size={14}/> Edit</button>
                  <button type="button" className={showPreview ? "active" : ""} onClick={() => setShowPreview(true)}><Eye size={14}/> Preview</button>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid">
                <input 
                  placeholder="Company" 
                  value={formData.company} 
                  onChange={e => setFormData({...formData, company: e.target.value})} 
                  required 
                />
                <input 
                  placeholder="Role" 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                  required 
                />
              </div>
              <input 
                placeholder="Location" 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
              />
              <input 
                placeholder="Date Range (e.g. Aug 2024 - Present)" 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
              />
              {!showPreview ? (
                <textarea 
                  placeholder="Responsibilities & Achievements (Supports Markdown)
- Led team of 5...
- Integrated AI..." 
                  rows={8}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              ) : (
                <div className="preview-box glass">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formData.description || "_No description provided_"}
                  </ReactMarkdown>
                </div>
              )}
              <button type="submit" className="save-btn">Save Experience</button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .add-btn { display: flex; align-items: center; gap: 0.5rem; background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
        .exp-list { display: flex; flex-direction: column; gap: 1rem; }
        .exp-card { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); }
        .actions { display: flex; gap: 10px; }
        .actions button { background: transparent; border: none; color: rgba(255,255,255,0.6); cursor: pointer; }
        .actions .del:hover { color: #ef4444; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 100; }
        .modal { width: 100%; max-width: 600px; padding: 2rem; border-radius: 20px; background: #111; position: relative; }
        .modal-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
        .title-tabs { display: flex; flex-direction: column; gap: 0.8rem; }
        .tabs { display: flex; gap: 4px; background: #000; padding: 4px; border-radius: 8px; width: fit-content; }
        .tabs button { display: flex; align-items: center; gap: 6px; border: none; background: transparent; color: rgba(255,255,255,0.4); padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600; }
        .tabs button.active { background: #3b82f6; color: white; }

        .preview-box { padding: 1.5rem; border-radius: 12px; min-height: 150px; font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.7); }
        .preview-box :global(ul), .preview-box :global(ol) { padding-left: 1.2rem; margin-bottom: 1rem; }
        .preview-box :global(li) { margin-bottom: 0.5rem; }
        .preview-box :global(strong) { color: white; }

        form { display: flex; flex-direction: column; gap: 1rem; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        input, textarea { background: #1a1a1a; border: 1px solid #333; color: white; padding: 12px; border-radius: 8px; outline: none; }
        input:focus, textarea:focus { border-color: #3b82f6; }
        .save-btn { background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 1rem; transition: 0.3s; }
        .save-btn:hover { background: #2563eb; transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
