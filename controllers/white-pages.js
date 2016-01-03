var _ = require('lodash');
var request = require('request');

exports.identityCheck = function(req, res) {
  var url = 'https://proapi.whitepages.com/2.1/person.json?api_key=0e3db2f4c8b06067fc10a70feb5aeb24';
  _.each(req.body.address, function(value, key) {
    value && (url += '&' + key + '=' + value);
  });
  url += '&name=' + req.body.firstName + ' ' + req.body.lastName;
  url = url.split(' ').join('+').toLowerCase();
  console.log('white pages request url', url);
  var first = true;
  request({
    method: 'GET',
    url: url
  }, function(err, response) {
    var results = response.body;
    results = JSON.parse(results || '{}').results || [];
    results = _.pluck(results, 'locations');
    results = _.flatten(results);
    console.log('locations', results);
    res.send(results);
  });
};
