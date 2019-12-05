'use strict';

const express = require('express');
const path = require('path');

const inatRoutes = require('./routes/inat');

// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

const CLIENT_BUILD_PATH = path.join(__dirname, '../../client/build');

const setAPIHeaders = (req, res, next) => {
  res.set('Content-Type', 'application/json');
  return next();
};

// App
const app = express();

// Static files
app.use(express.static(CLIENT_BUILD_PATH));

// API
app.get('/api', (req, res) => {
  res.set('Content-Type', 'application/json');
  let data = {
    message: 'Hello world, Woooooeeeee!!!!???'
  };
  res.send(JSON.stringify(data, null, 2));
});

app.use('/api', setAPIHeaders);
app.get('/api/observations', inatRoutes.getObservations);
app.get('/api/observations/species', inatRoutes.speciesCounts);
app.get('/api/taxa/autocomplete', inatRoutes.autocompleteTaxa);
app.get('/api/taxa/:ids', inatRoutes.getTaxa);
app.get('/api/places/autocomplete', inatRoutes.autocompletePlaces);
app.get('/api/places/:ids', inatRoutes.getPlaces);
app.get('/api/users/autocomplete', inatRoutes.autocompleteUsers);
app.get('/api/observation_fields/autocomplete', inatRoutes.autocompleteObservationFields);
app.get('/api/users/:ids', inatRoutes.getUsers);

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
