/** @jsx ReactView.DOM */
ReactView = require('../react');
TodoItem = require('./todo_item');
Footer = require('./footer');

var ENTER_KEY = 13;

module.exports = ReactView({
  name: 'todos/index',
  getDefaultProps: function() {
    return {filter: 'all'};
  },
  handleKeyDown: function(event) {
    if( event.which !== ENTER_KEY ) {
      return;
    }

    var val = this.refs.newField.getDOMNode().value.trim();

    if( val ) {
      var newTodo = this.props.collection.create({ title: val });

      this.refs.newField.getDOMNode().value = '';
    }

    return false;
  },

  toggleAll: function(event) {
    var checked = event.target.checked;

    this.props.collection.each(function(todo) {
      // TODO batch update
      todo.save('completed', checked);
    });


  },
  handleClearCompleted: function(event) {
    this.props.collection.chain().filter( function(todo) {
      return todo.get('completed');
    }).each(function(todo) {
      // TODO batch update
      todo.destroy();
    })
  },
  filteredTodos: function() {
    var todos, filter;

    if( this.props.filter === 'completed' ) {
      todos = this.props.collection.where({completed: true});
    }
    else if( this.props.filter === 'active' ) {
      todos = this.props.collection.where({completed: false});
    }
    else {
      todos = this.props.collection;
    }

    return todos.map( function(todo) {
      return (
        <TodoItem
          component={TodoItem}
          key={todo.get('guid')}
          model={todo}
        /> );
    });
  },
  render: function() {
    var todos,
        activeCount= this.props.collection.activeCount();
        completedCount = this.props.collection.completedCount();
        footer = null,
        main = null;

    var todos = this.filteredTodos();

    if( this.props.collection.length > 0 ) {
      main = <section id="main">
              <input id="toggle-all" type="checkbox" checked={activeCount === 0} onChange={this.toggleAll} ></input>
              <label htmlFor="toggle-all">Mark all as complete</label>
              <ul id="todo-list">{todos}</ul>
            </section>;
      footer = <Footer activeCount={activeCount} filter={this.props.filter} completedCount={completedCount} onClearCompleted={this.handleClearCompleted}/>
    }
    return (
      <section id="todoapp">
        <header id="header">
          <h1>todos</h1>
          <input id="new-todo" ref="newField" placeholder="What needs to be done?" autoFocus="true" onKeyDown={this.handleKeyDown}/>
        </header>
        {main}
        {footer}
      </section>
    );
  }
});
