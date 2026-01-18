"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { seedLegacyData } from "@/lib/seed";
import { motion } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  Layers, 
  ArrowUpRight, 
  Sparkles, 
  Database,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [counts, setCounts] = useState({ experiences: 0, projects: 0 });
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<boolean | null>(null);

  const fetchCounts = useCallback(async () => {
    try {
      const [expSnap, projSnap] = await Promise.all([
        getDocs(collection(db, "experiences")),
        getDocs(collection(db, "projects"))
      ]);
      setCounts({
        experiences: expSnap.size,
        projects: projSnap.size
      });
    } catch (err) {
      console.error("Dashboard count fetch failed:", err);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedSuccess(null);
    try {
      const result = await seedLegacyData();
      setSeedSuccess(result);
      if (result) await fetchCounts();
    } catch (err) {
      console.error("Seeding failed:", err);
      setSeedSuccess(false);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="p-6 md:p-12 flex flex-col gap-8 md:gap-12">
      <header className="flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            {t('admin.welcome')}, <span className="text-[#7628E5]">{user?.email?.split('@')[0].toUpperCase() || "OWNER"}</span>
          </h1>
          <p className="text-white/30 font-bold tracking-[0.2em] text-[10px] md:text-[11px] uppercase">{t('admin.portfolioEngine')}</p>
        </motion.div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSeed} 
          disabled={isSeeding}
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
            seedSuccess === true 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
              : seedSuccess === false 
                ? "bg-rose-500/10 border-rose-500/20 text-rose-500" 
                : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
          }`}
        >
          {isSeeding ? (
            <Sparkles className="animate-spin" size={16} />
          ) : seedSuccess === true ? (
            <CheckCircle2 size={16} />
          ) : seedSuccess === false ? (
            <AlertCircle size={16} />
          ) : (
            <Database size={16} />
          )}
          {isSeeding ? t('admin.seeding') : seedSuccess === true ? t('admin.seeded') : seedSuccess === false ? t('admin.seedFailed') : t('admin.seedLegacy')}
        </motion.button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[32px] flex items-center gap-6 relative overflow-hidden group hover:border-purple-500/50 hover:bg-white/[0.05] transition-all shadow-2xl"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            <Briefcase size={28} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">{t('admin.experienceCount')}</h3>
            <p className="text-4xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">{counts.experiences}</p>
          </div>
          <ArrowUpRight className="absolute top-6 right-6 text-white/10 group-hover:text-purple-400/50 transition-colors" size={20} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[32px] flex items-center gap-6 relative overflow-hidden group hover:border-blue-500/50 hover:bg-white/[0.05] transition-all shadow-2xl"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <Layers size={28} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">{t('admin.showcases')}</h3>
            <p className="text-4xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">{counts.projects}</p>
          </div>
          <ArrowUpRight className="absolute top-6 right-6 text-white/10 group-hover:text-blue-400/50 transition-colors" size={20} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[32px] flex items-center gap-6 relative overflow-hidden group hover:border-emerald-500/50 hover:bg-white/[0.05] transition-all shadow-2xl sm:col-span-2 lg:col-span-1"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors"></div>
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Users size={28} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">{t('admin.identity')}</h3>
            <p className="text-3xl font-bold uppercase tracking-tight bg-gradient-to-br from-emerald-400 to-emerald-600 bg-clip-text text-transparent">{t('admin.active')}</p>
          </div>
          <ArrowUpRight className="absolute top-6 right-6 text-white/10 group-hover:text-emerald-400/50 transition-colors" size={20} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <section className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
          <div>
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-1">{t('admin.quickProtocols')}</h3>
            <p className="text-sm text-white/60">{t('admin.directAccess')}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Projects", icon: <Layers size={24} />, href: "/admin/projects", color: "hover:border-purple-500/50 hover:text-purple-400" },
              { label: "Experience", icon: <Briefcase size={24} />, href: "/admin/experience", color: "hover:border-blue-500/50 hover:text-blue-400" },
              { label: "Identity", icon: <Users size={24} />, href: "/admin/profile", color: "hover:border-emerald-500/50 hover:text-emerald-400" }
            ].map((action) => (
              <button 
                key={action.label}
                onClick={() => router.push(action.href)}
                className={`flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10 transition-all group active:scale-95 shadow-lg ${action.color}`}
              >
                <div className="text-white/20 group-hover:text-inherit transition-colors">{action.icon}</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Status Section */}
        <section className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
          <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-6">{t('admin.systemHealth')}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <Database size={18} className="text-purple-400" />
                <span className="text-sm font-bold text-white/90">{t('admin.firestoreHub')}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{t('admin.stable')}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <Layers size={18} className="text-purple-400" />
                <span className="text-sm font-bold text-white/90">{t('admin.cloudStorage')}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{t('admin.ready')}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 shadow-sm">
              <div className="flex justify-between items-center text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">
                <span>{t('admin.infraLoad')}</span>
                <span className="text-emerald-500">{t('admin.optimum')}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[92%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
