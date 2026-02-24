// server.mjs — Entry point para Correos Pro en producción
import { config } from 'dotenv';
config();

import express from 'express';
import { createRequestHandler } from '@remix-run/express';

const app = express();
const port = process.env.PORT || 3002;

app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }));
app.use(express.static('build/client', { maxAge: '1h' }));

const build = await import('./build/server/index.js');
app.all('*', createRequestHandler({ build }));

app.listen(port, '0.0.0.0', () => {
  console.log('Correos Pro listening on http://0.0.0.0:' + port);
});
