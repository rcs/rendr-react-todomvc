var Todo = require('../models/todo')
  , BaseCollection = require('./base')
  , _ = require('underscore');


module.exports = Todos = BaseCollection.extend({
  model: Todo,
  url: '/todos',
  jsonKey: 'todos',

  initialize: function() {
    BaseCollection.prototype.initialize.apply(this,arguments);
    this.on('add remove', this.store.bind(this));
  },
  completedCount: function() {
    return this.where({completed: true}).length
  },
  activeCount: function() {
    return this.where({completed: false}).length
  },
});
module.exports.id = 'Todos';
