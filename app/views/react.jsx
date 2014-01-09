var BaseView = require('rendr/shared/base/view');
var _ = require('underscore');

var React = require('react/addons');
var async = require('async');

var Backbone = require('backbone');

function attachNewInstance($el, parentView, baseOptions, callback) {
  var options = _.omit(baseOptions,'reactid','reactChecksum'),
      fetchSummary = options.fetch_summary,
      _this = this;

  if (!_.isEmpty(fetchSummary)) {
    options.app.fetcher.hydrate(fetchSummary, { app: options.app }, function(err, results) {
      _.extend(options, results || {});

      if (options.model != null) {
        if (!(options.model instanceof Backbone.Model) && options.model_name) {
          options.model = options.app.modelUtils.getModel(options.model_name, options.model, {
            parse: true
          });
        }
        options.model_name = options.model_name || options.app.modelUtils.modelName(options.model.constructor);
        options.model_id = options.model.id;
      }

      if (options.collection != null) {
        options.collection_name = options.collection_name || options.app.modelUtils.modelName(options.collection.constructor);
        options.collection_params = options.collection.params;
      }

      var view = _this(_.extend(options,results));
      view.attach($el.get(0),parentView);
      callback(null, view);

    })
  }
  else {
    var view = _this(options);
    view.attach($el.get(0),parentView);
    callback(null, view);
  }
}

var ReactView = function(spec) {
  var baseSpec = {
    getDefaultProps: function() {
      var defaults = {},
          node = this,
          app;

      while( !(app = node.props.app) && node.props.__owner__ ) {
        node = node.props.__owner__;
      }
      defaults['app'] = app;

      return defaults;
    },
    getTemplateData: function() {
      if( this.props.model ) {
        return this.props.model.toJSON();
      }
      else if( this.props.collection ) {
        return {
          models: this.props.collection.toJSON(),
          meta: this.props.collection.meta,
          params: this.props.collection.params
        }
      }
      else {
        return _.clone(this.props);
      }
    },

    decorateTemplateData: function(data) {
      if( this.props.app ) {
        data._app = this.props.app;
      }
      if( this.props.model ) {
        data._model = this.props.model;
      }
      if( this.props.collection ) {
        data._collection = this.props.collection;
      }

      data._view = this;

      return data;
    },

    getInitialState: function() {
      var data = this.getTemplateData();
      data = this.decorateTemplateData(data);
      return data;
    },

    updateFromModelOrCollection: function() {
      var data = this.getTemplateData();
      data = this.decorateTemplateData(data);
      this.setState(data);
    },

    getModelOrCollection: function() {
      return this.props.model || this.props.collection;
    },

    componentDidMount: function(rootNode) {
      if( obj = this.getModelOrCollection() ) {
        obj.on("add remove reset sort change destroy", this.updateFromModelOrCollection, this);
      }
    },

    componentWillUnmount: function() {
      if( obj = this.getModelOrCollection() ) {
        obj.off(null, this.updateFromModelOrCollection, this);
      }
    },

    // Rendr interface adapter
    attach: function(element, parentView) {
      React.renderComponent(this,element.parentNode);
    },

    // Rendr interface adapter
    getHtml: function(callback) {
      React.renderComponentToString(this,function(html) {
        callback(html);
      })
    },

    // Rendr interface adapter
    remove: function() {
      React.unmountComponentAtNode(this.getDOMNode().parentNode)
    },
    getRootAttributes: function() {
      var context = {
        app: this.props.app,
        attributes: this.props.attributes,
        id: this.props.id,
        className: this.props.className,
        name: this.name,
        options: this.props
      }

      return BaseView.prototype.getAttributes.call(context)
    },

    decorateRendr: function( node ) {
      var newInstance = new node.constructor();
      var attributes = this.getRootAttributes.apply(this);
      newInstance.construct(_.defaults(node.props,
          _.omit(this.props,'view','tagName'),
          _.omit(attributes,'data-model_name','data-model_id','data-collection_name', 'data-collection_params')
          ));
      return newInstance;
    },
  }

  if( typeof spec.render != 'function' ) {
    throw new Error("ReactRendr: Class spec must implement a render function")
  }

  if( !spec.displayName && spec.name ) {
    spec.displayName = spec.name;
  }
  else if( !spec.name && spec.displayname ) {
    spec.name = spec.displayName;
  }


  spec.render = _.compose( function(node) {
    return this.decorateRendr(node);
  }, spec.render);

  var reactClass = React.createClass(_.defaults({},spec,baseSpec));
  // TODO When a new react version gets cut, turn this into a method on the `statics` property of the spec
  reactClass.attachNewInstance = attachNewInstance;
  return reactClass;
}

// TODO Any good way to get a private instance of React.DOM to add this to?
ReactView.DOM = React.DOM;
ReactView.addons = React.addons;

module.exports = ReactView;
