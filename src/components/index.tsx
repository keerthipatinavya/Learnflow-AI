import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated as RNAnimated
} from 'react-native';
import { Card, Button, IconButton, ProgressBar, ActivityIndicator, Avatar as PaperAvatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme';
import * as Types from '../types';

const { width } = Dimensions.get('window');

export const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}> = ({ children, style, onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.glassCard, SHADOWS.soft, style]}
      >
        <View style={styles.glassInner}>{children}</View>
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.glassCard, SHADOWS.soft, style]}>
      <View style={styles.glassInner}>{children}</View>
    </View>
  );
};

// 2. GradientButton Component (Using secondary/primary color transitions)
export const GradientButton: React.FC<{
  title: string;
  onPress: () => void;
  icon?: string;
  loading?: boolean;
  style?: any;
}> = ({ title, onPress, icon, loading, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[styles.gradientBtn, SHADOWS.glow, style]}
    >
      <View style={styles.gradientBtnInner}>
        {loading ? (
          <ActivityIndicator color={COLORS.text} size="small" style={{ marginRight: 8 }} />
        ) : icon ? (
          <MaterialCommunityIcons name={icon as any} size={18} color={COLORS.text} style={{ marginRight: 8 }} />
        ) : null}
        <Text style={styles.gradientBtnText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

// 3. AvatarTeacher Component
export const AvatarTeacher: React.FC<{
  isSpeaking?: boolean;
  size?: number;
  onPress?: () => void;
}> = ({ isSpeaking = false, size = 100, onPress }) => {
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  React.useEffect(() => {
    if (isSpeaking) {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          RNAnimated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSpeaking]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.avatarContainer}>
      <RNAnimated.View
        style={[
          styles.avatarOutline,
          {
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            transform: [{ scale: pulseAnim }],
            borderColor: isSpeaking ? COLORS.accent : COLORS.primary,
          },
        ]}
      />
      <PaperAvatar.Image
        size={size}
        source={{ uri: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300' }}
        style={styles.avatarImage}
      />
      {isSpeaking && (
        <View style={styles.waveformContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={[styles.waveBar, { height: Math.random() * 20 + 8 }]} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

// 4. AITutorWidget Component
export const AITutorWidget: React.FC<{
  messages: Types.ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping?: boolean;
}> = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <GlassCard style={{ flex: 1, padding: SPACING.md }}>
      <View style={styles.widgetHeader}>
        <MaterialCommunityIcons name="robot" size={24} color={COLORS.accent} />
        <Text style={[TYPOGRAPHY.h3, { marginLeft: SPACING.sm, color: COLORS.text }]}>AI Tutor Chat</Text>
      </View>
      <View style={styles.chatArea}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.msgBubble,
              msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text style={{ color: COLORS.text, fontSize: 14 }}>{msg.text}</Text>
            {msg.citations && msg.citations.length > 0 && (
              <View style={styles.citationBadge}>
                <MaterialCommunityIcons name="book-open-variant" size={12} color={COLORS.accent} />
                <Text style={styles.citationText}>{msg.citations[0].source}</Text>
              </View>
            )}
          </View>
        ))}
        {isTyping && (
          <View style={[styles.msgBubble, styles.aiBubble, styles.typingIndicator]}>
            <ActivityIndicator size="small" color={COLORS.accent} />
          </View>
        )}
      </View>
      <View style={styles.inputBar}>
        <TextInput
          placeholder="Ask AI Teacher..."
          placeholderTextColor={COLORS.textMuted}
          value={input}
          onChangeText={setInput}
          style={styles.textInput}
        />
        <IconButton icon="send" iconColor={COLORS.accent} onPress={handleSend} />
      </View>
    </GlassCard>
  );
};

// 5. UploadWidget Component
export const UploadWidget: React.FC<{
  onUploadSelect: (type: 'pdf' | 'url' | 'youtube') => void;
  isUploading?: boolean;
  progress?: number;
}> = ({ onUploadSelect, isUploading = false, progress = 0 }) => {
  return (
    <GlassCard style={{ padding: SPACING.lg }}>
      <View style={styles.uploadArea}>
        <MaterialCommunityIcons name="cloud-upload-outline" size={48} color={COLORS.primary} />
        <Text style={[TYPOGRAPHY.h2, { marginTop: SPACING.sm, color: COLORS.text }]}>Upload Content</Text>
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary, textAlign: 'center', marginVertical: SPACING.sm }]}>
          Transform PDFs, YouTube Videos, or Web links into custom courses.
        </Text>

        {isUploading ? (
          <View style={{ width: '100%', marginTop: SPACING.md }}>
            <ProgressBar progress={progress / 100} color={COLORS.primary} style={{ height: 6, borderRadius: 3 }} />
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary, alignSelf: 'center', marginTop: 8 }]}>
              AI parsing files... {progress}%
            </Text>
          </View>
        ) : (
          <View style={styles.uploadOptions}>
            <IconButton icon="file-pdf-box" mode="contained" containerColor={COLORS.surface} iconColor={COLORS.error} size={28} onPress={() => onUploadSelect('pdf')} />
            <IconButton icon="youtube" mode="contained" containerColor={COLORS.surface} iconColor={COLORS.error} size={28} onPress={() => onUploadSelect('youtube')} />
            <IconButton icon="link-variant" mode="contained" containerColor={COLORS.surface} iconColor={COLORS.accent} size={28} onPress={() => onUploadSelect('url')} />
          </View>
        )}
      </View>
    </GlassCard>
  );
};

