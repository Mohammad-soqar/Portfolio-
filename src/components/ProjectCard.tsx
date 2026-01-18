"use client";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types";
import { useTranslation } from "react-i18next";

interface ProjectCardProps {
  project: Project;
  idx?: number;
  isPreview?: boolean;
}

export default function ProjectCard({ project, idx = 0, isPreview = false }: ProjectCardProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const content = (
    <motion.div 
      className="project-card group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden transition-all hover:border-purple-500/40 hover:bg-white/[0.04] shadow-2xl"
      initial={isPreview ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={isPreview ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Stacked Images Logic */}
      <div className="h-64 relative bg-black overflow-hidden p-8 flex justify-center items-center">
        <div className="relative w-full h-full">
          {project.images?.slice(0, 3).map((img, i) => (
            <div 
              key={i} 
              className="absolute w-4/5 h-4/5 rounded-2xl border-4 border-black transition-all group-hover:scale-105 shadow-2xl overflow-hidden shimmer" 
              style={{ 
                top: `${10 + (i * 5)}%`, 
                [isRtl ? 'right' : 'left']: `${10 + (i * 10)}%`, 
                zIndex: 10 - i,
                opacity: 1 - (i * 0.25)
              }}
            >
              <Image 
                src={img} 
                fill 
                className="object-cover"
                alt="" 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
          {!project.images || project.images.length === 0 ? (
             <div className="w-full h-full rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 border-dashed">
                <Plus size={32} className="opacity-10" />
             </div>
          ) : project.images.length > 3 && (
            <div className={`absolute bottom-4 ${isRtl ? 'left-4' : 'right-4'} bg-purple-500 px-3 py-1.5 rounded-xl text-[10px] font-black z-20 shadow-lg`}>
              +{project.images.length - 3} SCREENS
            </div>
          )}
        </div>
      </div>

      <div className="p-8 relative bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 relative overflow-hidden">
            {project.logo ? (
              <Image 
                src={project.logo} 
                fill 
                className="object-contain p-2" 
                alt="" 
              />
            ) : <Plus size={16} className="text-white/20" />}
          </div>
          <div>
            <h3 className="font-bold text-xl tracking-tight line-clamp-1">{project.title || "Untitled Project"}</h3>
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">{project.techStack?.[0] || "Architecture"}</span>
          </div>
        </div>
        <p className="text-white/50 text-sm line-clamp-2 leading-relaxed h-10">{project.shortDescription || "Elevating digital experiences through advanced design and engineering."}</p>
      </div>
    </motion.div>
  );

  if (isPreview) {
    return <div className="preview-card-wrap">{content}</div>;
  }

  return (
    <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
      {content}
    </Link>
  );
}
