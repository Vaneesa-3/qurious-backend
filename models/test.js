const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  testName: String,
  questions: [
    {
      questionText: String,
      options: [String],
      correctOption: Number,
    },
  ],
});

const TestModel = mongoose.model('Test', testSchema);

module.exports = TestModel;