// 6. CourseCard Component
export const CourseCard: React.FC<{
  course: Types.Course;
  onPress: () => void;
}> = ({ course, onPress }) => {
  return (
    <GlassCard onPress={onPress} style={{ marginBottom: SPACING.md }}>
      <View style={styles.courseCardRow}>
        <View style={styles.courseInfo}>
          <Text style={[TYPOGRAPHY.h3, { color: COLORS.text }]}>{course.title}</Text>
          <Text numberOfLines={2} style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, fontSize: 13, marginVertical: SPACING.xs }]}>
            {course.description}
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{course.difficulty.toUpperCase()}</Text>
            </View>
            <Text style={[TYPOGRAPHY.caption, { color: COLORS.accent }]}>
              {course.completedChapters}/{course.chaptersCount} Chapters
            </Text>
          </View>
          <ProgressBar progress={course.progress / 100} color={COLORS.accent} style={{ height: 4, borderRadius: 2, marginTop: 8 }} />
        </View>
      </View>
    </GlassCard>
  );
};

// 7. LessonCard Component
export const LessonCard: React.FC<{
  lesson: Types.Lesson;
  onPress: () => void;
}> = ({ lesson, onPress }) => {
  return (
    <GlassCard onPress={onPress} style={styles.lessonCard}>
      <View style={styles.lessonRow}>
        <MaterialCommunityIcons
          name={lesson.isCompleted ? "checkbox-marked-circle" : "circle-outline"}
          size={22}
          color={lesson.isCompleted ? COLORS.success : COLORS.textMuted}
        />
        <View style={{ marginLeft: SPACING.md, flex: 1 }}>
          <Text style={[TYPOGRAPHY.body, { color: COLORS.text, fontWeight: '700' }]}>{lesson.title}</Text>
          <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary }]}>{lesson.durationMinutes} mins</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textSecondary} />
      </View>
    </GlassCard>
  );
};

// 8. ProgressCard Component
export const ProgressCard: React.FC<{
  streak: number;
  weeklyTarget: number;
  weeklyCompleted: number;
}> = ({ streak, weeklyTarget, weeklyCompleted }) => {
  return (
    <GlassCard style={{ padding: SPACING.md }}>
      <View style={styles.progressRow}>
        <View style={{ flex: 1 }}>
          <Text style={[TYPOGRAPHY.label, { color: COLORS.secondary }]}>Current Progress</Text>
          <Text style={[TYPOGRAPHY.h1, { color: COLORS.text, marginTop: SPACING.xs }]}>{streak} Day Streak</Text>
          <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, fontSize: 13, marginTop: SPACING.xs }]}>
            {weeklyCompleted} / {weeklyTarget} mins studied this week
          </Text>
        </View>
        <View style={styles.streakFlameContainer}>
          <MaterialCommunityIcons name="fire" size={32} color={COLORS.warning} />
          <Text style={styles.streakText}>{streak}</Text>
        </View>
      </View>
      <ProgressBar progress={weeklyCompleted / weeklyTarget} color={COLORS.secondary} style={{ height: 6, borderRadius: 3, marginTop: SPACING.md }} />
    </GlassCard>
  );
};

