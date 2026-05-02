// components/SortModal.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

const SORT_OPTIONS = [
  { id: 'date_desc', label: 'Plus récentes', icon: 'calendar-outline' },
  { id: 'date_asc', label: 'Plus anciennes', icon: 'calendar-clear-outline' },
  { id: 'title_asc', label: 'Titre A → Z', icon: 'text-outline' },
  { id: 'title_desc', label: 'Titre Z → A', icon: 'text-outline' },
  { id: 'favorites', label: 'Favoris en premier', icon: 'star-outline' },
];

export default function SortModal({ visible, current, onSelect, onClose }) {
  const { colors } = useTheme();

  return (
    <Modal transparent visible={visible} animationType="slide">
      <Pressable
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
        onPress={onClose}
      >
        <Pressable>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <Text style={[styles.sheetTitle, { color: colors.text }]}>Trier par</Text>

            {SORT_OPTIONS.map((opt) => {
              const isActive = current === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.option,
                    isActive && {
                      backgroundColor: colors.tagBg,
                    },
                  ]}
                  onPress={() => { onSelect(opt.id); onClose(); }}
                >
                  <Ionicons
                    name={opt.icon}
                    size={20}
                    color={isActive ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: isActive ? colors.primary : colors.text },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isActive && (
                    <Ionicons name="checkmark" size={18} color={colors.primary} style={styles.check} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl + 16,
    paddingTop: SPACING.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  sheetTitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
    gap: SPACING.md,
  },
  optionLabel: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
    flex: 1,
  },
  check: {
    marginLeft: 'auto',
  },
});
