const { Schema, model } = require('mongoose');

const agvSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  active: {
    type: String,
    require: true,
  },
  proporcional: {
    type: Number,
    required: true,
  },
  derivativo: {
    type: Number,
    required: true,
  },
  integrativo: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = model('agv', agvSchema);
