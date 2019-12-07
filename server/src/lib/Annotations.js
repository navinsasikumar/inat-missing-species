const helper = require('./Helper');

class Annotations {
  constructor(perPage) {
    this.url = 'https://api.inaturalist.org/v1/controlled_terms';
    this.perPage = perPage || 10;
  }

  async get() {
    return helper.request(this.url);
  }
}

module.exports = Annotations;
