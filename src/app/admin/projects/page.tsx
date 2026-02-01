"use client";
export const dynamic = "force-dynamic";

import {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { getAll, create, update, remove } from "@/lib/firestore";
import { Project } from "@/types";
import { storage } from "@/lib/firebase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ProjectExportTemplate from "@/components/ProjectExportTemplate";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  SettableMetadata,
} from "firebase/storage";
import imageCompression from "browser-image-compression";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Upload,
  LayoutGrid,
  Target,
  Award,
  Code,
  ArrowUpRight,
  Languages,
  Maximize2,
  Image as ImageIcon,
  Download,
  CheckSquare,
  Square,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ProjectCard from "@/components/ProjectCard";
import Image from "next/image";
import { JourneyPhase } from "@/types";

const FORM_STEPS = [
  { id: "identity", label: "Identity", icon: <LayoutGrid size={16} /> },
  { id: "visuals", label: "Visuals", icon: <Upload size={16} /> },
  { id: "narrative", label: "Narrative", icon: <Award size={16} /> },
  { id: "journey", label: "Journey", icon: <Target size={16} /> },
  { id: "specs", label: "Specs", icon: <Code size={16} /> },
];

const AVAILABLE_CATEGORIES = ["Mobile", "Web", "UI/UX", "AI"];

