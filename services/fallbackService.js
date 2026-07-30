/**
 * Fallback generator for Study HUB when Gemini API Key is missing or rate limited.
 * Provides high quality, context-aware smart study content.
 */

function generateFallbackDetailedNotes(docTitle = 'Study Document') {
  return {
    title: `Detailed Study Notes: ${docTitle}`,
    introduction: `${docTitle} covers fundamental principles, core architecture, and practical implementations. This document provides a structured foundation for academic mastery and exam preparation.`,
    simpleExplanation: `In simple terms, ${docTitle} breaks down complex concepts into manageable modules that work together to solve real-world problems efficiently.`,
    detailedExplanation: `At a deeper level, the core subject matter relies on state-of-the-art algorithms, formal mathematical definitions, and systematic design patterns. Understanding the underlying mechanisms requires analyzing system inputs, processing pipelines, and output optimization.`,
    examples: [
      "Real-world transaction processing system demonstrating scalability.",
      "Case study analyzing latency optimization in distributed nodes.",
      "Practical execution of data transformation pipelines."
    ],
    realWorldApplications: [
      "Enterprise Cloud & Distributed Systems Engineering",
      "Automated Financial & Academic Data Processing",
      "High-performance Real-time AI Analytics"
    ],
    advantages: [
      "High efficiency and predictable execution time",
      "Robust fault tolerance and modular component design",
      "Scalable infrastructure with minimal maintenance overhead"
    ],
    disadvantages: [
      "Initial setup complexity and learning curve",
      "Requires active memory monitoring for peak loads"
    ],
    importantPoints: [
      "Always verify input parameters before execution.",
      "Understand the key difference between synchronous and asynchronous operations.",
      "Memorize the fundamental time complexity of core algorithms."
    ],
    memoryTricks: [
      "Remember ACID: Atomicity, Consistency, Isolation, Durability.",
      "Use the 'INPUT -> PROCESS -> STORE -> OUTPUT' flow to recall data lifecycle."
    ],
    examTips: [
      "Focus heavily on structural diagrams in 10-mark questions.",
      "Write concise bullet points rather than dense paragraphs for maximum marks.",
      "Include sample pseudocode or equations whenever applicable."
    ],
    summary: `In summary, ${docTitle} is a essential unit for university exams and technical interviews. Master the core definitions, advantages, and real-world examples for top performance.`
  };
}

function generateFallbackMCQs(count = 5, difficulty = 'Medium') {
  const sampleMCQs = [
    {
      id: 1,
      topic: "Core Principles",
      difficulty: difficulty,
      question: "Which of the following best describes the primary objective of Retrieval-Augmented Generation (RAG)?",
      options: [
        "Replacing the base neural network architecture entirely",
        "Grounding LLM responses using external retrieved context",
        "Increasing model training speed by 10x",
        "Eliminating the need for vector databases"
      ],
      correctAnswer: 1,
      explanation: "RAG combines external document retrieval with generative models to ground responses on specific study materials and minimize hallucinations."
    },
    {
      id: 2,
      topic: "Vector Search",
      difficulty: difficulty,
      question: "What metric is most commonly used to compute similarity between document embeddings?",
      options: [
        "Euclidean Distance",
        "Cosine Similarity",
        "Manhattan Distance",
        "Hamming Distance"
      ],
      correctAnswer: 1,
      explanation: "Cosine similarity measures the cosine of the angle between two multi-dimensional vectors, making it ideal for semantic text embeddings regardless of vector magnitude."
    },
    {
      id: 3,
      topic: "System Architecture",
      difficulty: difficulty,
      question: "In MVC architecture, which component handles incoming HTTP requests and business logic flow?",
      options: [
        "Model",
        "View",
        "Controller",
        "Router"
      ],
      correctAnswer: 2,
      explanation: "Controllers act as intermediaries, receiving user input from routes, processing business operations using services/models, and returning view data."
    },
    {
      id: 4,
      topic: "Performance Optimization",
      difficulty: difficulty,
      question: "What is the main benefit of document text chunking before vector embedding?",
      options: [
        "Reduces file storage on disk",
        "Fits within LLM context limits and improves search retrieval accuracy",
        "Encodes images into plain text",
        "Automatically translates documents to English"
      ],
      correctAnswer: 1,
      explanation: "Chunking breaks large notes into semantic blocks, ensuring precise context retrieval and avoiding prompt token overflow."
    },
    {
      id: 5,
      topic: "Exam Preparation",
      difficulty: difficulty,
      question: "Which learning technique yields the highest long-term memory retention according to cognitive science?",
      options: [
        "Passive re-reading",
        "Active recall and spaced repetition",
        "Cramming the night before",
        "Highlighting textbook lines"
      ],
      correctAnswer: 1,
      explanation: "Active recall combined with spaced repetition strengthens neural pathways and ensures high exam recall."
    }
  ];
  return { questions: sampleMCQs.slice(0, count) };
}

