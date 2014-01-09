
/** @jsx ReactView.DOM */
ReactView = require('../react');


module.exports = ReactView({
  name: 'todos/footer',

  render: function() {
    var linkClasses = {
      all: '',
      active: '',
      completed: ''
    };

    linkClasses[this.props.filter] = 'selected';

    return (
      <footer id="footer">
        <span id="todo-count">
          <strong>{this.props.activeCount}</strong>
          {'  ' + (this.props.activeCount === 1 ? 'item' : 'items') + ' left'}
        </span>
        <ul id="filters">
          <li>
            <a className={linkClasses['all']} href="/">All</a>
          </li>
          {' '}
          <li>
            <a href="/active" className={linkClasses['active']} >Active</a>
          </li>
          {' '}
          <li>
            <a href="/completed" className={linkClasses['completed']} >Completed</a>
          </li>
        </ul>
        {this.props.completedCount
          ?  <button onClick={this.props.onClearCompleted} id="clear-completed">Clear completed ({this.props.completedCount})</button>
          : ''
        }
      </footer>
    );
  }
});
