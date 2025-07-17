const mongoose = require('mongoose');

const studentSubmissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // links to your user model
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test', // links to your test model
    required: true,
  },
  testName: String,
  answers: [Number], // student's selected options
  score: Number,
  maxScore: Number,
});

const StudentSubmission = mongoose.model('StudentSubmission', studentSubmissionSchema);
module.exports = StudentSubmission;
