import { parseStringPromise } from 'xml2js';
import { IRect } from '../models/Design';

interface ParseResult {
    svgWidth: number;
    svgHeight: number;
    items: IRect[];
    itemsCount: number;
    coverageRatio: number;
    issues: ('EMPTY' | 'OUT_OF_BOUNDS')[];
    status: 'OK' | 'ISSUES';
}

export const parseSVG = async (buffer: Buffer): Promise<ParseResult> => {
    const xml = buffer.toString('utf-8');
    const result = await parseStringPromise(xml);

    if (!result.svg) {
        throw new Error('Invalid SVG: No svg root element');
    }

    const svg = result.svg;
    // Parse dimensions (handle "px" suffix if present)
    const svgWidth = parseFloat(svg.$.width || '0');
    const svgHeight = parseFloat(svg.$.height || '0');

    const items: IRect[] = [];
    const issues: Set<'EMPTY' | 'OUT_OF_BOUNDS'> = new Set();

    // Extract rects
    const rects = svg.rect || [];

    let totalRectArea = 0;

    for (const r of rects) {
        const rectAttrs = r.$;
        const x = parseFloat(rectAttrs.x || '0');
        const y = parseFloat(rectAttrs.y || '0');
        const width = parseFloat(rectAttrs.width || '0');
        const height = parseFloat(rectAttrs.height || '0');
        const fill = rectAttrs.fill || '#000000';

        if (width <= 0 || height <= 0) continue;

        items.push({ x, y, width, height, fill });
        totalRectArea += width * height;

        // Check bounds
        if (x + width > svgWidth || y + height > svgHeight) {
            issues.add('OUT_OF_BOUNDS');
        }
    }

    const itemsCount = items.length;

    if (itemsCount === 0) {
        issues.add('EMPTY');
    }

    const canvasArea = svgWidth * svgHeight;
    const coverageRatio = canvasArea > 0 ? totalRectArea / canvasArea : 0;

    return {
        svgWidth,
        svgHeight,
        items,
        itemsCount,
        coverageRatio,
        issues: Array.from(issues),
        status: issues.size > 0 ? 'ISSUES' : 'OK'
    };
};
