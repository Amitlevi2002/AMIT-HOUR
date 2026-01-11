import React, { useRef, useEffect, useState } from 'react';
import type { IRect } from '../types';
import { motion } from 'framer-motion';

interface CanvasPreviewProps {
    svgWidth: number;
    svgHeight: number;
    items: IRect[];
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ svgWidth, svgHeight, items }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [hoveredRect, setHoveredRect] = useState<IRect | null>(null);
    const [hoverPos, setHoverPos] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    const PADDING = 20;
    // Dynamic dimensions based on container
    const CANVAS_WIDTH = containerWidth > 0 ? containerWidth : 600;
    // Maintain aspect ratio if possible, but cap height. 
    // Let's settle for a flexible height based on aspect ratio of SVG, but maxed at ~500 for viewing comfort.
    const aspectRatio = svgWidth / svgHeight;
    const calculatedHeight = CANVAS_WIDTH / aspectRatio;
    const CANVAS_HEIGHT = Math.min(Math.max(300, calculatedHeight), 600);

    // Calculate scale
    const availableWidth = CANVAS_WIDTH - (PADDING * 2);
    const availableHeight = CANVAS_HEIGHT - (PADDING * 2);
    const scale = Math.min(availableWidth / svgWidth, availableHeight / svgHeight);

    // Center
    const drawWidth = svgWidth * scale;
    const drawHeight = svgHeight * scale;
    const offsetX = (CANVAS_WIDTH - drawWidth) / 2;
    const offsetY = (CANVAS_HEIGHT - drawHeight) / 2;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear and draw background
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // Draw grid pattern (responsive optimization: fewer lines on small screens?)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        const gridSize = 20;
        for (let i = 0; i < CANVAS_WIDTH; i += gridSize) ctx.fillRect(i, 0, 1, CANVAS_HEIGHT);
        for (let i = 0; i < CANVAS_HEIGHT; i += gridSize) ctx.fillRect(0, i, CANVAS_WIDTH, 1);

        // Draw SVG bounds
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(offsetX, offsetY, drawWidth, drawHeight);
        ctx.setLineDash([]);

        // Draw rects
        items.forEach(rect => {
            const rx = offsetX + (rect.x * scale);
            const ry = offsetY + (rect.y * scale);
            const rw = rect.width * scale;
            const rh = rect.height * scale;

            ctx.fillStyle = rect.fill;
            ctx.fillRect(rx, ry, rw, rh);

            // Issues highlighting
            if (rect.x + rect.width > svgWidth || rect.y + rect.height > svgHeight) {
                ctx.strokeStyle = '#EF4444'; // Red-500
                ctx.lineWidth = 3;
                ctx.strokeRect(rx, ry, rw, rh);
            }
        });

    }, [svgWidth, svgHeight, items, scale, offsetX, offsetY, CANVAS_WIDTH, CANVAS_HEIGHT]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let found: IRect | null = null;
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            const rx = offsetX + (item.x * scale);
            const ry = offsetY + (item.y * scale);
            const rw = item.width * scale;
            const rh = item.height * scale;
            if (mouseX >= rx && mouseX <= rx + rw && mouseY >= ry && mouseY <= ry + rh) {
                found = item;
                break;
            }
        }
        setHoveredRect(found);
        setHoverPos({ x: e.clientX, y: e.clientY });
    };

    return (
        <div ref={containerRef} className="relative group w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredRect(null)}
                className="relative block rounded-lg bg-[#0F1014] border border-white/5 cursor-crosshair shadow-2xl w-full h-auto"
            />

            {/* Tooltip */}
            {hoveredRect && hoverPos && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed z-50 glass-panel p-3 rounded-lg shadow-2xl pointer-events-none border-l-4 border-blue-500 max-w-[200px] break-words"
                    style={{
                        left: Math.min(hoverPos.x + 15, window.innerWidth - 220), // Prevent overflow right
                        top: hoverPos.y + 15
                    }}
                >
                    <div className="text-xs font-mono text-blue-200 mb-1">RECTANGLE</div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-300">
                        <span>X: <span className="text-white">{hoveredRect.x}</span></span>
                        <span>Y: <span className="text-white">{hoveredRect.y}</span></span>
                        <span>W: <span className="text-white">{hoveredRect.width}</span></span>
                        <span>H: <span className="text-white">{hoveredRect.height}</span></span>
                    </div>
                    {(hoveredRect.x + hoveredRect.width > svgWidth || hoveredRect.y + hoveredRect.height > svgHeight) && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">
                            OUT OF BOUNDS
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};
