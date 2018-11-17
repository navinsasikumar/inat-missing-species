const helper = require('./Helper');

function Observations() {
  this.url = 'http://api.inaturalist.org/v1/observations';
}

Observations.prototype.speciesCounts = async function(opts) {
  let queryStr = helper.makeQueryStr(opts);
  let url = this.url + '/species_counts' + queryStr;
  let response = await helper.request(url);
  return response;
};

module.exports = Observations;
