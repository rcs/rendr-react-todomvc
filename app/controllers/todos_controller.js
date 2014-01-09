_ = require('underscore');

module.exports = TodosController = {
  index: function(params, callback) {
    var spec = {
      collection: {collection: 'Todos', params:{}}
    };
    this.app.fetch(spec, function(err, fetched) {
      var options = _.extend(params, fetched);
      callback(err, 'todos/index',options);
    });
  },
  active: function(params, callback) {
    TodosController.index.call(this, _.defaults({filter: 'active'}, params), callback)
  },
  completed: function(params, callback) {
    TodosController.index.call(this, _.defaults({filter: 'completed'}, params), callback)
  },
  show: function(params, callback) {
    var spec = {
      model: {model: 'Todo', params: params}
    };
    this.app.fetch(spec, function(err, result) {
      callback(err, result);
    });
  }
};
