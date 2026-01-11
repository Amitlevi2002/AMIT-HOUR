import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, FileCode, CheckCircle, Activity, Box } from 'lucide-react';
import { CanvasPreview } from '../components/CanvasPreview';
import type { Design } from '../types';
import { cn } from '../utils/cn';
import { API_URL } from '../config';

export const DesignDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [design, setDesign] = useState<Design | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/designs/${id}`)
            .then(res => res.json())
            .then(data => {
                setDesign(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch design', err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!design) return <div className="p-8 text-white">Design not found</div>;

    const StatCard = ({ label, value, icon: Icon, colorClass }: any) => (
        <div className="glass p-4 rounded-xl flex items-center justify-between">
            <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
            <div className={cn("p-2 rounded-lg opacity-80", colorClass)}>
                <Icon size={20} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col p-6 lg:p-12 relative overflow-hidden">
            <div className="animated-bg" />

            <div className="max-w-7xl mx-auto w-full z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Panel: Stats & Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-8 rounded-3xl"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                    <FileCode size={32} className="text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold truncate max-w-[200px]" title={design.filename}>{design.filename}</h1>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border",
                                            design.status === 'OK'
                                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                        )}>
                                            {design.status === 'OK' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                                            {design.status}
                                        </span>
                                        <span className="text-xs text-gray-500">{new Date(design.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <StatCard
                                    label="Elements"
                                    value={design.itemsCount}
                                    icon={Box}
                                    colorClass="bg-purple-500/20 text-purple-400"
                                />
                                <StatCard
                                    label="Coverage"
                                    value={`${(design.coverageRatio * 100).toFixed(0)}%`}
                                    icon={Activity}
                                    colorClass="bg-blue-500/20 text-blue-400"
                                />
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Dimensions</span>
                                    <span className="font-mono text-white">{design.svgWidth} × {design.svgHeight}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">ID</span>
                                    <span className="font-mono text-gray-600 text-xs">{design._id}</span>
                                </div>
                            </div>
                        </motion.div>

                        {design.issues.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass-panel p-6 rounded-3xl border-red-500/20 bg-red-500/5"
                            >
                                <h3 className="flex items-center gap-2 font-bold text-red-400 mb-3">
                                    <AlertTriangle size={18} /> Issues Detected
                                </h3>
                                <ul className="space-y-2">
                                    {design.issues.map((issue, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-red-200/80 bg-red-500/10 p-2 rounded-lg">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                            {issue}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Panel: Canvas */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-8"
                    >
                        <div className="glass-panel p-1 rounded-[32px]">
                            <div className="bg-[#050505] rounded-[28px] p-8 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                                <div className="relative z-10 w-full flex justify-center">
                                    <CanvasPreview
                                        svgWidth={design.svgWidth}
                                        svgHeight={design.svgHeight}
                                        items={design.items}
                                    />
                                </div>

                                <p className="mt-8 text-center text-sm text-gray-500 max-w-md">
                                    Interactive Preview. Hover elements to inspect coordinate data.
                                    <br />
                                    <span className="text-xs opacity-50">Grid represents canvas space. Dashed line represents SVG bounds.</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
