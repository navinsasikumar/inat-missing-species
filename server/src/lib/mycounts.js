/*jshint esversion: 6 */
const Observations = require('./Observations');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

let observations = new Observations();

const HOST_PROJECT = process.env.HOST_CITY_PROJECT;
const HOST_PLACE_ID = process.env.HOST_CITY_PLACE_ID;
const HOST_PROJECT_PLACE_ID = process.env.HOST_PROJECT_PLACE_ID || process.env.HOST_CITY_PLACE_ID;

Object.defineProperty(Array.prototype, 'flat', {
  value: function(depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
    }, []);
  }
});

const getAOpts = (query) => {
  const opts = {
    verifiable: true,
    captive: false,
  };
  if (Object.keys(query).length === 0) {
    console.log('No query keys');
    query.a_months = '4,5';
    query.b_project_id = HOST_PROJECT;
  }
  if (query.a_place_id) opts.place_id = query.a_place_id;
  if (query.a_project_id) opts.project_id = query.a_project_id;
  if (!query.a_place_id && !query.a_project_id) {
    opts.place_id = HOST_PLACE_ID;
    if (query.b_project_id && query.b_project_id.startsWith('city-nature-challenge')) {
      opts.place_id = HOST_PROJECT_PLACE_ID;
    }
  }
  if (query.a_user_id) opts.user_id = query.a_user_id;
  if (query.a_months) opts.month = query.a_months;
  if (query.a_taxon_id) opts.taxon_id = query.a_taxon_id;

  return opts;
}

/* jshint ignore:start */
const getATotals = async function (query, page = 1) {
  try {
    const opts = getAOpts(query);
    opts.page = page;

    const response = await observations.speciesCounts(opts);

    if (page === 1) {
      const total = response.total_results;
      const perPage = response.per_page;
      const thisPage = response.page;
      console.log(`A: Total: ${total}, perPage: ${perPage}, thisPage: ${thisPage}`);
      console.log(`A: Pages: ${Math.ceil(total / perPage)}`);
      const pages = Math.ceil(total / perPage);
      const promises = [];
      for (let i = 2; i <= pages; i += 1) {
        promises.push(getATotals(query, i));
      }
      const resultPages = await Promise.all(promises);
      return [...response.results, ...resultPages.flat()];
    }

    return response.results;
  } catch (e) {
    console.log(e);
    return [];
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

  const response = await observations.speciesCounts(opts);

  try {
    if (page === 1) {
      const total = response.total_results;
      const perPage = response.per_page;
      const thisPage = response.page;
      console.log(`B: Total: ${total}, perPage: ${perPage}, thisPage: ${thisPage}`);
      console.log(`B: Pages: ${Math.ceil(total / perPage)}`);
      const pages = Math.ceil(total / perPage);
      const promises = [];
      for (let i = 2; i <= pages; i += 1) {
        promises.push(getBTotals(query, i));
      }
      const resultPages = await Promise.all(promises);
      return [...response.results, ...resultPages.flat()];
    }

    return response.results;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const missingSpecies = async function(query) {
  console.log(`Query: ${JSON.stringify(query)}`);
  var queryJSON = JSON.stringify(query);
  console.log(`Query JSON: ${queryJSON}`);
  let minus = myCache.get(queryJSON);
  if (minus == undefined) {
    console.log('Cache miss');
    const [aTotals, bTotals] = await Promise.all([getATotals(query), getBTotals(query)]);
    let bTaxa = bTotals.map(function(taxon) { return taxon.taxon.name });
    minus = aTotals.filter(function(taxon) {
      return bTaxa.indexOf(taxon.taxon.name) < 0;
    });
    myCache.set(queryJSON, minus, 1800);
  } else {
    console.log('Cache hit!');
  }
  return minus;
};

myCache.on("set", function (key, value) {
  console.log('Key set');
});

myCache.on("expired", function (key, value) {
  console.log('Expiring');
  if (key === `{"a_months":"4,5","b_project_id":"${HOST_PROJECT}"}`) {
    console.log('Key is expired');
    cncMissing = missingSpecies(JSON.parse(key));
  }
});

/* jshint ignore:end */

module.exports = {
  missingSpecies: missingSpecies
};
