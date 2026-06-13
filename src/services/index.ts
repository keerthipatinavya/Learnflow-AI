import * as Types from '../types';

// Helper to simulate API delay
const delay = (ms: number = 600) => new Promise(resolve => setTimeout(resolve, ms));

// BASE CONFIG for future API integration
const API_BASE_URL = 'http://localhost:8000'; // Target FastAPI endpoint

class AuthService {
  async login(email: string, password: string): Promise<Types.APIResponse<Types.User>> {
    await delay(800);
    if (!email.includes('@')) {
      return {
        success: false,
        data: null as any,
        error: { code: 'INVALID_CREDENTIALS', details: 'Please enter a valid email address.' }
      };
    }
    return {
      success: true,
      data: {
        id: 'usr_98231',
        name: 'Alex Mercer',
        email,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        streakDays: 14,
        totalXP: 2450,
        joinedDate: '2026-01-10',
        level: 4,
        learningTimeMinutes: 480
      }
    };
  }

  async register(name: string, email: string): Promise<Types.APIResponse<Types.User>> {
    await delay(900);
    return {
      success: true,
      data: {
        id: 'usr_98232',
        name,
        email,
        streakDays: 1,
        totalXP: 50,
        joinedDate: new Date().toISOString().split('T')[0],
        level: 1,
        learningTimeMinutes: 0
      }
    };
  }
}

class UploadService {
  private uploads: Types.Upload[] = [
    {
      id: 'upl_1',
      title: 'Attention Is All You Need.pdf',
      type: 'pdf',
      source: 'attention_paper.pdf',
      status: 'completed',
      progress: 100,
      createdAt: '2026-06-12 14:00',
      fileSize: '2.4 MB'
    },
    {
      id: 'upl_2',
      title: 'Neural Networks Basics - YouTube',
      type: 'youtube',
      source: 'https://youtube.com/watch?v=aircAruvnKk',
      status: 'completed',
      progress: 100,
      createdAt: '2026-06-13 10:15',
      fileSize: 'N/A'
    }
  ];

  async getUploadHistory(): Promise<Types.APIResponse<Types.Upload[]>> {
    await delay();
    return { success: true, data: this.uploads };
  }

  async uploadFile(fileUri: string, type: 'pdf' | 'url' | 'youtube'): Promise<Types.APIResponse<Types.Upload>> {
    await delay(1200);
    const newUpload: Types.Upload = {
      id: `upl_${Date.now()}`,
      title: fileUri.split('/').pop() || 'New Uploaded Source',
      type,
      source: fileUri,
      status: 'processing',
      progress: 45,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.uploads.unshift(newUpload);
    return { success: true, data: newUpload };
  }
}

class LessonService {
  private mockCourses: Types.Course[] = [
    {
      id: 'crs_1',
      title: 'Transformers & LLM Foundations',
      description: 'Master self-attention mechanism, multi-head attention, and transformer architecture from the original research paper.',
      sourceType: 'pdf',
      thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300',
      progress: 65,
      chaptersCount: 4,
      completedChapters: 2,
      difficulty: 'advanced',
      createdAt: '2026-06-11'
    },
    {
      id: 'crs_2',
      title: 'Introduction to Neural Networks',
      description: 'Understanding neurons, weights, activation functions, backpropagation, and gradient descent.',
      sourceType: 'youtube',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=300',
      progress: 100,
      chaptersCount: 3,
      completedChapters: 3,
      difficulty: 'beginner',
      createdAt: '2026-06-12'
    },
    {
      id: 'crs_3',
      title: 'Prompt Engineering Techniques',
      description: 'Practical guide to Few-Shot, Chain-of-Thought, and ReAct prompting paradigms.',
      sourceType: 'url',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300',
      progress: 12,
      chaptersCount: 5,
      completedChapters: 0,
      difficulty: 'intermediate',
      createdAt: '2026-06-13'
    }
  ];

  async getCourses(): Promise<Types.APIResponse<Types.Course[]>> {
    await delay(700);
    return { success: true, data: this.mockCourses };
  }

