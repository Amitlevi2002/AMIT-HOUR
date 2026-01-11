import mongoose, { Schema, Document } from 'mongoose';

export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
}

export interface IDesign extends Document {
    filename: string;
    svgWidth: number;
    svgHeight: number;
    items: IRect[];
    itemsCount: number;
    coverageRatio: number;
    issues: ('EMPTY' | 'OUT_OF_BOUNDS')[];
    status: 'OK' | 'ISSUES';
    createdAt: Date;
}

const RectSchema = new Schema<IRect>({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    fill: { type: String, required: true }
}, { _id: false });

const DesignSchema = new Schema<IDesign>({
    filename: { type: String, required: true },
    svgWidth: { type: Number, required: true },
    svgHeight: { type: Number, required: true },
    items: [RectSchema],
    itemsCount: { type: Number, required: true },
    coverageRatio: { type: Number, required: true },
    issues: [{ type: String, enum: ['EMPTY', 'OUT_OF_BOUNDS'] }],
    status: { type: String, enum: ['OK', 'ISSUES'], required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Design = mongoose.model<IDesign>('Design', DesignSchema);
