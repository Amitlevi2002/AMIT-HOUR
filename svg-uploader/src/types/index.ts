export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
}

export interface Design {
    _id: string;
    filename: string;
    svgWidth: number;
    svgHeight: number;
    items: IRect[];
    itemsCount: number;
    coverageRatio: number;
    issues: ('EMPTY' | 'OUT_OF_BOUNDS')[];
    status: 'OK' | 'ISSUES';
    createdAt: string;
}

export interface UploadedSVG {
    id: string;
    name: string;
    content: string;
    size: number;
    url: string;
}
