/*jshint esversion: 6 */
const Observations = require('./Observations');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

let observations = new Observations();

/* jshint ignore:start */
const getATotals = async function(query, page = 1) {
  let opts = {
    verifiable: true,
    captive: false,
    page: page
  };
  if (Object.keys(query).length === 0) {
    console.log('No query keys');
    query.a_months = '4,5';
    query.b_project_id = 'city-nature-challenge-2019-greater-philadelphia-area';
  }
  if (query.a_place_id) opts.place_id = query.a_place_id;
  if (query.a_project_id) opts.project_id = query.a_project_id;
  if (!query.a_place_id && !query.a_project_id) {
    opts.place_id = 2983;
    if (query.b_project_id && query.b_project_id.startsWith('city-nature-challenge')) {
      opts.place_id = 130542;
    }
  }
  if (query.a_user_id) opts.user_id = query.a_user_id;
  if (query.a_months) opts.month = query.a_months;
  if (query.a_taxon_id) opts.taxon_id = query.a_taxon_id;

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
  if (query.b_taxon_id) opts.taxon_id = query.b_taxon_id;
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
  console.log(query);
  var queryJSON = JSON.stringify(query);
  console.log(queryJSON);
  let minus = myCache.get(queryJSON);
  if (minus == undefined) {
    console.log('Cache miss');
    const [aTotals, bTotals] = await Promise.all([getATotals(query), getBTotals(query)]);
    let bTaxa = bTotals.map(function(taxon) { return taxon.taxon.name });
    minus = aTotals.filter(function(taxon) {
      return bTaxa.indexOf(taxon.taxon.name) < 0;
    });
    myCache.set(queryJSON, minus, 1800);
  }
  return minus;
};

myCache.on("set", function (key, value) {
  console.log('Key set');
});

myCache.on("expired", function (key, value) {
  console.log('Expiring');
  if (key === '{"a_months":"4,5","b_project_id":"city-nature-challenge-2019-greater-philadelphia-area"}') {
    console.log('Key is expired');
    cncMissing = missingSpecies(JSON.parse(key));
  }
});

/* jshint ignore:end */

module.exports = {
  missingSpecies: missingSpecies
};
