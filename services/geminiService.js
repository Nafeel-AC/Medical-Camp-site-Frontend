// services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuestions(topic, count = 5) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Generate ${count} medical school interview questions about ${topic}. 
  Format as a JSON array of question strings. Only return the JSON. Example:
  ["Question 1", "Question 2"]`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

async function evaluateAnswer(question, userAnswer) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Evaluate this medical student's answer to the interview question. 
  First determine if the answer is correct (true/false), then provide brief feedback.
  
  Question: ${question}
  Answer: ${userAnswer}
  
  Return as JSON: {correct: boolean, feedback: string}`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    throw error;
  }
}

module.exports = { generateQuestions, evaluateAnswer };