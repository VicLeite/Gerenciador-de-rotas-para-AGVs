const { Schema, model } = require('mongoose');

const PostoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  trajetoria: {
    type: JSON,
    required: true,
  },

}, {
  timestamps: true,
});

module.exports = model('Posto', PostoSchema);
