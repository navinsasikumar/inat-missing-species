const myCounts = require('../lib/mycounts');
const Taxa = require('../lib/Taxa');
const Observations = require('../lib/Observations');

const speciesCounts = async (req, res) => {
  const diff = await myCounts.missingSpecies(req.query);
  console.log('Got all data');
  return res.send(diff);
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
  console.log(results);
  return res.send(results);
};

module.exports = {
  speciesCounts,
  autocompleteTaxa,
  getObservations,
};
