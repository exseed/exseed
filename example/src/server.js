import { env } from 'exseed';
import app from './app';
import settings from './settings.server';
if (env.development) {
  require('source-map-support').install();
}

app.run(settings, (err, models, port) => {
  if (err) {
    throw err;
  }
  console.log(`HTTP server listening on port ${port}`);
});