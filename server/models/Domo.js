const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');
// const { Domo } = require('.');

let DomoModel;

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  level: {
    type: Number,
    min: 0,
    max: 99,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  level: doc.level,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DomoModel.find(search).select('name age level').lean().exec(callback);
};

DomoSchema.statics.deleteDomo = (ownerId, name, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
  };
  return DomoModel.deleteOne(search, callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
