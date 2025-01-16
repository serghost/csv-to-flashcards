export interface Card {
  front: string;
  back: string;
  progress: {
    correct: number;
    incorrect: number;
    lastSeen?: Date;
    averageTime?: number;
    lastTime?: number;
  };
}

export interface CardSet {
  name: string;
  frontLabel: string;
  backLabel: string;
  cards: Card[];
}

export interface Collection {
  id: number;
  name: string;
  cardSets: CardSet[];
}
