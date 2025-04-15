const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: [true, 'Please add a topic']
  },
  questions: [{
    text: String,
    userAnswer: String,
    evaluation: {
      correct: Boolean,
      feedback: String
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema);