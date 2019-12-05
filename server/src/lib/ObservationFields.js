const helper = require('./Helper');

class ObservationFields {
  constructor(perPage) {
    this.url = 'https://inaturalist.org/observation_fields.json';
    this.perPage = perPage || 10;
  }

  async autocomplete(query) {
    console.log('Autocompleteing obs fields');
    const url = `${this.url}?q=${query}`;
    return helper.request(url);
  }

  /* async get(ids) {
    const url = `${this.url}/${ids}`;
    return helper.request(url);
  } */
}

module.exports = ObservationFields;
