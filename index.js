'use strict';

var sinon = require('sinon');
var events = require('events');

var mongoose = {};

// Mongoose-mock emits events
// when Models or Documents are created.
// This allows for the mock injector to get notifications
// about use of the mock and get a chance to access
// the mocked models and document produced.
events.EventEmitter.call(mongoose);
mongoose.__proto__ = events.EventEmitter.prototype; // jshint ignore:line

var ModelPrototype = {
  save: sinon.stub(),
  increment: sinon.stub(),
  remove: sinon.stub(),
  validateSync: sinon.stub()
};

// ## Schema
var Schema = function () {

  function Model(properties) {
    if (properties) {
      Object.keys(properties).forEach(function (key) {
        this[key] = properties[key];
      }.bind(this));
    }
    mongoose.emit('document', this);

    this.__proto__ = ModelPrototype;
  }

  Model.statics = {};
  Model.methods = {};
  Model.static = sinon.stub();
  Model.method = sinon.stub();
  Model.pre = sinon.stub();

  Model.path = function () {
    return {
      validate: sinon.stub(),
    };
  };

  Model.virtual = function () {
    function SetterGetter() {
      return {
        set: function () {
          return new SetterGetter();
        },
        get: function () {
          return new SetterGetter();
        }
      };
    }
    return new SetterGetter();
  };

  Model.aggregate = sinon.stub();
  Model.count = sinon.stub();
  Model.create = sinon.stub();
  Model.distinct = sinon.stub();
  Model.ensureIndexes = sinon.stub();
  Model.find = sinon.stub();
  Model.findById = sinon.stub();
  Model.findByIdAndRemove = sinon.stub();
  Model.findByIdAndUpdate = sinon.stub();
  Model.findOne = sinon.stub();
  Model.findOneAndRemove = sinon.stub();
  Model.findOneAndUpdate = sinon.stub();
  Model.geoNear = sinon.stub();
  Model.geoSearch = sinon.stub();
  Model.index = sinon.stub();
  Model.mapReduce = sinon.stub();
  Model.plugin = sinon.stub();
  Model.populate = sinon.stub();
  Model.remove = sinon.stub();
  Model.set = sinon.stub();
  Model.update = sinon.stub();
  Model.where = sinon.stub();
  Model.validateSync = sinon.stub();
  Model.prototype = ModelPrototype;

  mongoose.emit('model', Model);
  return Model;
};

// compiled models are stored in models_
// and may be retrieved by name.
var models_ = {};
function createModelFromSchema(name, Type) {
  if (Type) {
    if (Type.statics) {
      Object.keys(Type.statics).forEach(function (key) {
        Type[key] = Type.statics[key];
      });
    }
    if (Type.methods) {
      Object.keys(Type.methods).forEach(function (key) {
        Type.prototype[key] = Type.methods[key];
      });
    }
    models_[name] = Type;
  }
  return models_[name];
}

mongoose.Schema = Schema;
mongoose.Schema.Types = { ObjectId: '' };  // Defining mongoose types as dummies.
mongoose.model = createModelFromSchema;
mongoose.connect = sinon.stub;
module.exports = mongoose;