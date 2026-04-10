import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

const QUESTIONS = [
  {
    id: 'skin_type',
    q: 'How does your skin feel by midday?',
    options: [
      { label: '🌟 Shiny & oily', value: 'oily' },
      { label: '🏜️ Tight & dry', value: 'dry' },
      { label: '⚖️ A mix of both', value: 'combo' },
      { label: '🌿 Comfortable', value: 'normal' },
    ],
  },
  {
    id: 'concern',
    q: "What's your top skin concern?",
    options: [
      { label: '💧 Hydration & moisture', value: 'hydration' },
      { label: '✨ Aging & fine lines', value: 'aging' },
      { label: '🛡️ Sensitivity & redness', value: 'sensitive' },
      { label: '🌱 Clean, toxin-free routine', value: 'clean' },
    ],
  },
  {
    id: 'scent',
    q: 'Do you have a scent preference?',
    options: [
      { label: '🍋 Citrus & bright', value: 'Citrus' },
      { label: '💐 Floral & calming', value: 'Lavender' },
      { label: '🌰 Warm & cozy', value: 'Vanilla' },
      { label: '🍃 Fragrance-free', value: 'Unscented' },
    ],
  },
  {
    id: 'lifestyle',
    q: 'How would you describe your lifestyle?',
    options: [
      { label: '🏃 Active & outdoors', value: 'active' },
      { label: '💻 Mostly indoors', value: 'indoor' },
      { label: '🌊 Near the sun & water', value: 'beach' },
      { label: '🏙️ City hustle', value: 'urban' },
    ],
  },
];

// Map answers → recommended product IDs + message
function getRecommendations(answers) {
  const { skin_type, concern, scent, lifestyle } = answers;

  const recs = [];

  // Balm always relevant
  if (concern === 'hydration' || concern === 'aging' || skin_type === 'dry') {
    recs.push({ id: '1', reason: 'Our 4oz Tallow Honey Balm deeply moisturizes and targets fine lines.' });
  } else {
    recs.push({ id: '6', reason: 'The 2oz Balm is perfect for a light, everyday glow.' });
  }

  // Sunscreen for active/beach
  if (lifestyle === 'active' || lifestyle === 'beach') {
    recs.push({ id: '4', reason: 'Our natural sunscreen protects without harsh chemicals — perfect for your active life.' });
  }

  // Soap for everyone
  if (concern === 'clean' || skin_type === 'oily') {
    recs.push({ id: '3', reason: 'Our handcrafted soap cleanses gently with all-natural ingredients.' });
  }

  // Hair oil for urban/indoor
  if (lifestyle === 'urban' || lifestyle === 'indoor') {
    recs.push({ id: '5', reason: 'Our Hair Oil restores shine and tames frizz from dry indoor air.' });
  }

  // Deodorant always
  recs.push({ id: '2', reason: 'Our natural deodorant is effective, aluminum-free, and kind to sensitive skin.' });

  const unique = [];
  const seen = new Set();
  for (const r of recs) {
    if (!seen.has(r.id)) { seen.add(r.id); unique.push(r); }
    if (unique.length === 3) break;
  }
  return { recs: unique, scent };
}

