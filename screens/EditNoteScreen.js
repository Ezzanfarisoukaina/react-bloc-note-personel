// screens/EditNoteScreen.js
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
import { updateNote, deleteNote, toggleFavorite } from '../storage/notesStorage';
import { SPACING, RADIUS, TYPOGRAPHY, NOTE_COLORS } from '../constants/theme';
import Header from '../components/Header';
import ColorPicker from '../components/ColorPicker';
import ConfirmModal from '../components/ConfirmModal';

export default function EditNoteScreen({ navigation, route }) {
  const { note } = route.params;
  const { colors, isDark } = useTheme();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [selectedColor, setSelectedColor] = useState(note.color || 'default');
  const [isFavorite, setIsFavorite] = useState(note.isFavorite);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const contentRef = useRef(null);

  const noteColorObj = NOTE_COLORS.find((c) => c.id === selectedColor) || NOTE_COLORS[0];
  const cardBg = isDark ? noteColorObj.dark : noteColorObj.light;

  const markChanged = () => setHasChanges(true);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Note vide', 'Veuillez ajouter un titre ou du contenu.');
      return;
    }
    setIsSaving(true);
    try {
      await updateNote(note.id, {
        title: title.trim(),
        content: content.trim(),
        color: selectedColor,
        isFavorite,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les modifications.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFavoriteToggle = async () => {
    setIsFavorite((prev) => !prev);
    markChanged();
  };

  const handleDelete = async () => {
    try {
      await deleteNote(note.id);
      setShowDeleteModal(false);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de supprimer la note.');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <Header
        title="Modifier la note"
        showBack
        onBack={() => navigation.goBack()}
        rightActions={[
          {
            icon: isFavorite ? 'star' : 'star-outline',
            onPress: handleFavoriteToggle,
            primary: false,
          },
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
            <ColorPicker
              selected={selectedColor}
              onSelect={(c) => { setSelectedColor(c); markChanged(); }}
            />
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
              onChangeText={(t) => { setTitle(t); markChanged(); }}
              maxLength={100}
              returnKeyType="next"
              onSubmitEditing={() => contentRef.current?.focus()}
            />

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TextInput
              ref={contentRef}
              style={[styles.contentInput, { color: colors.text }]}
              placeholder="Contenu de la note..."
              placeholderTextColor={colors.textMuted}
              value={content}
              onChangeText={(t) => { setContent(t); markChanged(); }}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <Text style={[styles.stat, { color: colors.textMuted }]}>
              {content.trim().split(/\s+/).filter(Boolean).length} mots · {content.length} caractères
            </Text>
            {isFavorite && (
              <Text style={[styles.stat, { color: colors.star }]}>⭐ Favori</Text>
            )}
          </View>
        </ScrollView>

        {/* Footer actions */}
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.deleteBtn, { borderColor: colors.danger }]}
            onPress={() => setShowDeleteModal(true)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.primary, flex: 1 }]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            <Ionicons name="save-outline" size={20} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>
              {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={showDeleteModal}
        danger
        title="Supprimer la note"
        message={`Voulez-vous vraiment supprimer "${note.title || 'cette note'}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
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
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderTopWidth: 1,
  },
  deleteBtn: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    height: 52,
    borderRadius: RADIUS.md,
  },
  saveBtnText: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    color: '#FFFFFF',
  },
});
