"use client";

import { useState } from "react";
import { Upload, Camera, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PrescriptionScannerProps {
    onDataExtracted: (data: any) => void;
}

export default function PrescriptionScanner({ onDataExtracted }: PrescriptionScannerProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/process-prescription", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.details || "Failed to process prescription");
            }

            const data = await response.json();
            if (data) {
                onDataExtracted(data);
            }
        } catch (err: any) {
            setError(err.message || "We couldn't read the prescription properly. Please try a clearer photo.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Prescription Digitalizer
                </h2>
                <p className="text-zinc-500 text-lg">
                    Upload your handwritten prescription to get a digital schedule and clear explanations.
                </p>
            </div>

            <div className="relative group">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={loading}
                />

                <div className={`
          relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300
          ${loading ? 'bg-zinc-50 border-zinc-200' : 'bg-white border-blue-100 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10'}
          ${error ? 'border-red-200 bg-red-50/30' : ''}
          flex flex-col items-center justify-center text-center space-y-4
        `}>
                    {preview ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
                        >
                            <img src={preview} alt="Prescription preview" className="w-full h-full object-contain" />
                            {loading && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-4">
                                    <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
                                    <p className="font-medium animate-pulse">Our AI is reading your doctor's handwriting...</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <>
                            <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                                <Camera className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-semibold text-zinc-900">Click to upload or drag & drop</p>
                                <p className="text-zinc-500">Supports JPG, PNG, WEBP</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
