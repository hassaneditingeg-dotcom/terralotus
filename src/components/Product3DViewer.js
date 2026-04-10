import React, { useRef, useEffect, useState } from 'react';
import {
  View, PanResponder, Animated, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import { Image } from 'expo-image';
import { COLORS, FONTS } from '../theme';

/**
 * Product3DViewer
 * Drag to rotate a product image in 3D using perspective transforms.
 * No native modules required — pure Animated + PanResponder.
 */
export default function Product3DViewer({ images = [], style }) {
  const rotateY = useRef(new Animated.Value(-15)).current;
  const rotateX = useRef(new Animated.Value(5)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const shadow = useRef(new Animated.Value(0)).current;

  const lastY = useRef(-15);
  const lastX = useRef(5);
  const [activeImg, setActiveImg] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-intro spin on mount
  useEffect(() => {
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(rotateY, {
        toValue: 15,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(rotateY, {
        toValue: -15,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(rotateY, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      lastY.current = 0;
    });
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        Animated.spring(scale, { toValue: 1.04, friction: 4, useNativeDriver: true }).start();
        Animated.spring(shadow, { toValue: 1, friction: 4, useNativeDriver: true }).start();
      },
      onPanResponderMove: (_, gesture) => {
        const newY = lastY.current + gesture.dx * 0.35;
        const newX = lastX.current - gesture.dy * 0.2;
        const clampedY = Math.max(-45, Math.min(45, newY));
        const clampedX = Math.max(-20, Math.min(20, newX));
        rotateY.setValue(clampedY);
        rotateX.setValue(clampedX);
      },
      onPanResponderRelease: (_, gesture) => {
        setIsDragging(false);
        lastY.current = Math.max(-45, Math.min(45, lastY.current + gesture.dx * 0.35));
        lastX.current = Math.max(-20, Math.min(20, lastX.current - gesture.dy * 0.2));
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
        Animated.spring(shadow, { toValue: 0, friction: 5, useNativeDriver: true }).start();
        // Gentle spring back toward center
        Animated.spring(rotateX, {
          toValue: 0, friction: 6, tension: 40, useNativeDriver: true,
        }).start(() => { lastX.current = 0; });
      },
    })
  ).current;

  const rotateYInterp = rotateY.interpolate({
    inputRange: [-45, 0, 45],
    outputRange: ['-45deg', '0deg', '45deg'],
  });
  const rotateXInterp = rotateX.interpolate({
    inputRange: [-20, 0, 20],
    outputRange: ['20deg', '0deg', '-20deg'],
  });
  const shadowOpacity = shadow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 0.22],
  });
  const shadowRadius = shadow.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 24],
  });

  const src = images[activeImg] || images[0];

  return (
    <View style={[styles.container, style]}>
      {/* Hint label */}
      <View style={styles.hint}>
        <Text style={styles.hintText}>{isDragging ? 'ROTATING' : 'DRAG TO ROTATE'}</Text>
      </View>

      {/* 3D Stage */}
      <View style={styles.stage}>
        {/* Drop shadow */}
        <Animated.View style={[
          styles.dropShadow,
          { opacity: shadowOpacity, shadowRadius }
        ]} />

        {/* Rotating product */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.product,
            {
              transform: [
                { perspective: 900 },
                { rotateY: rotateYInterp },
                { rotateX: rotateXInterp },
                { scale },
              ],
            },
          ]}
        >
          <Image
            source={src}
            style={styles.img}
            contentFit="contain"
            transition={200}
          />

          {/* Sheen overlay — simulates light on 3D surface */}
          <Animated.View
            style={[
              styles.sheen,
              {
                opacity: rotateY.interpolate({
                  inputRange: [-45, 0, 45],
                  outputRange: [0.18, 0.03, 0.15],
                }),
              },
            ]}
            pointerEvents="none"
          />
        </Animated.View>
      </View>

      {/* Thumbnail strip for multi-image */}
      {images.length > 1 && (
        <View style={styles.thumbRow}>
          {images.map((img, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActiveImg(i)}
              style={[styles.thumb, i === activeImg && styles.thumbActive]}
            >
              <Image source={img} style={styles.thumbImg} contentFit="cover" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  hint: {
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 0.5,
    borderColor: 'rgba(201,164,74,0.4)',
    backgroundColor: 'rgba(201,164,74,0.06)',
  },
  hintText: {
    fontFamily: FONTS.heading,
    fontSize: 8,
    letterSpacing: 2,
    color: COLORS.honeyGold,
  },
  stage: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropShadow: {
    position: 'absolute',
    bottom: 10,
    width: 160,
    height: 30,
    borderRadius: 80,
    backgroundColor: '#3B3225',
    shadowColor: '#3B3225',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 10,
  },
  product: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 220,
    height: 220,
  },
  sheen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  thumbRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  thumbActive: {
    borderColor: COLORS.honeyGold,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
});
