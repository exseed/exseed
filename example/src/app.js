import 'source-map-support/register';
import * as exseed from 'exseed';
import settings from './settings.server';

exseed.registerApp('basic', './basic');
exseed.registerApp('user', './user');

exseed.run(settings, (err, models, port) => {
  if (err) {
    throw err;
  }
  console.log(`HTTP server listening on port ${port}`);
});