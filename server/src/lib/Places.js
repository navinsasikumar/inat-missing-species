const helper = require('./Helper');

class Places {
  constructor(perPage) {
    this.url = 'https://api.inaturalist.org/v1/places';
    this.perPage = perPage || 10;
  }

  async autocomplete(query) {
    const url = `${this.url}/autocomplete?q=${query}`;
    return helper.request(url);
  }

  async get(ids) {
    const url = `${this.url}/${ids}`;
    return helper.request(url);
  }
}

module.exports = Places;
