// routes/performance.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Question = require('../models/Question');

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // Get user's question history
    const questionSets = await Question.find({ user: req.user.id })
      .sort({ date: -1 })
      .lean();
    
    // Calculate performance metrics
    let totalQuestions = 0;
    let correctAnswers = 0;
    const topicPerformance = {};
    
    questionSets.forEach(set => {
      set.questions.forEach(q => {
        if (q.userAnswer) {
          totalQuestions++;
          if (q.evaluation?.correct) correctAnswers++;
          
          // Track by topic
          if (!topicPerformance[set.topic]) {
            topicPerformance[set.topic] = { total: 0, correct: 0 };
          }
          topicPerformance[set.topic].total++;
          if (q.evaluation?.correct) topicPerformance[set.topic].correct++;
        }
      });
    });
    
    // Calculate percentages
    const overallAccuracy = totalQuestions > 0 
      ? Math.round((correctAnswers / totalQuestions) * 100) 
      : 0;
    
    const topics = Object.keys(topicPerformance).map(topic => ({
      name: topic,
      accuracy: Math.round((topicPerformance[topic].correct / topicPerformance[topic].total) * 100),
      total: topicPerformance[topic].total
    })).sort((a, b) => b.accuracy - a.accuracy);
    
    res.render('performance/index', {
      overallAccuracy,
      totalQuestions,
      topics,
      questionSets
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;