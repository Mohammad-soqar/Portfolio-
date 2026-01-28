"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  User,
  Calendar,
  MessageSquare,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  Reply,
  MoreVertical,
  X,
  ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContactMessage } from "@/types";

export default function InquiriesPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied">(
    "all",
  );
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContactMessage[];
      setMessages(msgs);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateStatus = async (id: string, status: ContactMessage["status"]) => {
    try {
      const docRef = doc(db, "contacts", id);
      await updateDoc(docRef, { status });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m)),
      );
      if (selectedMsg?.id === id)
        setSelectedMsg((prev) => (prev ? { ...prev, status } : null));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (
      !confirm(
        t(
          "common.confirmDelete",
          "Are you sure you want to delete this message?",
        ),
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "contacts", id));
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const filteredMessages = messages.filter(
    (m) => filter === "all" || m.status === filter,
  );

  const getStatusColor = (status: ContactMessage["status"]) => {
    switch (status) {
      case "new":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "read":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "replied":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      default:
        return "text-white/40 bg-white/5 border-white/10";
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] lg:h-screen overflow-hidden">
      {/* Sidebar List */}
      <div
        className={`
        flex-col w-full md:w-[400px] border-r border-white/10 bg-white/[0.01] flex
        ${selectedMsg ? "hidden md:flex" : "flex"}
      `}
      >
        <div className="p-6 md:p-8 border-b border-white/10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight">
              {t("common.inquiries")}
            </h1>
            <span className="bg-purple-500/20 text-purple-400 text-[10px] font-black px-2 py-1 rounded-md">
              {messages.length}
            </span>
          </div>

          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
            {["all", "new", "read", "replied"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`
                  flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all
                  ${filter === f ? "bg-white/10 text-white shadow-lg" : "text-white/30 hover:text-white/50"}
                `}
              >
                {t(`status.${f}`, f)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4 opacity-20">
              <Clock className="animate-spin" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                {t("common.syncing")}
              </p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-12 text-center opacity-20 italic text-sm">
              {t("common.noInquiries", "No inquiries found.")}
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelectedMsg(msg);
                  if (msg.status === "new") updateStatus(msg.id!, "read");
                }}
                className={`
                  w-full p-6 border-b border-white/5 text-left flex flex-col gap-3 transition-all group
                  ${selectedMsg?.id === msg.id ? "bg-purple-500/10 border-r-2 border-r-purple-500" : "hover:bg-white/[0.02]"}
                  ${isRtl ? "text-right" : "text-left"}
                `}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                      <User
                        size={14}
                        className={
                          selectedMsg?.id === msg.id
                            ? "text-purple-400"
                            : "text-white/40"
                        }
                      />
                    </div>
                    <span className="text-sm font-bold truncate">
                      {msg.name}
                    </span>
                  </div>
                  <span
                    className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider border shrink-0 ${getStatusColor(msg.status)}`}
                  >
                    {msg.status}
                  </span>
                </div>
                <h4
                  className={`text-xs font-bold truncate ${selectedMsg?.id === msg.id ? "text-white" : "text-white/60"}`}
                >
                  {msg.subject}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-white/20">
                  <Calendar size={10} />
                  <span>
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleDateString()
                      : "Just now"}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail View */}
      <div
        className={`
        flex-1 bg-black flex flex-col
        ${!selectedMsg ? "hidden md:flex" : "flex"}
      `}
      >
        {selectedMsg ? (
          <>
            {/* Toolbar */}
            <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedMsg(null)}
                className="md:hidden p-2 text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 ml-auto">
                <button
                  onClick={() => updateStatus(selectedMsg.id!, "replied")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all text-xs font-black uppercase tracking-widest"
                >
                  <Reply size={14} /> {t("common.replied", "Mark Replied")}
                </button>
                <button
                  onClick={() => deleteMessage(selectedMsg.id!)}
                  className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-20 flex flex-col gap-12 max-w-4xl mx-auto w-full custom-scrollbar">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <span
                    className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border inline-block ${getStatusColor(selectedMsg.status)}`}
                  >
                    {selectedMsg.status} inquiry
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                    {selectedMsg.subject}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white/[0.02] border border-white/10 rounded-3xl">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                      {t("contact.name")}
                    </p>
                    <p className="font-bold text-white/90">
                      {selectedMsg.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                      {t("contact.email")}
                    </p>
                    <a
                      href={`mailto:${selectedMsg.email}`}
                      className="font-bold text-purple-400 hover:underline flex items-center gap-2"
                    >
                      {selectedMsg.email} <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                      {t("contact.received")}
                    </p>
                    <p className="font-bold text-white/90">
                      {selectedMsg.createdAt
                        ? new Date(selectedMsg.createdAt).toLocaleString()
                        : "Just now"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                      Message ID
                    </p>
                    <p className="font-mono text-[10px] text-white/40">
                      {selectedMsg.id}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/20">
                    <MessageSquare size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {t("contact.message")}
                    </span>
                  </div>
                  <div
                    className={`text-lg leading-relaxed text-white/70 whitespace-pre-wrap bg-white/[0.01] p-8 md:p-12 rounded-[40px] border border-white/5 ${isRtl ? "text-right" : "text-left"}`}
                  >
                    {selectedMsg.message}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-10 gap-6">
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center">
              <Mail size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight mb-2">
                Select an Inquiry
              </h3>
              <p className="text-sm">
                Manage and respond to client messages from this interface.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
