import { Router } from 'express';
import multer from 'multer';
import { analyzeUpload, downloadOutput, health } from '../controllers/analyzerController.js';
const upload = multer({ dest: 'uploads/', limits: { fileSize: 250 * 1024 * 1024 } });
export const analyzerRouter = Router();
analyzerRouter.get('/health', health);
analyzerRouter.post('/analyze', upload.single('pcap'), analyzeUpload);
analyzerRouter.get('/analyze/:filename/download', downloadOutput);