export default function ProjectsAdmin() {
  const [activeStep, setActiveStep] = useState("identity");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const homeImgInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // NEW: State for Lightbox
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLang, setEditLang] = useState<"en" | "ar">("en");
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    shortDescription: "",
    shortDescription_ar: "",
    longDescription: "",
    longDescription_ar: "",
    features: "",
    features_ar: "",
    challenge: "",
    challenge_ar: "",
    results: "",
    results_ar: "",
    impact: "",
    impact_ar: "",
    techStack: "",
    projectLink: "",
    images: [] as string[],
    logo: "",
    homeImage: "",
    thumbnail: "",
    journey: [] as JourneyPhase[],
    categories: [] as string[],
    color: "#7628E5",
    order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const fetchProjects = useCallback(async () => {
    const data = await getAll<Project>("projects", "createdAt", "desc");
    const sorted = [...data].sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });
    setProjects(sorted);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...formData.images];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const metadata: SettableMetadata = {
      cacheControl: "public,max-age=31536000",
    };

    try {
      for (const file of Array.from(files)) {
        const compressedFile = await imageCompression(file, options);
        const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, compressedFile, metadata);
        const url = await getDownloadURL(storageRef);
        newImages.push(url);
      }
      setFormData((prev) => ({ ...prev, images: newImages }));
    } catch (err: any) {
      console.error("Upload Error:", err);
      alert(`Media upload failed: ${err.message}.`);
    } finally {
      setUploading(false);
    }
  };

  // ... (Keep existing handleLogoUpload, handleHomeImageUpload, handleThumbnailUpload logic same as before) ...
  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 512,
      useWebWorker: true,
    };
    const metadata: SettableMetadata = {
      cacheControl: "public,max-age=31536000",
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `logos/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, compressedFile, metadata);
      const url = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, logo: url }));
    } catch (err: any) {
      alert(`Logo upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleHomeImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };
    const metadata: SettableMetadata = {
      cacheControl: "public,max-age=31536000",
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(
        storage,
        `projects/home_${Date.now()}_${file.name}`,
      );
      await uploadBytes(storageRef, compressedFile, metadata);
      const url = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, homeImage: url }));
    } catch (err: any) {
      alert(`Home image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };
    const metadata: SettableMetadata = {
      cacheControl: "public,max-age=31536000",
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `thumbnails/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, compressedFile, metadata);
      const url = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, thumbnail: url }));
    } catch (err: any) {
      alert(`Thumbnail upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ... (Keep Phase logic same as before) ...
  const addPhase = () => {
    setFormData((prev) => ({
      ...prev,
      journey: [
        ...prev.journey,
        { title: "", title_ar: "", description: "", description_ar: "" },
      ],
    }));
  };

  const removePhase = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      journey: prev.journey.filter((_, i) => i !== index),
    }));
  };

  const updatePhase = (
    index: number,
    field: "title" | "title_ar" | "description" | "description_ar",
    value: string,
  ) => {
    const newJourney = [...formData.journey];
    (newJourney[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, journey: newJourney }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      techStack: formData.techStack.split(",").map((t) => t.trim()),
      order: Number(formData.order) || 0,
    };
    if (editingId) {
      await update("projects", editingId, dataToSave);
    } else {
      await create("projects", dataToSave);
    }
    closeModal();
    fetchProjects();
  };

  const handleEdit = (p: Project) => {
    setEditingId(p.id || null);
    setFormData({
      title: p.title,
      title_ar: p.title_ar || "",
      shortDescription: p.shortDescription || "",
      shortDescription_ar: p.shortDescription_ar || "",
      longDescription: p.longDescription || "",
      longDescription_ar: p.longDescription_ar || "",
      features: Array.isArray(p.features)
        ? p.features.join("\n")
        : p.features || "",
      features_ar: p.features_ar || "",
      challenge: p.challenge || "",
      challenge_ar: p.challenge_ar || "",
      results: p.results || "",
      results_ar: p.results_ar || "",
      impact: p.impact || "",
      impact_ar: p.impact_ar || "",
      techStack: p.techStack?.join(", ") || "",
      projectLink: p.projectLink || "",
      images: p.images || [],
      logo: p.logo || "",
      homeImage: p.homeImage || "",
      thumbnail: p.thumbnail || "",
      journey: p.journey || [],
      categories: p.categories || [],
      color: p.color || "#7628E5",
      order: p.order || 0,
    });
    setEditLang("en");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setActiveStep("identity");
    setEditLang("en");
    setFormData({
      title: "",
      title_ar: "",
      shortDescription: "",
      shortDescription_ar: "",
      longDescription: "",
      longDescription_ar: "",
      features: "",
      features_ar: "",
      challenge: "",
      challenge_ar: "",
      results: "",
      results_ar: "",
      impact: "",
      impact_ar: "",
      techStack: "",
      projectLink: "",
      images: [],
      logo: "",
      homeImage: "",
      thumbnail: "",
      journey: [],
      categories: [],
      color: "#7628E5",
      order: 0,
    });
  };

  const handleExportPDF = async (
    project: Project,
    lang: "en" | "ar" = "en",
  ) => {
    setIsExporting(true);
    try {
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      document.body.appendChild(container);

      // We need to render the template to the hidden container
      // Since we are in a client component, we can use createRoot or just use a hidden div in the JSX
      // But for simplicity and to avoid React issues with portal/rendering,
      // I'll add a hidden container in the return and use that.

      const targetElement = document.getElementById(`export-container`);
      if (!targetElement) throw new Error("Export container not found");

      // We'll use a temporary state or a direct approach to render
      // For now, let's just use the hidden div approach in JSX below.

      const element = document.getElementById(`project-export-${project.id}`);
      if (!element) throw new Error("Project element not found");

      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${project.title.replace(/\s+/g, "_")}_${lang}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkExport = async () => {
    const selectedProjects = projects.filter(
      (p) => p.id && selectedIds.includes(p.id),
    );
    if (selectedProjects.length === 0) return;

    for (const project of selectedProjects) {
      await handleExportPDF(project, "en");
      // Add a small delay between downloads to avoid browser blocks
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(projects.map((p) => p.id as string).filter(Boolean));
    }
  };

  if (isModalOpen) {
    return (
      <div className="admin-page min-h-screen bg-black text-white flex flex-col">
        {/* LIGHTBOX OVERLAY */}
        {expandedImage && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300"
            onClick={() => setExpandedImage(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[101]"
              onClick={() => setExpandedImage(null)}
            >
              <X size={24} />
            </button>
            <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
              <Image
                src={expandedImage}
                fill
                className="object-contain"
                alt="Expanded Preview"
                quality={100}
              />
            </div>
          </div>
        )}

        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-12 py-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={closeModal}
              className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors font-bold text-sm"
            >
              <ArrowUpRight
                size={18}
                className="rotate-[-135deg] transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
              />{" "}
              BACK
            </button>
            <div className="h-6 w-[1px] bg-white/10"></div>
            <h2 className="text-xl font-bold tracking-tight">
              {editingId ? "Refine Case Study" : "Draft New Showcase"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setEditLang("en")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  editLang === "en"
                    ? "bg-[#7628E5] text-white"
                    : "text-white/40 hover:text-white"
                }`}
              >
                <Languages size={14} /> EN
              </button>
              <button
                type="button"
                onClick={() => setEditLang("ar")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  editLang === "ar"
                    ? "bg-[#7628E5] text-white"
                    : "text-white/40 hover:text-white"
                }`}
              >
                AR <Languages size={14} />
              </button>
            </div>
            <div className="h-6 w-[1px] bg-white/10"></div>
            <button
              onClick={() =>
                (
                  document.querySelector(".project-form") as HTMLFormElement
                )?.requestSubmit()
              }
              className="bg-[#7628E5] hover:bg-[#621cc4] text-white px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50"
              disabled={uploading}
            >
              {editingId ? "UPDATE PROJECT" : "PUBLISH PROJECT"}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-white/5 p-8 flex flex-col gap-2 overflow-y-auto">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">
              Construction
            </p>
            {FORM_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeStep === step.id
                    ? "bg-[#7628E5] text-white shadow-lg shadow-purple-900/20"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {step.icon}
                {step.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-12 scroll-smooth">
            <form
              onSubmit={handleSubmit}
              className="project-form max-w-4xl mx-auto space-y-12 pb-32"
            >
              {/* Identity Section (Same as before) */}
              {activeStep === "identity" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-8 bg-white/5 p-8 rounded-[32px] border border-white/5">
                    <div
                      onClick={() => logoInputRef.current?.click()}
                      className="w-24 h-24 rounded-2xl bg-black border-2 border-dashed border-white/10 hover:border-[#7628E5]/50 flex items-center justify-center cursor-pointer transition-all overflow-hidden relative group"
                    >
                      {formData.logo ? (
                        <Image
                          src={formData.logo}
                          fill
                          className="object-contain p-4"
                          alt="Logo"
                        />
                      ) : (
                        <Plus size={32} className="opacity-20" />
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-[#7628E5] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-widest text-[#7628E5] mb-2">
                        Brand Identity
                      </h4>
                      <p className="text-white/40 text-sm mb-4">
                        Upload the project emblem.
                      </p>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="text-[10px] font-black bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/5 transition-all"
                      >
                        UPLOAD EMBLEM
                      </button>
                      <input
                        type="file"
                        ref={logoInputRef}
                        onChange={handleLogoUpload}
                        hidden
                      />
                    </div>
                  </div>

                  {editLang === "en" ? (
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                          Project Title (English)
                        </label>
                        <input
                          className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-2xl px-6 py-4 text-white outline-none transition-all font-bold"
                          placeholder="e.g. SnowLex"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                          Primary Pitch (English)
                        </label>
                        <input
                          className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-2xl px-6 py-4 text-white outline-none transition-all font-bold"
                          placeholder="High-impact title..."
                          value={formData.shortDescription}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shortDescription: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6" dir="rtl">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mr-4">
                          عنوان المشروع (العربية)
                        </label>
                        <input
                          className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-2xl px-6 py-4 text-white outline-none transition-all font-bold text-right"
                          placeholder="مثال: سنو ليكس"
                          value={formData.title_ar}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              title_ar: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mr-4">
                          العرض الأساسي (العربية)
                        </label>
                        <input
                          className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-2xl px-6 py-4 text-white outline-none transition-all font-bold text-right"
                          placeholder="عنوان ثانوي..."
                          value={formData.shortDescription_ar}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shortDescription_ar: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                        Theme Color
                      </label>
                      <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                          <input
                            type="color"
                            className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                            value={formData.color}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                color: e.target.value,
                              })
                            }
                          />
                        </div>
                        <input
                          type="text"
                          className="bg-transparent border-none text-white outline-none font-mono text-sm uppercase flex-1"
                          value={formData.color}
                          onChange={(e) =>
                            setFormData({ ...formData, color: e.target.value })
                          }
                          placeholder="#7628E5"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                        Display Order
                      </label>
                      <input
                        type="number"
                        className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-2xl px-6 py-4 text-white outline-none transition-all font-bold"
                        placeholder="0"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            order: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Visuals Section - REDESIGNED */}
              {activeStep === "visuals" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Main Covers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                        Home Screen (Hero)
                      </label>
                      <div
                        onClick={() => homeImgInputRef.current?.click()}
                        className="h-48 rounded-[32px] border-2 border-dashed border-white/10 hover:border-[#7628E5]/50 bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all relative group"
                        style={{
                          backgroundImage: formData.homeImage
                            ? `url(${formData.homeImage})`
                            : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {!formData.homeImage && (
                          <div className="flex flex-col items-center">
                            <Upload
                              size={24}
                              className="opacity-20 mb-2 group-hover:scale-110 transition-transform"
                            />
                            <span className="text-xs font-bold text-white/20">
                              HERO IMAGE
                            </span>
                          </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-[#7628E5] border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={homeImgInputRef}
                        onChange={handleHomeImageUpload}
                        hidden
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                        Card Thumbnail
                      </label>
                      <div
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="h-48 rounded-[32px] border-2 border-dashed border-white/10 hover:border-[#7628E5]/50 bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all relative group"
                        style={{
                          backgroundImage: formData.thumbnail
                            ? `url(${formData.thumbnail})`
                            : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {!formData.thumbnail && (
                          <div className="flex flex-col items-center">
                            <ImageIcon
                              size={24}
                              className="opacity-20 mb-2 group-hover:scale-110 transition-transform"
                            />
                            <span className="text-xs font-bold text-white/20">
                              CARD THUMBNAIL
                            </span>
                          </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-[#7628E5] border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={thumbnailInputRef}
                        onChange={handleThumbnailUpload}
                        hidden
                      />
                    </div>
                  </div>

                  {/* FILM REEL GALLERY */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center ml-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                        Project Gallery Reel{" "}
                        <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-[9px]">
                          {formData.images.length}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 text-[10px] font-black bg-[#7628E5]/10 text-[#7628E5] hover:bg-[#7628E5] hover:text-white px-4 py-2 rounded-lg transition-all"
                      >
                        <Plus size={12} /> ADD SCREENS
                      </button>
                    </div>

                    {/* Horizontal Scroll Container */}
                    <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20">
                      <div className="flex gap-4 w-max px-1">
                        {/* Add Button in Strip */}
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-[200px] h-[140px] flex-shrink-0 rounded-2xl border-2 border-dashed border-white/10 hover:border-white/30 bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/10 group"
                        >
                          <Plus
                            size={24}
                            className="opacity-30 group-hover:scale-110 transition-transform"
                          />
                          <span className="text-[10px] font-bold text-white/30 mt-2 uppercase tracking-wide">
                            Upload
                          </span>
                        </div>

                        {/* Image Cards */}
                        {formData.images.map((img, i) => (
                          <div
                            key={i}
                            className="group relative w-[240px] h-[140px] flex-shrink-0 rounded-2xl border border-white/10 overflow-hidden bg-black shadow-lg hover:shadow-[#7628E5]/20 hover:border-[#7628E5]/50 transition-all"
                          >
                            <Image
                              src={img}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              alt=""
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                              <button
                                type="button"
                                onClick={() => setExpandedImage(img)}
                                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-md transition-transform hover:scale-110"
                                title="View Fullscreen"
                              >
                                <Maximize2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-transform hover:scale-110"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-mono text-white/70 border border-white/5">
                              {i + 1 < 10 ? `0${i + 1}` : i + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      hidden
                    />
                  </div>
                </div>
              )}

              {/* Narrative Section (Same as before) */}
              {activeStep === "narrative" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {editLang === "en" ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                          Long Description (English - Markdown)
                        </label>
                        <textarea
                          className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-[32px] px-8 py-6 text-white outline-none transition-all font-medium text-sm leading-relaxed min-h-[300px]"
                          placeholder="Write the background story..."
                          value={formData.longDescription}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              longDescription: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                            The Challenge
                          </label>
                          <textarea
                            className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-3xl px-6 py-5 text-white outline-none transition-all font-medium text-sm min-h-[150px]"
                            value={formData.challenge}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                challenge: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                            The Impact
                          </label>
                          <textarea
                            className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-3xl px-6 py-5 text-white outline-none transition-all font-medium text-sm min-h-[150px]"
                            value={formData.impact}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                impact: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Markdown Tips Box */}
                      <div className="bg-[#7628E5]/5 border border-[#7628E5]/20 rounded-2xl p-6 text-sm">
                        <h4 className="text-xs font-black text-[#7628E5] uppercase tracking-widest mb-3">
                          📝 Markdown Tips
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-white/50 font-mono text-xs">
                          <div>
                            <code className="text-[#7628E5]">**bold**</code> →{" "}
                            <strong className="text-white">bold</strong>
                          </div>
                          <div>
                            <code className="text-[#7628E5]">*italic*</code> →{" "}
                            <em className="text-white">italic</em>
                          </div>
                          <div>
                            <code className="text-[#7628E5]"># Heading</code> →
                            Large title
                          </div>
                          <div>
                            <code className="text-[#7628E5]">## Subhead</code> →
                            Subtitle
                          </div>
                          <div>
                            <code className="text-[#7628E5]">- item</code> → •
                            Bullet list
                          </div>
                          <div>
                            <code className="text-[#7628E5]">1. item</code> →
                            Numbered list
                          </div>
                        </div>
                      </div>

                      {/* Features & Results */}
                      <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                            Key Features (Markdown)
                          </label>
                          <textarea
                            className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-3xl px-6 py-5 text-white outline-none transition-all font-medium text-sm min-h-[180px]"
                            placeholder="- Feature one&#10;- Feature two&#10;- Feature three"
                            value={formData.features}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                features: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                            Results / Outcomes (Markdown)
                          </label>
                          <textarea
                            className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-3xl px-6 py-5 text-white outline-none transition-all font-medium text-sm min-h-[180px]"
                            placeholder="- 50% increase in...&#10;- Reduced time by...&#10;- Achieved milestone..."
                            value={formData.results}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                results: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div dir="rtl">
                      {/* Arabic Inputs */}
                      <div className="flex flex-col gap-2 mb-8">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mr-4">
                          الوصف التفصيلي (العربية)
                        </label>
                        <textarea
                          className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-[32px] px-8 py-6 text-white outline-none transition-all font-medium text-sm leading-relaxed min-h-[300px] text-right"
                          value={formData.longDescription_ar}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              longDescription_ar: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mr-4">
                            التحدي
                          </label>
                          <textarea
                            className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-3xl px-6 py-5 text-white outline-none transition-all font-medium text-sm min-h-[150px] text-right"
                            value={formData.challenge_ar}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                challenge_ar: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mr-4">
                            الأثر
                          </label>
                          <textarea
                            className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-3xl px-6 py-5 text-white outline-none transition-all font-medium text-sm min-h-[150px] text-right"
                            value={formData.impact_ar}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                impact_ar: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Features & Results (Arabic) */}
                      <div className="grid grid-cols-2 gap-8 mt-8">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mr-4">
                            المميزات الرئيسية
                          </label>
                          <textarea
                            className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-3xl px-6 py-5 text-white outline-none transition-all font-medium text-sm min-h-[180px] text-right"
                            placeholder="- ميزة واحدة&#10;- ميزة ثانية&#10;- ميزة ثالثة"
                            value={formData.features_ar}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                features_ar: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mr-4">
                            النتائج
                          </label>
                          <textarea
                            className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-3xl px-6 py-5 text-white outline-none transition-all font-medium text-sm min-h-[180px] text-right"
                            placeholder="- زيادة بنسبة 50%...&#10;- تقليل الوقت بنسبة...&#10;- تحقيق هدف..."
                            value={formData.results_ar}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                results_ar: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Journey Section (Same as before) */}
              {activeStep === "journey" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center ml-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                      {editLang === "en"
                        ? "Experience Pipeline"
                        : "مسار التجربة"}
                    </label>
                    <button
                      type="button"
                      onClick={addPhase}
                      className="bg-[#7628E5] hover:bg-[#621cc4] text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2"
                    >
                      <Plus size={14} />{" "}
                      {editLang === "en" ? "ADD PHASE" : "إضافة مرحلة"}
                    </button>
                  </div>
                  <div className="space-y-6">
                    {formData.journey.map((phase, index) => (
                      <div
                        key={index}
                        className="group relative bg-white/5 p-8 rounded-[32px] border border-white/5 space-y-4"
                        dir={editLang === "ar" ? "rtl" : "ltr"}
                      >
                        <button
                          type="button"
                          onClick={() => removePhase(index)}
                          className="absolute -top-3 -right-3 p-2 bg-red-500 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="flex items-center gap-6">
                          <span className="w-10 h-10 rounded-full bg-black flex items-center justify-center font-black text-[#7628E5] border border-white/5 text-xs">
                            0{index + 1}
                          </span>
                          <input
                            className="bg-transparent border-b border-white/10 focus:border-[#7628E5] flex-1 py-2 text-lg font-black outline-none transition-all"
                            placeholder={
                              editLang === "en"
                                ? "Phase Title"
                                : "عنوان المرحلة"
                            }
                            value={
                              editLang === "en" ? phase.title : phase.title_ar
                            }
                            onChange={(e) =>
                              updatePhase(
                                index,
                                editLang === "en" ? "title" : "title_ar",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <textarea
                          className="bg-black/20 border border-white/10 focus:border-[#7628E5] w-full p-6 h-32 rounded-2xl outline-none transition-all text-sm font-medium"
                          placeholder={
                            editLang === "en" ? "Description..." : "الوصف..."
                          }
                          value={
                            editLang === "en"
                              ? phase.description
                              : phase.description_ar
                          }
                          onChange={(e) =>
                            updatePhase(
                              index,
                              editLang === "en"
                                ? "description"
                                : "description_ar",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs Section (Same as before) */}
              {activeStep === "specs" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                        Technical Ecosystem
                      </label>
                      <input
                        className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-2xl px-6 py-4 text-white font-bold"
                        placeholder="React, Next.js..."
                        value={formData.techStack}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            techStack: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                        Live URL
                      </label>
                      <input
                        className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-2xl px-6 py-4 text-white font-bold"
                        placeholder="https://..."
                        value={formData.projectLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectLink: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">
                        Categories
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              const newCats = formData.categories.includes(cat)
                                ? formData.categories.filter((c) => c !== cat)
                                : [...formData.categories, cat];
                              setFormData({ ...formData, categories: newCats });
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.categories.includes(cat) ? "bg-[#7628E5] text-white" : "bg-white/5 text-white/40 border border-white/10"}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Real-time Preview */}
          <div className="w-[450px] border-l border-white/5 bg-[#080808] p-12 overflow-y-auto hidden xl:block">
            <div className="sticky top-0 space-y-12">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-[#7628E5] uppercase tracking-[0.3em]">
                  Live Home Preview
                </p>
                <div className="scale-90 origin-top">
                  <ProjectCard
                    project={
                      {
                        ...formData,
                        techStack: formData.techStack
                          .split(",")
                          .map((t) => t.trim()),
                      } as any
                    }
                    isPreview={true}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-[#7628E5] uppercase tracking-[0.3em]">
                  Story Continuity
                </p>
                <div className="bg-white/5 rounded-3xl p-8 border border-white/5 h-[300px] overflow-y-auto">
                  <div className="prose prose-invert prose-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.longDescription || "_Drafting the story..._"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Export Containers */}
        <div
          id="export-container"
          className="fixed left-[-9999px] top-0 pointer-events-none"
        >
          {projects.map((p) => (
            <div key={p.id}>
              <ProjectExportTemplate project={p} language="en" />
              <ProjectExportTemplate project={p} language="ar" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="p-12 space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 underline decoration-[#7628E5] decoration-4 underline-offset-8">
            Case Studies
          </h1>
          <p className="text-white/20 font-bold tracking-[0.2em] text-[10px] uppercase">
            Active Portfolio Manifest — Operational
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-3 bg-[#7628E5] hover:bg-[#621cc4] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20 active:scale-95"
        >
          <Plus
            size={18}
            className="group-hover:rotate-90 transition-transform"
          />
          <span>Initialize New Project</span>
        </button>
      </header>

      {/* Bulk Actions Bar */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl sticky top-[100px] z-40">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-3 text-xs font-black text-white/40 hover:text-white transition-all uppercase tracking-widest"
          >
            {selectedIds.length === projects.length ? (
              <CheckSquare size={16} className="text-[#7628E5]" />
            ) : (
              <Square size={16} />
            )}
            {selectedIds.length === projects.length
              ? "Deselect All"
              : "Select All"}
          </button>
          {selectedIds.length > 0 && (
            <span className="text-[10px] font-black bg-[#7628E5] text-white px-3 py-1 rounded-full">
              {selectedIds.length} SELECTED
            </span>
          )}
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkExport}
            disabled={isExporting}
            className="flex items-center gap-3 bg-white text-black hover:bg-white/90 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50"
          >
            <Download size={18} />
            <span>{isExporting ? "Exporting..." : "Bulk Export PDF"}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => (
          <div
            key={p.id}
            className="group relative bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden transition-all hover:border-[#7628E5]/30"
          >
            <div className="h-48 relative bg-black overflow-hidden p-6 flex justify-center items-center">
              <div className="relative w-full h-full">
                {p.images?.slice(0, 3).map((img, i) => (
                  <div
                    key={i}
                    className={`absolute w-4/5 h-4/5 rounded-xl border-4 border-[#0a0a0a] transition-all group-hover:scale-105 shadow-2xl overflow-hidden`}
                    style={{
                      top: `${10 + i * 5}%`,
                      left: `${10 + i * 10}%`,
                      zIndex: 10 - i,
                      opacity: 1 - i * 0.3,
                    }}
                  >
                    <Image src={img} fill className="object-cover" alt="" />
                  </div>
                ))}
                {p.images && p.images.length > 3 && (
                  <div className="absolute bottom-4 right-4 bg-[#7628E5] px-2 py-1 rounded-md text-[10px] font-black z-20">
                    +{p.images.length - 3} SCREENS
                  </div>
                )}
                {(!p.images || p.images.length === 0) && (
                  <div className="w-full h-full rounded-xl bg-white/5 flex items-center justify-center">
                    <LayoutGrid className="opacity-10" size={40} />
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/5 relative">
                  {p.logo ? (
                    <Image
                      src={p.logo}
                      fill
                      className="object-contain p-2"
                      alt=""
                    />
                  ) : (
                    <LayoutGrid size={16} className="opacity-20" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight line-clamp-1">
                    {p.title}
                  </h3>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                    {p.categories?.join(" • ") || "Case Study"}
                  </span>
                </div>
              </div>
              <p className="text-white/40 text-xs line-clamp-2 mb-6 h-8">
                {p.shortDescription}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-[#7628E5] text-white py-2 rounded-xl text-xs font-bold transition-all group/btn"
                >
                  <Edit2 size={14} className="group-hover/btn:scale-110" /> EDIT
                </button>
                <button
                  onClick={() =>
                    p.id && remove("projects", p.id).then(fetchProjects)
                  }
                  className="w-10 flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-500 rounded-xl transition-all"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => handleExportPDF(p, "en")}
                  disabled={isExporting}
                  className="w-10 flex items-center justify-center bg-white/5 hover:bg-[#7628E5]/20 text-white/20 hover:text-[#7628E5] rounded-xl transition-all"
                  title="Export PDF (EN)"
                >
                  <FileText size={14} />
                </button>
                <button
                  onClick={() => handleExportPDF(p, "ar")}
                  disabled={isExporting}
                  className="w-10 flex items-center justify-center bg-white/5 hover:bg-[#7628E5]/20 text-white/20 hover:text-[#7628E5] rounded-xl transition-all"
                  title="Export PDF (AR)"
                >
                  <Languages size={14} />
                </button>
              </div>
            </div>

            {/* Selection Checkbox */}
            <button
              onClick={() => p.id && toggleSelect(p.id)}
              className={`absolute top-4 left-4 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all z-30 ${
                p.id && selectedIds.includes(p.id)
                  ? "bg-[#7628E5] border-[#7628E5] text-white scale-110 shadow-lg shadow-purple-900/40"
                  : "bg-black/40 border-white/10 text-transparent hover:border-white/30 backdrop-blur-md"
              }`}
            >
              <CheckSquare size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Hidden Export Containers for Dashboard View */}
      <div
        id="export-container"
        className="fixed left-[-9999px] top-0 pointer-events-none"
      >
        {projects.map((p) => (
          <div key={p.id}>
            <ProjectExportTemplate project={p} language="en" />
            <ProjectExportTemplate project={p} language="ar" />
          </div>
        ))}
      </div>
    </div>
  );
}
