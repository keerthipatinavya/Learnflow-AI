import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  Modal
} from 'react-native';
import { Button, TextInput, Avatar as PaperAvatar, IconButton, SegmentedButtons, ProgressBar } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme';
import { RootStackParamList } from '../navigation';
import * as Services from '../services';
import * as Types from '../types';
import {
  GlassCard,
  GradientButton,
  AvatarTeacher,
  AITutorWidget,
  UploadWidget,
  CourseCard,
  LessonCard,
  ProgressCard,
  AnalyticsCard,
  StatisticCard,
  Flashcard,
  QuizCard,
  AchievementBadge,
  EmptyState,
  ErrorState,
  LoadingState,
  SkeletonLoader,
  AppHeader,
  SearchBar,
  ProgressRing,
  ChartWidgets
} from '../components';

const { width, height } = Dimensions.get('window');

type NavProp = StackNavigationProp<RootStackParamList>;

// 1. Splash Screen
export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, styles.center, { backgroundColor: COLORS.background }]}>
      <MaterialCommunityIcons name="brain" size={80} color={COLORS.primary} />
      <Text style={[TYPOGRAPHY.display, { color: COLORS.text, marginTop: SPACING.md }]}>LearnFlow</Text>
      <Text style={[TYPOGRAPHY.body, { color: COLORS.accent, letterSpacing: 2, marginTop: 4 }]}>
        YOUR PERSONAL AI TEACHER
      </Text>
      <View style={styles.splashLoading}>
        <LoadingState label="Igniting synapses..." />
      </View>
    </View>
  );
};

// 2. Onboarding Screen (3-step carousel mockup)
export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [step, setStep] = useState(0);

  const onboardingData = [
    {
      title: 'Transform Any Content',
      desc: 'Upload PDFs, YouTube links, or websites and watch the AI distill them into high-impact courses, lessons, and tests instantly.',
      icon: 'cloud-upload-outline'
    },
    {
      title: 'Study With Your AI Teacher',
      desc: 'Access a real-time conversational voice avatar or text tutor that answers queries and walks you through complex equations step-by-step.',
      icon: 'robot'
    },
    {
      title: 'Learn Anywhere, Offline',
      desc: 'Take your lessons, flashcards, and quizzes offline. All progress syncs automatically once you re-establish an internet connection.',
      icon: 'wifi-off'
    }
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      navigation.replace('Auth');
    }
  };

  return (
    <View style={[styles.container, { padding: SPACING.lg, justifyContent: 'space-between' }]}>
      <View style={{ alignSelf: 'flex-end', marginTop: 24 }}>
        <TouchableOpacity onPress={() => navigation.replace('Auth')}>
          <Text style={{ color: COLORS.textSecondary, fontWeight: '700' }}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.center}>
        <MaterialCommunityIcons name={onboardingData[step].icon as any} size={100} color={COLORS.accent} />
        <Text style={[TYPOGRAPHY.h1, { color: COLORS.text, textAlign: 'center', marginTop: SPACING.xl }]}>
          {onboardingData[step].title}
        </Text>
        <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.md }]}>
          {onboardingData[step].desc}
        </Text>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.dotRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === step ? COLORS.accent : COLORS.border }]} />
          ))}
        </View>
        <GradientButton
          title={step === 2 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={{ width: 140 }}
        />
      </View>
    </View>
  );
};

