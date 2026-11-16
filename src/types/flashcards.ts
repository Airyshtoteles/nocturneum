export interface Flashcard {
  id: string; // UUID v4
  front: string; // markdown
  back: string; // markdown
}

export interface FlashcardDeck {
  id: string; // UUID v4
  name: string;
  cards: Flashcard[];
  createdAt: number;
}

export interface FlashcardState {
  decks: FlashcardDeck[];
  activeDeckId: string | null;
  currentCardIndex: number;
  isFlipped: boolean;
  isEditing: boolean;
}

export interface StoredFlashcardData {
  decks: FlashcardDeck[];
  lastActiveDeckId: string | null;
}

export interface FlashcardStorage {
  version: number;
  decks: FlashcardDeck[];
  lastActiveDeckId: string | null;
}

export interface GrimoireFlashcardsProps {
  judgeMode?: boolean;
}
