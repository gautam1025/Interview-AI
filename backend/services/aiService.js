const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuestions = async (role, experienceLevel, difficulty) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a professional technical interviewer.

      Generate 5 ${difficulty} difficulty interview questions for a ${role} developer with ${experienceLevel} experience.

      Return ONLY valid JSON in this format:
      [
        { "question": "Question text here" },
        { "question": "Question text here" }
      ]

      Do NOT add explanations.
      Do NOT add markdown.
      Only return pure JSON.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Clean possible markdown wrapping
    const cleaned = response.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned);

    return parsed.map(q => q.question);

  } catch (error) {
    console.error("Gemini Error:", error.message);
    throw new Error("Failed to generate questions from Gemini AI");
  }
};
const evaluateAnswers = async (role, experienceLevel, questions, answers, hintsUsed = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const formattedQA = questions.map((q, index) => {
      const hintCount = hintsUsed[index] || 0;
      return `Question ${index + 1}: ${q}\nAnswer: ${answers[index] || "No Answer Provided"}${hintCount > 0 ? `\n(NOTE: Candidate used ${hintCount} AI hint(s) for this question)` : ""}`;
    }).join("\n\n");

    const prompt = `
        You are a professional technical interviewer.

        Role: ${role}
        Experience Level: ${experienceLevel}

        Evaluate the candidate's answers based on their experience level.

        CRITICAL INSTRUCTIONS FOR EVALUATION:
        - Some answers may contain raw programming code snippets. 
        - If an answer contains code, you MUST evaluate it for syntax correctness, logical accuracy, time/space complexity, and best practices.
        - Treat pure text answers as theoretical knowledge.
        - Be objective and constructively critical.
        - IMPORTANT: If a candidate used AI hints (noted in the Q&A below), you MUST penalize their technical and overall scores for those specific questions. The more hints used, the higher the penalty.

        Here are the questions and answers:

        ${formattedQA}

        Return ONLY valid JSON in this format:

        {
        "technicalScore": number (0-10),
        "clarityScore": number (0-10),
        "confidenceScore": number (0-10),
        "structureScore": number (0-10),
        "overallScore": number (0-10),
        "strengths": ["point1", "point2"],
        "weaknesses": ["point1", "point2"],
        "improvementPlan": ["step1", "step2"]
        }

        Do NOT add explanations.
        Do NOT use markdown.
        Return pure JSON only.
        `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleaned = response.replace(/```json|```/g, "").trim();
    const evaluation = JSON.parse(cleaned); // Renamed parsed to evaluation for clarity with the new return structure
    return {
      totalScore: evaluation.overallScore,
      evaluation,
    };
  } catch (error) {
    console.error("AI Evaluation Error:", error); // Updated error message
    throw error; // Throws the original error object
  }
};

const generateHint = async (question, currentAnswer, role, experienceLevel) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
        You are a helpful interview assistant for a ${role} position (Experience: ${experienceLevel}).
        The candidate is stuck on the following question:
        "${question}"

        Their current partial answer is:
        "${currentAnswer || "No answer started yet."}"

        Provide a very short, helpful hint (1-2 sentences) to nudge them in the right direction. 
        CRITICAL: Do NOT give away the full answer. Focus on a concept, a logic step, or a potential edge case they might have missed.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Hint Generation Error:", error);
    throw error;
  }
};

module.exports = { generateQuestions, evaluateAnswers, generateHint };