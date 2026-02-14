"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Paperclip, Mic, FileText, Image as ImageIcon, X, Trash2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceRecorder from "./VoiceRecorder";
import PrescriptionScanner from "./PrescriptionScanner";

interface Message {
    role: "bot" | "user";
    content: string;
    type?: "text" | "report";
    data?: any;
}

export default function ChatBot({ onResultsFound }: { onResultsFound?: (data: any) => void }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: "Welcome to MediBot. I can help you with medication information, symptom analysis, and prescription scanning. How can I assist you today?" }
    ]);
    const [loading, setLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || loading) return;

        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: messageText }]);
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageText, history: messages.filter(m => m.type !== "report") }),
            });

            if (!response.ok) throw new Error("Failed to chat");

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
        } catch (err) {
            setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleScanData = (data: any) => {
        setMessages((prev) => [
            ...prev,
            { role: "user", content: "I've uploaded a prescription for analysis." },
            {
                role: "bot",
                content: "I've analyzed the prescription. Here's a summary of the medications found:",
                type: "report",
                data: data
            }
        ]);
        setShowUpload(false);
        if (onResultsFound) onResultsFound(data);
    };

    return (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                        <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-zinc-900 tracking-tight">MediBot</h2>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">AI Assistant Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FAFBFF]/30 scroll-smooth"
            >
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-sm ${msg.role === "user" ? "bg-zinc-900 text-white" : "bg-blue-600 text-white"
                            }`}>
                            {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div className={`flex flex-col space-y-2 max-w-[75%] ${msg.role === "user" ? "items-end" : ""}`}>
                            <div className={`p-5 rounded-3xl shadow-sm border ${msg.role === "user"
                                    ? "bg-zinc-900 text-white border-zinc-800 rounded-tr-none"
                                    : "bg-white text-zinc-700 border-zinc-100 rounded-tl-none font-medium leading-relaxed"
                                }`}>
                                {msg.content}
                            </div>

                            {msg.type === "report" && (
                                <div className="w-full mt-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 space-y-4">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <FileText className="w-5 h-5" />
                                        <span className="font-bold text-xs uppercase tracking-widest">Prescription Summary</span>
                                    </div>
                                    <div className="space-y-2">
                                        {msg.data.medicines.map((m: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-blue-50 shadow-sm">
                                                <span className="font-bold text-zinc-900 text-sm">{m.name}</span>
                                                <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter ring-1 ring-blue-100">
                                                    {m.dosage}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest px-1">
                                {msg.role === "bot" ? "MediBot" : "You"} • Just now
                            </span>
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-sm">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-zinc-100 shadow-sm flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                            <span className="text-xs text-zinc-400 font-black uppercase tracking-widest">MediBot is analyzing...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div className="p-8 bg-white border-t border-zinc-100">
                <AnimatePresence>
                    {showUpload && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mb-6 p-1 bg-zinc-50 rounded-[2.5rem] border border-zinc-100 shadow-inner overflow-hidden"
                        >
                            <div className="relative">
                                <button
                                    onClick={() => setShowUpload(false)}
                                    className="absolute top-4 right-4 z-20 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-zinc-100 text-zinc-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="pointer-events-auto">
                                    <PrescriptionScanner onDataExtracted={handleScanData} compact={true} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-4">
                    <div className="flex-1 relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                            <button
                                onClick={() => setShowUpload(!showUpload)}
                                className={`p-2 rounded-xl transition-all ${showUpload ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'}`}
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask about medications, side effects, or upload a prescription..."
                            className="w-full h-16 pl-16 pr-32 bg-zinc-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-blue-600/5 placeholder:text-zinc-400 group-hover:bg-zinc-100/80 transition-all"
                        />
                        <div className="absolute right-3 top-3 bottom-3 flex items-center gap-2">
                            <VoiceRecorder onAudioCaptured={handleScanData} isIconOnly={true} />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || loading}
                                className="h-full px-6 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 active:scale-95"
                            >
                                <Send className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-widest hidden md:block">Send</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-6 ml-2">
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mr-2">Quick Commands:</p>
                    {["Atorvastatin Info", "Side Effects", "Missed Dose"].map((txt) => (
                        <button
                            key={txt}
                            onClick={() => handleSend(txt)}
                            className="px-3 py-1.5 bg-white border border-zinc-100 rounded-full text-[10px] font-bold text-zinc-500 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
                        >
                            {txt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