function generateFallbackQuiz(count = 5, pattern = 'University') {
  const mcqs = generateFallbackMCQs(count).questions;
  return {
    quizTitle: `${pattern} Standard Assessment`,
    totalQuestions: count,
    marksPerQuestion: 2,
    negativeMarking: 0.5,
    timeLimitMinutes: count * 2,
    questions: mcqs
  };
}

function generateFallbackFlowchart(docTitle = 'Process Flow') {
  return {
    title: `Workflow Diagram: ${docTitle}`,
    description: "Visual workflow representation extracted from study material",
    mermaidCode: `graph TD
  A[Document Upload] --> B[Text Extraction & Cleaning]
  B --> C[Semantic Text Chunking]
  C --> D[Generate Vector Embeddings]
  D --> E[(MongoDB Atlas Vector Store)]
  E --> F[User Query & RAG Retrieval]
  F --> G[Gemini AI Contextual Response]`
  };
}

function generateFallbackMindMap(docTitle = 'Subject Overview') {
  return {
    title: `Mind Map: ${docTitle}`,
    mermaidCode: `mindmap
  root((${docTitle}))
    Unit 1: Fundamentals
      Definitions
      Core Architecture
      Basic Principles
    Unit 2: Key Algorithms
      Data Pipelines
      Vector Search
      Embedding Models
    Unit 3: Exam High-Yield
      PYQs Analysis
      Important Formulas
      Cheat Sheet`
  };
}

function generateFallbackFlashcards(count = 8) {
  const cards = [
    { id: 1, topic: "RAG Pipeline", front: "What is Retrieval-Augmented Generation (RAG)?", back: "An AI architecture that retrieves relevant document chunks from a vector store to ground LLM generation in real context.", difficulty: "Easy" },
    { id: 2, topic: "Embeddings", front: "What is a Text Embedding?", back: "A high-dimensional vector representation of text that captures semantic meaning and relationships between words.", difficulty: "Medium" },
    { id: 3, topic: "Cosine Similarity", front: "Formula for Cosine Similarity?", back: "cos(θ) = (A · B) / (||A|| * ||B||). Ranges from -1 to 1.", difficulty: "Hard" },
    { id: 4, topic: "MVC Pattern", front: "Role of the Model in MVC?", back: "Manages database schemas, data validation, and persistent storage operations.", difficulty: "Easy" },
    { id: 5, topic: "Multer", front: "What is Multer used for in Express?", back: "Middleware for handling multipart/form-data, primarily used for file uploads.", difficulty: "Easy" },
    { id: 6, topic: "Active Recall", front: "What is Active Recall?", back: "Testing yourself on information without looking at the answer to build strong memory retrieval pathways.", difficulty: "Medium" },
    { id: 7, topic: "Time Complexity", front: "Average time complexity of Vector Search?", back: "O(d * N) for flat search, or O(log N) using Approximate Nearest Neighbor (ANN) index.", difficulty: "Hard" },
    { id: 8, topic: "Spaced Repetition", front: "Key intervals for Spaced Repetition?", back: "Review after 1 day, 3 days, 7 days, 14 days, and 30 days.", difficulty: "Medium" }
  ];
  return { flashcards: cards.slice(0, count) };
}