// 3. Auth Screen (Login & Register toggle)
export const AuthScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const res = await Services.Auth.login(email, password);
        if (res.success) {
          navigation.replace('MainTabs');
        } else {
          setError(res.error?.details || 'Login failed');
        }
      } else {
        const res = await Services.Auth.register(name, email);
        if (res.success) {
          navigation.replace('MainTabs');
        } else {
          setError('Signup failed');
        }
      }
    } catch (err) {
      setError('Network connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { padding: SPACING.lg, justifyContent: 'center' }]}>
      <View style={[styles.center, { marginBottom: SPACING.xl }]}>
        <MaterialCommunityIcons name="brain" size={60} color={COLORS.primary} />
        <Text style={[TYPOGRAPHY.display, { color: COLORS.text, fontSize: 32 }]}>LearnFlow</Text>
        <Text style={{ color: COLORS.textSecondary }}>Access your AI learning brain</Text>
      </View>

      <GlassCard style={{ padding: SPACING.lg }}>
        <Text style={[TYPOGRAPHY.h2, { color: COLORS.text, marginBottom: SPACING.md }]}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {!isLogin && (
          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            activeOutlineColor={COLORS.primary}
            style={styles.authInput}
          />
        )}

        <TextInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          activeOutlineColor={COLORS.primary}
          style={styles.authInput}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          activeOutlineColor={COLORS.primary}
          style={styles.authInput}
        />

        <GradientButton
          title={isLogin ? 'Log In' : 'Sign Up'}
          onPress={handleSubmit}
          loading={loading}
          style={{ marginTop: SPACING.md }}
        />

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          style={{ alignSelf: 'center', marginTop: SPACING.lg }}
        >
          <Text style={{ color: COLORS.accent, fontSize: 13 }}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </Text>
        </TouchableOpacity>
      </GlassCard>
    </ScrollView>
  );
};

// 4. Home Dashboard Screen
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [courses, setCourses] = useState<Types.Course[]>([]);
  const [progress, setProgress] = useState<Types.Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const crsRes = await Services.Lesson.getCourses();
      const prgRes = await Services.Progress.getProgress();
      if (crsRes.success) setCourses(crsRes.data);
      if (prgRes.success) setProgress(prgRes.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleUpload = async (type: 'pdf' | 'url' | 'youtube') => {
    setIsUploading(true);
    setUploadProgress(10);
    // Simulate upload stages
    const timer1 = setTimeout(() => setUploadProgress(40), 400);
    const timer2 = setTimeout(() => setUploadProgress(85), 800);
    const timer3 = setTimeout(async () => {
      await Services.Upload.uploadFile('attention_paper.pdf', type);
      setIsUploading(false);
      loadDashboard();
    }, 1200);
  };

  if (loading) return <LoadingState label="Synching courses..." />;

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={{ paddingBottom: 80 }}>
      <AppHeader
        title="LearnFlow Dashboard"
        rightAction={<IconButton icon="bell-outline" iconColor={COLORS.text} onPress={() => navigation.navigate('Notifications')} />}
      />

      <View style={{ padding: SPACING.md }}>
        {/* Welcome card */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={[TYPOGRAPHY.h1, { color: COLORS.text }]}>Hi, Alex!</Text>
            <Text style={{ color: COLORS.textSecondary }}>Ready for your daily AI study session?</Text>
          </View>
          <PaperAvatar.Image size={44} source={{ uri: progress?.user.avatarUrl }} />
        </View>

        {/* Streak card */}
        {progress && (
          <ProgressCard
            streak={progress.dailyStreak}
            weeklyTarget={progress.weeklyTargetMinutes}
            weeklyCompleted={progress.weeklyCompletedMinutes}
          />
        )}

        {/* Upload hub widget */}
        <View style={{ marginVertical: SPACING.md }}>
          <UploadWidget
            onUploadSelect={handleUpload}
            isUploading={isUploading}
            progress={uploadProgress}
          />
        </View>

        {/* Shortcut Quick Panel */}
        <Text style={[TYPOGRAPHY.h3, { color: COLORS.text, marginBottom: SPACING.sm }]}>Quick Access</Text>
        <View style={styles.quickPanel}>
          <TouchableOpacity onPress={() => navigation.navigate('AvatarTeacherScreen', { courseId: 'crs_1' })} style={styles.quickAccessItem}>
            <MaterialCommunityIcons name="microphone" size={24} color={COLORS.primary} />
            <Text style={styles.quickLabel}>Voice AI</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Quiz', { courseId: 'crs_1' })} style={styles.quickAccessItem}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={COLORS.accent} />
            <Text style={styles.quickLabel}>Quizzes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('GeneratedCourse', { courseId: 'crs_1' })} style={styles.quickAccessItem}>
            <MaterialCommunityIcons name="notebook" size={24} color={COLORS.secondary} />
            <Text style={styles.quickLabel}>Flashcards</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Learning list */}
        <Text style={[TYPOGRAPHY.h3, { color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm }]}>
          Continue Learning
        </Text>
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={() => navigation.navigate('GeneratedCourse', { courseId: course.id })}
          />
        ))}
      </View>
    </ScrollView>
  );
};

