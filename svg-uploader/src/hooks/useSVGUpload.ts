import { useState, useCallback } from 'react';
import type { UploadedSVG } from '../types';

export const useSVGUpload = () => {
    const [files, setFiles] = useState<UploadedSVG[]>([]);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): string | null => {
        if (file.type !== 'image/svg+xml') {
            return 'Only SVG files are allowed';
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return 'File size must be less than 5MB';
        }
        return null;
    };

    const addFiles = useCallback(async (fileList: File[]) => {
        setError(null);
        const newFiles: UploadedSVG[] = [];

        for (const file of fileList) {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                continue;
            }

            try {
                const text = await file.text();
                // Basic SVG validation checks if it contains <svg
                if (!text.includes('<svg')) {
                    setError('Invalid SVG content');
                    continue;
                }

                const id = crypto.randomUUID();
                const url = URL.createObjectURL(file);

                newFiles.push({
                    id,
                    name: file.name,
                    content: text,
                    size: file.size,
                    url
                });
            } catch (err) {
                console.error('Error reading file:', err);
                setError('Failed to read file');
            }
        }

        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const removeFile = useCallback((id: string) => {
        setFiles(prev => {
            const file = prev.find(f => f.id === id);
            if (file) {
                URL.revokeObjectURL(file.url);
            }
            return prev.filter(f => f.id !== id);
        });
    }, []);

    return { files, error, addFiles, removeFile };
};
