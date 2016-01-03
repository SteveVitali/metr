
const config = require('../config');
const API_KEY = process.env.M2X_API_KEY || config.M2X_API_KEY;

var M2X = require('m2x');
var m2x = new M2X(API_KEY);

exports.list = (next) => {
  m2x.devices.list(function(response) {
    if (response.isSuccess()) {
      next(null, response.json);
    }
    else {
      next(response.error);
    }
  });
};

//This may not be safe, haha.
exports.key = API_KEY;
