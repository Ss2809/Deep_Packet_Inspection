import { promises as fs } from 'node:fs';
import path from 'node:path';
import { DPIEngine, sharedRuleManager } from '../services/dpiEngine.js';
export async function analyzeUpload(req, res, next) { try { if (!req.file) return res.status(400).json({ error: 'Upload a PCAP file as multipart field "pcap".' }); const outputPath = path.join(path.dirname(req.file.path), `${path.basename(req.file.path)}.filtered.pcap`); const engine = new DPIEngine({ ruleManager: sharedRuleManager }); const result = await engine.processFile(req.file.path, outputPath); res.json({ ...result, outputDownload: `/api/analyze/${path.basename(outputPath)}/download` }); } catch (error) { next(error); } }
export async function downloadOutput(req, res, next) { try { const file = path.join('uploads', req.params.filename); await fs.access(file); res.download(file); } catch (error) { next(error); } }
export function health(_req, res) { res.json({ status: 'ok', service: 'deep-packet-inspection-node' }); }
