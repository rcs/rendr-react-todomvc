/** @jsx ReactView.DOM */
ReactView = require('rendr-react/view');

var ESCAPE_KEY = 27;
var ENTER_KEY = 13;

module.exports = ReactView({
  name: 'todos/todo_item',
  getInitialState: function() {
    return {editText: this.props.model.get('title') };
  },
  handleEdit: function(event) {
    this.setState({ editing: true, editText: this.props.model.get('title') }, function() {
      var node = this.refs.editField.getDOMNode();
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length)
    });
  },
  handleChange: function(event) {
    this.setState({editText: event.target.value});
  },
  handleSubmit: function(event) {
    var val = this.state.editText.trim();
    if(val) {
      this.props.model.save({title: val});
      this.setState({editing: false});
    }
    else {
      this.handleDestroy();
    }
  },
  handleKeyDown: function(event) {
    if( event.which == ESCAPE_KEY ) {
      this.setState({editing: false, editText: this.props.model.get('title'),});
    }
    else if( event.which == ENTER_KEY ) {
      this.handleSubmit(event);
    }
  },
  handleDestroy: function(event) {
    this.props.model.destroy();
  },
  handleToggle: function(event) {
    this.props.model.save('completed', event.target.checked);
  },

  render: function() {
    var todo = this.props.model;

    return (
      <li
          className={ReactView.addons.classSet({
            completed: todo.get('completed'),
            editing: this.state.editing
          })}
      >
        <div className="view">
          <input
                 className="toggle"
                 type="checkbox"
                 checked={todo.get('completed') ? 'checked' : '' }
                 onClick={this.handleToggle}
          />
          <label onDoubleClick={this.handleEdit}>{todo.get('title')}</label>
          <button className="destroy" onClick={this.handleDestroy}></button>
        </div>
        <input
                className="edit"
                ref="editField"
                onBlur={this.handleSubmit}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                value={this.state.editText}
        />
      </li>
    );
  }
});
