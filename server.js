const express = require('express');
const next = require('next');
const compression = require('compression');
const helmet = require('helmet');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const runTheTrap = async () => {
  try {
    await app.prepare();
    const server = express();

    //Enable helmet to set security headers
    server.use(helmet());
    
    // gzip it!
    server.use(compression());

    // handle authors
    server.get('/author/:slug', (req, res) => {
      const context = {
        slug: req.params.slug,
      };
      app.render(req, res, '/author', context);
    });

    // Handle direct year routes
    server.get('/:year(\\d{4})', (req, res) => {
      const context = {
        year: req.params.year,
      };
      app.render(req, res, '/year', context);
    });

    // Handle post routes
    server.get('/:year(\\d{4})/:date(\\d{1,2})', (req, res) => {
      const context = {
        year: req.params.year,
        date: req.params.date.padStart(2, '0'),
      };
      app.render(req, res, '/post', context);
    });

    // Handle all basic routes
    server.get('*', (...args) => handle(...args));

    // Start the server itself!
    server.listen(3000, err => {
      if (err) {
        throw err;
      }
      console.log('Listening on port 3000');
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
runTheTrap();
