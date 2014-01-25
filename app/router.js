var BaseClientRouter = require('rendr/client/router');
var _ = require('underscore');

var RendrReact = require('rendr-react');

var Router = module.exports = function Router(options) {
  BaseClientRouter.call(this, options);
};

/**
 * Set up inheritance.
 */
Router.prototype = Object.create(BaseClientRouter.prototype);
Router.prototype.constructor = BaseClientRouter;

Router.prototype.postInitialize = function() {
  this.on('action:start', this.trackImpression, this);
};

Router.prototype.getMainView = RendrReact.getMainView;

Router.prototype.trackImpression = function() {
  if (window._gaq) {
    _gaq.push(['_trackPageview']);
  }
};
