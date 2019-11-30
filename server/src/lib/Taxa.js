const helper = require('./Helper');

class Taxa {
  constructor(perPage) {
    this.url = 'https://api.inaturalist.org/v1/taxa';
    this.perPage = perPage || 10;
  }

  async autocomplete(query) {
    const url = `${this.url}/autocomplete?q=${query}`;
    return helper.request(url);
  }
}

module.exports = Taxa;
