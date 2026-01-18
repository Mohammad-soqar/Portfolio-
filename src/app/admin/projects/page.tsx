"use client";
import { useState, useEffect, FormEvent, ChangeEvent, useCallback, useRef } from "react";
import { getAll, create, update, remove } from "@/lib/firestore";
import { Project } from "@/types";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, SettableMetadata } from "firebase/storage";
import imageCompression from 'browser-image-compression';
import { Plus, Trash2, Edit2, X, Upload, LayoutGrid, ListChecks, Target, Award, Eye, Code, ArrowUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ProjectCard from "@/components/ProjectCard";
import Image from "next/image";

const FORM_STEPS = [
  { id: 'identity', label: 'Identity', icon: <LayoutGrid size={16} /> },
  { id: 'visuals', label: 'Visuals', icon: <Upload size={16} /> },
  { id: 'narrative', label: 'Narrative', icon: <Award size={16} /> },
  { id: 'journey', label: 'Journey', icon: <Target size={16} /> },
  { id: 'specs', label: 'Specs', icon: <Code size={16} /> },
];

export default function ProjectsAdmin() {
  const [activeStep, setActiveStep] = useState('identity');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const homeImgInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Used as "isFormOpen" now
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    features: "", 
    challenge: "",
    results: "",
    impact: "",
    techStack: "",
    projectLink: "",
    images: [] as string[],
    logo: "",
    homeImage: "",
    thumbnail: "",
    journey: [] as { title: string, description: string }[]
  });
  const [uploading, setUploading] = useState(false);

  const fetchProjects = useCallback(async () => {
    const data = await getAll<Project>("projects", "createdAt");
    setProjects(data);
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
      useWebWorker: true
    };

    const metadata: SettableMetadata = {
      cacheControl: 'public,max-age=31536000',
    };
    
    try {
      for (const file of Array.from(files)) {
        const compressedFile = await imageCompression(file, options);
        const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, compressedFile, metadata);
        const url = await getDownloadURL(storageRef);
        newImages.push(url);
      }
      setFormData(prev => ({ ...prev, images: newImages }));
      alert(`Success: ${files.length} images uploaded!`);
    } catch (err: any) {
      console.error("Upload Error:", err);
      alert(`Media upload failed: ${err.message}. Ensure Storage bucket is publicly writable or you are authenticated.`);
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    const options = {
      maxSizeMB: 0.2, // Logo should be very small
      maxWidthOrHeight: 512,
      useWebWorker: true
    };

    const metadata: SettableMetadata = {
      cacheControl: 'public,max-age=31536000',
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `logos/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, compressedFile, metadata);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, logo: url }));
      alert("Logo uploaded!");
    } catch (err: any) {
      console.error("Logo Upload Error:", err);
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
      useWebWorker: true
    };

    const metadata: SettableMetadata = {
      cacheControl: 'public,max-age=31536000',
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `projects/home_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, compressedFile, metadata);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, homeImage: url }));
      alert("Home screen image uploaded!");
    } catch (err: any) {
      console.error("Home Image Upload Error:", err);
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
      useWebWorker: true
    };

    const metadata: SettableMetadata = {
      cacheControl: 'public,max-age=31536000',
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `thumbnails/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, compressedFile, metadata);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, thumbnail: url }));
      alert("Thumbnail uploaded!");
    } catch (err: any) {
      console.error("Thumbnail Upload Error:", err);
      alert(`Thumbnail upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addPhase = () => {
    setFormData(prev => ({
      ...prev,
      journey: [...prev.journey, { title: "", description: "" }]
    }));
  };

  const removePhase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      journey: prev.journey.filter((_, i) => i !== index)
    }));
  };

  const updatePhase = (index: number, field: 'title' | 'description', value: string) => {
    const newJourney = [...formData.journey];
    newJourney[index][field] = value;
    setFormData(prev => ({ ...prev, journey: newJourney }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSave = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      longDescription: formData.longDescription,
      features: formData.features, // Store as markdown string
      challenge: formData.challenge,
      results: formData.results,
      impact: formData.impact,
      journey: formData.journey,
      techStack: formData.techStack.split(",").map(t => t.trim()),
      projectLink: formData.projectLink,
      images: formData.images,
      logo: formData.logo,
      homeImage: formData.homeImage,
      thumbnail: formData.thumbnail
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
      shortDescription: p.shortDescription || "",
      longDescription: p.longDescription || "",
      features: Array.isArray(p.features) ? p.features.join("\n") : (p.features || ""),
      challenge: p.challenge || "",
      results: p.results || "",
      impact: p.impact || "",
      techStack: p.techStack?.join(", ") || "",
      projectLink: p.projectLink || "",
      images: p.images || [],
      logo: p.logo || "",
      homeImage: p.homeImage || "",
      thumbnail: p.thumbnail || "",
      journey: p.journey || []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setActiveStep('identity'); // Reset step on close
    setFormData({
      title: "",
      shortDescription: "",
      longDescription: "",
      features: "",
      challenge: "",
      results: "",
      impact: "",
      techStack: "",
      projectLink: "",
      images: [],
      logo: "",
      homeImage: "",
      thumbnail: "",
      journey: []
    });
  };

  if (isModalOpen) {
    return (
      <div className="admin-page min-h-screen bg-black text-white flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-12 py-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={closeModal} 
              className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors font-bold text-sm"
            >
              <ArrowUpRight size={18} className="rotate-[-135deg] transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" /> BACK
            </button>
            <div className="h-6 w-[1px] bg-white/10"></div>
            <h2 className="text-xl font-bold tracking-tight">{editingId ? "Refine Case Study" : "Draft New Showcase"}</h2>
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={closeModal} className="text-white/40 hover:text-white font-bold text-sm px-4">DISCARD</button>
            <button 
              onClick={() => (document.querySelector('.project-form') as HTMLFormElement)?.requestSubmit()} 
              className="bg-[#7628E5] hover:bg-[#621cc4] text-white px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50" 
              disabled={uploading}
            >
              {editingId ? "UPDATE PROJECT" : "PUBLISH PROJECT"}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Progress Tracker Sidebar */}
          <div className="w-64 border-r border-white/5 p-8 flex flex-col gap-2 overflow-y-auto">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Project Construction</p>
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
                {activeStep === step.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-12">
            <form onSubmit={handleSubmit} className="project-form max-w-4xl mx-auto space-y-12 pb-32">
              
              {/* Identity Section */}
              {activeStep === 'identity' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-8 bg-white/5 p-8 rounded-[32px] border border-white/5">
                    <div 
                      onClick={() => logoInputRef.current?.click()}
                      className="w-24 h-24 rounded-2xl bg-black border-2 border-dashed border-white/10 hover:border-[#7628E5]/50 flex items-center justify-center cursor-pointer transition-all overflow-hidden relative group"
                    >
                      {formData.logo ? <Image src={formData.logo} fill className="object-contain rounded-2xl p-4 rounded-2xl rounded-[32px] transition-transform group-hover:scale-110" alt="Logo" /> : <Plus size={32} className="opacity-20" />}
                      {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"><div className="w-6 h-6 border-2 border-[#7628E5] border-t-transparent rounded-full animate-spin"></div></div>}
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-widest text-[#7628E5] mb-2">Brand Identity</h4>
                      <p className="text-white/40 text-sm mb-4">Upload the project emblem (e.g. logo or icon).</p>
                      <button type="button" onClick={() => logoInputRef.current?.click()} className="text-[10px] font-black bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/5 transition-all">UPLOAD EMBLEM</button>
                      <input type="file" ref={logoInputRef} onChange={handleLogoUpload} hidden />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Project Title</label>
                      <input 
                        className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-2xl px-6 py-4 text-white placeholder-white/20 outline-none transition-all font-bold"
                        placeholder="e.g. SnowLex — AI Legal Research" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Primary Pitch (Hero)</label>
                      <input 
                        className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-2xl px-6 py-4 text-white placeholder-white/20 outline-none transition-all font-bold"
                        placeholder="High-impact secondary title..." 
                        value={formData.shortDescription} 
                        onChange={e => setFormData({...formData, shortDescription: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Visuals Section */}
              {activeStep === 'visuals' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Home Screen Thumbnail</label>
                    <div 
                      onClick={() => homeImgInputRef.current?.click()}
                      className="h-64 rounded-[32px] border-2 border-dashed border-white/10 hover:border-[#7628E5]/50 bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all relative group"
                      style={{ backgroundImage: formData.homeImage ? `url(${formData.homeImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      {!formData.homeImage && (
                        <>
                          <Upload size={32} className="opacity-20 mb-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-bold text-white/20">UPLOAD DASHBOARD THUMBNAIL</span>
                        </>
                      )}
                      {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"><div className="w-10 h-10 border-4 border-[#7628E5] border-t-transparent rounded-full animate-spin"></div></div>}
                    </div>
                    <input type="file" ref={homeImgInputRef} onChange={handleHomeImageUpload} hidden />
                  </div>

                  {/* Card Thumbnail Upload */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Card Thumbnail (Movie-Style)</label>
                    <div 
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="h-48 rounded-[32px] border-2 border-dashed border-white/10 hover:border-[#7628E5]/50 bg-white/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all relative group"
                      style={{ backgroundImage: formData.thumbnail ? `url(${formData.thumbnail})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      {!formData.thumbnail && (
                        <>
                          <Upload size={28} className="opacity-20 mb-3 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-bold text-white/20">UPLOAD CARD THUMBNAIL</span>
                          <span className="text-[10px] text-white/10 mt-1">This appears on project cards</span>
                        </>
                      )}
                      {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"><div className="w-10 h-10 border-4 border-[#7628E5] border-t-transparent rounded-full animate-spin"></div></div>}
                    </div>
                    {formData.thumbnail && (
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                        className="text-[10px] font-bold text-red-400 hover:text-red-300 ml-4"
                      >
                        Remove Thumbnail
                      </button>
                    )}
                    <input type="file" ref={thumbnailInputRef} onChange={handleThumbnailUpload} hidden />
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center ml-4">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Project Gallery</label>
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 text-[10px] font-black bg-[#7628E5]/10 text-[#7628E5] hover:bg-[#7628E5] hover:text-white px-4 py-2 rounded-lg transition-all"
                      >
                        <Plus size={12} /> ADD SCREENS
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((img, i) => (
                        <div key={i} className="group aspect-video rounded-2xl border border-white/10 overflow-hidden relative">
                          <Image src={img} fill className="object-cover transition-transform group-hover:scale-110" alt="" />
                          <button 
                            type="button" 
                            onClick={() => removeImage(i)} 
                            className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl z-10"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-white/30 flex items-center justify-center cursor-pointer transition-all"
                      >
                        <Plus size={20} className="opacity-20" />
                      </div>
                    </div>
                    <input type="file" multiple ref={fileInputRef} onChange={handleImageUpload} hidden />
                  </div>
                </div>
              )}

              {/* Narrative Section */}
              {activeStep === 'narrative' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Long Description (Markdown)</label>
                    <textarea 
                      className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-[32px] px-8 py-6 text-white placeholder-white/20 outline-none transition-all font-medium text-sm leading-relaxed min-h-[300px]"
                      placeholder="Write the background story...

Use # for headers, **bold**, *italic*, and - for bullets." 
                      value={formData.longDescription} 
                      onChange={e => setFormData({...formData, longDescription: e.target.value})} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">The Challenge (Markdown)</label>
                      <textarea 
                        className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-3xl px-6 py-5 text-white placeholder-white/20 outline-none transition-all font-medium text-sm min-h-[150px]"
                        placeholder="What problem were we solving?\n\nUse **bold**, *italic*, - bullets, and paragraphs" 
                        value={formData.challenge} 
                        onChange={e => setFormData({...formData, challenge: e.target.value})} 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">The Impact (Markdown)</label>
                      <textarea 
                        className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-3xl px-6 py-5 text-white placeholder-white/20 outline-none transition-all font-medium text-sm min-h-[150px]"
                        placeholder="Quantifiable results...\n\nUse **bold**, *italic*, - bullets, and paragraphs" 
                        value={formData.impact} 
                        onChange={e => setFormData({...formData, impact: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Journey Section */}
              {activeStep === 'journey' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center ml-4">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Experience Pipeline</label>
                    <button 
                      type="button" 
                      onClick={addPhase} 
                      className="bg-[#7628E5] hover:bg-[#621cc4] text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2"
                    >
                      <Plus size={14} /> ADD PHASE
                    </button>
                  </div>
                  <div className="space-y-6">
                    {formData.journey.map((phase, index) => (
                      <div key={index} className="group relative bg-white/5 p-8 rounded-[32px] border border-white/5 space-y-4">
                        <button 
                          type="button" 
                          onClick={() => removePhase(index)} 
                          className="absolute -top-3 -right-3 p-2 bg-red-500 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="flex items-center gap-6">
                          <span className="w-10 h-10 rounded-full bg-black flex items-center justify-center font-black text-[#7628E5] border border-white/5 text-xs">0{index + 1}</span>
                          <input 
                            className="bg-transparent border-b border-white/10 focus:border-[#7628E5] flex-1 py-2 text-lg font-black outline-none transition-all placeholder-white/10"
                            placeholder="Phase Title (e.g. Discovery)" 
                            value={phase.title}
                            onChange={(e) => updatePhase(index, 'title', e.target.value)}
                          />
                        </div>
                        <textarea 
                          className="bg-black/20 border border-white/10 focus:border-[#7628E5] hover:border-white/20 w-full p-6 h-32 rounded-2xl outline-none transition-all text-sm font-medium leading-relaxed"
                          placeholder="Detail what happened here... (Supports Markdown)" 
                          value={phase.description}
                          onChange={(e) => updatePhase(index, 'description', e.target.value)}
                        />
                      </div>
                    ))}
                    {formData.journey.length === 0 && (
                      <div className="h-64 rounded-[32px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 opacity-20">
                        <Target size={40} />
                        <p className="font-bold">No phases added yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Specs Section */}
              {activeStep === 'specs' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Technical Ecosystem</label>
                      <input 
                        className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-2xl px-6 py-4 text-white placeholder-white/20 outline-none transition-all font-bold"
                        placeholder="React, Next.js, Python, Tailwind..." 
                        value={formData.techStack} 
                        onChange={e => setFormData({...formData, techStack: e.target.value})} 
                      />
                      <p className="text-[10px] text-white/20 ml-4 italic">Separate tools with commas.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4">Live Deployment URL</label>
                      <input 
                        className="bg-white/5 border border-white/10 focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] rounded-2xl px-6 py-4 text-white placeholder-white/20 outline-none transition-all font-bold"
                        placeholder="https://..." 
                        value={formData.projectLink} 
                        onChange={e => setFormData({...formData, projectLink: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Real-time Preview Sidebar */}
          <div className="w-[450px] border-l border-white/5 bg-[#080808] p-12 overflow-y-auto">
            <div className="sticky top-0 space-y-12">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-[#7628E5] uppercase tracking-[0.3em]">Live Home Preview</p>
                <div className="scale-90 origin-top">
                  <ProjectCard 
                    project={{
                      ...formData,
                      techStack: formData.techStack.split(",").map(t => t.trim()),
                    } as any}
                    isPreview={true}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-[#7628E5] uppercase tracking-[0.3em]">Story Continuity</p>
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
      </div>
    );
  }

    return (
      <div className="p-12 space-y-12">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 underline decoration-[#7628E5] decoration-4 underline-offset-8">Case Studies</h1>
            <p className="text-white/20 font-bold tracking-[0.2em] text-[10px] uppercase">Active Portfolio Manifest — Operational</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-3 bg-[#7628E5] hover:bg-[#621cc4] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20 active:scale-95"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
            <span>Initialize New Project</span>
          </button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => (
          <div key={p.id} className="group relative bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden transition-all hover:border-[#7628E5]/30">
            {/* Stacked Images Preview */}
            <div className="h-48 relative bg-black overflow-hidden p-6 flex justify-center items-center">
              <div className="relative w-full h-full">
                {p.images?.slice(0, 3).map((img, i) => (
                  <div 
                    key={i} 
                    className={`absolute w-4/5 h-4/5 rounded-xl border-4 border-[#0a0a0a] transition-all group-hover:scale-105 shadow-2xl overflow-hidden`} 
                    style={{ 
                      top: `${10 + (i * 5)}%`, 
                      left: `${10 + (i * 10)}%`, 
                      zIndex: 10 - i,
                      opacity: 1 - (i * 0.3)
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
                  {p.logo ? <Image src={p.logo} fill className="object-contain p-2" alt="" /> : <LayoutGrid size={16} className="opacity-20" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight line-clamp-1">{p.title}</h3>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">{p.category || "Case Study"}</span>
                </div>
              </div>
              
              <p className="text-white/40 text-xs line-clamp-2 mb-6 h-8">{p.shortDescription}</p>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(p)} 
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-[#7628E5] text-white py-2 rounded-xl text-xs font-bold transition-all group/btn"
                >
                  <Edit2 size={14} className="group-hover/btn:scale-110" /> EDIT
                </button>
                <button 
                  onClick={() => p.id && remove("projects", p.id).then(fetchProjects)} 
                  className="w-10 flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-500 rounded-xl transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      </div>
  );
}
