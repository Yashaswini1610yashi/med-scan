"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import HealthResources from "@/components/HealthResources";
import ChatBot from "@/components/ChatBot";
import MedicineDetails from "@/components/MedicineDetails";
import DigitalSchedule from "@/components/DigitalSchedule";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Heart, History, User as UserIcon, ArrowRight, Pill, Activity, Settings, Search, LayoutDashboard, FileText, ShieldCheck, Volume2 } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"scan" | "history" | "profile" | "settings">("scan");
  const [data, setData] = useState<{ medicines: any[] } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({ age: "", medicalHistory: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchHistory();
    }
  }, [status, router]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const result = await res.json();
      if (result.history) setHistory(result.history);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FAFBFF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
            <Heart className="w-7 h-7 text-white animate-pulse" fill="currentColor" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Loading MediBot...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FAFBFF] font-sans selection:bg-blue-100 selection:text-blue-900">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          {activeTab === "scan" && (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full"
            >
              {/* Central Chat Column */}
              <div className="flex-1 flex flex-col h-full border-r border-zinc-100">
                <ChatBot onResultsFound={setData} />
              </div>

              {/* Right Context Column */}
              <div className="w-[450px] bg-white flex flex-col h-full hidden lg:flex">
                <div className="px-8 py-7 border-b border-zinc-100 flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  <h3 className="font-black text-xs uppercase tracking-widest text-zinc-900">Health Context</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {data ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-10 pb-10"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-black text-zinc-900 tracking-tight">Active Analysis</h4>
                        <button
                          onClick={() => setData(null)}
                          className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          Clear Result
                        </button>
                      </div>

                      <div className="space-y-8">
                        <MedicineDetails medicines={data.medicines} />
                        <div className="pt-6 border-t border-zinc-50">
                          <DigitalSchedule medicines={data.medicines} />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                      <div className="w-16 h-16 bg-zinc-50 rounded-[2rem] flex items-center justify-center text-zinc-300 border border-zinc-100">
                        <Pill className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">No Active Profile</p>
                        <p className="text-xs text-zinc-500 mt-1">Upload a prescription or consult MediBot to see details here.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-12 space-y-12 overflow-y-auto scrollbar-hide"
            >
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Prescription Vault</h2>
                  <p className="text-zinc-500 text-lg font-medium italic">A temporal record of your medical consultations.</p>
                </div>

                {history.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => { setData({ medicines: item.medicines }); setActiveTab("scan"); }}
                        className="p-8 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-xl">
                              <FileText className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-zinc-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.medicines.map((m: any, idx: number) => (
                            <span key={idx} className="px-4 py-1.5 bg-zinc-50 text-zinc-900 rounded-full text-[11px] font-black uppercase tracking-tighter ring-1 ring-zinc-100">
                              {m.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-zinc-50 flex flex-col items-center justify-center space-y-6">
                    <History className="w-16 h-16 text-zinc-100" />
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-zinc-300">Vault is Empty</p>
                      <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Start a new conversation to save records.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-12 overflow-y-auto"
            >
              <div className="max-w-2xl mx-auto space-y-12">
                <div className="text-center space-y-6 pb-6 border-b border-zinc-100">
                  <div className="w-32 h-32 bg-blue-50 rounded-[3rem] flex items-center justify-center text-blue-600 mx-auto border-4 border-white shadow-xl relative">
                    <UserIcon className="w-14 h-14" />
                    <div className="absolute -bottom-2 -right-2 bg-zinc-900 text-white p-3 rounded-2xl shadow-lg">
                      <Settings className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-zinc-900 tracking-tight">{session?.user?.name}</h2>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mt-1">{session?.user?.email}</p>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-xl shadow-blue-900/5 space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Personal Health Profile</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Patient Age</label>
                        <input
                          type="number"
                          placeholder="Set Age"
                          className="w-full h-14 px-6 bg-zinc-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 transition-all"
                          value={profileData.age}
                          onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Patient Gender</label>
                        <select className="w-full h-14 px-6 bg-zinc-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Allergies & Medical History</label>
                    <textarea
                      placeholder="e.g., Type 2 Diabetes, Penicillin Allergy, High Blood Pressure..."
                      rows={4}
                      className="w-full p-6 bg-zinc-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                      value={profileData.medicalHistory}
                      onChange={(e) => setProfileData({ ...profileData, medicalHistory: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={async () => {
                      await fetch("/api/user/profile", {
                        method: "PUT",
                        body: JSON.stringify(profileData),
                        headers: { "Content-Type": "application/json" }
                      });
                      alert("Health Profile Synced with MediBot AI!");
                    }}
                    className="w-full h-16 bg-blue-600 text-white rounded-[1.5rem] font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Sync Health Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-12 space-y-12 max-w-2xl mx-auto"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-zinc-900 tracking-tight">App Settings</h2>
                <p className="text-zinc-500 text-lg font-medium italic">Configure your MediBot experience.</p>
              </div>

              <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-50 rounded-2xl">
                      <ShieldCheck className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Privacy Mode</p>
                      <p className="text-xs text-zinc-400 font-medium">Auto-delete history after 30 days</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>

                <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-50 rounded-2xl">
                      <Volume2 className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Voice Assistant</p>
                      <p className="text-xs text-zinc-400 font-medium">Enable AI voice feedback</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-zinc-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>

                <div className="p-8 bg-zinc-50/50">
                  <button className="w-full py-4 bg-white border border-red-100 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all">
                    Deactivate Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <HealthResources />
    </div>
  );
}
