const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuestions = async (role, experienceLevel) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a professional technical interviewer.

Generate 5 technical interview questions for:
Role: ${role}
Experience Level: ${experienceLevel}

Return ONLY valid JSON in this format:
[
  { "question": "Question text here" },
  { "question": "Question text here" }
]

Do NOT add explanations.
Do NOT add markdown.
Only return pure JSON.
`;

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
const evaluateAnswers = async (role, experienceLevel, questions, answers) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const formattedQA = questions.map((q, index) => {
      return `Question: ${q}\nAnswer: ${answers[index] || "No Answer Provided"}`;
    }).join("\n\n");

    const prompt = `
        You are a professional technical interviewer.

        Role: ${role}
        Experience Level: ${experienceLevel}

        Evaluate the candidate's answers.

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
    const parsed = JSON.parse(cleaned);

    return parsed;

  } catch (error) {
    console.error("Evaluation Error:", error.message);
    throw new Error("Failed to evaluate answers");
  }
};

module.exports = { generateQuestions, evaluateAnswers };