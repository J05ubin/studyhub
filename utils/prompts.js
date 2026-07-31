/**
 * Prompt generators for 20 AI toolkit modules in Study HUB
 */

const RAG_SYSTEM_INSTRUCTION = `You are Study HUB, an elite academic AI tutor. 
CRITICAL RULE: Base your responses STRICTLY on the provided Document Context extracted from the student's study materials. 
If the context is incomplete or lacks specific detail, use reasonable academic knowledge consistent with the document, but explicitly prioritize the document context.
Respond with clarity, professional formatting, structured JSON or clean Markdown as requested. Do not include markdown code block backticks if JSON output is requested unless instructed.`;

const PROMPTS = {
  detailedNotes: (context) => `
${RAG_SYSTEM_INSTRUCTION}

Generate comprehensive detailed study notes from the context below. 

Format your response as a valid JSON object matching this structure:
{
  "title": "Title of the Notes",
  "introduction": "Comprehensive introduction",
  "simpleExplanation": "Simple plain-English explanation",
  "detailedExplanation": "In-depth technical/academic explanation",
  "examples": ["Example 1", "Example 2", "Example 3"],
  "realWorldApplications": ["Application 1", "Application 2"],
  "advantages": ["Advantage 1", "Advantage 2"],
  "disadvantages": ["Disadvantage 1", "Disadvantage 2"],
  "importantPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "memoryTricks": ["Mnemonics or memory tricks to remember key ideas"],
  "examTips": ["Crucial tips for answering exam questions on this topic"],
  "summary": "Concise concluding summary"
}

Document Context:
${context}`,

  shortNotes: (context) => `
${RAG_SYSTEM_INSTRUCTION}

Generate concise, high-yield Short Notes from the context below. Group by core topics using clear markdown headings, bullet points, key equations/terms, and bold takeaways.

Document Context:
${context}`,

  smartSummary: (context) => `
${RAG_SYSTEM_INSTRUCTION}

Provide an executive Smart Summary of the document context below:
1. Executive Overview (3 sentences)
2. Core Takeaways (5 Bullet Points)
3. Essential Concepts Matrix
4. Key Definitions & Terminology

Document Context:
${context}`,

  mcqGenerator: (context, { count = 5, difficulty = 'Medium', source = 'Notes' }) => `
${RAG_SYSTEM_INSTRUCTION}

Generate ${count} Multiple Choice Questions (MCQs) based on the context.
Difficulty Level: ${difficulty}
Target Source Focus: ${source}

Return ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "id": 1,
      "topic": "Topic Name",
      "difficulty": "${difficulty}",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed step-by-step explanation of why this answer is correct..."
    }
  ]
}

Document Context:
${context}`,

  quizGenerator: (context, { count = 5, difficulty = 'Medium', questionType = 'MCQ', marksPerQuestion = 1, negativeMarking = 0, timeLimit = 10, pattern = 'University' }) => `
${RAG_SYSTEM_INSTRUCTION}

Generate a custom academic quiz based on the context.
Config: ${count} questions, Difficulty: ${difficulty}, Pattern: ${pattern}, Question Type: ${questionType}.

Return ONLY valid JSON matching this schema:
{
  "quizTitle": "${pattern} Exam Quiz",
  "totalQuestions": ${count},
  "marksPerQuestion": ${marksPerQuestion},
  "negativeMarking": ${negativeMarking},
  "timeLimitMinutes": ${timeLimit},
  "questions": [
    {
      "id": 1,
      "topic": "Concept Title",
      "type": "MCQ",
      "question": "Clear, challenging question statement",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Thorough explanation with formulas or principles"
    }
  ]
}

Document Context:
${context}`,

  practiceTest: (context, { count = 10, difficulty = 'Mixed', pattern = 'University', marksPerQuestion = 2, negativeMarking = 0.5, timeLimit = 15 }) => `
${RAG_SYSTEM_INSTRUCTION}

Create a full formal Practice Test for ${pattern} pattern. Total ${count} questions, Difficulty: ${difficulty}.
Marks per question: ${marksPerQuestion}, Negative marking: ${negativeMarking}, Time limit: ${timeLimit} minutes.

Return ONLY valid JSON:
{
  "testTitle": "Practice Exam - ${pattern}",
  "instructions": ["Read each question carefully", "Single choice questions"],
  "totalQuestions": ${count},
  "marksPerQuestion": ${marksPerQuestion},
  "negativeMarking": ${negativeMarking},
  "timeLimitMinutes": ${timeLimit},
  "questions": [
    {
      "id": 1,
      "section": "Core Section",
      "topic": "Topic Name",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 1,
      "explanation": "Detailed explanation..."
    }
  ]
}

Document Context:
${context}`,

  flowchartGenerator: (context) => `
${RAG_SYSTEM_INSTRUCTION}

Generate a clean, syntactically valid Mermaid.js flowchart code representing the main processes, workflows, or step-by-step logic in the document.

Return ONLY valid JSON in this exact structure:
{
  "title": "Flowchart Title",
  "description": "Short explanation of the workflow",
  "mermaidCode": "graph TD\\n  A[Start] --> B[Process Step 1]\\n  B --> C{Decision Point}\\n  C -- Yes --> D[Result 1]\\n  C -- No --> E[Result 2]"
}

Important: Ensure the mermaidCode uses valid graph TD syntax with quotes around nodes containing special characters.

Document Context:
${context}`,

  mindmapGenerator: (context) => `
${RAG_SYSTEM_INSTRUCTION}

Generate a clear Mermaid.js mindmap diagram representing chapter hierarchy, core sub-topics, and definitions.

Return ONLY valid JSON:
{
  "title": "Chapter Mind Map",
  "mermaidCode": "mindmap\\n  root((Main Subject))\\n    Chapter 1\\n      Topic A\\n      Topic B\\n    Chapter 2\\n      Topic C\\n      Topic D"
}

Document Context:
${context}`,

  flashcards: (context, count = 8) => `
${RAG_SYSTEM_INSTRUCTION}

Generate ${count} high-impact study flashcards based on the context.

Return ONLY valid JSON:
{
  "flashcards": [
    {
      "id": 1,
      "topic": "Topic Name",
      "front": "Front of card (Question / Term / Concept)",
      "back": "Back of card (Concise Answer / Key Definition / Explanation)",
      "difficulty": "Easy"
    }
  ]
}

Document Context:
${context}`,

  importantQuestions: (context) => `
${RAG_SYSTEM_INSTRUCTION}

Identify the top 10 Most Important Questions likely to appear in university or competitive exams from the context below. 

Return ONLY valid JSON:
{
  "importantQuestions": [
    {
      "id": 1,
      "marks": 10,
      "question": "Detailed exam question text",
      "expectedAnswerSummary": "Outline of key points expected in the answer",
      "frequency": "Frequently Asked (Repeated 4+ times)",
      "topic": "Topic Name"
    }
  ]
}

Document Context:
${context}`,

  vivaQuestions: (context) => `
${RAG_SYSTEM_INSTRUCTION}

Generate 10 rapid-fire Viva Voce questions with ideal oral answers for lab/oral examinations.

Return ONLY valid JSON:
{
  "vivaQuestions": [
    {
      "id": 1,
      "question": "Direct viva question asked by examiner",
      "answer": "Ideal concise verbal response (2-3 sentences)",
      "examinerTip": "What the examiner is testing here"
    }
  ]
}

Document Context:
${context}`,

  interviewQuestions: (context) => `
${RAG_SYSTEM_INSTRUCTION}

Generate 8 Technical Interview questions (ranging from conceptual fundamentals to scenario questions) derived from the study document.

Return ONLY valid JSON:
{
  "interviewQuestions": [
    {
      "id": 1,
      "category": "Core Concept / System Design / Scenario",
      "question": "Challenging technical interview question",
      "detailedAnswer": "Structured STAR method or technical answer breakdown",
      "followUpQuestion": "Potential follow-up question by interviewer"
    }
  ]
}

Document Context:
${context}`
};

module.exports = { RAG_SYSTEM_INSTRUCTION, PROMPTS };