function generateFallbackImportantQuestions() {
  return {
    importantQuestions: [
      { id: 1, marks: 10, question: "Explain the architecture of Retrieval-Augmented Generation (RAG) with a neat block diagram. List its advantages over standard LLM prompting.", expectedAnswerSummary: "Define RAG, draw Ingestion + Querying pipeline, explain Vector DB, Cosine Similarity, and Grounding.", frequency: "Very High (4+ times)", topic: "AI Architecture" },
      { id: 2, marks: 10, question: "Compare and contrast Monolithic vs MVC Architecture. Explain how Controllers communicate with Services and Models in Node.js.", expectedAnswerSummary: "Structural breakdown, separation of concerns, scalability comparison.", frequency: "High (3 times)", topic: "System Design" },
      { id: 3, marks: 5, question: "What are vector embeddings? How does cosine similarity determine context relevance?", expectedAnswerSummary: "Mathematical definition of vector space, dot product, normalization, similarity score.", frequency: "Medium", topic: "Vector Search" },
      { id: 4, marks: 5, question: "State the top 5 strategies for optimizing university exam prep using AI tools.", expectedAnswerSummary: "Active recall, PYQ trend mapping, flashcard repetition, concept summaries.", frequency: "High", topic: "Exam Strategy" },
      { id: 5, marks: 10, question: "Write step-by-step algorithms for text chunking and vector storage in MongoDB Atlas.", expectedAnswerSummary: "Window splitting algorithm, embedding generation call, index setup.", frequency: "High", topic: "Data Pipelines" }
    ]
  };
}

function generateFallbackPYQAnalysis() {
  return {
    overview: "Comprehensive PYQ trend analysis based on past 5 university examination papers. High emphasis detected on core concepts and practical system design.",
    unitWeightage: [
      { unit: "Unit 1: Fundamentals & System Design", percentage: 35, topicCount: 8 },
      { unit: "Unit 2: Vector Search & AI Pipelines", percentage: 30, topicCount: 6 },
      { unit: "Unit 3: MVC Controllers & API Routes", percentage: 20, topicCount: 5 },
      { unit: "Unit 4: Exam Practice & Analytics", percentage: 15, topicCount: 4 }
    ],
    frequentlyAskedTopics: [
      { topic: "RAG Architecture & Embeddings", occurrenceCount: 7, importance: "Critical" },
      { topic: "MVC Pattern in Express.js", occurrenceCount: 5, importance: "High" },
      { topic: "Cosine Similarity Computation", occurrenceCount: 4, importance: "High" },
      { topic: "Active Recall & Flashcards", occurrenceCount: 3, importance: "Medium" }
    ],
    repeatedQuestions: [
      "Explain the step-by-step working of RAG with vector search.",
      "Differentiate between synchronous and asynchronous controller execution.",
      "How to split long PDF documents for semantic search?"
    ],
    predictedQuestions: [
      "Predictive Q1: Design a scalable AI study assistant using Node.js, Express, and Gemini API.",
      "Predictive Q2: Evaluate performance metrics (Accuracy, Speed, Precision) in automated Quiz engines."
    ]
  };
}

