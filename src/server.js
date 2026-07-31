import { mkdir } from 'node:fs/promises';
import { createApp } from './app.js';
const port = Number(process.env.PORT ?? 3000); await mkdir('uploads', { recursive: true }); createApp().listen(port, () => console.log(`DPI API listening on http://localhost:${port}`));