  async getCourseById(courseId: string): Promise<Types.APIResponse<Types.Course>> {
    await delay();
    const course = this.mockCourses.find(c => c.id === courseId);
    if (!course) return { success: false, data: null as any, error: { code: 'NOT_FOUND', details: 'Course not found.' } };
    return { success: true, data: course };
  }

  async getChapters(courseId: string): Promise<Types.APIResponse<Types.Chapter[]>> {
    await delay();
    return {
      success: true,
      data: [
        {
          id: 'ch_1',
          courseId,
          title: '1. The Paradigm Shift',
          description: 'Limitations of Recurrent Networks and the advent of Parallel Processing.',
          order: 1,
          isCompleted: true,
          durationMinutes: 15,
          lessons: [
            {
              id: 'les_1',
              chapterId: 'ch_1',
              title: 'RNNs vs. Transformers',
              content: `### The Sequential Bottleneck\nTraditional Recurrent Neural Networks (RNNs) and Long Short-Term Memory networks (LSTMs) process sequences token-by-token. This sequential nature limits parallelization, which makes it extremely slow to train on huge datasets.\n\n### Self-Attention to the Rescue\nTransformers bypass recurrence entirely using **Self-Attention**. Every token attends to every other token in the sequence simultaneously, allowing massive parallel processing across GPU cores.`,
              summary: 'RNNs are limited by sequential training constraints. Transformers solve this via parallel Self-Attention.',
              keyPoints: ['Sequential compute is O(n)', 'Self-attention is O(1) in path lengths', 'Allows full GPU utilization'],
              durationMinutes: 7,
              isCompleted: true
            }
          ]
        },
        {
          id: 'ch_2',
          courseId,
          title: '2. Scaled Dot-Product Attention',
          description: 'Deep dive into Queries, Keys, and Values vector interactions.',
          order: 2,
          isCompleted: true,
          durationMinutes: 25,
          lessons: [
            {
              id: 'les_2',
              chapterId: 'ch_2',
              title: 'Attention Formula Demystified',
              content: `### The Formula\n$$Attention(Q, K, V) = softmax(\\frac{QK^T}{\\sqrt{d_k}})V$$\n\n### Core Vectors\n- **Query (Q)**: What we are searching for.\n- **Key (K)**: Information descriptor mapping to Queries.\n- **Value (V)**: The actual content returned once we match Query with Key.\n\n### Scaling Factor\nDividing by $\\sqrt{d_k}$ prevents the dot products from growing excessively large in high dimensions, which would push the softmax function into regions with extremely small gradients.`,
              summary: 'Attention scores are computed as the scaled similarity between queries and keys, normalized via softmax to scale the values.',
              keyPoints: ['Queries, Keys, and Values mapping', 'Softmax normalization', 'The role of the sqrt(d_k) scaling factor'],
              durationMinutes: 12,
              isCompleted: true,
              diagramUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'
            }
          ]
        },
        {
          id: 'ch_3',
          courseId,
          title: '3. Multi-Head Attention Layout',
          description: 'Splitting embeddings into multiple spaces for richer representations.',
          order: 3,
          isCompleted: false,
          durationMinutes: 20,
          lessons: [
            {
              id: 'les_3',
              chapterId: 'ch_3',
              title: 'Parallel Attention Subspaces',
              content: `### Why Multiple Heads?\nInstead of performing a single attention function with the full-dimensional query, key, and value vectors, it is beneficial to linearly project the queries, keys, and values $h$ times with different, learned linear projections.\n\nThis allows the model to jointly attend to information from different representation subspaces at different positions.`,
              summary: 'Multi-head attention projects inputs into different namespaces to capture diverse structural relationships.',
              keyPoints: ['Parallel representation spaces', 'Concatenation & linear projection', 'Capturing syntax and semantic relations'],
              durationMinutes: 10,
              isCompleted: false
            }
          ]
        }
      ]
    };
  }
}

class TutorService {
  private chatHistory: Record<string, Types.ChatMessage[]> = {
    'crs_1': [
      {
        id: 'msg_1',
        sender: 'ai',
        text: 'Hi there! I am your AI Study Companion for Transformers. Ask me anything about Query/Key matrices, Positional Encodings, or the Softmax scale factor!',
        timestamp: '10:00'
      }
    ]
  };

