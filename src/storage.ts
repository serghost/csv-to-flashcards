import { Collection, CardSet } from './types';

const STORAGE_KEYS = {
  COLLECTIONS: 'flashcards-collections',
  LAST_ID: 'flashcards-last-id'
} as const;

const serializeCollection = (collection: Collection): string => {
  return JSON.stringify(collection, (key, value) => {
    if (key === 'lastSeen' && value instanceof Date) {
      return value.toISOString();
    }
    return value;
  });
};

const deserializeCollection = (json: string): Collection => {
  return JSON.parse(json, (key, value) => {
    if (key === 'lastSeen' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  });
};

export const storage = {
  loadCollections(): Collection[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (!stored) return [];

      const collections = JSON.parse(stored);
      return collections.map(deserializeCollection);
    } catch (error) {
      console.error('Failed to load collections:', error);
      return [];
    }
  },

  saveCollections(collections: Collection[]): void {
    try {
      const serialized = collections.map(serializeCollection);
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(serialized));
    } catch (error) {
      console.error('Failed to save collections:', error);
    }
  },

  addCardSet(collectionId: number, cardSet: CardSet): void {
    const collections = this.loadCollections();
    const collection = collections.find(c => c.id === collectionId);

    if (collection) {
      const existingSetIndex = collection.cardSets.findIndex(
        set => set.name === cardSet.name
      );

      if (existingSetIndex >= 0) {
        collection.cardSets[existingSetIndex] = cardSet;
      } else {
        collection.cardSets.push(cardSet);
      }

      this.saveCollections(collections);
    }
  },

  getNextId(): number {
    try {
      const lastId = Number(localStorage.getItem(STORAGE_KEYS.LAST_ID)) || 0;
      const nextId = lastId + 1;
      localStorage.setItem(STORAGE_KEYS.LAST_ID, String(nextId));
      return nextId;
    } catch {
      return Date.now();
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
      localStorage.removeItem(STORAGE_KEYS.LAST_ID);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
};
