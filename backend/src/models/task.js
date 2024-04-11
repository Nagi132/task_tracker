const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {type: String, required: true},
  startDate: {type: Date, required: true},
  endDate: Date,
});

module.exports = mongoose.model('Task', taskSchema);
