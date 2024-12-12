import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function LanguageCards() {
  const [words, setWords] = useState([]); // Массив слов из CSV
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [remainingIndices, setRemainingIndices] = useState([]);
  // Здесь и ниже можно сделать всё 'generic' (чтобы работать с любыми языками),
  // Нужно переименовать переменные Armenian, Russian и т.д.
  // + возможно стоит обновить стандарт файла, первой строкой добавив названия языков
  const [isArmenianFirst, setIsArmenianFirst] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const handleFileUpload = (event) => { // useCallback :TODO:
    const file = event.target.files[0];  // check for format and words presence :TODO:

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n');

        const wordPairs = rows
          .filter(row => row.trim())
          .map(row => {
            const [armenian, russian] = row.split(',').map(word => word.trim());
            return { armenian, russian };
          });

        setWords(wordPairs);
        setGameStarted(false);
        setCurrentIndex(null);
      };
      reader.readAsText(file);
    }
  };

  const shuffleAndStart = () => {
    const indices = fisherYatesShuffle(
      Array.from({ length: words.length }, (_, i) => i)
    );
    setRemainingIndices(indices);
    setCurrentIndex(indices[0]);
    setShowTranslation(false);
    setGameStarted(true);
  };

  function fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const pickNextCard = () => {
    if (!gameStarted || remainingIndices.length === 0) return;

    const currentPosition = remainingIndices.indexOf(currentIndex);
    if (currentPosition === remainingIndices.length - 1) {
      setGameStarted(false);
      return;
    }

    const nextIndex = remainingIndices[currentPosition + 1];
    setCurrentIndex(nextIndex);
    setShowTranslation(false);
  };

  const pickPreviousCard = () => {
    if (!gameStarted || remainingIndices.length === 0) return;

    const currentPosition = remainingIndices.indexOf(currentIndex);
    if (currentPosition <= 0) return;

    const previousIndex = remainingIndices[currentPosition - 1];
    setCurrentIndex(previousIndex);
    setShowTranslation(false);
  };

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  const toggleLanguage = () => {
    setIsArmenianFirst(!isArmenianFirst);
    if (gameStarted) {
      setShowTranslation(false);
    }
  };

  const cardStyles = `
    .flip-card {
      perspective: 1000px;
      background-color: transparent;
      width: 100%;
      height: 12rem;
    }

    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform 0.6s;
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
  `;

  return (
    <div className="max-w-md mx-auto">
      <style>{cardStyles}</style>

      {!words.length ? (
        // Экран загрузки файла
        <div className="text-center">
          <label className="cursor-pointer">
            <div className="mb-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
            </div>
            <span className="text-lg text-gray-200">Загрузить CSV файл</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : !gameStarted ? (
        // Экран начала игры
        <div className="text-center">
          <Button
            onClick={shuffleAndStart}
            className="text-lg px-8 py-4 bg-gray-200 text-gray-900 hover:bg-gray-300"
          >
            Старт
          </Button>
        </div>
      ) : (
        // Экран с карточкой
        <div className="space-y-4">
          <div className="flex justify-between mb-4">
            <div className="text-gray-400">
              {remainingIndices.indexOf(currentIndex) + 1} / {remainingIndices.length}
            </div>
            <Button
              onClick={toggleLanguage}
              className="text-sm bg-gray-200 text-gray-900 hover:bg-gray-300"
            >
              {isArmenianFirst ? 'Армянский → Русский' : 'Русский → Армянский'}
            </Button>
          </div>

          <div className={`flip-card ${showTranslation ? 'flipped' : ''}`} onClick={toggleTranslation}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <span className="text-2xl text-gray-200">
                  {isArmenianFirst
                    ? words[currentIndex].armenian
                    : words[currentIndex].russian}
                </span>
              </div>
              <div className="flip-card-back">
                <span className="text-2xl text-gray-200">
                  {isArmenianFirst
                    ? words[currentIndex].russian
                    : words[currentIndex].armenian}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button
              onClick={pickPreviousCard}
              className="bg-gray-200 text-gray-900 hover:bg-gray-300"
              disabled={remainingIndices.indexOf(currentIndex) === 0}
            >
              Назад
            </Button>
            <Button
              onClick={pickNextCard}
              className="bg-gray-200 text-gray-900 hover:bg-gray-300"
            >
              Вперед
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
