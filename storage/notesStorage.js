// storage/notesStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@bloc_note_notes';

/**
 * Génère un identifiant unique pour chaque note
 */
const generateId = () => `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Récupère toutes les notes depuis le stockage local
 */
export const getAllNotes = async () => {
  try {
    const data = await AsyncStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des notes:', error);
    return [];
  }
};

/**
 * Sauvegarde une nouvelle note
 * @param {Object} noteData - { title, content, color }
 */
export const saveNote = async (noteData) => {
  try {
    const notes = await getAllNotes();
    const newNote = {
      id: generateId(),
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      color: noteData.color || 'default',
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    return newNote;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    throw error;
  }
};

/**
 * Met à jour une note existante
 * @param {string} id - L'identifiant de la note
 * @param {Object} updates - Les champs à mettre à jour
 */
export const updateNote = async (id, updates) => {
  try {
    const notes = await getAllNotes();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error('Note non trouvée');

    notes[idx] = {
      ...notes[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return notes[idx];
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    throw error;
  }
};

/**
 * Supprime une note par son identifiant
 * @param {string} id
 */
export const deleteNote = async (id) => {
  try {
    const notes = await getAllNotes();
    const filtered = notes.filter((n) => n.id !== id);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};

/**
 * Bascule le statut favori d'une note
 * @param {string} id
 */
export const toggleFavorite = async (id) => {
  try {
    const notes = await getAllNotes();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error('Note non trouvée');
    notes[idx].isFavorite = !notes[idx].isFavorite;
    notes[idx].updatedAt = new Date().toISOString();
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return notes[idx];
  } catch (error) {
    console.error('Erreur lors du toggle favori:', error);
    throw error;
  }
};

/**
 * Recherche les notes par mot-clé (titre + contenu)
 * @param {string} query
 */
export const searchNotes = async (query) => {
  try {
    const notes = await getAllNotes();
    if (!query.trim()) return notes;
    const q = query.toLowerCase().trim();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
};

/**
 * Trie les notes selon un critère
 * @param {Array} notes
 * @param {'date_desc'|'date_asc'|'title_asc'|'title_desc'|'favorites'} sortBy
 */
export const sortNotes = (notes, sortBy) => {
  const arr = [...notes];
  switch (sortBy) {
    case 'date_desc':
      return arr.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    case 'date_asc':
      return arr.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    case 'title_asc':
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    case 'title_desc':
      return arr.sort((a, b) => b.title.localeCompare(a.title));
    case 'favorites':
      return arr.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
    default:
      return arr;
  }
};

/**
 * Formate une date ISO en texte lisible français
 * @param {string} isoString
 */
export const formatDate = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const mins = Math.floor(diff / (1000 * 60));
      return mins <= 1 ? "À l'instant" : `Il y a ${mins} min`;
    }
    return hours === 1 ? 'Il y a 1h' : `Il y a ${hours}h`;
  }
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} jours`;

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};
