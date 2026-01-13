import express from 'express';
import multer from 'multer';
import { Design } from '../models/Design';
import { parseSVG } from '../utils/svgParser';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { originalname, buffer } = req.file;
        const parseResult = await parseSVG(buffer);

        const design = new Design({
            filename: originalname,
            ...parseResult
        });

        await design.save();

        res.status(201).json(design);
    } catch (error: any) {
        console.error('Error processing upload:', error);
        res.status(500).json({
            error: 'Failed to process SVG',
            details: error.message
        });
    }
});

// GET /designs
router.get('/designs', async (req, res) => {
    try {
        const designs = await Design.find({}, 'filename status itemsCount createdAt issues');
        res.json(designs);
    } catch (error: any) {
        console.error('Error fetching designs:', error);
        res.status(500).json({
            error: 'Database connection failed. Please check MONGO_URI and IP Whitelisting.',
            details: error.message
        });
    }
});

// GET /designs/:id
router.get('/designs/:id', async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        if (!design) {
            return res.status(404).json({ error: 'Design not found' });
        }
        res.json(design);
    } catch (error: any) {
        console.error('Error fetching design details:', error);
        res.status(500).json({
            error: 'Failed to fetch design details',
            details: error.message
        });
    }
});

export default router;
