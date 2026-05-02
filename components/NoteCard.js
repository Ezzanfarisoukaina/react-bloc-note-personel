// components/NoteCard.js
import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { NOTE_COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { formatDate } from '../storage/notesStorage';

export default function NoteCard({ note, onPress, onFavorite, onDelete }) {
  const { colors, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const noteColorObj = NOTE_COLORS.find((c) => c.id === note.color) || NOTE_COLORS[0];
  const cardBg = isDark ? noteColorObj.dark : noteColorObj.light;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const previewContent = note.content.length > 120
    ? note.content.substring(0, 120) + '...'
    : note.content;

  const wordCount = note.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {note.title || 'Sans titre'}
          </Text>
          <TouchableOpacity
            onPress={() => onFavorite(note.id)}
            style={styles.favoriteBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={note.isFavorite ? 'star' : 'star-outline'}
              size={20}
              color={note.isFavorite ? colors.star : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Content preview */}
        {note.content.length > 0 && (
          <Text
            style={[styles.preview, { color: colors.textSecondary }]}
            numberOfLines={3}
          >
            {previewContent}
          </Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.meta}>
            <Ionicons name="time-outline" size={12} color={colors.textMuted} />
            <Text style={[styles.date, { color: colors.textMuted }]}>
              {formatDate(note.updatedAt)}
            </Text>
            {wordCount > 0 && (
              <>
                <View style={[styles.dot, { backgroundColor: colors.textMuted }]} />
                <Text style={[styles.date, { color: colors.textMuted }]}>
                  {wordCount} mot{wordCount > 1 ? 's' : ''}
                </Text>
              </>
            )}
          </View>
          <TouchableOpacity
            onPress={() => onDelete(note)}
            style={styles.deleteBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>

        {/* Favorite indicator */}
        {note.isFavorite && (
          <View style={[styles.favIndicator, { backgroundColor: colors.star }]} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
    flex: 1,
    marginRight: SPACING.sm,
  },
  favoriteBtn: {
    padding: 2,
  },
  preview: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    lineHeight: TYPOGRAPHY.lineHeightMD,
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    marginLeft: 3,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginHorizontal: 2,
    opacity: 0.5,
  },
  deleteBtn: {
    padding: 4,
  },
  favIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    bottom: 0,
    borderTopRightRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },
});
