const Observations = require('./Observations');

let observations = new Observations();

/* jshint ignore:start */
const getTotals = async function(query, page = 1) {
  let opts = {
    place_id: query.place_id || 2983,
    verifiable: true,
    captive: false,
    page: page
  };
  if (query.months) opts.month = query.months

  let response = await observations.speciesCounts(opts);
  let total = response.total_results;
  let perPage = response.per_page;
  let thisPage = response.page;
  if (total - (thisPage * perPage) > 0) {
    return response.results.concat(await getTotals(query, thisPage + 1));
  } else {
    return response.results;
  }
};

const getUserTotals = async function(query, page = 1) {
  let userOpts = {
    place_id: query.place_id || 2983,
    user_id: query.user_id || 'navin_sasikumar',
    verifiable: true,
    captive: false,
    page: page
  };

  let response = await observations.speciesCounts(userOpts);
  let total = response.total_results;
  let perPage = response.per_page;
  let thisPage = response.page;
  if (total - (thisPage * perPage) > 0) {
    return response.results.concat(await getUserTotals(query, thisPage + 1));
  } else {
    return response.results;
  }
};

const missingSpecies = async function(query) {
  const [totals, userTotals] = await Promise.all([getTotals(query), getUserTotals(query)]);
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