export default function QuizScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const progress = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateNext = (nextStep) => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).start();
    Animated.timing(progress, {
      toValue: nextStep / QUESTIONS.length,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const handleAnswer = (qId, value) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      animateNext(step + 1);
      setTimeout(() => setStep(s => s + 1), 150);
    } else {
      // Done
      Animated.timing(progress, { toValue: 1, duration: 400, useNativeDriver: false }).start();
      setResult(getRecommendations(newAnswers));
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (result) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.resultWrap}>
          <Text style={styles.resultEyebrow}>YOUR RITUAL</Text>
          <Text style={styles.resultTitle}>Your Personal{'\n'}Terra Lotus Routine</Text>
          <Text style={styles.resultSub}>
            Based on your answers, your preferred scent is{' '}
            <Text style={{ color: COLORS.honeyGold }}>{result.scent}</Text>.
            Here's what we recommend:
          </Text>

          {result.recs.map((rec, i) => (
            <View key={rec.id} style={styles.recCard}>
              <View style={styles.recNum}>
                <Text style={styles.recNumText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.recReason}>{rec.reason}</Text>
                <TouchableOpacity
                  style={styles.recBtn}
                  onPress={() => navigation.navigate('ProductDetail', { productId: rec.id })}
                >
                  <Text style={styles.recBtnText}>VIEW PRODUCT →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.retakeBtn]}
            onPress={() => { setStep(0); setAnswers({}); setResult(null); progress.setValue(0); }}
          >
            <Text style={styles.retakeBtnText}>RETAKE QUIZ</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const q = QUESTIONS[step];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← BACK</Text>
      </TouchableOpacity>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.progressLabel}>{step + 1} / {QUESTIONS.length}</Text>
      </View>

      {/* Question */}
      <Animated.View
        style={[styles.questionWrap, { transform: [{ translateX: slideAnim }] }]}
      >
        <Text style={styles.eyebrow}>FIND YOUR RITUAL</Text>
        <Text style={styles.question}>{q.q}</Text>

        <View style={styles.optionsGrid}>
          {q.options.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={styles.option}
              activeOpacity={0.75}
              onPress={() => handleAnswer(q.id, opt.value)}
            >
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
    paddingHorizontal: SPACING.lg,
  },
  backBtn: {
    paddingVertical: SPACING.md,
  },
  backText: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    letterSpacing: 1.5,
    color: COLORS.warmGray,
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.xl,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(201,164,74,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.honeyGold,
    borderRadius: 99,
  },
  progressLabel: {
    fontFamily: FONTS.heading,
    fontSize: 9,
    letterSpacing: 1.5,
    color: COLORS.warmGray,
  },
  questionWrap: {
    flex: 1,
    paddingTop: SPACING.lg,
  },
  eyebrow: {
    fontFamily: FONTS.heading,
    fontSize: 9,
    letterSpacing: 2.5,
    color: COLORS.honeyGold,
    marginBottom: 12,
  },
  question: {
    fontFamily: FONTS.body,
    fontSize: 26,
    color: COLORS.deepBrown,
    lineHeight: 34,
    marginBottom: SPACING.xl,
  },
  optionsGrid: {
    gap: 12,
  },
  option: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(201,164,74,0.3)',
    backgroundColor: COLORS.offWhite,
    ...SHADOW.sm,
  },
  optionLabel: {
    fontFamily: FONTS.body,
    fontSize: 17,
    color: COLORS.deepBrown,
  },
  // Result styles
  resultWrap: {
    paddingBottom: 60,
  },
  resultEyebrow: {
    fontFamily: FONTS.heading,
    fontSize: 9,
    letterSpacing: 2.5,
    color: COLORS.honeyGold,
    marginTop: SPACING.md,
    marginBottom: 12,
  },
  resultTitle: {
    fontFamily: FONTS.heading,
    fontSize: 26,
    color: COLORS.deepBrown,
    lineHeight: 34,
    marginBottom: 16,
  },
  resultSub: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.warmGray,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  recCard: {
    flexDirection: 'row',
    gap: 14,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    borderColor: 'rgba(201,164,74,0.2)',
    marginBottom: 12,
    ...SHADOW.sm,
  },
  recNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.honeyGold,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  recNumText: {
    fontFamily: FONTS.headingBold,
    fontSize: 12,
    color: COLORS.deepBrown,
  },
  recReason: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.deepBrown,
    lineHeight: 22,
    marginBottom: 10,
  },
  recBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.honeyGold,
  },
  recBtnText: {
    fontFamily: FONTS.heading,
    fontSize: 9,
    letterSpacing: 1.5,
    color: COLORS.honeyGold,
  },
  retakeBtn: {
    marginTop: SPACING.lg,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.deepBrown,
  },
  retakeBtnText: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.cream,
  },
});