// 9. AnalyticsCard Component
export const AnalyticsCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  iconName: string;
}> = ({ title, value, subtitle, iconName }) => {
  return (
    <GlassCard style={{ flex: 1, marginHorizontal: 4, padding: SPACING.md }}>
      <MaterialCommunityIcons name={iconName as any} size={24} color={COLORS.accent} />
      <Text style={[TYPOGRAPHY.label, { color: COLORS.textSecondary, marginTop: SPACING.sm }]}>{title}</Text>
      <Text style={[TYPOGRAPHY.h1, { color: COLORS.text, marginVertical: SPACING.xs }]}>{value}</Text>
      <Text style={[TYPOGRAPHY.caption, { color: COLORS.textMuted }]}>{subtitle}</Text>
    </GlassCard>
  );
};

// 10. StatisticCard Component
export const StatisticCard: React.FC<{
  label: string;
  value: string;
  icon: string;
}> = ({ label, value, icon }) => {
  return (
    <GlassCard style={{ width: width * 0.43, margin: 6, padding: SPACING.md }}>
      <View style={styles.rowBetween}>
        <Text style={[TYPOGRAPHY.h2, { color: COLORS.text }]}>{value}</Text>
        <MaterialCommunityIcons name={icon as any} size={20} color={COLORS.primary} />
      </View>
      <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary, marginTop: 4 }]}>{label}</Text>
    </GlassCard>
  );
};

// 11. Flashcard Component
export const Flashcard: React.FC<{
  card: Types.Flashcard;
  onBoxUpdate: (correct: boolean) => void;
}> = ({ card, onBoxUpdate }) => {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new RNAnimated.Value(0)).current;

  const handleFlip = () => {
    setFlipped(!flipped);
    RNAnimated.timing(flipAnim, {
      toValue: flipped ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg']
  });

  return (
    <View style={styles.flashcardWrapper}>
      <TouchableOpacity activeOpacity={0.9} onPress={handleFlip} style={styles.cardContainer}>
        {/* Front Side */}
        <RNAnimated.View style={[styles.flashCardSide, { transform: [{ rotateY: frontInterpolate }], opacity: flipAnim.interpolate({ inputRange: [0, 0.5, 0.51, 1], outputRange: [1, 1, 0, 0] }) }]}>
          <Text style={styles.flashcardLabel}>FRONT</Text>
          <Text style={styles.flashcardText}>{card.front}</Text>
          <Text style={styles.tapPrompt}>Tap to flip</Text>
        </RNAnimated.View>

        {/* Back Side */}
        <RNAnimated.View style={[styles.flashCardSide, styles.flashCardBack, { transform: [{ rotateY: backInterpolate }], opacity: flipAnim.interpolate({ inputRange: [0, 0.5, 0.51, 1], outputRange: [0, 0, 1, 1] }) }]}>
          <Text style={[styles.flashcardLabel, { color: COLORS.accent }]}>BACK</Text>
          <Text style={styles.flashcardText}>{card.back}</Text>
          <View style={styles.sm2Buttons}>
            <TouchableOpacity onPress={() => onBoxUpdate(false)} style={[styles.sm2Btn, { borderColor: COLORS.error }]}>
              <Text style={{ color: COLORS.error, fontSize: 12 }}>Incorrect</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onBoxUpdate(true)} style={[styles.sm2Btn, { borderColor: COLORS.success }]}>
              <Text style={{ color: COLORS.success, fontSize: 12 }}>Correct</Text>
            </TouchableOpacity>
          </View>
        </RNAnimated.View>
      </TouchableOpacity>
    </View>
  );
};

