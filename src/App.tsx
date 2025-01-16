import React, { useState } from 'react';
import { Collection, CardSet } from './types';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionMenu } from './components/collection/CollectionMenu';
import { StudySession } from './components/studySession/StudySession';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [currentSet, setCurrentSet] = useState<CardSet | null>(null);

  const handleCollectionSelect = (collection: Collection) => {
    setCurrentCollection(collection);
  };

  const handleCollectionUpdate = (updated: Collection) => {
    setCurrentCollection(updated);
  };

  const handleSetSelect = (set: CardSet) => {
    setCurrentSet(set);
  };

  const handleBackClick = () => {
    if (currentSet) {
      setCurrentSet(null);
    } else {
      setCurrentCollection(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {currentCollection ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-gray-200"
              onClick={handleBackClick}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold text-gray-100 ml-4">
              {currentCollection.name}
              {currentSet && ` / ${currentSet.name}`}
            </h1>
          </div>

          {currentSet ? (
            <StudySession
              cardSet={currentSet}
              onComplete={() => setCurrentSet(null)}
            />
          ) : (
            <CollectionMenu
              collection={currentCollection}
              onUpdate={handleCollectionUpdate}
              onSelectSet={handleSetSelect}
            />
          )}
        </div>
      ) : (
        <CollectionsPage onCollectionSelect={handleCollectionSelect} />
      )}
    </div>
  );
}

export default App;
