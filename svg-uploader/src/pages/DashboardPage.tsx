import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileCode, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { cn } from '../utils/cn';
import { API_URL } from '../config';

interface DesignSummary {
    _id: string;
    filename: string;
    status: 'OK' | 'ISSUES';
    itemsCount: number;
    createdAt: string;
    issues: string[];
}

export const DashboardPage: React.FC = () => {
    const [designs, setDesigns] = useState<DesignSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/designs`)
            .then(res => res.json())
            .then(data => {
                setDesigns(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch designs', err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen p-6 lg:p-12 relative overflow-hidden">
            <div className="animated-bg" />

            <div className="max-w-7xl mx-auto z-10 relative">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold text-white mb-2"
                        >
                            Dashboard
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-400"
                        >
                            Manage your analyzed visualization assets
                        </motion.p>
                    </div>

                    <Link to="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Upload New
                        </motion.button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {designs.map((design, index) => (
                        <Link key={design._id} to={`/design/${design._id}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative glass-panel rounded-2xl p-5 hover:bg-white/5 transition-colors border-t border-white/10"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-gray-800/50 rounded-lg group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors text-gray-400">
                                        <FileCode size={24} />
                                    </div>
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                        design.status === 'OK'
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-red-500/10 text-red-400"
                                    )}>
                                        {design.status === 'OK' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                                        {design.status}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-white truncate mb-1" title={design.filename}>{design.filename}</h3>
                                <div className="text-sm text-gray-500 mb-4">{new Date(design.createdAt).toLocaleDateString()}</div>

                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 bg-black/20 p-3 rounded-lg">
                                    <div>
                                        <span className="block text-gray-600 uppercase text-[10px]">Rects</span>
                                        {design.itemsCount}
                                    </div>
                                    <div>
                                        <span className="block text-gray-600 uppercase text-[10px]">Issues</span>
                                        {design.issues.length}
                                    </div>
                                </div>

                                <div className="absolute inset-0 border-2 border-blue-500/0 rounded-2xl group-hover:border-blue-500/20 transition-colors pointer-events-none" />
                            </motion.div>
                        </Link>
                    ))}

                    {designs.length === 0 && (
                        <div className="col-span-full py-20 text-center glass-panel rounded-3xl">
                            <p className="text-gray-500 text-lg">No designs found. Upload one to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
