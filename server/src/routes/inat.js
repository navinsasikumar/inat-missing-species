const myCounts = require('../lib/mycounts');
const Taxa = require('../lib/Taxa');
const Observations = require('../lib/Observations');

const speciesCounts = async (req, res) => {
  const diff = await myCounts.missingSpecies(req.query);
  console.log('Got all data');
  return res.send(diff);
};

const getTaxa = async (req, res) => {
  try {
    console.log('Calling get Taxa');
    const taxa = new Taxa();
    const results = await taxa.get(req.params.ids);
    console.log(results);
    return res.send(results);
  } catch (e) {
    console.error(e);
    res.send({ results: [] });
  }
};

const autocompleteTaxa = async (req, res) => {
  console.log('Calling autocomplete');
  const taxa = new Taxa(10);
  const results = await taxa.autocomplete(req.query.search);
  console.log(results);
  return res.send(results);
};

const getObservations = async (req, res) => {
  console.log('Getting Observations');
  const observations = new Observations();
  const results = await observations.get(req.query);
  console.log(JSON.stringify(results.results[1]));
  return res.send(results);
};

module.exports = {
  speciesCounts,
  getTaxa,
  autocompleteTaxa,
  getObservations,
};
