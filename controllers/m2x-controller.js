
const API_KEY = '010ab3e6e7e488ffd8927c610390f192';

var M2X = require('m2x'),
	m2x = new M2X(API_KEY);

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