// 5. Courses List / Directory Screen
export const CoursesScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [courses, setCourses] = useState<Types.Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await Services.Lesson.getCourses();
      if (res.success) setCourses(res.data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.mainContainer}>
      <AppHeader title="Your AI Courses" />
      <View style={{ padding: SPACING.md, flex: 1 }}>
        <SearchBar value={search} onChangeText={setSearch} />

        {loading ? (
          <SkeletonLoader />
        ) : filteredCourses.length === 0 ? (
          <EmptyState title="No courses found" description="Try searching another subject or upload content to build one!" iconName="book-open-blank-variant" />
        ) : (
          <FlatList
            data={filteredCourses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CourseCard
                course={item}
                onPress={() => navigation.navigate('GeneratedCourse', { courseId: item.id })}
              />
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
    </View>
  );
};

// 6. Generated Course Details Screen
type GeneratedCourseRouteProp = RouteProp<RootStackParamList, 'GeneratedCourse'>;
export const GeneratedCourseScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<GeneratedCourseRouteProp>();
  const { courseId } = route.params;

  const [course, setCourse] = useState<Types.Course | null>(null);
  const [chapters, setChapters] = useState<Types.Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      const cRes = await Services.Lesson.getCourseById(courseId);
      const chRes = await Services.Lesson.getChapters(courseId);
      if (cRes.success) setCourse(cRes.data);
      if (chRes.success) setChapters(chRes.data);
      setLoading(false);
    };
    loadDetails();
  }, [courseId]);

  if (loading) return <LoadingState label="Synthesizing course syllabus..." />;
  if (!course) return <ErrorState message="Syllabus parsing failed" onRetry={() => navigation.goBack()} />;

  return (
    <View style={styles.mainContainer}>
      <AppHeader title={course.title} showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: SPACING.md, paddingBottom: 40 }}>
        {/* Course Hero info */}
        <GlassCard style={{ padding: SPACING.md, marginBottom: SPACING.md }}>
          <Text style={[TYPOGRAPHY.h2, { color: COLORS.text }]}>{course.title}</Text>
          <Text style={{ color: COLORS.textSecondary, marginTop: 4 }}>{course.description}</Text>
          <View style={[styles.badgeRow, { marginTop: 12 }]}>
            <Text style={{ color: COLORS.accent, fontSize: 13 }}>
              Progress: {course.progress}% Complete
            </Text>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{course.difficulty.toUpperCase()}</Text>
            </View>
          </View>
          <ProgressBar progress={course.progress / 100} color={COLORS.accent} style={{ height: 6, borderRadius: 3, marginTop: SPACING.sm }} />
        </GlassCard>

        {/* Study buttons row */}
        <View style={styles.studyRow}>
          <TouchableOpacity onPress={() => navigation.navigate('AvatarTeacherScreen', { courseId })} style={styles.studyCircleBtn}>
            <MaterialCommunityIcons name="microphone" size={20} color={COLORS.text} />
            <Text style={styles.studyCircleText}>Voice AI</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Quiz', { courseId })} style={styles.studyCircleBtn}>
            <MaterialCommunityIcons name="clipboard-text" size={20} color={COLORS.text} />
            <Text style={styles.studyCircleText}>Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PracticeTests', { courseId })} style={styles.studyCircleBtn}>
            <MaterialCommunityIcons name="chart-bell-curve" size={20} color={COLORS.text} />
            <Text style={styles.studyCircleText}>Test</Text>
          </TouchableOpacity>
        </View>

        {/* Chapters and Lessons */}
        <Text style={[TYPOGRAPHY.h3, { color: COLORS.text, marginVertical: SPACING.md }]}>Course Chapters</Text>
        {chapters.map((ch) => (
          <View key={ch.id} style={{ marginBottom: SPACING.md }}>
            <Text style={[TYPOGRAPHY.body, { color: COLORS.accent, fontWeight: '700', marginBottom: 8 }]}>
              {ch.title}
            </Text>
            {ch.lessons.map((les) => (
              <LessonCard
                key={les.id}
                lesson={les}
                onPress={() => navigation.navigate('Lesson', { courseId, lessonId: les.id })}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// 7. Lesson Screen (Study screen)
type LessonRouteProp = RouteProp<RootStackParamList, 'Lesson'>;
export const LessonScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<LessonRouteProp>();
  const { courseId, lessonId } = route.params;

  const [lesson, setLesson] = useState<Types.Lesson | null>(null);
  const [ttsActive, setTtsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      const chRes = await Services.Lesson.getChapters(courseId);
      if (chRes.success) {
        // Find the specific lesson
        let foundLesson: Types.Lesson | null = null;
        for (const ch of chRes.data) {
          const l = ch.lessons.find((les) => les.id === lessonId);
          if (l) {
            foundLesson = l;
            break;
          }
        }
        setLesson(foundLesson);
      }
      setLoading(false);
    };
    fetchLesson();
  }, [courseId, lessonId]);

  if (loading) return <LoadingState label="Generating AI keynotes..." />;
  if (!lesson) return <ErrorState message="Lesson not found" onRetry={() => navigation.goBack()} />;

  return (
    <View style={styles.mainContainer}>
      <AppHeader
        title={lesson.title}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <IconButton
            icon={ttsActive ? "volume-high" : "volume-mute"}
            iconColor={ttsActive ? COLORS.accent : COLORS.textMuted}
            onPress={() => setTtsActive(!ttsActive)}
          />
        }
      />
      <ScrollView contentContainerStyle={{ padding: SPACING.md, paddingBottom: 80 }}>
        {/* Main lesson content */}
        <GlassCard style={{ padding: SPACING.md, marginBottom: SPACING.md }}>
          <Text style={[TYPOGRAPHY.h2, { color: COLORS.text, marginBottom: 8 }]}>{lesson.title}</Text>
          <Text style={{ color: COLORS.text, fontSize: 15, lineHeight: 24 }}>{lesson.content}</Text>
        </GlassCard>

        {/* Diagram Placeholder */}
        {lesson.diagramUrl && (
          <GlassCard style={{ padding: SPACING.md, marginBottom: SPACING.md, alignItems: 'center' }}>
            <Text style={[TYPOGRAPHY.label, { color: COLORS.accent, marginBottom: 8 }]}>AI VISUAL REPRESENTATION</Text>
            <Image source={{ uri: lesson.diagramUrl }} style={{ width: '100%', height: 160, borderRadius: 8 }} />
          </GlassCard>
        )}

        {/* Key Points */}
        <Text style={[TYPOGRAPHY.h3, { color: COLORS.text, marginVertical: SPACING.md }]}>Key Takeaways</Text>
        {lesson.keyPoints.map((pt, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <MaterialCommunityIcons name="rhombus-medium" size={16} color={COLORS.secondary} />
            <Text style={{ color: COLORS.textSecondary, marginLeft: 8, flex: 1 }}>{pt}</Text>
          </View>
        ))}

        {/* Summary */}
        <GlassCard style={{ padding: SPACING.md, marginTop: SPACING.lg }}>
          <Text style={[TYPOGRAPHY.label, { color: COLORS.primary, marginBottom: 4 }]}>Quick Summary</Text>
          <Text style={{ color: COLORS.text, fontStyle: 'italic' }}>"{lesson.summary}"</Text>
        </GlassCard>

        {/* Ask AI button */}
        <GradientButton
          title="Ask AI Tutor About This"
          icon="chat-processing-outline"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Tutor' } as any)}
          style={{ marginTop: SPACING.xl }}
        />
      </ScrollView>
    </View>
  );
};

// 8. AI Tutor Chat Screen
export const TutorScreen: React.FC = () => {
  const [messages, setMessages] = useState<Types.ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const initChat = async () => {
      const res = await Services.Tutor.getChatHistory('crs_1');
      if (res.success) setMessages(res.data);
    };
    initChat();
  }, []);

  const handleSendMessage = async (text: string) => {
    // Optimistic user update
    const userMsg: Types.ChatMessage = {
      id: `msg_${Date.now()}_usr`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await Services.Tutor.sendChatMessage('crs_1', text);
      if (res.success) {
        setMessages(prev => [...prev, res.data]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <AppHeader title="AI Study Tutor" />
      <View style={{ flex: 1, padding: SPACING.md, paddingBottom: 60 }}>
        <AITutorWidget
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      </View>
    </View>
  );
};

// 9. Voice Avatar Teacher Speech Screen
type AvatarTeacherRouteProp = RouteProp<RootStackParamList, 'AvatarTeacherScreen'>;
export const AvatarTeacherScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<AvatarTeacherRouteProp>();
  const { courseId } = route.params;

  const [session, setSession] = useState<Types.VoiceSession | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleStartSession = async () => {
    const res = await Services.Voice.startSession(courseId);
    if (res.success) {
      setSession(res.data);
      setTranscript(res.data.aiTranscript || '');
    }
  };

  useEffect(() => {
    handleStartSession();
  }, [courseId]);

  const toggleMic = async () => {
    if (isListening) {
      setIsListening(false);
      // Mock processing user voice input
      if (session) {
        const res = await Services.Voice.sendVoiceAudio(session.sessionId, 5);
        if (res.success) {
          setSession(res.data);
          setTranscript(`${res.data.userTranscript}\n\nAI: ${res.data.aiTranscript}`);
        }
      }
    } else {
      setIsListening(true);
    }
  };

  return (
    <View style={[styles.container, { padding: SPACING.md }]}>
      <AppHeader title="AI Voice Tutor" showBack onBack={() => navigation.goBack()} />
      <View style={[styles.center, { flex: 1 }]}>
        <AvatarTeacher isSpeaking={session?.status === 'speaking' && !isListening} size={150} />
        
        <GlassCard style={{ width: '90%', padding: SPACING.md, marginVertical: SPACING.xl, minHeight: 120 }}>
          <Text style={[TYPOGRAPHY.caption, { color: COLORS.accent, marginBottom: 4 }]}>TRANSCRIPT</Text>
          <Text style={{ color: COLORS.text, fontSize: 14, textAlign: 'center' }}>
            {transcript || 'Connecting speech engine...'}
          </Text>
        </GlassCard>

        <TouchableOpacity onPress={toggleMic} style={[styles.micBtn, { backgroundColor: isListening ? COLORS.error : COLORS.primary }]}>
          <MaterialCommunityIcons name={isListening ? "microphone" : "microphone-outline"} size={36} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary, marginTop: 8 }]}>
          {isListening ? 'Listening... Tap to stop' : 'Tap mic to speak'}
        </Text>
      </View>
    </View>
  );
};

