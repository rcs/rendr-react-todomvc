module.exports = MemoryAdapter;
var _ = require('underscore');

var Todos = require('../../app/collections/todos');
// HAX: don't try to interact with the model store.
Todos.prototype.store = function() {};

var TODOS = new Todos();

function MemoryAdapter(options) {
  this.options = options;
}

MemoryAdapter.prototype.request = function(req, api, options, callback) {
  var guid,
      todo,
      pathParts;
  pathParts = req.path.split('/');
  guid = pathParts[3];

  if( arguments.length == 3) {
    callback = options;
    options = {};
  }


  if( guid ) {
    if( req.method == 'GET' ) {
      return this.getTodo(guid,callback);
    }
    if( req.method == 'PUT' ) {
      return this.putTodo(guid, req.body, callback);
    }
    if( req.method == 'DELETE' ) {
      return this.deleteTodo(guid,callback);
    }
  }
  else {
    if( req.method == 'GET' ) {
      if( _.keys(api.query).length > 0 ) {
        if( api.query.completed && api.query.completed == 'false' ) {
          api.query.completed = false;
        }
        return callback(null,{statusCode: 200}, { todos: _.map(TODOS.where(api.query), function(todo) { return todo.toJSON() })  });
      }
      else {
        return callback(null,{statusCode: 200}, { todos: TODOS.toJSON() });
      }
    }
  }

  callback(null, {statusCode: 404}, null);
}

MemoryAdapter.prototype.getTodo = function(guid, callback) {
  if( !guid ) {
    return callback('Cannot get without GUID', {statusCode: 400});
  }

  todo = TODOS.get(guid);
  if( !todo ) {
    return callback(null,{statusCode: 404},"Can't find task");
  }

  callback(null, {statusCode: 200}, todo.toJSON());
}

MemoryAdapter.prototype.putTodo = function(guid, updated, callback) {
  var todo;

  if( !guid || !updated.guid ) {
    return callback(null, {statusCode: 404}, 'Cannot PUT without GUID');
  }

  if( updated.guid !== guid ) {
    return callback(null, {statusCode: 400}, "Body doesn't match URL guid");
  }

  if( todo = TODOS.get(guid) ) {
    todo.set(updated, {silent: true, parse: true});
  }
  else {
    todo = new (TODOS.model)(updated, {silent: true, parse: true});
    TODOS.add(todo);
  }

  callback(null, {statusCode: 200}, todo.toJSON());
}


MemoryAdapter.prototype.deleteTodo = function(guid,callback) {
  var todo;
  if( !guid || !(todo = TODOS.get(guid)) ) {
    return callback(null, {statusCode: 404}, "Can't find todo");
  }

  TODOS.remove(todo)

  callback(null, {statusCode: 200}, todo);
}
