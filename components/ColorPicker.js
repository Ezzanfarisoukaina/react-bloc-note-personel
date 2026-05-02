// components/ColorPicker.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NOTE_COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

export default function ColorPicker({ selected, onSelect }) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Couleur</Text>
      <View style={styles.swatches}>
        {NOTE_COLORS.map((c) => {
          const bg = isDark ? c.dark : c.light;
          const isSelected = selected === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => onSelect(c.id)}
              style={[
                styles.swatch,
                {
                  backgroundColor: bg,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2.5 : 1.5,
                },
              ]}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={14} color={colors.primary} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: '500',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  swatches: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
