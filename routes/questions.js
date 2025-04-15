// routes/questions.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensurePremium } = require('../middleware/auth');
const { generateQuestions } = require('../services/geminiService');
const Question = require('../models/Question');
const multer = require('multer');
const speechToText = require('speech-to-text');

// Configure multer for audio uploads
const upload = multer({ dest: 'public/audio/' });

// Question practice page
router.get('/practice', ensureAuthenticated, ensurePremium, async (req, res) => {
  try {
    const topics = ['Anatomy', 'Physiology', 'Pharmacology', 'Ethics', 'Personal Statement'];
    res.render('questions/practice', { topics });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// Generate questions
router.post('/generate', ensureAuthenticated, ensurePremium, async (req, res) => {
  try {
    const { topic, count } = req.body;
    const questions = await generateQuestions(topic, count);
    
    // Save to user's history
    const questionSet = new Question({
      user: req.user.id,
      topic,
      questions,
      date: new Date()
    });
    await questionSet.save();
    
    res.json({ success: true, questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to generate questions' });
  }
});

// Submit audio answer
router.post('/submit-answer', ensureAuthenticated, ensurePremium, upload.single('audio'), async (req, res) => {
  try {
    const { questionId, questionText } = req.body;
    
    // Convert speech to text
    const audioPath = req.file.path;
    const userAnswer = await speechToText.convert(audioPath);
    
    // Evaluate with Gemini
    const evaluation = await evaluateAnswer(questionText, userAnswer);
    
    // Update question history with answer
    await Question.updateOne(
      { _id: questionId, 'questions.text': questionText },
      { $set: { 'questions.$.userAnswer': userAnswer, 'questions.$.evaluation': evaluation } }
    );
    
    res.json({ success: true, evaluation, userAnswer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to process answer' });
  }
});

module.exports = router;