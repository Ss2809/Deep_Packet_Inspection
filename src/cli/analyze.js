#!/usr/bin/env node
import { DPIEngine } from '../services/dpiEngine.js';
const [input, output = 'output.pcap'] = process.argv.slice(2); if (!input) { console.error('Usage: npm run cli -- <input.pcap> [output.pcap]'); process.exit(1); }
const engine = new DPIEngine(); const result = await engine.processFile(input, output); console.log(JSON.stringify(result.report, null, 2));
