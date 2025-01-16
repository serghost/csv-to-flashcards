import React from 'react';
import { Collection, CardSet } from '@/types';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { storage } from '@/storage';

interface CollectionMenuProps {
  collection: Collection;
  onUpdate: (collection: Collection) => void;
  onSelectSet: (set: CardSet) => void;
}

export const CollectionMenu: React.FC<CollectionMenuProps> = ({
  collection,
  onUpdate,
  onSelectSet
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result as string;
      const rows = text.split('\n');

      if (rows.length < 2) {
        console.error('CSV файл должен содержать заголовки и хотя бы одну пару');
        return;
      }

      const [frontLabel, backLabel] = rows[0]
        .split(',')
        .map(label => label.trim());

      if (!frontLabel || !backLabel) {
        console.error('Не найдены заголовки в первой строке');
        return;
      }

      const cards = rows.slice(1)
        .filter(row => row.trim())
        .map(row => {
          const [front, back] = row.split(',').map(word => word.trim());
          return {
            front,
            back,
            progress: {
              correct: 0,
              incorrect: 0
            }
          };
        })
        .filter(card => card.front && card.back);

      if (cards.length === 0) {
        console.error('Не найдено валидных пар в CSV файле');
        return;
      }

      const newSet: CardSet = {
        name: file.name.replace('.csv', ''),
        frontLabel,
        backLabel,
        cards
      };

      const updatedCollection = {
        ...collection,
        cardSets: [...collection.cardSets, newSet]
      };

      storage.saveCollections([updatedCollection]);
      onUpdate(updatedCollection);
    };

    reader.readAsText(file);
  };

  const handleDeleteSet = (setName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedCollection = {
      ...collection,
      cardSets: collection.cardSets.filter(set => set.name !== setName)
    };
    storage.saveCollections([updatedCollection]);
    onUpdate(updatedCollection);
  };

  return (
    <div className="space-y-8">
      {/* Кнопка загрузки */}
      <Card className="p-8 border-dashed border-2 border-gray-700">
        <label className="flex flex-col items-center cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <span className="text-lg text-gray-200">Загрузить CSV файл</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </Card>

      {/* Секция загруженных наборов */}
      {collection.cardSets.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Загруженные наборы
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {collection.cardSets.map((set) => (
              <Card
                key={set.name}
                className="p-4 bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer group"
                onClick={() => onSelectSet(set)}
              >
                <div className="flex flex-col space-y-2 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteSet(set.name, e)}
                  >
                    <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
                  </Button>
                  <span className="font-medium text-gray-200 pr-8">{set.name}</span>
                  <span className="text-sm text-gray-400">
                    {set.frontLabel} → {set.backLabel}
                  </span>
                  <span className="text-sm text-gray-400">
                    {set.cards.length} карточек
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
