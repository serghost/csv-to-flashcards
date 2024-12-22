import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface FlashCardProps {
  frontText: string;
  backText: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export const FlashCard: React.FC<FlashCardProps> = ({
  frontText,
  backText,
  isFlipped,
  onFlip
}) => {
  return (
    <Card
      className={`cursor-pointer ${isFlipped ? 'flipped' : ''}`}
      onClick={onFlip}
    >
      <CardContent>
        <div className="text-2xl">
          {isFlipped ? backText : frontText}
        </div>
      </CardContent>
    </Card>
  );
};