// 10. Flashcards Screen
export const FlashcardsScreen: React.FC = () => {
  const [cards, setCards] = useState<Types.Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      const res = await Services.Flashcard.getFlashcards('crs_1');
      if (res.success) setCards(res.data);
    };
    fetchCards();
  }, []);

  const handleBoxUpdate = async (correct: boolean) => {
    if (cards.length === 0) return;
    const currentCard = cards[currentIdx];
    await Services.Flashcard.updateBox(currentCard.id, 'crs_1', correct ? 'correct' : 'incorrect');

    if (currentIdx < cards.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentIdx(0); // Loop back
    }
  };

  if (cards.length === 0) return <LoadingState label="Formatting flashcards..." />;

  return (
    <View style={styles.mainContainer}>
      <AppHeader title="Study Flashcards" />
      <View style={[styles.center, { flex: 1, padding: SPACING.md }]}>
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
          Card {currentIdx + 1} of {cards.length} (Box {cards[currentIdx].box}/5)
        </Text>

        <Flashcard card={cards[currentIdx]} onBoxUpdate={handleBoxUpdate} />
      </View>
    </View>
  );
};

// 11. Quiz Assessment Screen
type QuizRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
export const QuizScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<QuizRouteProp>();
  const { courseId } = route.params;

  const [quiz, setQuiz] = useState<Types.Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState<{ score: number; xpEarned: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await Services.Quiz.getQuiz(courseId);
      if (res.success) setQuiz(res.data);
      setLoading(false);
    };
    fetchQuiz();
  }, [courseId]);

  const handleSelectOption = (optIdx: number) => {
    if (!quiz) return;
    const question = quiz.questions[currentQuestionIdx];
    setAnswers({ ...answers, [question.id]: optIdx });
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setLoading(true);
    const res = await Services.Quiz.submitQuiz(quiz.id, answers);
    if (res.success) {
      setScoreData(res.data);
      setQuizSubmitted(true);
    }
    setLoading(false);
  };

  if (loading) return <LoadingState label="Loading dynamic quiz questions..." />;
  if (!quiz) return <ErrorState message="Failed to assemble quiz" onRetry={() => navigation.goBack()} />;

  if (quizSubmitted && scoreData) {
    return (
      <View style={[styles.container, styles.center, { padding: SPACING.lg }]}>
        <MaterialCommunityIcons name="trophy-outline" size={80} color={COLORS.warning} />
        <Text style={[TYPOGRAPHY.display, { color: COLORS.text, marginTop: SPACING.md }]}>Quiz Finished!</Text>
        <Text style={[TYPOGRAPHY.h1, { color: COLORS.accent, marginVertical: SPACING.sm }]}>{scoreData.score}% Score</Text>
        <Text style={{ color: COLORS.textSecondary, marginBottom: SPACING.xl }}>
          You earned +{scoreData.xpEarned} XP!
        </Text>
        <GradientButton title="Back to course" onPress={() => navigation.goBack()} style={{ width: '80%' }} />
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIdx];
  const selectedAns = answers[currentQuestion.id];

  return (
    <View style={styles.mainContainer}>
      <AppHeader title={quiz.title} showBack onBack={() => navigation.goBack()} />
      <View style={{ padding: SPACING.md, flex: 1, justifyContent: 'space-between' }}>
        <View>
          <ProgressBar
            progress={(currentQuestionIdx + 1) / quiz.questions.length}
            color={COLORS.primary}
            style={{ height: 6, borderRadius: 3, marginBottom: SPACING.lg }}
          />
          <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>
            Question {currentQuestionIdx + 1} of {quiz.questions.length}
          </Text>

          <QuizCard
            question={currentQuestion}
            onSelectOption={handleSelectOption}
            selectedOption={selectedAns}
          />
        </View>

        <GradientButton
          title={currentQuestionIdx === quiz.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
          onPress={handleNext}
          style={{ marginBottom: 24 }}
        />
      </View>
    </View>
  );
};

// 12. Practice Tests Exam Screen
type PracticeRouteProp = RouteProp<RootStackParamList, 'PracticeTests'>;
export const PracticeTestsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<PracticeRouteProp>();
  const { courseId } = route.params;

  const [test, setTest] = useState<Types.PracticeTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      const res = await Services.PracticeTest.getPracticeTest(courseId);
      if (res.success) setTest(res.data);
      setLoading(false);
    };
    fetchTest();
  }, [courseId]);

  if (loading) return <LoadingState label="Formulating benchmark exam..." />;
  if (!test) return <ErrorState message="Could not locate test" onRetry={() => navigation.goBack()} />;

  return (
    <View style={styles.mainContainer}>
      <AppHeader title={test.title} showBack onBack={() => navigation.goBack()} />
      <View style={[styles.center, { flex: 1, padding: SPACING.lg }]}>
        <MaterialCommunityIcons name="clock-outline" size={60} color={COLORS.secondary} />
        <Text style={[TYPOGRAPHY.h1, { color: COLORS.text, marginTop: SPACING.md }]}>Practice Test Ready</Text>
        <Text style={{ color: COLORS.textSecondary, textAlign: 'center', marginVertical: SPACING.sm }}>
          This timed practice exam simulates core testing conditions. You will have {test.durationMinutes} minutes.
        </Text>
        <GlassCard style={{ padding: SPACING.md, width: '90%', marginVertical: SPACING.md }}>
          <Text style={{ color: COLORS.text, fontSize: 13 }}>
            • Number of Questions: {test.questions.length}{'\n'}
            • Instant grading will be visible upon submission.{'\n'}
            • Full explanations are provided for all questions.
          </Text>
        </GlassCard>
        <GradientButton title="Start Exam" onPress={() => navigation.replace('Quiz', { courseId })} style={{ width: '80%', marginTop: SPACING.md }} />
      </View>
    </View>
  );
};