// 12. QuizCard Component
export const QuizCard: React.FC<{
  question: Types.Question;
  onSelectOption: (index: number) => void;
  selectedOption?: number;
  showExplanation?: boolean;
}> = ({ question, onSelectOption, selectedOption, showExplanation = false }) => {
  return (
    <GlassCard style={{ padding: SPACING.md, marginBottom: SPACING.md }}>
      <Text style={[TYPOGRAPHY.h3, { color: COLORS.text, marginBottom: SPACING.md }]}>
        {question.questionText}
      </Text>
      {question.options.map((opt, index) => {
        const isSelected = selectedOption === index;
        const isCorrect = question.correctAnswerIndex === index;
        let optionStyle: any = styles.quizOption;

        if (showExplanation) {
          if (isCorrect) optionStyle = [styles.quizOption, styles.quizOptionCorrect];
          else if (isSelected) optionStyle = [styles.quizOption, styles.quizOptionWrong];
        } else if (isSelected) {
          optionStyle = [styles.quizOption, styles.quizOptionSelected];
        }

        return (
          <TouchableOpacity key={index} onPress={() => !showExplanation && onSelectOption(index)} style={optionStyle}>
            <Text style={{ color: COLORS.text, flex: 1 }}>{opt}</Text>
            {showExplanation && isCorrect && <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.success} />}
            {showExplanation && isSelected && !isCorrect && <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.error} />}
          </TouchableOpacity>
        );
      })}
      {showExplanation && (
        <View style={styles.explanationBox}>
          <Text style={{ color: COLORS.accent, fontWeight: '700', fontSize: 12 }}>EXPLANATION</Text>
          <Text style={{ color: COLORS.textSecondary, fontSize: 13, marginTop: 4 }}>{question.explanation}</Text>
        </View>
      )}
    </GlassCard>
  );
};

// 13. AchievementBadge Component
export const AchievementBadge: React.FC<{
  achievement: Types.Achievement;
}> = ({ achievement }) => {
  return (
    <GlassCard style={[styles.badgeCard, { opacity: achievement.isUnlocked ? 1.0 : 0.4 }]}>
      <IconButton
        icon={achievement.iconName as any}
        size={36}
        iconColor={achievement.isUnlocked ? COLORS.warning : COLORS.textMuted}
        style={{ margin: 0 }}
      />
      <Text style={[TYPOGRAPHY.body, { color: COLORS.text, fontWeight: '700', textAlign: 'center' }]}>
        {achievement.title}
      </Text>
      <Text style={[TYPOGRAPHY.caption, { color: COLORS.textSecondary, textAlign: 'center' }]} numberOfLines={2}>
        {achievement.description}
      </Text>
      {achievement.isUnlocked && (
        <Text style={[TYPOGRAPHY.caption, { color: COLORS.success, fontSize: 10, marginTop: 4 }]}>
          +{achievement.xpReward} XP Earned
        </Text>
      )}
    </GlassCard>
  );
};

// 14. EmptyState Component
export const EmptyState: React.FC<{
  title: string;
  description: string;
  iconName: string;
}> = ({ title, description, iconName }) => {
  return (
    <View style={styles.stateContainer}>
      <MaterialCommunityIcons name={iconName as any} size={64} color={COLORS.textMuted} />
      <Text style={[TYPOGRAPHY.h2, { color: COLORS.text, marginTop: SPACING.md }]}>{title}</Text>
      <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xs }]}>
        {description}
      </Text>
    </View>
  );
};

// 15. ErrorState Component
export const ErrorState: React.FC<{
  message: string;
  onRetry: () => void;
}> = ({ message, onRetry }) => {
  return (
    <View style={styles.stateContainer}>
      <MaterialCommunityIcons name="alert-circle-outline" size={64} color={COLORS.error} />
      <Text style={[TYPOGRAPHY.h2, { color: COLORS.text, marginTop: SPACING.md }]}>An Error Occurred</Text>
      <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, textAlign: 'center', marginVertical: SPACING.sm }]}>
        {message}
      </Text>
      <Button mode="contained" onPress={onRetry} buttonColor={COLORS.primary}>
        Retry
      </Button>
    </View>
  );
};

// 16. LoadingState Component
export const LoadingState: React.FC<{
  label?: string;
}> = ({ label = 'Loading...' }) => {
  return (
    <View style={styles.stateContainer}>
      <ActivityIndicator size="large" color={COLORS.accent} />
      <Text style={[TYPOGRAPHY.body, { color: COLORS.textSecondary, marginTop: SPACING.md }]}>{label}</Text>
    </View>
  );
};

// 17. SkeletonLoader Component
export const SkeletonLoader: React.FC = () => {
  return (
    <View style={styles.skeletonWrapper}>
      <View style={styles.skeletonBarShort} />
      <View style={styles.skeletonBarLong} />
      <View style={styles.skeletonBarLong} />
    </View>
  );
};

