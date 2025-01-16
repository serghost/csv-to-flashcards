import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { storage } from '@/storage';

interface Collection {
  id: number;
  name: string;
  background: string;
}

interface CollectionsPageProps {
  onCollectionSelect: (collection: Collection) => void;
}

const generateGradientBackground = (name: string): string => {
  const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = (seed * 137.508) % 360;
  const hue2 = (hue1 + 120 + Math.sin(seed) * 60) % 360;
  return `linear-gradient(135deg,
    hsl(${hue1}, ${65 + Math.sin(seed * 0.1) * 15}%, ${20 + Math.sin(seed * 0.2) * 10}%),
    hsl(${hue2}, ${70 + Math.sin(seed * 0.15) * 15}%, ${30 + Math.sin(seed * 0.25) * 10}%)
  )`;
};

export const CollectionsPage: React.FC = ({ onCollectionSelect }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [nextId, setNextId] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setCollections(storage.loadCollections());
  }, []);

  const handleAddCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: nextId,
        name: newCollectionName.trim(),
        background: generateGradientBackground(newCollectionName),
        cardSets: []
      };
      setCollections((prev) => [newCollection, ...prev]);
      setNextId(nextId + 1);
      setNewCollectionName('');
      setIsDialogOpen(false);
      onCollectionSelect(newCollection);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-8 text-gray-100">Коллекции</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Card className="h-32 flex flex-col items-center justify-center text-gray-400 cursor-pointer border-dashed border-2 border-gray-700 bg-gray-800 hover:bg-gray-700 transition-colors">
                <PlusCircle className="w-8 h-8 mb-2" />
                <span className="text-sm">Добавить коллекцию</span>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-gray-100">
              <DialogHeader>
                <DialogTitle>Добавить новую коллекцию</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Название коллекции"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
                <Button
                  onClick={handleAddCollection}
                  disabled={!newCollectionName.trim()}
                  className="w-full"
                >
                  Сохранить
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {collections.map((collection) => (
            <Card
              key={collection.id}
              style={{ background: collection.background }}
              className="h-32 flex items-center justify-center text-gray-100 font-bold text-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onCollectionSelect(collection)}
            >
            {collection.name}
            <span className="text-center px-2">{collection.name}</span>
            <span className="text-sm font-normal text-gray-400 mt-2">
              {collection.cardSets.length || 'Нет'} наборов
            </span>
            </Card>
          ))}
        </div>
    </div>
    </div>
  );
};

export default CollectionsPage;
