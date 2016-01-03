var _ = require('lodash');
var request = require('request');

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.identityCheck = function(req, res) {
  var url = 'https://proapi.whitepages.com/2.1/person.json';
  url += '?api_key=0e3db2f4c8b06067fc10a70feb5aeb24';

  _.each(req.body.address, function(value, key) {
    value && (url += '&' + key + '=' + value);
  });

  url += '&name=' + req.body.firstName + ' ' + req.body.lastName;
  url = url.split(' ').join('+').toLowerCase();

  request({
    method: 'GET',
    url: url
  },
  function(err, response) {
    if (err) return onErr(err, res);
    results = JSON.parse(response.body || '{}').results || [];
    results = _.pluck(results, 'locations');
    results = _.flatten(results);
    res.send(results);
  });
};
