var Reflux = require('reflux');
var request = require('superagent');

var ParkingSpaceActions = Reflux.createActions([
  'load',
  'createRandomSpace'
]);

ParkingSpaceActions.createRandomSpace.preEmit = function(space) {
  request.post('/api/parking-spaces', space, function(spaceAfter) {
    console.log('created space (before)', space, 'after', spaceAfter);
  });
};

module.exports = ParkingSpaceActions;
