var BaseModel = require('./base');

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
module.exports = Todo = BaseModel.extend({
  url: '/todo/:guid',
  idAttribute: 'guid',
  defaults: function() {
    return {
      guid: guid(),
      completed: false
    }
  },
  parse: function(json) {
    if( json.completed === 'false' ) {
      json.completed = false
    }
    else if( json.completed === 'true' ) {
      json.completed = true;
    }
    return json;
  }

});
module.exports.id = 'Todo';