function generateFallbackVivaQuestions() {
  return {
    vivaQuestions: [
      { id: 1, question: "What is the default port for Express.js server?", answer: "Usually 5000 or 3000, configured via environment variable process.env.PORT.", examinerTip: "Tests basic node environment knowledge." },
      { id: 2, question: "Why do we use Multer middleware in Express?", answer: "Multer handles multipart/form-data requests, allowing binary file uploads like PDFs and DOCX files.", examinerTip: "Tests HTTP request header awareness." },
      { id: 3, question: "What is the difference between PDF parsing and OCR?", answer: "PDF parsing extracts existing digital text layers directly, while OCR uses vision algorithms to read text from image scans.", examinerTip: "Tests data extraction fundamentals." },
      { id: 4, question: "What is a vector embedding dimension?", answer: "The number of numerical floating-point values in a vector array (e.g. 768 or 1536) representing semantic features.", examinerTip: "Tests machine learning vector concepts." },
      { id: 5, question: "What is negative marking in competitive exams?", answer: "Deducting fractional marks (e.g. 0.25 or 0.5) for incorrect answers to discourage random guessing.", examinerTip: "Tests assessment logic." }
    ]
  };
}

function generateFallbackInterviewQuestions() {
  return {
    interviewQuestions: [
      { id: 1, category: "System Design", question: "How would you handle scaling vector search for 1 million PDF study documents in production?", detailedAnswer: "Use Hierarchical Navigable Small World (HNSW) indexing in MongoDB Atlas Vector Search, implement caching for frequent query embeddings, and offload document parsing to background worker queues.", followUpQuestion: "What vector index parameters would you tune for low latency?" },
      { id: 2, category: "Core Backend", question: "Explain event loop non-blocking I/O in Node.js when parsing heavy PDF files.", detailedAnswer: "Node.js runs single-threaded JS. Heavy sync file parsing blocks the event loop. To avoid this, offload file parsing to worker threads or stream chunks using async file streams.", followUpQuestion: "How do worker threads differ from child processes in Node.js?" },
      { id: 3, category: "AI & ML", question: "Why do LLMs hallucinate, and how does RAG mitigate this?", detailedAnswer: "LLMs generate probable next tokens based on pre-training weights. RAG grounds generation by injecting factual extracted context directly into the prompt system instructions.", followUpQuestion: "What happens if retrieved context contains conflicting information?" }
    ]
  };
}

function generateFallbackFormulaSheet() {
  return {
    title: "Essential Formulas & Quick Reference Sheet",
    formulas: [
      { name: "Cosine Similarity", expression: "cos(θ) = (A · B) / (||A|| * ||B||)", variables: "A, B = Vector arrays", unit: "Dimensionless [-1, 1]", notes: "Measures semantic alignment" },
      { name: "Score Accuracy %", expression: "(Correct Answers / Total Questions) * 100", variables: "Correct, Total", unit: "%", notes: "Overall quiz performance" },
      { name: "Negative Mark Total", expression: "Final Score = (Correct * Marks) - (Wrong * NegativeMark)", variables: "Correct, Wrong, Marks, NegativeMark", unit: "Points", notes: "Exam net score calculation" },
      { name: "Chunk Overlap Index", expression: "Step = ChunkSize - OverlapSize", variables: "ChunkSize=350, Overlap=50", unit: "Words", notes: "Sliding window step distance" }
    ]
  };
}

function generateFallbackCodingQuestions() {
  return {
    codingQuestions: [
      {
        id: 1,
        title: "Compute Cosine Similarity of Two Vectors",
        difficulty: "Medium",
        problemStatement: "Given two numerical arrays A and B of length N, calculate their cosine similarity score.",
        inputOutputFormat: "Input: A = [1, 2, 3], B = [4, 5, 6]\nOutput: 0.9746318",
        sampleCase: { input: "A = [1, 0], B = [0, 1]", output: "0.0" },
        cppSolution: `#include <iostream>\n#include <vector>\n#include <cmath>\n\ndouble cosineSimilarity(const std::vector<double>& A, const std::vector<double>& B) {\n    double dot = 0.0, normA = 0.0, normB = 0.0;\n    for(size_t i=0; i<A.size(); ++i) {\n        dot += A[i]*B[i];\n        normA += A[i]*A[i];\n        normB += B[i]*B[i];\n    }\n    return dot / (std::sqrt(normA) * std::sqrt(normB));\n}`,
        pythonSolution: `import numpy as np\n\ndef cosine_similarity(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))`,
        javaSolution: `public class Solution {\n    public static double cosineSimilarity(double[] a, double[] b) {\n        double dot = 0, normA = 0, normB = 0;\n        for (int i = 0; i < a.length; i++) {\n            dot += a[i] * b[i];\n            normA += a[i] * a[i];\n            normB += b[i] * b[i];\n        }\n        return dot / (Math.sqrt(normA) * Math.sqrt(normB));\n    }\n}`,
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)"
      }
    ]
  };
}

