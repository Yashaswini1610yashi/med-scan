"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceRecorderProps {
    onAudioCaptured: (data: { medicines: any[] }) => void;
    isIconOnly?: boolean;
}

export default function VoiceRecorder({ onAudioCaptured, isIconOnly }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
                await sendAudioToAPI(audioBlob);

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            console.error("Failed to start recording:", err);
            setError("Microphone access denied or not available.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioToAPI = async (blob: Blob) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        try {
            const response = await fetch("/api/process-prescription", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                let errorMsg = "Failed to process voice note";
                try {
                    const errData = await response.json();
                    errorMsg = errData.details || errData.error || errorMsg;
                } catch (e) {
                    errorMsg = "Server encountered a critical error during processing.";
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            if (data.medicines) {
                onAudioCaptured(data);
            }
        } catch (err: any) {
            setError(err.message || "Could not understand audio. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (isIconOnly) {
        return (
            <div className="relative">
                <AnimatePresence>
                    {isRecording && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0.2 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 bg-red-500 rounded-xl"
                        />
                    )}
                </AnimatePresence>
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={loading}
                    className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isRecording
                        ? "bg-red-500 hover:bg-red-600 shadow-md shadow-red-100"
                        : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 text-white"
                        } disabled:opacity-50`}
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isRecording ? (
                        <Square className="w-4 h-4 fill-current text-white" />
                    ) : (
                        <Mic className="w-5 h-5 text-white" />
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <AnimatePresence>
                    {isRecording && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0.2 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 bg-red-500 rounded-full"
                        />
                    )}
                </AnimatePresence>

                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={loading}
                    className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording
                        ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200"
                        : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                        } text-white disabled:opacity-50`}
                >
                    {loading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : isRecording ? (
                        <Square className="w-8 h-8 fill-current" />
                    ) : (
                        <Mic className="w-8 h-8" />
                    )}
                </button>
            </div>

            <div className="text-center space-y-1">
                <p className={`text-sm font-bold uppercase tracking-widest ${isRecording ? "text-red-500 animate-pulse" : "text-zinc-400"
                    }`}>
                    {isRecording ? "Listening..." : loading ? "Processing..." : "Tap to Speak"}
                </p>
                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-500 font-medium max-w-[200px]"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {isRecording && (
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [4, 16, 4] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                            className="w-1 bg-red-400 rounded-full"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
