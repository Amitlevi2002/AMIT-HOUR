import React from 'react';
import { Download, Trash2, FileCode } from 'lucide-react';
import type { UploadedSVG } from '../types';

interface SVGGridProps {
    files: UploadedSVG[];
    onDelete: (id: string) => void;
}

export const SVGGrid: React.FC<SVGGridProps> = ({ files, onDelete }) => {
    if (files.length === 0) {
        return null;
    }

    const handleDownload = (file: UploadedSVG) => {
        const blob = new Blob([file.content], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {files.map((file) => (
                <div key={file.id} className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all">
                    <div className="aspect-square p-4 bg-gray-900/50 flex items-center justify-center relative">
                        <img src={file.url} alt={file.name} className="max-w-full max-h-full object-contain" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                                onClick={() => handleDownload(file)}
                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                                title="Download"
                            >
                                <Download size={20} />
                            </button>
                            <button
                                onClick={() => onDelete(file.id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <FileCode size={16} className="text-blue-400 shrink-0" />
                                <span className="font-medium text-gray-200 truncate" title={file.name}>
                                    {file.name}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 pl-6">
                            {formatSize(file.size)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