// 13. Progress Dashboard Screen (Charts, Streaks, Badge grids)
export const ProgressScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [progress, setProgress] = useState<Types.Progress | null>(null);
  const [achievements, setAchievements] = useState<Types.Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const prRes = await Services.Progress.getProgress();
      const acRes = await Services.Progress.getAchievements();
      if (prRes.success) setProgress(prRes.data);
      if (acRes.success) setAchievements(acRes.data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingState label="Computing metrics..." />;

  return (
    <View style={styles.mainContainer}>
      <AppHeader title="Your Progress Hub" />
      <ScrollView contentContainerStyle={{ padding: SPACING.md, paddingBottom: 80 }}>
        {/* KPI metrics row */}
        {progress && (
          <View style={styles.kpiRow}>
            <StatisticCard label="Total Experience" value={`${progress.user.totalXP} XP`} icon="lightning-bolt" />
            <StatisticCard label="Level Achieved" value={`LV ${progress.user.level}`} icon="seal" />
          </View>
        )}

        {/* Charts component */}
        {progress && <ChartWidgets data={progress.history} />}

        {/* Subject Breakdown percentages */}
        <Text style={[TYPOGRAPHY.h3, { color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm }]}>
          Subject Performance
        </Text>
        {progress?.subjectPerformance.map((sub, idx) => (
          <GlassCard key={idx} style={{ marginBottom: SPACING.sm, padding: SPACING.sm }}>
            <View style={styles.rowBetween}>
              <Text style={{ color: COLORS.text, fontWeight: '700' }}>{sub.subject}</Text>
              <Text style={{ color: COLORS.accent, fontWeight: '700' }}>{sub.score}%</Text>
            </View>
            <ProgressBar progress={sub.score / 100} color={COLORS.accent} style={{ height: 4, borderRadius: 2, marginTop: 6 }} />
          </GlassCard>
        ))}

        {/* Achievement Unlock grid list */}
        <Text style={[TYPOGRAPHY.h3, { color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm }]}>
          Badges & Achievements
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={achievements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AchievementBadge achievement={item} />}
          contentContainerStyle={{ paddingVertical: 4 }}
        />
      </ScrollView>
    </View>
  );
};

