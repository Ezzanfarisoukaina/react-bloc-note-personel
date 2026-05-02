// screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../hooks/useTheme';
import {
  getAllNotes,
  deleteNote,
  toggleFavorite,
  searchNotes,
  sortNotes,
} from '../storage/notesStorage';
import { SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import SortModal from '../components/SortModal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';

export default function HomeScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();

  const [notes, setNotes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [showSort, setShowSort] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all | favorites

  // Charger les notes à chaque focus de l'écran
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    const data = await getAllNotes();
    setNotes(data);
    applyFilters(data, query, sortBy, activeFilter);
  };

  const applyFilters = (data, q, sort, filter) => {
    let result = [...data];

    // Filtrer par favoris
    if (filter === 'favorites') {
      result = result.filter((n) => n.isFavorite);
    }

    // Recherche textuelle
    if (q.trim()) {
      const lower = q.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(lower) ||
          n.content.toLowerCase().includes(lower)
      );
    }

    // Tri
    result = sortNotes(result, sort);
    setFiltered(result);
  };

  const handleSearch = (text) => {
    setQuery(text);
    applyFilters(notes, text, sortBy, activeFilter);
  };

  const handleSort = (newSort) => {
    setSortBy(newSort);
    applyFilters(notes, query, newSort, activeFilter);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    applyFilters(notes, query, sortBy, filter);
  };

  const handleFavorite = async (id) => {
    await toggleFavorite(id);
    loadNotes();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteNote(deleteTarget.id);
    setDeleteTarget(null);
    loadNotes();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const favoriteCount = notes.filter((n) => n.isFavorite).length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.appTitle, { color: colors.text }]}>📝 Mes Notes</Text>
          <Text style={[styles.appSubtitle, { color: colors.textMuted }]}>
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowSort(true)}
            style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt }]}
          >
            <Ionicons name="funnel-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar value={query} onChangeText={handleSearch} />
      </View>

      {/* Filter tabs */}
      <View style={styles.tabs}>
        {[
          { id: 'all', label: 'Toutes', count: notes.length },
          { id: 'favorites', label: '⭐ Favoris', count: favoriteCount },
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => handleFilter(tab.id)}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive ? colors.primary : colors.surfaceAlt,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
              <View
                style={[
                  styles.tabBadge,
                  {
                    backgroundColor: isActive
                      ? 'rgba(255,255,255,0.25)'
                      : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabBadgeText,
                    { color: isActive ? '#FFFFFF' : colors.textMuted },
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notes list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => navigation.navigate('EditNote', { note: item })}
            onFavorite={handleFavorite}
            onDelete={(note) => setDeleteTarget(note)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon={query ? 'search-outline' : 'document-text-outline'}
            title={query ? 'Aucun résultat' : activeFilter === 'favorites' ? 'Aucun favori' : 'Aucune note'}
            subtitle={
              query
                ? `Aucune note ne correspond à "${query}"`
                : activeFilter === 'favorites'
                ? 'Marquez des notes comme favorites pour les retrouver ici.'
                : 'Appuyez sur + pour créer votre première note.'
            }
          />
        }
      />

      {/* FAB - Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddNote')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modals */}
      <SortModal
        visible={showSort}
        current={sortBy}
        onSelect={handleSort}
        onClose={() => setShowSort(false)}
      />

      <ConfirmModal
        visible={!!deleteTarget}
        danger
        title="Supprimer la note"
        message={`Voulez-vous vraiment supprimer "${deleteTarget?.title || 'cette note'}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  appTitle: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightSemiBold,
  },
  tabBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  tabBadgeText: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  list: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: SPACING.md,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