  async getChatHistory(courseId: string): Promise<Types.APIResponse<Types.ChatMessage[]>> {
    await delay();
    return { success: true, data: this.chatHistory[courseId] || [] };
  }

  async sendChatMessage(courseId: string, messageText: string): Promise<Types.APIResponse<Types.ChatMessage>> {
    await delay(1000);
    if (!this.chatHistory[courseId]) {
      this.chatHistory[courseId] = [];
    }

    const userMsg: Types.ChatMessage = {
      id: `msg_${Date.now()}_usr`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.chatHistory[courseId].push(userMsg);

    // AI response simulation logic
    let aiResponseText = `That's a great question! Regarding "${messageText}", the self-attention layer allows the model to compute representations by looking at other words in the input sentence. Is there a specific formula you want to explore?`;
    let citations: Types.ChatMessage['citations'] = undefined;

    if (messageText.toLowerCase().includes('scale') || messageText.toLowerCase().includes('softmax')) {
      aiResponseText = `We divide the dot-product $QK^T$ by the scaling factor $\\sqrt{d_k}$ (the dimension of keys) to prevent the softmax function from saturating. If dot products get too large, softmax gradients become extremely small, leading to the vanishing gradient problem during training.`;
      citations = [{ text: 'Section 3.2.1: Scaled Dot-Product Attention', source: 'Attention Is All You Need (PDF)', pageNumber: 4 }];
    } else if (messageText.toLowerCase().includes('key') || messageText.toLowerCase().includes('query')) {
      aiResponseText = `In self-attention, the Query (Q), Key (K), and Value (V) matrices are projections of the input sequence. You multiply Q and K transpose to find similarity weights, normalize them with softmax, and then multiply by V to construct the final representations.`;
      citations = [{ text: 'Section 3.2: Attention Matrices Overview', source: 'Attention Is All You Need (PDF)', pageNumber: 3 }];
    }

    const aiMsg: Types.ChatMessage = {
      id: `msg_${Date.now()}_ai`,
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations
    };
    this.chatHistory[courseId].push(aiMsg);

    return { success: true, data: aiMsg };
  }
}

class FlashcardService {
  private mockCards: Record<string, Types.Flashcard[]> = {
    'crs_1': [
      {
        id: 'fc_1',
        courseId: 'crs_1',
        front: 'What is the purpose of the scaling factor in Scaled Dot-Product Attention?',
        back: 'To prevent the dot products of Q and K from growing too large in high dimensions, which would cause the softmax function to saturate and return extremely small gradients.',
        box: 1
      },
      {
        id: 'fc_2',
        courseId: 'crs_1',
        front: 'Why are Positional Encodings added to input embeddings in Transformers?',
        back: 'Since transformers process all tokens in parallel and contain no recurrence or convolution, positional encodings are added to inject information about the order/position of words in the sequence.',
        box: 3
      },
      {
        id: 'fc_3',
        courseId: 'crs_1',
        front: 'What is the time complexity of a self-attention layer per token relative to sequence length n?',
        back: 'O(n^2), because each of the n tokens must calculate a similarity score with all other n tokens in the sequence.',
        box: 2
      }
    ]
  };

  async getFlashcards(courseId: string): Promise<Types.APIResponse<Types.Flashcard[]>> {
    await delay();
    return { success: true, data: this.mockCards[courseId] || [] };
  }