// 14. Notifications screen
export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [notifications, setNotifications] = useState<Types.Notification[]>([
    {
      id: 'n_1',
      title: 'Daily Streak Reminder',
      body: 'Keep your 14-day study streak alive! Practice flashcards for just 5 minutes today.',
      type: 'reminder',
      isRead: false,
      timestamp: '2 hours ago'
    },
    {
      id: 'n_2',
      title: 'AI Recommendation',
      body: 'We noticed a dip in "Optimizers & Scaling" quiz score. Let\'s practice an adaptive test.',
      type: 'recommendation',
      isRead: true,
      timestamp: '1 day ago'
    }
  ]);

  return (
    <View style={styles.mainContainer}>
      <AppHeader title="Notifications" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GlassCard style={{ margin: SPACING.sm, padding: SPACING.md, opacity: item.isRead ? 0.7 : 1 }}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons
                  name={item.type === 'reminder' ? 'alarm' : 'robot-outline'}
                  size={20}
                  color={item.type === 'reminder' ? COLORS.warning : COLORS.accent}
                />
                <Text style={[TYPOGRAPHY.body, { color: COLORS.text, fontWeight: '700', marginLeft: 8 }]}>
                  {item.title}
                </Text>
              </View>
              <Text style={styles.chartLabel}>{item.timestamp}</Text>
            </View>
            <Text style={{ color: COLORS.textSecondary, marginTop: 4, fontSize: 13 }}>{item.body}</Text>
          </GlassCard>
        )}
      />
    </View>
  );
};