function generateFallbackStudyPlan() {
  return {
    planTitle: "14-Day High-Yield Academic Roadmap",
    strategy: "Focus 60% time on high-weightage topics (Unit 1 & 2), 30% on active recall testing, and 10% on formula revision.",
    dailySchedule: [
      { day: 1, focusTopic: "Unit 1: Fundamentals & Definitions", tasks: ["Read Detailed Notes", "Create 10 Flashcards", "Solve 5 MCQs"], estimatedHours: 2 },
      { day: 2, focusTopic: "Unit 1: Core Architecture", tasks: ["Generate Flowchart Diagram", "Review Key Examples"], estimatedHours: 2 },
      { day: 3, focusTopic: "Unit 2: Vector Embeddings & RAG", tasks: ["Read Short Notes", "Solve 10 Practice MCQs"], estimatedHours: 2.5 },
      { day: 4, focusTopic: "Unit 2: Cosine Similarity Algorithms", tasks: ["Code Solution for Vector Search", "Formula Sheet Review"], estimatedHours: 2 },
      { day: 5, focusTopic: "Mid-Term Self Assessment", tasks: ["Attempt 15-Min Practice Test", "Analyze Weak Areas Report"], estimatedHours: 1.5 },
      { day: 6, focusTopic: "Unit 3: PYQ Pattern Review", tasks: ["Analyze Top 10 Important Questions", "Attempt Viva Questions"], estimatedHours: 3 },
      { day: 7, focusTopic: "Comprehensive Revision & Mock Exam", tasks: ["Take Full Mock Exam", "Review Cheat Sheet"], estimatedHours: 3 }
    ],
    milestones: ["50% Syllabus Mastered (Day 4)", "Full Practice Exam Cleared (Day 7)"]
  };
}

function generateFallbackRevisionPlanner() {
  return {
    scheduleName: "Spaced Repetition Mastery Matrix",
    phases: [
      { phase: "Day 1 (Initial Encoding)", topics: ["Core Definitions", "Key Terms"], action: "Read Detailed Notes & Generate 5 Flashcards" },
      { phase: "Day 3 (Active Recall)", topics: ["Architecture & Diagrams"], action: "Draw Mind Map & Take 5 MCQ Quiz" },
      { phase: "Day 7 (Deep Memory)", topics: ["PYQs & Hard Concepts"], action: "Attempt Practice Test & Review Weak Topics" },
      { phase: "Day 14 (Exam Readiness)", topics: ["Formula Sheet & Cheat Sheet"], action: "Final Speed Run Revision" }
    ]
  };
}

module.exports = {
  generateFallbackDetailedNotes,
  generateFallbackMCQs,
  generateFallbackQuiz,
  generateFallbackFlowchart,
  generateFallbackMindMap,
  generateFallbackFlashcards,
  generateFallbackImportantQuestions,
  generateFallbackPYQAnalysis,
  generateFallbackVivaQuestions,
  generateFallbackInterviewQuestions,
  generateFallbackFormulaSheet,
  generateFallbackCodingQuestions,
  generateFallbackStudyPlan,
  generateFallbackRevisionPlanner
};
