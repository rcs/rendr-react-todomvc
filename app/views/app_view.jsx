'use strict';
var BaseAppView = require('rendr/client/app_view');
var RendrBaseView = require('rendr/shared/base/view');
var ReactView = require('rendr-react/view');
var _ = require('underscore');

var React = require('react/addons');

/*
renderInside: function(container) {
  $el.html(view.el);
  view.render()
}
*/

/*
renderInside: function(container) {
  React.renderComponent(this, container);
}
*/
var AppView = function() {
  BaseAppView.apply(this, arguments);
}
module.exports = AppView;
_.extend( AppView.prototype, BaseAppView.prototype );

AppView.prototype.setCurrentView = function(view) {
  // TODO this is ugly. Is there a higher abstraction of an "HTML generating thing" we should be using?
  this.$content.html(view.el)
  if(view instanceof RendrBaseView) {
    this.$content.html(view.el);
    view.render()
  }
  else {
    React.renderComponent(view, this.$content.get(0));
  }
};
