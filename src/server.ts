// the polyfills must be one of the first things imported in node.js.
// The only modules to be imported higher - node modules with es6-promise 3.x or other Promise polyfill dependency
// (rule of thumb: do it if you have zone.js exception that it has been overwritten)
// if you are including modules that modify Promise, such as NewRelic,, you must include them before polyfills
import './polyfills.ts';
import './__2.1.1.workaround.ts'; // temporary until 2.1.1 things are patched in Core
import 'ts-helpers';

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';


// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';

// App
import { AppModule } from './app/app.node.module';
import { environment } from './environments/environment';

// Routes
import { routes } from './server.routes';

// Special Nodejs imports - They can't be implicit due to webpack
const morgan = require('morgan');
const Zone = require('zone.js');

/**
 * enable prod mode for faster renders in production environments
 */
if (environment.production) {
  enableProdMode();
}

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));
const port = process.env.PORT || 4200;

// Express View
app.engine('.html', createEngine({
  providers: [
    // use only if you have shared state between users
    // { provide: 'LRU', useFactory: () => new LRU(10) }

    // stateless providers only since it's shared
  ]
}));
app.set('port', port);
app.set('views',  path.join(ROOT, 'client'));
app.set('view engine', 'html');
app.set('json spaces', 2);

app.use(cookieParser('Angular 2 Universal woth universal-CLI Starter'));
app.use(bodyParser.json());
app.use(compression());

app.use(morgan('dev'));

function cacheControl(req, res, next) {
  // instruct browser to revalidate in 60 seconds
  res.header('Cache-Control', 'max-age=60');
  next();
}
// Serve static files
app.use('/assets', cacheControl, express.static(path.join(__dirname, 'assets'), {maxAge: 30}));
app.use(cacheControl, express.static(path.join(ROOT, 'client'), {index: false}));

/**
 * bootstrap universal app
 * @param req
 * @param res
 */
function ngApp(req, res) {

  function onHandleError(parentZoneDelegate, currentZone, targetZone, error)  {
    console.warn('Error in SSR, serving for direct CSR');
    res.sendFile('index.html', {root: './src'});
    return false;
  }

  Zone.current.fork({ name: 'CSR fallback', onHandleError }).run(() => {
    res.render('index', {
      req,
      res,
      ngModule: AppModule,
      time: true, // use this to determine what part of your app is slow only in development
      preboot: false,
      baseUrl: '/',
      requestUrl: req.originalUrl,
      originUrl: req.hostname
    });
  });

}

/**
 * use universal for specific routes
 */
app.get('/', ngApp);
routes.forEach(route => {
  app.get(`/${route}`, ngApp);
  app.get(`/${route}/*`, ngApp);
});

app.get('*', function(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  const pojo = { status: 404, message: 'No Content' };
  const json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
let server = app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
