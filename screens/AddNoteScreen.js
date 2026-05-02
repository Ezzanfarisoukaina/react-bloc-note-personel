// screens/AddNoteScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../hooks/useTheme';
import { saveNote } from '../storage/notesStorage';
import { SPACING, RADIUS, TYPOGRAPHY, NOTE_COLORS } from '../constants/theme';
import Header from '../components/Header';
import ColorPicker from '../components/ColorPicker';

export default function AddNoteScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('default');
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef(null);

  const noteColorObj = NOTE_COLORS.find((c) => c.id === selectedColor) || NOTE_COLORS[0];
  const cardBg = isDark ? noteColorObj.dark : noteColorObj.light;

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Note vide', 'Veuillez ajouter un titre ou du contenu.');
      return;
    }
    setIsSaving(true);
    try {
      await saveNote({ title, content, color: selectedColor });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder la note.');
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = title.trim() || content.trim();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <Header
        title="Nouvelle note"
        showBack
        onBack={() => navigation.goBack()}
        rightActions={[
          {
            icon: 'checkmark',
            onPress: handleSave,
            primary: true,
          },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Color picker */}
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ColorPicker selected={selectedColor} onSelect={setSelectedColor} />
          </View>

          {/* Note editor */}
          <View
            style={[
              styles.noteCard,
              {
                backgroundColor: cardBg,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <TextInput
              style={[styles.titleInput, { color: colors.text }]}
              placeholder="Titre de la note..."
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              returnKeyType="next"
              onSubmitEditing={() => contentRef.current?.focus()}
            />

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TextInput
              ref={contentRef}
              style={[styles.contentInput, { color: colors.text }]}
              placeholder="Commencez à écrire votre note..."
              placeholderTextColor={colors.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              autoFocus={false}
            />
          </View>

          {/* Character count */}
          <View style={styles.statsRow}>
            <Text style={[styles.stat, { color: colors.textMuted }]}>
              <Ionicons name="text-outline" size={12} /> {content.trim().split(/\s+/).filter(Boolean).length} mots
            </Text>
            <Text style={[styles.stat, { color: colors.textMuted }]}>
              {content.length} caractères
            </Text>
          </View>
        </ScrollView>

        {/* Save button */}
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: canSave ? colors.primary : colors.border },
            ]}
            onPress={handleSave}
            disabled={!canSave || isSaving}
            activeOpacity={0.85}
          >
            <Ionicons name="save-outline" size={20} color={canSave ? '#FFFFFF' : colors.textMuted} />
            <Text style={[styles.saveBtnText, { color: canSave ? '#FFFFFF' : colors.textMuted }]}>
              {isSaving ? 'Sauvegarde...' : 'Enregistrer la note'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  section: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  noteCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
    minHeight: 280,
  },
  titleInput: {
    fontSize: TYPOGRAPHY.fontSizeXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    letterSpacing: -0.3,
    paddingVertical: SPACING.sm,
    minHeight: 50,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  contentInput: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    lineHeight: 24,
    minHeight: 200,
    paddingTop: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  stat: {
    fontSize: TYPOGRAPHY.fontSizeXS,
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.lg,
  },
  saveBtnText: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
});
