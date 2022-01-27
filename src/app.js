const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const debug = require('debug')('elasticsearch-articles-api-nodejs:app');
const routes = require('./routes');
const compression = require('compression');
// const { caches } = require('./libs');
const _ = require('lodash-core');
const app = express();

app.use(compression());


app.use(helmet()); // https://helmetjs.github.io/

// Parse Form data
app.use(express.urlencoded({ extended: false }));
// Parse JSON 
app.use(express.json());


app.all('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">Welcome !!!</h1>');
});
app.use('/favicon.ico', express.static('./favicon.ico'));
app.use('/favicon.png', express.static('./favicon.png'));

app.use('/api', cors(), routes); // https://github.com/expressjs/cors

// 404
app.use(function (req, res) {
  debug('404', req.headers, req.query, req.body);
  return res.status(404).json({ error: 'Route [' + req.path + '] Not found.' });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  debug('500', req.headers, req.query, req.body, err);
  return res.status(500).json({ error: (err.code === 404) ? ('Route [' + req.path + '] Not found.') : 'Something wrong on our server.' });
});

/* print all routes
function print (path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split (thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}

app._router.stack.forEach(print.bind(null, []));
*/
module.exports = app;
