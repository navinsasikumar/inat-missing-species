const helper = require('./Helper');

class Observations {
  constructor(perPage) {
    this.url = 'http://api.inaturalist.org/v1/observations';
    this.perPage = perPage || 50;
  }

  async speciesCounts(opts) {
    const queryStr = helper.makeQueryStr(opts);
    const url = `${this.url}/species_counts/${queryStr}`;
    return helper.request(url);
  }

  async get(opts) {
    const queryStr = helper.makeQueryStr(opts);
    const url = `${this.url}/${queryStr}`;
    return helper.request(url);
  }
}

module.exports = Observations;
