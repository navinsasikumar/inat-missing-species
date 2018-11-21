const Observations = require('./Observations');

let observations = new Observations();

/* jshint ignore:start */
const getATotals = async function(query, page = 1) {
  let opts = {
    verifiable: true,
    captive: false,
    page: page
  };
  if (query.a_place_id) opts.place_id = query.a_place_id;
  if (query.a_project_id) opts.project_id = query.a_project_id;
  if (!query.a_place_id && !query.a_project_id) opts.place_id = 2983;
  if (query.a_user_id) opts.user_id = query.a_user_id;
  if (query.a_months) opts.month = query.a_months;

  let response = await observations.speciesCounts(opts);
  let total = response.total_results;
  let perPage = response.per_page;
  let thisPage = response.page;
  if (total - (thisPage * perPage) > 0) {
    return response.results.concat(await getATotals(query, thisPage + 1));
  } else {
    return response.results;
  }
};

const getBTotals = async function(query, page = 1) {
  let opts = {
    verifiable: true,
    captive: false,
    page: page
  };
  if (query.b_place_id) opts.place_id = query.b_place_id;
  if (query.b_project_id) opts.project_id = query.b_project_id;
  if (query.b_user_id) opts.user_id = query.b_user_id;
  if (query.b_months) opts.month = query.b_months;
  if (!query.b_place_id && !query.b_project_id) return [];

  let response = await observations.speciesCounts(opts);
  let total = response.total_results;
  let perPage = response.per_page;
  let thisPage = response.page;
  if (total - (thisPage * perPage) > 0) {
    return response.results.concat(await getBTotals(query, thisPage + 1));
  } else {
    return response.results;
  }
};

const missingSpecies = async function(query) {
  const [aTotals, bTotals] = await Promise.all([getATotals(query), getBTotals(query)]);
  let bTaxa = bTotals.map(function(taxon) { return taxon.taxon.name });
  let minus = aTotals.filter(function(taxon) {
    return bTaxa.indexOf(taxon.taxon.name) < 0;
  });
  return minus;
};
/* jshint ignore:end */

module.exports = {
  missingSpecies: missingSpecies
};