// 15. Settings Screen
export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [language, setLanguage] = useState('en');
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <AppHeader title="Application Settings" showBack onBack={() => navigation.goBack()} />
      <ScrollView style={{ padding: SPACING.md }}>
        <GlassCard style={{ padding: SPACING.md, marginBottom: SPACING.md }}>
          <Text style={[TYPOGRAPHY.h3, { color: COLORS.text, marginBottom: SPACING.sm }]}>AI Audio Voice</Text>
          <SegmentedButtons
            value={language}
            onValueChange={setLanguage}
            buttons={[
              { value: 'en', label: 'English Male' },
              { value: 'en-f', label: 'English Female' },
              { value: 'es', label: 'Spanish Voice' }
            ]}
            theme={{ colors: { primary: COLORS.accent, secondaryContainer: 'rgba(34, 211, 238, 0.2)' } }}
          />
        </GlassCard>

        <GlassCard style={{ padding: SPACING.md, marginBottom: SPACING.md }}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={[TYPOGRAPHY.body, { color: COLORS.text, fontWeight: '700' }]}>Enable Offline Study</Text>
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>Download lessons and practice tests locally</Text>
            </View>
            <TouchableOpacity onPress={() => setOfflineMode(!offlineMode)}>
              <MaterialCommunityIcons
                name={offlineMode ? "toggle-switch" : "toggle-switch-off-outline"}
                size={48}
                color={offlineMode ? COLORS.success : COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>
        </GlassCard>

        <Button mode="outlined" textColor={COLORS.error} onPress={() => navigation.replace('Auth')} style={{ marginTop: SPACING.xl, borderColor: COLORS.error }}>
          Log Out
        </Button>
      </ScrollView>
    </View>
  );
};

