import { Pill, AlertCircle, Info, Clock, AlertTriangle, UserRound, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface Medicine {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    explanation: string;
    purpose: string;
    sideEffects: string;
    restrictions: string;
    ageDosage: string;
    schedule: string[];
}

interface MedicineDetailsProps {
    medicines: Medicine[];
}

export default function MedicineDetails({ medicines }: MedicineDetailsProps) {
    return (
        <div className="grid grid-cols-1 gap-8 p-6">
            {medicines.map((med, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all relative overflow-hidden group"
                >
                    {/* Decorative Background Icon */}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <Pill className="w-48 h-48 -rotate-12" />
                    </div>

                    <div className="space-y-8 relative z-10">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{med.name}</h3>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-100">
                                        Verified
                                    </span>
                                </div>
                                <p className="text-zinc-500 text-lg font-medium">{med.explanation}</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    <span className="text-sm font-semibold text-zinc-600">{med.frequency}</span>
                                </div>
                                <div className="px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-zinc-400" />
                                    <span className="text-sm font-semibold text-zinc-600">{med.duration}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Detailed Purpose */}
                            <div className="bg-zinc-50/50 rounded-3xl p-6 border border-zinc-100 space-y-3">
                                <div className="flex items-center gap-2 text-zinc-900 font-bold">
                                    <BookOpen className="w-5 h-5 text-blue-500" />
                                    <h4>Medical Purpose</h4>
                                </div>
                                <p className="text-sm text-zinc-600 leading-relaxed">{med.purpose}</p>
                            </div>

                            {/* Side Effects */}
                            <div className="bg-orange-50/30 rounded-3xl p-6 border border-orange-100/50 space-y-3">
                                <div className="flex items-center gap-2 text-orange-900 font-bold">
                                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                                    <h4>Side Effects</h4>
                                </div>
                                <p className="text-sm text-orange-800/80 leading-relaxed">{med.sideEffects}</p>
                            </div>

                            {/* Safety Restrictions */}
                            <div className="bg-red-50/30 rounded-3xl p-6 border border-red-100/50 space-y-3 text-red-900">
                                <div className="flex items-center gap-2 font-bold">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <h4>Restricted Patients</h4>
                                </div>
                                <p className="text-sm text-red-800/80 leading-relaxed">
                                    {med.restrictions}
                                </p>
                            </div>
                        </div>

                        {/* Age-Based Dosage Footer */}
                        <div className="pt-6 border-t border-zinc-100 flex flex-col md:flex-row md:items-start gap-4">
                            <div className="flex items-center gap-2 text-zinc-900 font-bold min-w-fit mt-3">
                                <UserRound className="w-5 h-5 text-zinc-400" />
                                <span className="text-sm uppercase tracking-widest">Recommended Dosage</span>
                            </div>
                            <div className="bg-blue-600/5 text-blue-700 px-6 py-4 rounded-2xl border border-blue-100/50 text-sm font-medium w-full">
                                {typeof med.ageDosage === 'object' && med.ageDosage !== null ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {Object.entries(med.ageDosage).map(([age, dose]) => (
                                            <div key={age} className="space-y-1">
                                                <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">{age}</span>
                                                <p className="text-blue-900">{String(dose)}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="italic">{String(med.ageDosage)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
