"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { getAll, create, update } from "@/lib/firestore";
import { Profile } from "@/types";
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  SettableMetadata,
} from "firebase/storage";
import imageCompression from "browser-image-compression";
import {
  Save,
  Upload,
  User,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  Briefcase,
  Github,
  Eye,
  Code,
  Languages,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editLang, setEditLang] = useState<"en" | "ar">("en");
  const [formData, setFormData] = useState<Profile>({
    name: "",
    name_ar: "",
    role: "",
    role_ar: "",
    email: "",
    phone: "",
    location: "",
    location_ar: "",
    aboutMe: "",
    aboutMe_ar: "",
    catchyPhrase: "",
    catchyPhrase_ar: "",
    cvLink: "",
    profilePic: "",
    githubContributions: "",
    experienceYears: "",
    projectsDone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile data...");
        const data = await getAll<Profile>("profile");
        if (data && data.length > 0) {
          setProfile(data[0]);
          setFormData(data[0]);
        }
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        if (err.code === "permission-denied") {
          alert(
            "Firestore Permission Denied. Please check your Security Rules.",
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    const metadata: SettableMetadata = {
      cacheControl: "public,max-age=31536000",
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `profile/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, compressedFile, metadata);
      const url = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, profilePic: url }));
      alert("Image uploaded successfully!");
    } catch (err: any) {
      console.error("Upload Error:", err);
      alert(
        `Upload failed: ${err.message}. Check if Storage is enabled and rules allow writes.`,
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (profile?.id) {
        await update("profile", profile.id, formData);
      } else {
        const result = await create("profile", formData);
        // Refresh with NEW ID
        const data = await getAll<Profile>("profile");
        if (data.length > 0) {
          setProfile(data[0]);
          setFormData(data[0]);
        }
      }
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Save Error:", err);
      alert(`Failed to update profile: ${err.message}`);
    }
  };

  if (loading) return <div>Loading Profile...</div>;

  return (
    <div className="admin-page">
      <div className="header">
        <div>
          <h1>Personal Identity</h1>
          <p>Manage how you appear to the world.</p>
        </div>
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
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-top-card glass">
          <div className="pic-upload">
            <div className="current-pic">
              {formData.profilePic ? (
                <div className="relative w-full h-full">
                  <Image
                    src={formData.profilePic}
                    fill
                    className="object-cover"
                    alt="Profile"
                  />
                </div>
              ) : (
                <div className="no-pic">
                  <User size={48} />
                </div>
              )}
              {uploading && <div className="upload-overlay">Uploading...</div>}
            </div>
            <label className="upload-btn">
              <Upload size={16} />{" "}
              {formData.profilePic ? "Change Photo" : "Upload Photo"}
              <input
                type="file"
                onChange={handleImageUpload}
                hidden
                disabled={uploading}
              />
            </label>
          </div>

          <div className="basic-info">
            {editLang === "en" ? (
              <>
                <div className="input-group">
                  <label>Full Name (English)</label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Professional Role (English)</label>
                  <input
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    required
                  />
                </div>
              </>
            ) : (
              <div dir="rtl" className="rtl-group">
                <div className="input-group">
                  <label>الاسم الكامل (العربية)</label>
                  <input
                    value={formData.name_ar || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name_ar: e.target.value })
                    }
                    className="rtl-input"
                  />
                </div>
                <div className="input-group">
                  <label>المنصب المهني (العربية)</label>
                  <input
                    value={formData.role_ar || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, role_ar: e.target.value })
                    }
                    className="rtl-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-section glass">
            <h3>
              <Briefcase size={20} /> Contact & Presence
            </h3>
            <div className="input-field">
              <label>
                <Mail size={14} /> Email
              </label>
              <input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="input-field">
              <label>
                <Phone size={14} /> Phone
              </label>
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="input-field">
              <label>
                <MapPin size={14} />{" "}
                {editLang === "en" ? "Location (English)" : "الموقع (العربية)"}
              </label>
              {editLang === "en" ? (
                <input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              ) : (
                <input
                  value={formData.location_ar || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location_ar: e.target.value })
                  }
                  className="rtl-input"
                  dir="rtl"
                />
              )}
            </div>
            <div className="input-field">
              <label>
                <Globe size={14} /> CV Link (Google Drive/Dropbox)
              </label>
              <input
                value={formData.cvLink}
                onChange={(e) =>
                  setFormData({ ...formData, cvLink: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-section glass">
            <h3>
              <Award size={20} /> Key Metrics
            </h3>
            <div className="input-field">
              <label>
                <Github size={14} /> GitHub Contributions
              </label>
              <input
                placeholder="e.g. 2k+"
                value={formData.githubContributions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    githubContributions: e.target.value,
                  })
                }
              />
            </div>
            <div className="input-field">
              <label>Years of Experience</label>
              <input
                placeholder="e.g. 2+"
                value={formData.experienceYears}
                onChange={(e) =>
                  setFormData({ ...formData, experienceYears: e.target.value })
                }
              />
            </div>
            <div className="input-field">
              <label>Projects Completed</label>
              <input
                placeholder="e.g. 14+"
                value={formData.projectsDone}
                onChange={(e) =>
                  setFormData({ ...formData, projectsDone: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="form-section glass full-width">
          <div className="section-header-row">
            <h3>
              <User size={20} />{" "}
              {editLang === "en"
                ? "About Me Story (English)"
                : "قصتي (العربية)"}
            </h3>
            <div className="preview-tabs">
              <button
                type="button"
                className={!showPreview ? "active" : ""}
                onClick={() => setShowPreview(false)}
              >
                <Code size={14} /> Editor
              </button>
              <button
                type="button"
                className={showPreview ? "active" : ""}
                onClick={() => setShowPreview(true)}
              >
                <Eye size={14} /> Live Preview
              </button>
            </div>
          </div>
          {editLang === "en" ? (
            <>
              <div className="input-field">
                <label>Catchy Hero Phrase (English)</label>
                <input
                  placeholder="Engineering clarity into complex systems."
                  value={formData.catchyPhrase}
                  onChange={(e) =>
                    setFormData({ ...formData, catchyPhrase: e.target.value })
                  }
                />
              </div>
              <div className="input-field">
                <label>Full Biography (English - Supports Markdown)</label>
                {!showPreview ? (
                  <textarea
                    rows={10}
                    placeholder="Share your story using Markdown...
Use # for headers, - for bullets, **bold** for emphasis."
                    value={formData.aboutMe}
                    onChange={(e) =>
                      setFormData({ ...formData, aboutMe: e.target.value })
                    }
                  />
                ) : (
                  <div className="markdown-preview glass">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.aboutMe || "_No biography written yet..._"}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div dir="rtl">
              <div className="input-field">
                <label>العبارة الجذابة (العربية)</label>
                <input
                  placeholder="هندسة الوضوح في الأنظمة المعقدة."
                  value={formData.catchyPhrase_ar || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      catchyPhrase_ar: e.target.value,
                    })
                  }
                  className="rtl-input"
                />
              </div>
              <div className="input-field">
                <label>السيرة الذاتية الكاملة (العربية - يدعم ماركداون)</label>
                {!showPreview ? (
                  <textarea
                    rows={10}
                    placeholder="شارك قصتك باستخدام ماركداون...
استخدم # للعناوين، - للقوائم، **عريض** للتأكيد."
                    value={formData.aboutMe_ar || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, aboutMe_ar: e.target.value })
                    }
                    className="rtl-input"
                  />
                ) : (
                  <div className="markdown-preview glass" dir="rtl">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.aboutMe_ar ||
                        "_لم تتم كتابة السيرة الذاتية بعد..._"}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="save-btn">
          <Save size={20} /> Save Changes
        </button>
      </form>

      <style jsx>{`
        .admin-page {
          max-width: 1000px;
          margin: 0 auto;
        }
        .header {
          margin-bottom: 3rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .header p {
          opacity: 0.6;
        }

        .lang-toggle {
          display: flex;
          gap: 4px;
          background: rgba(0, 0, 0, 0.3);
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
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          transition: 0.3s;
        }
        .lang-toggle button.active {
          background: #7628e5;
          color: white;
        }

        .rtl-input {
          text-align: right;
          direction: rtl;
        }
        .rtl-group {
          display: grid;
          gap: 1.5rem;
        }

        .profile-top-card {
          display: flex;
          gap: 3rem;
          padding: 3rem;
          border-radius: 24px;
          margin-bottom: 2rem;
          align-items: center;
        }

        .pic-upload {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .current-pic {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          border: 4px solid #7628e5;
          position: relative;
        }

        .current-pic img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .no-pic {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.3;
        }
        .upload-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        .upload-btn {
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          color: #7628e5;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(118, 40, 229, 0.1);
          padding: 8px 16px;
          border-radius: 50px;
          transition: 0.3s;
        }
        .upload-btn:hover {
          background: rgba(118, 40, 229, 0.2);
        }

        .basic-info {
          flex: 1;
          display: grid;
          gap: 1.5rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .form-section {
          padding: 2rem;
          border-radius: 20px;
        }
        .form-section h3 {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
        }
        .full-width {
          grid-column: 1 / -1;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1.2rem;
        }
        label {
          font-size: 0.8rem;
          font-weight: 600;
          opacity: 0.5;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        input,
        textarea {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 12px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 1rem;
        }
        input:focus,
        textarea:focus {
          border-color: #7628e5;
          outline: none;
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .preview-tabs {
          display: flex;
          gap: 4px;
          background: rgba(0, 0, 0, 0.2);
          padding: 4px;
          border-radius: 8px;
        }
        .preview-tabs button {
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.4);
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          transition: 0.3s;
        }
        .preview-tabs button.active {
          background: #7628e5;
          color: white;
        }

        .markdown-preview {
          padding: 2rem;
          border-radius: 12px;
          min-height: 200px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
        }
        .markdown-preview :global(h1),
        .markdown-preview :global(h2),
        .markdown-preview :global(h3) {
          color: white;
          margin: 1.5rem 0 1rem;
        }
        .markdown-preview :global(ul),
        .markdown-preview :global(ol) {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-preview :global(li) {
          margin-bottom: 0.5rem;
        }
        .markdown-preview :global(strong) {
          color: white;
          font-weight: 700;
        }
        .markdown-preview :global(p) {
          margin-bottom: 1rem;
        }

        .save-btn {
          width: 100%;
          background: #7628e5;
          color: white;
          border: none;
          padding: 1.2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.3s;
        }
        .save-btn:hover {
          background: #8a3ffc;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(118, 40, 229, 0.4);
        }

        @media (max-width: 768px) {
          .profile-top-card {
            flex-direction: column;
            padding: 1.5rem;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
