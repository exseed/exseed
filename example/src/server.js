import 'source-map-support/register';
import app from './app';
import settings from './settings.server';

app.run(settings, (err, models, port) => {
  if (err) {
    throw err;
  }
  console.log(`HTTP server listening on port ${port}`);
});