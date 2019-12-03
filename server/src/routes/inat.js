const myCounts = require('../lib/mycounts');
const Taxa = require('../lib/Taxa');
const Places = require('../lib/Places');
const Users = require('../lib/Users');
const Observations = require('../lib/Observations');

const speciesCounts = async (req, res) => {
  const diff = await myCounts.missingSpecies(req.query);
  console.log('Got all data');
  return res.send(diff);
};

const getTaxa = async (req, res) => {
  try {
    const taxa = new Taxa();
    const results = await taxa.get(req.params.ids);
    return res.send(results);
  } catch (e) {
    console.error(e);
    return res.send({ results: [] });
  }
};

const autocompleteTaxa = async (req, res) => {
  const taxa = new Taxa(10);
  const results = await taxa.autocomplete(req.query.search);
  return res.send(results);
};

const getPlaces = async (req, res) => {
  try {
    const places = new Places();
    const results = await places.get(req.params.ids);
    return res.send(results);
  } catch (e) {
    console.error(e);
    return res.send({ results: [] });
  }
};

const autocompletePlaces = async (req, res) => {
  try {
    const places = new Places(10);
    const results = await places.autocomplete(req.query.search);
    return res.send(results);
  } catch (e) {
    console.error(e);
    return res.send({ results: [] });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = new Users();
    const results = await users.get(req.params.ids);
    return res.send(results);
  } catch (e) {
    console.error(e);
    return res.send({ results: [] });
  }
};

const autocompleteUsers = async (req, res) => {
  try {
    const users = new Users(10);
    const results = await users.autocomplete(req.query.search);
    return res.send(results);
  } catch (e) {
    console.error(e);
    return res.send({ results: [] });
  }
};

const getObservations = async (req, res) => {
  const observations = new Observations();
  const results = await observations.get(req.query);
  return res.send(results);
};

module.exports = {
  speciesCounts,
  getTaxa,
  autocompleteTaxa,
  getPlaces,
  autocompletePlaces,
  getUsers,
  autocompleteUsers,
  getObservations,
};
