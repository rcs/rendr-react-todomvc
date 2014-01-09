var BaseAppView = require('rendr/client/app_view');
var RendrBaseView = require('rendr/shared/base/view');
var ReactView = require('./react');
var _ = require('underscore');

var React = require('react');

module.exports = BaseAppView.extend({
  setCurrentView: function(view) {
    // TODO this is ugly. Is there a higher abstraction of an "HTML generating thing" we should be using?
    if(view instanceof RendrBaseView) {
      this.$content.html(view.el);
      view.render()
    }
    else {
      React.renderComponent(view, this.$content.get(0));
    }
  },
});
