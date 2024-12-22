import React, { useState } from 'react';
import { LanguageCards } from './components/LanguageCards';
import CollectionsPage, { Collection } from './pages/CollectionsPage';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);

  const handleCollectionSelect = (collection: Collection) => {
    setCurrentCollection(collection);
  };

  const handleBackClick = () => {
    setCurrentCollection(null);
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
            </h1>
          </div>
          <LanguageCards />
        </div>
      ) : (
        <CollectionsPage onCollectionSelect={handleCollectionSelect} />
      )}
    </div>
  );
}

export default App;
