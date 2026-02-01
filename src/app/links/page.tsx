"use client";

import { useState, useEffect } from "react";
import { getAll } from "@/lib/firestore";
import { Profile } from "@/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  Github,
  Linkedin,
  Instagram,
  Globe,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  UserCircle,
} from "lucide-react";

// Social links configuration - matches the main portfolio
const SOCIAL_LINKS = [
  {
    name: "WhatsApp",
    urlPrefix: "https://wa.me/",
    icon: <MessageCircle size={22} />,
    color: "#25D366",
    featured: true,
  },
  {
    name: "GitHub",
    url: "https://github.com/Mohammad-soqar",
    icon: <Github size={22} />,
    color: "#6e5494",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/mohammad-soqar-ahmad/",
    icon: <Linkedin size={22} />,
    color: "#0077b5",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/mohammad_soqar/",
    icon: <Instagram size={22} />,
    color: "#e4405f",
  },
  {
    name: "Portfolio",
    url: "/",
    icon: <Globe size={22} />,
    color: "#7628E5",
    internal: true,
  },
];

export default function LinksPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profData = await getAll<Profile>("profile");
        if (profData.length > 0) setProfile(profData[0]);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white gap-6">
        <div className="w-10 h-10 border-[3px] border-[rgba(118,40,229,0.2)] border-t-[#7628E5] rounded-full animate-spin"></div>
        <p className="text-white/60">{t("links.loading")}</p>
      </div>
    );
  }

  // Get WhatsApp link from phone number
  const whatsappLink = profile?.phone
    ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`
    : "#";

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[#050505] bg-[url('/images/Background.png')] bg-cover bg-fixed text-white font-[family-name:var(--font-family)] antialiased"
    >
      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(118,40,229,0.15),transparent_70%)] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto px-6 py-12 flex flex-col items-center min-h-screen">
        {/* Language Switcher */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-4 end-4"
        >
          <LanguageSwitcher />
        </motion.div>

        {/* Profile Photo with Faded Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-36 h-44 mb-6"
        >
          <div className="absolute inset-0 overflow-hidden rounded-t-full">
            {profile?.profilePic ? (
              <Image
                src={profile.profilePic}
                alt={profile.name || "Profile"}
                fill
                className="object-cover object-top"
                priority
              />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <UserCircle size={80} className="opacity-20" />
              </div>
            )}
            {/* Fade overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-[radial-gradient(circle,rgba(118,40,229,0.3),transparent_70%)] blur-2xl -z-10" />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-3xl font-extrabold text-center mb-2"
        >
          {profile?.name || "Mohammad Soqar Ahmad"}
        </motion.h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm text-white/60 text-center mb-6 flex items-center gap-2"
        >
          <span>🚀</span>
          <span>
            {profile?.role ||
              "Lead Software Architect | SaaS | AI | Mobile Ecosystems"}
          </span>
          <span>🛠️</span>
        </motion.p>

        {/* Quick Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-4 mb-10"
        >
          <a
            href="https://www.instagram.com/mohammad_soqar/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-[#e4405f] hover:border-[#e4405f]/50 hover:bg-[#e4405f]/10 transition-all"
          >
            <Instagram size={20} />
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-[#25D366] hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-all"
          >
            <MessageCircle size={20} />
          </a>
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="p-3 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-[#7628E5] hover:border-[#7628E5]/50 hover:bg-[#7628E5]/10 transition-all"
            >
              <Mail size={20} />
            </a>
          )}
          <a
            href="/"
            className="p-3 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-[#7628E5] hover:border-[#7628E5]/50 hover:bg-[#7628E5]/10 transition-all"
          >
            <Globe size={20} />
          </a>
        </motion.div>

        {/* Featured WhatsApp Card */}
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full bg-white/[0.03] backdrop-blur-xl rounded-3xl p-5 mb-6 flex flex-col items-center justify-center border border-white/10 hover:border-[#25D366]/50 hover:bg-[#25D366]/5 transition-all group"
        >
          {/* WhatsApp Logo */}
          <div className="w-10 h-10 mb-3 flex items-center justify-center">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <path
                fill="#25D366"
                d="M24 4C12.954 4 4 12.954 4 24c0 3.562.938 6.897 2.576 9.797L4 44l10.5-2.756A19.9 19.9 0 0024 44c11.046 0 20-8.954 20-20S35.046 4 24 4z"
              />
              <path
                fill="#fff"
                d="M34.6 28.8c-.6-.3-3.5-1.7-4-1.9-.5-.2-.9-.3-1.3.3-.4.6-1.5 1.9-1.8 2.3-.3.4-.7.4-1.3.1-.6-.3-2.5-.9-4.8-2.9-1.8-1.6-3-3.5-3.3-4.1-.3-.6 0-.9.3-1.2.3-.3.6-.7.9-1 .3-.3.4-.6.6-1 .2-.4.1-.7 0-1-.1-.3-1.3-3.1-1.8-4.2-.5-1.1-1-1-1.3-1h-1.1c-.4 0-1 .1-1.5.7-.5.6-2 2-2 4.8s2 5.6 2.3 6c.3.4 4 6.1 9.7 8.6 1.4.6 2.4 1 3.2 1.3 1.4.4 2.6.4 3.6.2 1.1-.2 3.5-1.4 4-2.8.5-1.4.5-2.5.3-2.8-.1-.2-.5-.4-1.1-.6z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-[#25D366] group-hover:scale-105 transition-transform">
            {t("links.whatsapp")}
          </span>
          <span className="text-xs text-white/40 mt-1">
            {t("links.chatWithMe")}
          </span>
        </motion.a>

        {/* Link Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full space-y-3"
        >
          {SOCIAL_LINKS.filter((link) => !link.featured).map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url || "#"}
              target={link.internal ? "_self" : "_blank"}
              rel="noopener noreferrer"
              variants={itemVariants}
              className="group w-full flex items-center gap-4 bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-2xl py-4 px-6 transition-all hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5"
              style={
                {
                  "--link-color": link.color,
                } as React.CSSProperties
              }
            >
              <span
                className="p-2 rounded-xl bg-white/5 transition-all group-hover:bg-[var(--link-color)]/10"
                style={{ color: link.color }}
              >
                {link.icon}
              </span>
              <span className="flex-1 font-semibold text-white/80 group-hover:text-white transition-colors">
                {t(`links.${link.name.toLowerCase()}`)}
              </span>
              <ExternalLink
                size={16}
                className="opacity-0 group-hover:opacity-40 transition-all"
              />
            </motion.a>
          ))}

          {/* Email Link */}
          {profile?.email && (
            <motion.a
              href={`mailto:${profile.email}`}
              variants={itemVariants}
              className="group w-full flex items-center gap-4 bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-2xl py-4 px-6 transition-all hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5"
            >
              <span className="p-2 rounded-xl bg-white/5 text-[#7628E5] transition-all group-hover:bg-[#7628E5]/10">
                <Mail size={22} />
              </span>
              <span className="flex-1 font-semibold text-white/80 group-hover:text-white transition-colors">
                {t("links.emailMe")}
              </span>
              <ExternalLink
                size={16}
                className="opacity-0 group-hover:opacity-40 transition-all"
              />
            </motion.a>
          )}

          {/* Phone Link */}
          {profile?.phone && (
            <motion.a
              href={`tel:${profile.phone}`}
              variants={itemVariants}
              className="group w-full flex items-center gap-4 bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-2xl py-4 px-6 transition-all hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5"
            >
              <span className="p-2 rounded-xl bg-white/5 text-[#7628E5] transition-all group-hover:bg-[#7628E5]/10">
                <Phone size={22} />
              </span>
              <span className="flex-1 font-semibold text-white/80 group-hover:text-white transition-colors">
                {t("links.callMe")}
              </span>
              <ExternalLink
                size={16}
                className="opacity-0 group-hover:opacity-40 transition-all"
              />
            </motion.a>
          )}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-16 text-xs text-white/30 text-center"
        >
          © {new Date().getFullYear()} {profile?.name || "Mohammad Soqar Ahmad"}
          . {t("links.allRightsReserved")}
        </motion.p>
      </div>
    </main>
  );
}
