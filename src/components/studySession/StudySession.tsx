import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardSet } from '@/types';

const TIME_THRESHOLD = 5000;
const MIN_HARD_CARDS = 2;
const FLIP_ANIMATION_DURATION = 600;

interface StudySessionProps {
  cardSet: CardSet;
  onComplete: () => void;
}

export const StudySession: React.FC<StudySessionProps> = ({ cardSet, onComplete }) => {
  const [cards, setCards] = useState(cardSet.cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isFirstSide, setIsFirstSide] = useState(true);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const [currentSessionHardCards, setCurrentSessionHardCards] = useState<typeof cardSet.cards>([]);
  const [hardCards, setHardCards] = useState<typeof cardSet.cards>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isHardMode, setIsHardMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  function shuffleCards(cardsToShuffle: typeof cardSet.cards) {
    const shuffled = [...cardsToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const startSession = (useHardCards: boolean = false) => {
    const currentCards = useHardCards ? hardCards : cardSet.cards;
    setCards(shuffleCards(currentCards));
    setCurrentIndex(0);
    setShowTranslation(false);
    setStartTime(Date.now());
    setIsHardMode(useHardCards);

    setCurrentSessionHardCards([]);
    if (!useHardCards) {
      setHardCards([]);
    }
    setIsComplete(false);
  };

  useEffect(() => {
    console.log('hardCards updated:', hardCards);
  }, [hardCards]);

  const addToHardCards = (card: (typeof cardSet.cards)[0]) => {
    console.log('Trying to add card to hard:', card);

    const targetArray = isHardMode ? currentSessionHardCards : hardCards;
    const isAlreadyHard = targetArray.some(c => c.front === card.front && c.back === card.back);

    console.log('Is already hard?', isAlreadyHard);

    if (!isAlreadyHard) {
      console.log('Adding to hard cards');
      if (isHardMode) {
        setCurrentSessionHardCards(prev => [...prev, card]);
      } else {
        setHardCards(prev => [...prev, card]);
      }
      return true;
    }
    return false;
  };

  const toggleCard = () => {
    if (isTransitioning) return;

    const currentCard = cards[currentIndex];
    console.log('Toggle card:', currentCard);

    if (!showTranslation && !isHardMode) {
      console.log('First flip, considering for hard cards');
      if (addToHardCards(currentCard)) {
        console.log('Added to hard cards');
        currentCard.progress.incorrect++;
        currentCard.progress.lastTime = Date.now() - startTime;
        currentCard.progress.lastSeen = new Date();
      }
    }

    setShowTranslation(!showTranslation);
  };

  const handleNextCard = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const timeSpent = Date.now() - startTime;
    const currentCard = cards[currentIndex];
    const isLastCard = currentIndex === cards.length - 1;

    console.log('Next card:', {
      timeSpent,
      showTranslation,
      isHardMode,
      currentCard
    });

    if (showTranslation) {
      setShowTranslation(false);
      await new Promise(resolve => setTimeout(resolve, FLIP_ANIMATION_DURATION));
    } else if (!isHardMode && timeSpent > TIME_THRESHOLD) {
      console.log('Time threshold exceeded, adding to hard');
      if (addToHardCards(currentCard)) {
        console.log('Added to hard due to time');
      }
    }

    if (timeSpent <= TIME_THRESHOLD && !showTranslation) {
      currentCard.progress.correct++;
    }

    currentCard.progress.lastTime = timeSpent;
    currentCard.progress.lastSeen = new Date();

    if (isLastCard) {
      console.log('Last card. Hard cards:', hardCards.length, 'Current session hard cards:', currentSessionHardCards.length);
      if (isHardMode) {
        if (currentSessionHardCards.length >= MIN_HARD_CARDS) {
          setHardCards(currentSessionHardCards);
          startSession(true);
        } else {
          setIsComplete(true);
        }
      } else if (hardCards.length >= MIN_HARD_CARDS) {
        startSession(true);
      } else {
        setIsComplete(true);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
      setStartTime(Date.now());
    }

    setIsTransitioning(false);
  };

  const clearCache = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    window.location.reload();
  };

  // debug
  console.log('Current state:', {
    currentIndex,
    cardsLength: cards.length,
    hardCardsLength: hardCards.length,
    hardCards,
    isHardMode,
  });

  const cardStyles = `
    .flip-card {
      perspective: 1000px;
      background-color: transparent;
      width: 100%;
      height: 12rem;
      cursor: pointer;
    }

    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform ${FLIP_ANIMATION_DURATION}ms;
      transform-style: preserve-3d;
    }

    .flip-card.flipped .flip-card-inner {
      transform: rotateY(180deg);
    }

    .flip-card-front,
    .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgb(31 41 55);
      border: 1px solid rgb(55 65 81);
      border-radius: 0.5rem;
    }

    .flip-card-back {
      transform: rotateY(180deg);
    }

    .flip-card.transitioning {
      pointer-events: none;
    }
  `;

  if (isComplete) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-xl text-gray-200 mb-4">Сеанс завершен!</h2>
        <Button
          onClick={() => startSession()}
          variant="outline"
          className="w-full"
        >
          Начать заново
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <style>{cardStyles}</style>

      {/* Debug info */}
      {/* <div className="mb-4 p-2 bg-gray-800 rounded text-xs text-gray-400">
          <div>Всего карточек: {cards.length}</div>
          <div>Сложных слов (общих): {hardCards.length}</div>
          <div>Сложные слова (общие): {hardCards.map(card => `${card.front}:${card.back}`).join(', ')}</div>
          <div>Сложных слов (текущая сессия): {currentSessionHardCards.length}</div>
          <div>Сложные слова (текущая сессия): {currentSessionHardCards.map(card => `${card.front}:${card.back}`).join(', ')}</div>
          <div>Режим сложных: {isHardMode ? 'да' : 'нет'}</div>
          <Button
          onClick={clearCache}
          variant="outline"
          size="sm"
          className="mt-2 text-xs"
          >
          Очистить кэш
          </Button>
          </div> */}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="text-gray-400">
            {currentIndex + 1} / {cards.length}
          </div>
          {isHardMode && (
            <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500">
              Сложные слова ({hardCards.length})
            </span>
          )}
        </div>
        <Button
          onClick={() => setIsFirstSide(!isFirstSide)}
          className="text-sm bg-gray-200 text-gray-900 hover:bg-gray-300"
        >
          {isFirstSide ?
           `${cardSet.frontLabel} → ${cardSet.backLabel}` :
           `${cardSet.backLabel} → ${cardSet.frontLabel}`}
        </Button>
      </div>

      <div
        className={`flip-card ${showTranslation ? 'flipped' : ''} ${
          isTransitioning ? 'transitioning' : ''
        }`}
        onClick={toggleCard}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <span className="text-2xl text-gray-200">
              {isFirstSide ? cards[currentIndex].front : cards[currentIndex].back}
            </span>
          </div>
          <div className="flip-card-back">
            <span className="text-2xl text-gray-200">
              {isFirstSide ? cards[currentIndex].back : cards[currentIndex].front}
            </span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleNextCard}
        className="w-full bg-gray-200 text-gray-900 hover:bg-gray-300"
      >
        {currentIndex === cards.length - 1 ? 'Завершить' : 'Вперед'}
      </Button>
    </div>
  );
};