// 16. Profile Screen
export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  return (
    <View style={styles.mainContainer}>
      <AppHeader
        title="Student Profile"
        rightAction={<IconButton icon="cog" iconColor={COLORS.text} onPress={() => navigation.navigate('Settings')} />}
      />
      <View style={[styles.center, { padding: SPACING.xl }]}>
        <PaperAvatar.Image size={100} source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }} />
        <Text style={[TYPOGRAPHY.h1, { color: COLORS.text, marginTop: SPACING.md }]}>Alex Mercer</Text>
        <Text style={{ color: COLORS.textSecondary, marginBottom: SPACING.lg }}>alex@learnflow.ai</Text>
        
        <GlassCard style={{ width: '100%', padding: SPACING.md }}>
          <Text style={[TYPOGRAPHY.label, { color: COLORS.accent, marginBottom: 8 }]}>CERTIFICATE ACHIEVED</Text>
          <View style={styles.bulletRow}>
            <MaterialCommunityIcons name="certificate" size={24} color={COLORS.warning} />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ color: COLORS.text, fontWeight: '700' }}>Deep Learning Transformer Basics</Text>
              <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>Issued June 2026</Text>
            </View>
          </View>
        </GlassCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLoading: {
    position: 'absolute',
    bottom: 80,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  dotRow: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  authInput: {
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.sm,
    fontSize: 13,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  quickPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.borderRadius.md,
  },
  quickAccessItem: {
    alignItems: 'center',
  },
  quickLabel: {
    color: COLORS.text,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  studyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SPACING.md,
  },
  studyCircleBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  studyCircleText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  micBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glow,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
});