  async updateBox(cardId: string, courseId: string, score: 'correct' | 'incorrect'): Promise<Types.APIResponse<Types.Flashcard>> {
    await delay(200);
    const card = this.mockCards[courseId]?.find(fc => fc.id === cardId);
    if (!card) return { success: false, data: null as any, error: { code: 'NOT_FOUND' } };
    
    if (score === 'correct') {
      card.box = Math.min(5, card.box + 1);
    } else {
      card.box = 1;
    }
    return { success: true, data: card };
  }
}

class QuizService {
  private mockQuizzes: Record<string, Types.Quiz> = {
    'crs_1': {
      id: 'qz_1',
      courseId: 'crs_1',
      title: 'Attention Mechanism Quick Assessment',
      totalXP: 100,
      timeLimitSeconds: 120,
      questions: [
        {
          id: 'q_1',
          questionText: 'Which mathematical operation is used to calculate the raw similarity scores between Queries (Q) and Keys (K)?',
          options: [
            'Matrix Addition',
            'Dot Product / Matrix Multiplication',
            'Element-wise Division',
            'Cross Product'
          ],
          correctAnswerIndex: 1,
          explanation: 'Attention scores are calculated by taking the dot product of the query with all keys (Q * K^T), reflecting how aligned they are.'
        },
        {
          id: 'q_2',
          questionText: 'What is the standard activation function applied immediately after calculating the scaled dot product?',
          options: [
            'ReLU',
            'GELU',
            'Softmax',
            'Sigmoid'
          ],
          correctAnswerIndex: 2,
          explanation: 'The Softmax function is applied to convert raw attention similarity scores into a probability distribution that sums to 1.'
        },
        {
          id: 'q_3',
          questionText: 'The original Transformer model uses how many attention heads in its Multi-Head Attention layer?',
          options: [
            '4 heads',
            '8 heads',
            '12 heads',
            '16 heads'
          ],
          correctAnswerIndex: 1,
          explanation: 'The standard transformer model detailed in the research paper employs h = 8 parallel attention heads.'
        }
      ]
    }
  };

  async getQuiz(courseId: string): Promise<Types.APIResponse<Types.Quiz>> {
    await delay();
    return { success: true, data: this.mockQuizzes[courseId] };
  }

  async submitQuiz(quizId: string, answers: Record<string, number>): Promise<Types.APIResponse<{ score: number; xpEarned: number }>> {
    await delay(800);
    // Find quiz
    let quiz: Types.Quiz | undefined;
    for (const key in this.mockQuizzes) {
      if (this.mockQuizzes[key].id === quizId) {
        quiz = this.mockQuizzes[key];
        break;
      }
    }
    if (!quiz) return { success: false, data: null as any, error: { code: 'NOT_FOUND' } };

    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const xpEarned = Math.round((correctCount / quiz.questions.length) * quiz.totalXP);

    return {
      success: true,
      data: { score, xpEarned }
    };
  }
}

class PracticeTestService {
  async getPracticeTest(courseId: string): Promise<Types.APIResponse<Types.PracticeTest>> {
    await delay(800);
    return {
      success: true,
      data: {
        id: 'tst_1',
        courseId,
        title: 'Transformers Architecture Benchmark Exam',
        durationMinutes: 10,
        isSubmitted: false,
        questions: [
          {
            id: 'tq_1',
            questionText: 'Why is the Multi-Head Attention mechanism structurally superior to a single self-attention head?',
            options: [
              'It uses fewer parameter computations',
              'It allows the model to attend to information from different representation subspaces simultaneously',
              'It removes the need for residual connections',
              'It bypasses the O(n^2) sequence constraint'
            ],
            correctAnswerIndex: 1,
            explanation: 'Multi-head attention projects Q, K, and V into smaller dimensions multiple times, letting different heads capture syntax, semantics, and context in parallel.'
          },
          {
            id: 'tq_2',
            questionText: 'What is the activation function used in the feed-forward sub-layers of the original Transformer?',
            options: [
              'ReLU',
              'LeakyReLU',
              'GeLU',
              'Tanh'
            ],
            correctAnswerIndex: 0,
            explanation: 'The paper details applying a ReLU activation inside the two linear transformations of the FFN sub-layers.'
          }
        ]
      }
    };
  }
}

class ProgressService {
  private progressStats: Types.Progress = {
    user: {
      id: 'usr_98231',
      name: 'Alex Mercer',
      email: 'alex@learnflow.ai',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      streakDays: 14,
      totalXP: 2450,
      joinedDate: '2026-01-10',
      level: 4,
      learningTimeMinutes: 480
    },
    dailyStreak: 14,
    weeklyTargetMinutes: 120,
    weeklyCompletedMinutes: 84,
    subjectPerformance: [
      { subject: 'Attention Q/K/V', score: 85 },
      { subject: 'Positional Encoding', score: 72 },
      { subject: 'Normalization Layers', score: 94 },
      { subject: 'Optimizers & Scaling', score: 60 }
    ],
    weakAreas: ['Optimizers & Scaling', 'Decoder Self-Attention Masks'],
    strongAreas: ['Self-Attention Dot Products', 'Layer Normalization'],
    history: [
      { day: 'Mon', minutes: 15, xp: 120 },
      { day: 'Tue', minutes: 25, xp: 180 },
      { day: 'Wed', minutes: 10, xp: 75 },
      { day: 'Thu', minutes: 20, xp: 150 },
      { day: 'Fri', minutes: 14, xp: 90 },
      { day: 'Sat', minutes: 0, xp: 0 },
      { day: 'Sun', minutes: 0, xp: 0 }
    ]
  };

