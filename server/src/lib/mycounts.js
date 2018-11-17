const Observations = require('./Observations');

let observations = new Observations();

let opts = {
  //month: '4%2C5',
  place_id: 2983,
  verifiable: true,
  captive: false
};

let userOpts = {
  place_id: 2983,
  user_id: 'navin_sasikumar',
  verifiable: true,
  captive: false
};

/* jshint ignore:start */
const getTotals = async function(page = 1) {
  opts.page = page;
  let response = await observations.speciesCounts(opts);
  let total = response.total_results;
  let perPage = response.per_page;
  let thisPage = response.page;
  if (total - (thisPage * perPage) > 0) {
    return response.results.concat(await getTotals(thisPage + 1));
  } else {
    return response.results;
  }
};

const getUserTotals = async function(page = 1) {
  userOpts.page = page;
  let response = await observations.speciesCounts(userOpts);
  let total = response.total_results;
  let perPage = response.per_page;
  let thisPage = response.page;
  if (total - (thisPage * perPage) > 0) {
    return response.results.concat(await getUserTotals(thisPage + 1));
  } else {
    return response.results;
  }
};

const missingSpecies = async function() {
  const [totals, userTotals] = await Promise.all([getTotals(), getUserTotals()]);
  let userTaxa = userTotals.map(function(taxon) { return taxon.taxon.name });
  let minus = totals.filter(function(taxon) {
    return userTaxa.indexOf(taxon.taxon.name) < 0;
  });
  return minus;
};
/* jshint ignore:end */

module.exports = {
  missingSpecies: missingSpecies
};
