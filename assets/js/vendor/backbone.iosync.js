(function (undefined) {
  // Common JS // require JS
  var _, $, Backbone, exports;
  if (typeof window === 'undefined' || typeof require === 'function') {
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    exports = Backbone;
    if (typeof module !== 'undefined') module.exports = exports;
  } else {
    $ = this.$;
    _ = this._;
    Backbone = this.Backbone;
    exports = this;
  }


/*!
 * backbone.iobind - Backbone.sync replacement
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */


/**
 * # Backbone.sync
 *
 * Replaces default Backbone.sync function with socket.io transport
 *
 * ### Assumptions
 *
 * Currently expects active socket to be located at `window.socket`,
 * `Backbone.socket` or the sync'ed model own socket.
 * See inline comments if you want to change it.
 * ### Server Side
 *
 *     socket.on('todos:create', function (data, fn) {
 *      ...
 *      fn(null, todo);
 *     });
 *     socket.on('todos:read', ... );
 *     socket.on('todos:update', ... );
 *     socket.on('todos:delete', ... );
 *
 * @name sync
 */
Backbone.sync = function (method, model, options) {
  var params = _.extend({}, options)

  if (params.url) {
    params.url = _.result(params, 'url');
  } else {
    params.url = _.result(model, 'url') || urlError();
  }

  var cmd = params.url.split('/')
    , namespace = (cmd[0] !== '') ? cmd[0] : cmd[1]; // if leading slash, ignore

  if ( !params.data && model ) {
    params.data = params.attrs || model.toJSON(options) || {};
  }

  if (params.patch === true && params.data.id == null && model) {
    params.data.id = model.id;
  }

  // If your socket.io connection exists on a different var, change here:
  var io = model.socket || Backbone.socket || window.socket

  //since Backbone version 1.0.0 all events are raised in methods 'fetch', 'save', 'remove' etc


  var methodMap = {
    'create': 'create',
    'update': 'update',
    'patch':  'PATCH',
    'delete': 'destroy',
    'read':   'find'
  };

  var actionMap = {
    'create': 'post',
    'update': 'post',
    'patch':  'PATCH',
    'delete': 'post',
    'read':   'get'
  }

  var type = methodMap[method];
  var action = actionMap[method];


    
    var json = {
    url : '/' + namespace + '/' + type,
    data : {
      params : params.data,
      action : global.Functions.whatChangedInModel(model),
      notification : (options.notification == false) ? false : true
    }
  }

  var defer = $.Deferred();

  io.emit(action, json, function (data) {

    // console.log("*** SOCKET from ", json.url, "Response ", data, "***")


    if(data.err){
      if(options.error) options.error(data.err);
      if(data.err === "You have read-only permission"){
        defer.resolve();
      }else{
        alert(data.err);
        location.reload();
      }
      defer.reject();
    }else{
      if(options.success) options.success(data);
      if(options.complete) defer.then(options.complete(data));
      defer.resolve();
    }



  });
  var promise = defer.promise();
  model.trigger('request', model, promise, options);
  return promise;
};

// Throw an error when a URL is needed, and none is supplied.
// Copy from backbone.js#1558
var urlError = function() {
  throw new Error('A "url" property or function must be specified');
};




})();