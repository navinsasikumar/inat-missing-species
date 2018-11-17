const rp = require('request-promise-native');

module.exports = {
  makeQueryStr: function(opts) {
    var str = '';
    for (var prop in opts) {
      if (opts.hasOwnProperty(prop)) {
        var valuePair = prop + '=' + opts[prop];
        str += str ? '&' + valuePair : '?' + valuePair;
      }
    }
    return str;
  },

  request: function(url, method, body) {
    let options = {
      method: method || 'GET',
      url: url,
      json: true,
      body: body
    };
    return rp(options);
  }
};
