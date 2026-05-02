# 📝 Bloc Note Personnel

Application mobile React Native (Expo) permettant de créer, modifier, supprimer et organiser ses notes personnelles.

---

## 🚀 Installation et lancement

### Prérequis
- Node.js (v18+)
- npm ou yarn
- Expo CLI : `npm install -g expo-cli`
- Application **Expo Go** sur votre téléphone (iOS ou Android)

### Étapes

```bash
# 1. Cloner ou dézipper le projet
cd BlocNotePersonnel

# 2. Installer les dépendances
npm install

# 3. Lancer l'application
npx expo start

# Scan du QR code avec Expo Go (iOS) ou la caméra (Android)
# Ou appuyer sur 'a' pour Android émulateur, 'i' pour iOS simulateur
```

---

## 📁 Structure du projet

```
BlocNotePersonnel/
├── App.js                    # Point d'entrée + navigation
├── app.json                  # Config Expo
├── package.json
├── babel.config.js
│
├── constants/
│   └── theme.js              # Couleurs, typographie, espacements
│
├── hooks/
│   └── useTheme.js           # Context + hook mode sombre/clair
│
├── storage/
│   └── notesStorage.js       # CRUD AsyncStorage + utilitaires
│
├── components/
│   ├── Header.js             # En-tête réutilisable
│   ├── NoteCard.js           # Carte de note
│   ├── SearchBar.js          # Barre de recherche animée
│   ├── ColorPicker.js        # Sélecteur de couleur
│   ├── SortModal.js          # Bottom sheet de tri
│   ├── ConfirmModal.js       # Modal de confirmation
│   └── EmptyState.js         # État vide illustré
│
└── screens/
    ├── HomeScreen.js         # Liste, recherche, filtres
    ├── AddNoteScreen.js      # Création de note
    └── EditNoteScreen.js     # Édition de note
```

---

## 🧩 Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| ➕ Ajouter une note | Titre + contenu + couleur personnalisable |
| ✏️ Modifier une note | Édition complète avec sauvegarde |
| 🗑️ Supprimer une note | Confirmation obligatoire avant suppression |
| 📋 Liste des notes | Affichage avec aperçu + métadonnées |
| 🔍 Recherche | Recherche en temps réel sur titre + contenu |
| 🔃 Tri | Par date (récent/ancien), titre (A-Z/Z-A), favoris |
| ⭐ Favoris | Marquer/démarquer + filtre dédié |
| 🌙 Mode sombre/clair | Persisté dans AsyncStorage |
| 🎨 Couleurs de note | 6 thèmes de couleur par note |

---

## 🏗️ Architecture et bonnes pratiques

### Pattern utilisé
- **MVC simplifié** : séparation claire données / logique / UI
- **Context API** pour le thème global (évite prop drilling)
- **AsyncStorage** pour la persistance locale (clé unique par app)

### Composants réutilisables
Tous les composants dans `/components` sont indépendants et configurables via props :
- `Header` : gestion back + actions droite
- `ConfirmModal` : modal de confirmation générique (danger ou neutre)
- `NoteCard` : carte avec animations de press
- `SearchBar` : champ avec focus animé

### Gestion de l'état
- Chaque écran gère son état local
- Le `HomeScreen` se recharge via `useFocusEffect` au retour de l'édition
- Pas de state management externe nécessaire à cette échelle



---

## 📦 Dépendances principales

| Package | Usage |
|---|---|
| `expo` | Plateforme de développement |
| `react-navigation` | Navigation entre écrans |
| `@react-native-async-storage/async-storage` | Persistance locale |
| `@expo/vector-icons` | Icônes Ionicons |
| `react-native-safe-area-context` | Gestion des zones sûres |
| `react-native-reanimated` | Animations avancées |

---

## 💡 Idées d'extension

- [ ] Export PDF des notes
- [ ] Partager une note
- [ ] Tags/catégories
- [ ] Rappels avec notifications locales
- [ ] Synchronisation cloud (Firebase / Supabase)
- [ ] Widgets home screen (Expo Widgets)
- [ ] Chiffrement des notes sensibles

---

## 👩‍💻 Auteur

Développé avec React Native + Expo · Architecture propre et extensible.
