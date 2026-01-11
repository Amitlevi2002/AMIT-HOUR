import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
    onUpload: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(Array.from(e.dataTransfer.files));
        }
    }, [onUpload]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(Array.from(e.target.files));
        }
    }, [onUpload]);

    return (
        <div
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50/10' : 'border-gray-600 hover:border-gray-500'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                multiple
                accept=".svg"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload SVG files"
            />
            <div className="flex flex-col items-center gap-4 pointer-events-none">
                <div className="p-4 rounded-full bg-gray-800">
                    <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <div>
                    <p className="text-lg font-medium text-gray-200">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        SVG files only (max 5MB)
                    </p>
                </div>
            </div>
        </div>
    );
};
