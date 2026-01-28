"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  User,
  MessageSquare,
  Type,
} from "lucide-react";
import { create } from "@/lib/firestore";
import { useTranslation } from "react-i18next";

export default function ContactForm() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await create("contacts", {
        ...formData,
        status: "new",
      });
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error: any) {
      console.error("Contact Form Error:", error);
      setStatus("error");
      setErrorMessage(
        error.message || "Something went wrong. Please try again.",
      );
    }
  };

  const inputClasses = `
    w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none 
    focus:border-[#7628E5] focus:ring-1 focus:ring-[#7628E5] transition-all font-medium text-sm
    ${isRtl ? "text-right" : "text-left"}
  `;

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[#7628E5] blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xs font-black uppercase tracking-[0.2em] text-[#7628E5] mb-4 block"
          >
            {t("contact.getInTouch", "Get In Touch")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            {t("contact.title", "Let's Build Something Great")}
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0A] border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="py-12 flex flex-col items-center text-center gap-6"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {t("contact.successTitle", "Message Sent!")}
                  </h3>
                  <p className="text-white/50 max-w-sm">
                    {t(
                      "contact.successMsg",
                      "Thank you for reaching out. I'll get back to you as soon as possible.",
                    )}
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-[#7628E5] font-bold text-sm uppercase tracking-widest hover:underline"
                  >
                    {t("contact.sendAnother", "Send Another Message")}
                  </button>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                        <User size={12} /> {t("contact.name", "Your Name")}
                      </label>
                      <input
                        type="text"
                        required
                        className={inputClasses}
                        placeholder={t("contact.namePlaceholder", "John Doe")}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                        <Mail size={12} /> {t("contact.email", "Your Email")}
                      </label>
                      <input
                        type="email"
                        required
                        className={inputClasses}
                        placeholder={t(
                          "contact.emailPlaceholder",
                          "john@example.com",
                        )}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                      <Type size={12} /> {t("contact.subject", "Subject")}
                    </label>
                    <input
                      type="text"
                      required
                      className={inputClasses}
                      placeholder={t(
                        "contact.subjectPlaceholder",
                        "Project Inquiry",
                      )}
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-4 flex items-center gap-2">
                      <MessageSquare size={12} />{" "}
                      {t("contact.message", "Your Message")}
                    </label>
                    <textarea
                      required
                      rows={5}
                      className={`${inputClasses} resize-none`}
                      placeholder={t(
                        "contact.messagePlaceholder",
                        "Briefly describe what you're looking for...",
                      )}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-[#7628E5] hover:bg-[#621cc4] text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          {t("contact.sending", "SENDING...")}
                        </>
                      ) : (
                        <>
                          <Send
                            size={18}
                            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                          />
                          {t("contact.send", "SEND MESSAGE")}
                        </>
                      )}
                    </button>
                  </div>

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm"
                    >
                      <AlertCircle size={18} />
                      {errorMessage}
                    </motion.div>
                  )}
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
