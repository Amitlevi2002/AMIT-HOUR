import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileCode, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { API_URL } from '../config';

export const UploadPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const processUpload = async (file: File) => {
        setIsUploading(true);
        setError(null);

        if (file.type !== 'image/svg+xml') {
            setError('Please upload a valid SVG file');
            setIsUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Failed to upload file. Check backend connection.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            processUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            processUpload(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center p-6">
            <div className="animated-bg" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center space-y-6 max-w-2xl mx-auto mb-12 z-10"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium text-blue-300 border-blue-500/20 mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    SVG Analysis System v2.0
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-sm">
                    Visualize Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                        Vector Assets
                    </span>
                </h1>

                <p className="text-lg text-gray-400 max-w-lg mx-auto">
                    Upload SVG files for instant backend processing, layout analysis, and issue detection.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full max-w-xl z-10"
            >
                <div
                    className={cn(
                        "relative group rounded-3xl p-1 transition-all duration-300",
                        isDragging ? "bg-blue-500/50 scale-105" : "bg-gradient-to-b from-white/10 to-transparent hover:bg-white/20"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="glass-panel rounded-[22px] min-h-[320px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-transparent group-hover:border-white/10 transition-colors relative overflow-hidden">

                        <input
                            type="file"
                            accept=".svg"
                            onChange={handleChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                        />

                        <AnimatePresence mode='wait'>
                            {isUploading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                                    <p className="text-xl font-medium text-blue-200">Processing SVG...</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    <div className={cn(
                                        "w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform duration-500",
                                        isDragging ? "scale-110 rotate-12" : "group-hover:scale-105"
                                    )}>
                                        <Upload className="w-10 h-10 text-white" />
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white">
                                            {isDragging ? 'Drop it here!' : 'Upload SVG'}
                                        </h3>
                                        <p className="text-gray-400">Drag & drop or click to browse</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 glass rounded-xl bg-red-500/10 border-red-500/20 text-red-200 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <FileCode size={20} />
                        <span>View Existing Designs</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};
