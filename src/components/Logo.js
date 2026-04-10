import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

export default function Logo({ size = 40, showText = true, color = COLORS.honeyGold }) {
  const beeScale = size / 100;

  return (
    <View style={styles.container}>
      {showText && (
        <View style={styles.textWrap}>
          <Text style={[styles.text, { color: COLORS.deepBrown }]}>TERRA</Text>
          <Text style={[styles.text, { color: COLORS.honeyGold, marginLeft: 4 }]}>LOTUS</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrap: {
    flexDirection: 'row',
    flexDirection: 'row',
  },
  text: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: '400',
  },
});
