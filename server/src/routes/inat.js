const myCounts = require('../lib/mycounts');

const speciesCounts = async function(req, res) {
  res.set('Content-Type', 'application/json');
  const diff = await myCounts.missingSpecies();
  let data = {
    message: 'Is anybody there?'
  };
  console.log('Got all data');
  res.send(diff);
};

module.exports = {
  speciesCounts: speciesCounts
};
