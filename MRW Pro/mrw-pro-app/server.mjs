// server.mjs — Entry point para MRW Pro en producción
// Carga dotenv ANTES de importar el build de Remix
// Esto resuelve el problema de ESM + PM2 + env vars
import { config } from 'dotenv';
config();

import express from 'express';
import { createRequestHandler } from '@remix-run/express';

const app = express();
const port = process.env.PORT || 3001;

// Serve static assets directly (bypasses Node for better performance)
app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }));
app.use(express.static('build/client', { maxAge: '1h' }));

// All other requests → Remix request handler
const build = await import('./build/server/index.js');
app.all('*', createRequestHandler({ build }));

app.listen(port, '0.0.0.0', () => {
  console.log('MRW Pro listening on http://0.0.0.0:' + port);
});
