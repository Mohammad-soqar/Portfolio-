"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  LogOut,
  UserCircle,
  Settings,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Menu,
  X,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { getAll } from "@/lib/firestore";
import { Profile } from "@/types";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dbStatus, setDbStatus] = useState<"checking" | "online" | "error">(
    "checking",
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("admin-mode");
    return () => document.body.classList.remove("admin-mode");
  }, []);

  useEffect(() => {
    if (user) {
      // Check DB connection
      getDocs(collection(db, "profile"))
        .then((data) => {
          setDbStatus("online");
          if (data.docs.length > 0) {
            setProfile({
              id: data.docs[0].id,
              ...data.docs[0].data(),
            } as Profile);
          }
        })
        .catch((err) => {
          console.error("DB Connection Error:", err);
          setDbStatus("error");
        });
    }
  }, [user]);

  const navItems = [
    {
      name: t("common.overview"),
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: t("common.myProfile"),
      href: "/admin/profile",
      icon: <UserCircle size={20} />,
    },
    {
      name: t("common.experience"),
      href: "/admin/experience",
      icon: <Briefcase size={20} />,
    },
    {
      name: t("common.projects"),
      href: "/admin/projects",
      icon: <FolderKanban size={20} />,
    },
    {
      name: t("common.inquiries", "Inquiries"),
      href: "/admin/contacts",
      icon: <Mail size={20} />,
    },
  ];

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return <>{children}</>;

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-black text-white font-sans selection:bg-purple-500/30 overflow-hidden">
        <style jsx global>{`
          body.admin-mode {
            background-image: none !important;
            background-color: black !important;
          }
        `}</style>

        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`
          fixed lg:static inset-y-0 left-0 w-72 bg-white/[0.01] backdrop-blur-[20px] border-r border-white/10 flex flex-col py-8 shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-[70] transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <button
            className="absolute top-6 right-6 p-2 text-white/40 hover:text-white lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
          <div className="px-8 flex flex-col gap-8 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[#7628E5] rounded-full shadow-[0_0_15px_rgba(118,40,229,0.5)]"></div>
              <h3 className="text-lg font-bold tracking-[0.2em] text-white/90">
                {t("common.admin")}
              </h3>
            </div>

            {profile && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-md group hover:bg-white/[0.08] transition-all cursor-default shadow-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/50 bg-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  {profile.profilePic ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={profile.profilePic}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <UserCircle size={24} className="opacity-20" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate text-white/90">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-bold truncate">
                    {profile.role}
                  </p>
                </div>
              </div>
            )}

            <div
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold bg-white/[0.03] border border-white/[0.02] ${dbStatus === "online" ? "text-emerald-400" : dbStatus === "error" ? "text-rose-400 bg-rose-500/5" : "text-white/20"}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${dbStatus === "online" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-white/20"}`}
              ></div>
              <span className="uppercase tracking-[0.1em]">
                {dbStatus === "online"
                  ? t("common.systemOnline")
                  : dbStatus === "checking"
                    ? t("common.syncing")
                    : t("common.linkError")}
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-purple-400 hover:bg-purple-500/10 transition-all font-bold text-sm group"
            >
              <ExternalLink
                size={18}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
              <span className="tracking-tight">
                {t("common.viewProduction")}
              </span>
            </Link>

            <div className="h-[1px] bg-white/[0.05] my-6 mx-5"></div>

            <div className="px-5 flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                {t("admin.navigation")}
              </p>
              <LanguageSwitcher />
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${
                  pathname === item.href
                    ? "bg-purple-500/20 text-white border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05] border-transparent"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div
                  className={`${pathname === item.href ? "text-purple-400" : "text-white/20 group-hover:text-white/40"}`}
                >
                  {item.icon}
                </div>
                <span className="tracking-tight">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="px-4 mt-auto">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-xl border border-rose-500/10 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5 transition-all font-bold text-xs uppercase tracking-[0.1em]"
            >
              <LogOut size={18} />
              <span>{t("common.terminateSession")}</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-black lg:border-l border-white/10 relative">
          {/* Mobile Toggle */}
          <div className="lg:hidden sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[#7628E5] rounded-full shadow-[0_0_15px_rgba(118,40,229,0.5)]"></div>
              <h3 className="text-sm font-bold tracking-[0.2em] text-white/90">
                {t("common.admin")}
              </h3>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-white/40 hover:text-white"
            >
              <Menu size={24} />
            </button>
          </div>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
