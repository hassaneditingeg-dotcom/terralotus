import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, Linking } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header, GoldButton, Divider } from '../components/UI';
import { COLORS, FONTS } from '../theme';

const BEE_LOGO = require('../../assets/logo-vivid.png');

const VALUES = [
  { icon: '🌿', title: '100% Natural', body: 'No synthetic fillers, no harsh chemicals — every ingredient serves a purpose.' },
  { icon: '🐄', title: 'Grass-Fed & Sourced', body: 'We source only the finest natural, grass-fed ingredients from trusted farms.' },
  { icon: '🇺🇸', title: 'Made in USA', body: 'Family owned and produced in the USA, small-batch for maximum quality.' },
  { icon: '🔬', title: 'Third Party Tested', body: 'Every batch independently tested and verified for purity and potency.' },
  { icon: '🛡️', title: '30-Day Guarantee', body: 'We stand behind every product with a full money-back guarantee.' },
];

const STORES = [
  { name: 'Amazon', url: 'https://www.amazon.com/stores/TerraLotus/page/C3414137-059E-46C6-B161-00AB64230F11?lp_asin=B0FFW9SQRW&ref_=ast_bln&store_ref=bl_ast_dp_brandlogo_sto' },
  { name: 'TikTok Shop', url: 'https://www.tiktok.com/@terralotus' },
  { name: 'Etsy', url: 'https://etsy.com' },
  { name: 'terralotus.shop', url: 'https://terralotus.shop' },
];

export default function AboutScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <Header navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={BEE_LOGO}
            style={{ width: 112, height: 112 }}
            contentFit="contain"
            transition={200}
          />
          <Text style={styles.heroTitle}>Our Story</Text>
          <Text style={styles.heroTagline}>Curated Purity. Exceptionally Sourced.</Text>
        </View>

        {/* Story */}
        <View style={styles.section}>
          <Text style={styles.storyText}>My two children and I started this company with one goal — to provide natural replacements to everyday products.</Text>
          <Text style={styles.storyText}>After struggling with allergies and rashes for so long, I began making my own alternatives and noticed all my issues went away.</Text>
          <Text style={styles.storyText}>Now, me and my family hope to help others in their pursuit for health, natural living, and a high quality of life.</Text>
        </View>

        <Divider />

        {/* Values */}
        <View style={styles.section}>
          <Text style={styles.eyebrow}>WHAT WE STAND FOR</Text>
          <Text style={styles.sectionTitle}>Our Values</Text>
          {VALUES.map(v => (
            <View key={v.title} style={styles.valRow}>
              <View style={styles.valCircle}><Text style={{ fontSize: 18 }}>{v.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.valTitle}>{v.title}</Text>
                <Text style={styles.valBody}>{v.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <Divider />

        {/* Where to find us */}
        <View style={styles.section}>
          <Text style={styles.eyebrow}>FIND US</Text>
          <Text style={styles.sectionTitle}>Where to Shop</Text>
          {STORES.map(s => (
            <TouchableOpacity key={s.name} style={styles.storeRow} onPress={() => Linking.openURL(s.url)}>
              <Text style={styles.storeName}>{s.name}</Text>
              <Text style={styles.storeArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Divider />

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.storeRow} onPress={() => Linking.openURL('https://terralotus.shop')}>
            <Text style={styles.storeName}>🌐 terralotus.shop</Text>
            <Text style={styles.storeArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.storeRow} onPress={() => Linking.openURL('mailto:support@terralotus.shop')}>
            <Text style={styles.storeName}>📧 support@terralotus.shop</Text>
            <Text style={styles.storeArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Email signup */}
        <View style={styles.emailSection}>
          <Text style={styles.emailTitle}>Join the Terra Lotus Family</Text>
          <Text style={styles.emailSub}>Exclusive offers, restocks, and natural living tips straight to your inbox.</Text>
          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={setEmail}
            placeholder="Your email address"
            placeholderTextColor="#B0A090"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <GoldButton title="SIGN UP" onPress={() => { /* TODO: connect to Klaviyo */ }} />
        </View>

        {/* Footer */}
        <View style={{ backgroundColor: COLORS.cream, paddingVertical: 16, alignItems: 'center' }}>
          <Text style={{ fontFamily: FONTS.bodyItalic, fontSize: 11, color: '#B0A090' }}>
            © 2026 Terra Lotus · All rights reserved
          </Text>
        </View>

        <View style={{ height: insets.bottom + 8 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: COLORS.deepBrown, padding: 28, alignItems: 'center' },
  heroLogo: { width: 56, height: 56, marginBottom: 12 },
  heroTitle: { fontFamily: FONTS.heading, fontSize: 22, color: COLORS.honeyGold, letterSpacing: 2, marginBottom: 6 },
  heroTagline: { fontFamily: FONTS.bodyItalic, fontSize: 13, color: '#DEC07A' },
  section: { padding: 18, paddingVertical: 20 },
  eyebrow: { fontFamily: FONTS.heading, fontSize: 9, letterSpacing: 3, color: COLORS.honeyGold, marginBottom: 5 },
  sectionTitle: { fontFamily: FONTS.heading, fontSize: 18, color: COLORS.deepBrown, marginBottom: 14 },
  storyText: { fontFamily: FONTS.bodyItalic, fontSize: 14, color: COLORS.warmGray, lineHeight: 22, marginBottom: 13 },
  valRow: { flexDirection: 'row', gap: 13, marginBottom: 13, alignItems: 'flex-start' },
  valCircle: { width: 40, height: 40, borderRadius: 99, backgroundColor: COLORS.softCream, borderWidth: 0.5, borderColor: 'rgba(201,164,74,0.33)', alignItems: 'center', justifyContent: 'center' },
  valTitle: { fontFamily: FONTS.bodyMedium, fontSize: 13, color: COLORS.deepBrown, marginBottom: 3 },
  valBody: { fontFamily: FONTS.bodyItalic, fontSize: 12, color: COLORS.warmGray, lineHeight: 18 },
  storeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: 'rgba(201,164,74,0.22)' },
  storeName: { fontFamily: FONTS.bodyMedium, fontSize: 14, color: COLORS.deepBrown },
  storeArrow: { fontFamily: FONTS.heading, fontSize: 16, color: COLORS.honeyGold },
  emailSection: { backgroundColor: COLORS.deepBrown, padding: 22 },
  emailTitle: { fontFamily: FONTS.heading, fontSize: 14, color: COLORS.honeyGold, textAlign: 'center', marginBottom: 7 },
  emailSub: { fontFamily: FONTS.bodyItalic, fontSize: 12, color: '#DEC07A', textAlign: 'center', lineHeight: 18, marginBottom: 14 },
  emailInput: { backgroundColor: COLORS.cream, borderRadius: 9, padding: 13, fontFamily: FONTS.body, fontSize: 13, color: COLORS.deepBrown, marginBottom: 10 },
});
