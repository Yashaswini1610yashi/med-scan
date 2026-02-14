"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { User, LogOut, MessageSquare, History, Award, Settings } from "lucide-react";

export default function DashboardSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: any) => void }) {
    const { data: session } = useSession();

    const navItems = [
        { id: "scan", label: "Medical Chat", icon: MessageSquare },
        { id: "history", label: "History", icon: History },
        { id: "profile", label: "Patient Profile", icon: User },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <aside className="w-72 bg-white border-r border-zinc-100 flex flex-col h-full sticky top-0 overflow-hidden">
            {/* User Section */}
            <div className="p-8 border-b border-zinc-50">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative group">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border-4 border-white shadow-sm transition-transform group-hover:scale-105">
                            <User className="w-10 h-10" />
                        </div>
                        <div className="absolute -right-1 bottom-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                    </div>
                    <div>
                        <h3 className="font-bold text-zinc-900">{session?.user?.name || "Patient"}</h3>
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                            <Award className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                                Premium
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-4 mb-4">Main Menu</p>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeTab === item.id
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Footer Actions */}
            <div className="p-6 mt-auto">
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all transition-colors group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