// 18. AppHeader Component
export const AppHeader: React.FC<{
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}> = ({ title, showBack = false, onBack, rightAction }) => {
  return (
    <View style={styles.header}>
      {showBack ? (
        <IconButton icon="arrow-left" iconColor={COLORS.text} onPress={onBack} />
      ) : (
        <MaterialCommunityIcons name="brain" size={26} color={COLORS.primary} style={{ marginLeft: 8 }} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      {rightAction ? rightAction : <View style={{ width: 48 }} />}
    </View>
  );
};

// 19. SearchBar Component
export const SearchBar: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}> = ({ value, onChangeText, placeholder = 'Search courses...' }) => {
  return (
    <View style={styles.searchBar}>
      <MaterialCommunityIcons name="magnify" size={20} color={COLORS.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        style={styles.searchBarInput}
      />
    </View>
  );
};

// 20. ProgressRing Component
export const ProgressRing: React.FC<{
  percentage: number;
  size?: number;
}> = ({ percentage, size = 60 }) => {
  return (
    <View style={[styles.progressRing, { width: size, height: size }]}>
      <Text style={{ color: COLORS.accent, fontWeight: '800', fontSize: 13 }}>{percentage}%</Text>
    </View>
  );
};

// 21. ChartWidgets Component
export const ChartWidgets: React.FC<{
  data: Types.DailyActivity[];
}> = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.minutes), 1);
  return (
    <GlassCard style={{ padding: SPACING.md, marginTop: SPACING.md }}>
      <Text style={[TYPOGRAPHY.h3, { color: COLORS.text, marginBottom: SPACING.md }]}>Weekly Study Hours</Text>
      <View style={styles.chartContainer}>
        {data.map((item, idx) => {
          const heightPct = (item.minutes / maxVal) * 80 + 10;
          return (
            <View key={idx} style={styles.chartCol}>
              <View style={styles.barWrap}>
                <View style={[styles.chartBar, { height: `${heightPct}%`, backgroundColor: item.minutes > 0 ? COLORS.accent : COLORS.surface }]} />
              </View>
              <Text style={styles.chartLabel}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: COLORS.glassBackground,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: SPACING.borderRadius.md,
    overflow: 'hidden',
  },
  glassInner: {
    padding: SPACING.md,
  },
  gradientBtn: {
    borderRadius: SPACING.borderRadius.md,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradientBtnText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarOutline: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  avatarImage: {
    backgroundColor: COLORS.surface,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    height: 30,
  },
  waveBar: {
    width: 4,
    backgroundColor: COLORS.accent,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  chatArea: {
    minHeight: 180,
    maxHeight: 280,
  },
  msgBubble: {
    padding: SPACING.sm,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  aiBubble: {
    backgroundColor: COLORS.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  citationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  citationText: {
    color: COLORS.accent,
    fontSize: 10,
    marginLeft: 4,
  },
  typingIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    marginTop: 8,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    height: 40,
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadOptions: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  courseCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
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
  lessonCard: {
    marginBottom: SPACING.sm,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakFlameContainer: {
    alignItems: 'center',
  },
  streakText: {
    color: COLORS.warning,
    fontWeight: '700',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flashcardWrapper: {
    height: 320,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '90%',
    height: '90%',
    position: 'relative',
  },
  flashCardSide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: SPACING.borderRadius.xl,
    padding: SPACING.lg,
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden',
  },
  flashCardBack: {
    backgroundColor: COLORS.glassBackground,
  },
  flashcardLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  flashcardText: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  tapPrompt: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  sm2Buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sm2Btn: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: SPACING.borderRadius.sm,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quizOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
  },
  quizOptionCorrect: {
    borderColor: COLORS.success,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  quizOptionWrong: {
    borderColor: COLORS.error,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  explanationBox: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: 6,
  },
  badgeCard: {
    width: width * 0.28,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 6,
    height: 140,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  skeletonWrapper: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadius.md,
    opacity: 0.6,
    marginVertical: SPACING.sm,
  },
  skeletonBarShort: {
    width: '40%',
    height: 16,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonBarLong: {
    width: '90%',
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderRadius: 24,
    marginBottom: SPACING.md,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  searchBarInput: {
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
    height: '100%',
  },
  progressRing: {
    borderRadius: 30,
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginTop: 8,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  barWrap: {
    height: 90,
    justifyContent: 'flex-end',
    width: 14,
    borderRadius: 7,
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: 7,
  },
  chartLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
});
