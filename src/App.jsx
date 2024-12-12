import React from 'react';
import { LanguageCards } from './components/LanguageCards';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-100 text-center mb-8">
          Հայկական Քարտիկներ
        </h1>
        {/* cards component */}
        <LanguageCards />
      </div>
    </div>
  );
}

export default App;