  private achievements: Types.Achievement[] = [
    {
      id: 'ac_1',
      title: 'Curiosity Spark',
      description: 'Upload your first educational content (PDF/URL).',
      badgeCode: 'first-upload',
      isUnlocked: true,
      unlockedAt: '2026-06-11',
      iconName: 'cloud-upload-outline',
      xpReward: 100
    },
    {
      id: 'ac_2',
      title: 'Consistency King',
      description: 'Achieve a 14-day study streak.',
      badgeCode: 'streak-14',
      isUnlocked: true,
      unlockedAt: '2026-06-13',
      iconName: 'fire-outline',
      xpReward: 300
    },
    {
      id: 'ac_3',
      title: 'Attention Maestro',
      description: 'Scored 100% on the Transformers Core Quiz.',
      badgeCode: 'perfect-quiz',
      isUnlocked: false,
      iconName: 'trophy-outline',
      xpReward: 200
    }
  ];

  async getProgress(): Promise<Types.APIResponse<Types.Progress>> {
    await delay(700);
    return { success: true, data: this.progressStats };
  }

  async getAchievements(): Promise<Types.APIResponse<Types.Achievement[]>> {
    await delay();
    return { success: true, data: this.achievements };
  }
}

class VoiceService {
  async startSession(courseId: string): Promise<Types.APIResponse<Types.VoiceSession>> {
    await delay(900);
    return {
      success: true,
      data: {
        sessionId: `vse_${Date.now()}`,
        status: 'speaking',
        durationSeconds: 0,
        aiTranscript: "Hello Alex! I am your interactive AI speech tutor. We are discussing Transformers. I can hear you clearly. What specific aspect of the encoder layer shall we review?"
      }
    };
  }

  async sendVoiceAudio(sessionId: string, durationSec: number): Promise<Types.APIResponse<Types.VoiceSession>> {
    await delay(1200);
    return {
      success: true,
      data: {
        sessionId,
        status: 'speaking',
        durationSeconds: durationSec + 5,
        userTranscript: "Explain positional encodings again.",
        aiTranscript: "Got it. Positional encodings are vectors added to input token embeddings. Because Transformers process everything in parallel, they have no built-in sense of order. The encoding vectors contain sinusoidal waves of varying frequencies, allowing the network to distinguish positions."
      }
    };
  }
}

class SettingsService {
  async updateLanguage(languageCode: string): Promise<Types.APIResponse<{ language: string }>> {
    await delay(300);
    return { success: true, data: { language: languageCode } };
  }

  async getOfflineContent(): Promise<Types.APIResponse<Types.Course[]>> {
    await delay(500);
    return {
      success: true,
      data: [
        {
          id: 'crs_1',
          title: 'Transformers & LLM Foundations (Offline)',
          description: 'Master self-attention mechanism, multi-head attention, and transformer architecture offline.',
          sourceType: 'pdf',
          progress: 65,
          chaptersCount: 4,
          completedChapters: 2,
          difficulty: 'advanced',
          createdAt: '2026-06-11'
        }
      ]
    };
  }
}

export const Auth = new AuthService();
export const Upload = new UploadService();
export const Lesson = new LessonService();
export const Tutor = new TutorService();
export const Flashcard = new FlashcardService();
export const Quiz = new QuizService();
export const PracticeTest = new PracticeTestService();
export const Progress = new ProgressService();
export const Voice = new VoiceService();
export const Settings = new SettingsService();
