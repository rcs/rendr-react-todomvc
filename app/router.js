var BaseClientRouter = require('rendr/client/router');
var _ = require('underscore');

var Router = module.exports = function Router(options) {
  BaseClientRouter.call(this, options);
};

ReactView = require('./views/react');

/**
 * Set up inheritance.
 */
Router.prototype = Object.create(BaseClientRouter.prototype);
Router.prototype.constructor = BaseClientRouter;

Router.prototype.postInitialize = function() {
  this.on('action:start', this.trackImpression, this);
};

Router.prototype.getMainView = function(views) {
  return views[0];
  var contentNode = this.appView.$content.get(0);
  return _.find(views, function(view) {
    var viewNode;
    if( typeof view.getDOMNode === 'function' ) {
      viewNode = view.getDOMNode().parentNode;
    } else {
      viewNode = view.$el.parent().get(0);
    }
    return viewNode === contentNode;
  });
}

//Router.prototype.getHandler = function(action, pattern, route) {
//  var router = this;
//
//  // abstract action call
//  function actionCall(action, params) {
//    action.call(router, params, router.getRenderCallback(route));
//  }
//
//  // This returns a function which is called by Backbone.history.
//  return function() {
//    var params, paramsArray, redirect;
//
//    router.trigger('action:start', route, !!this.renderedFirst);
//    router.currentRoute = route;
//    if( ! this.renderedfirst ) {
//      this.renderedfirst = true;
//      ReactView.attach(router.app, null, function(views) {
//        router.currentView = router.getMainView(views);
//        router.trigger('action:end', route, true);
//      });
//    } else {
//      paramsArray = _.toArray(arguments);
//      params = router.getParamsHash(pattern, paramsArray, window.location.search);
//
//      redirect = router.getRedirect(route, params);
//      /**
//       * If `redirect` is present, then do a redirect and return.
//       */
//      if (redirect != null) {
//        router.redirectTo(redirect, {replace: true});
//      } else {
//        if (!action) {
//          throw new Error("Missing action \"" + route.action + "\" for controller \"" + route.controller + "\"");
//        } else if (typeof action == 'string') {
//          // in AMD environment action is the string containing path to the controller
//          // which will be loaded async (might be preloaded)
//          // Only used in AMD environment
//          requireAMD([action], function(controller) {
//            // check we have everything we need
//            if (typeof controller[route.action] != 'function') {
//              throw new Error("Missing action \"" + route.action + "\" for controller \"" + route.controller + "\"");
//            }
//            actionCall(controller[route.action], params);
//          });
//        } else {
//          actionCall(action, params);
//        }
//      }
//    }
//  };
//};


Router.prototype.trackImpression = function() {
  if (window._gaq) {
    _gaq.push(['_trackPageview']);
  }
};
