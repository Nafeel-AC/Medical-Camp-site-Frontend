// public/js/questions.js
document.addEventListener('DOMContentLoaded', function() {
    const questionForm = document.getElementById('questionForm');
    const questionArea = document.getElementById('questionArea');
    const emptyState = document.getElementById('emptyState');
    const questionsList = document.getElementById('questionsList');
    const answerSection = document.getElementById('answerSection');
    const currentQuestionText = document.getElementById('currentQuestionText');
    const recordBtn = document.getElementById('recordBtn');
    const recordStatus = document.getElementById('recordStatus');
    const audioPlayback = document.getElementById('audioPlayback');
    const submitAnswerBtn = document.getElementById('submitAnswerBtn');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const feedbackSection = document.getElementById('feedbackSection');
    const answerFeedback = document.getElementById('answerFeedback');
    const continueBtn = document.getElementById('continueBtn');
    
    let questions = [];
    let currentQuestionIndex = 0;
    let mediaRecorder;
    let audioChunks = [];
    
    // Generate questions
    questionForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const topic = document.getElementById('topic').value;
      const count = document.getElementById('count').value;
      
      try {
        const response = await fetch('/questions/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic, count })
        });
        
        const data = await response.json();
        
        if (data.success) {
          questions = data.questions;
          renderQuestionsList();
          showQuestion(0);
          
          questionArea.classList.remove('d-none');
          emptyState.classList.add('d-none');
        } else {
          alert('Failed to generate questions. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    });
    
    // Render questions list
    function renderQuestionsList() {
      questionsList.innerHTML = '';
      questions.forEach((q, index) => {
        const questionItem = document.createElement('div');
        questionItem.className = `question-item mb-2 p-2 ${index === currentQuestionIndex ? 'bg-light' : ''}`;
        questionItem.innerHTML = `
          <span class="badge bg-secondary me-2">${index + 1}</span>
          ${q}
        `;
        questionsList.appendChild(questionItem);
      });
    }
    
    // Show current question
    function showQuestion(index) {
      currentQuestionIndex = index;
      currentQuestionText.textContent = questions[index];
      renderQuestionsList();
      
      answerSection.classList.remove('d-none');
      feedbackSection.classList.add('d-none');
      
      // Reset audio
      audioChunks = [];
      audioPlayback.src = '';
      audioPlayback.classList.add('d-none');
      recordStatus.textContent = 'Press to record your answer';
      recordBtn.innerHTML = '<i class="fas fa-microphone"></i>';
      recordBtn.classList.remove('recording');
      submitAnswerBtn.disabled = true;
    }
    
    // Record audio
    recordBtn.addEventListener('click', async function() {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          
          mediaRecorder.ondataavailable = function(e) {
            audioChunks.push(e.data);
          };
          
          mediaRecorder.onstop = function() {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayback.src = audioUrl;
            audioPlayback.classList.remove('d-none');
            submitAnswerBtn.disabled = false;
          };
          
          mediaRecorder.start();
          recordBtn.classList.add('recording');
          recordBtn.innerHTML = '<i class="fas fa-stop"></i>';
          recordStatus.textContent = 'Recording... Press to stop';
        } catch (error) {
          console.error('Error accessing microphone:', error);
          alert('Could not access microphone. Please ensure you have granted permission.');
        }
      } else {
        mediaRecorder.stop();
        recordBtn.classList.remove('recording');
        recordBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        recordStatus.textContent = 'Recording complete';
      }
    });
    
    // Submit answer
    submitAnswerBtn.addEventListener('click', async function() {
      if (audioChunks.length === 0) return;
      
      const formData = new FormData();
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      formData.append('audio', audioBlob, 'answer.wav');
      formData.append('questionText', questions[currentQuestionIndex]);
      
      try {
        const response = await fetch('/questions/submit-answer', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          showFeedback(data.evaluation, data.userAnswer);
        } else {
          alert('Failed to evaluate answer. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    });
    
    // Show feedback
    function showFeedback(evaluation, userAnswer) {
      answerSection.classList.add('d-none');
      feedbackSection.classList.remove('d-none');
      
      answerFeedback.className = `answer-feedback p-3 ${evaluation.correct ? 'correct' : 'incorrect'}`;
      answerFeedback.innerHTML = `
        <h6>Your Answer:</h6>
        <p>${userAnswer}</p>
        <h6>Feedback:</h6>
        <p>${evaluation.feedback}</p>
        <div class="text-${evaluation.correct ? 'success' : 'danger'}">
          <i class="fas fa-${evaluation.correct ? 'check-circle' : 'times-circle'} me-2"></i>
          ${evaluation.correct ? 'Correct!' : 'Needs Improvement'}
        </div>
      `;
    }
    
    // Next question
    nextQuestionBtn.addEventListener('click', function() {
      if (currentQuestionIndex < questions.length - 1) {
        showQuestion(currentQuestionIndex + 1);
      } else {
        alert('You have completed all questions!');
      }
    });
    
    continueBtn.addEventListener('click', function() {
      if (currentQuestionIndex < questions.length - 1) {
        showQuestion(currentQuestionIndex + 1);
      } else {
        alert('You have completed all questions!');
        questionArea.classList.add('d-none');
        emptyState.classList.remove('d-none');
      }
    });
  });