import React from 'react';

interface PopularSearchesProps {
  searches?: string[];
  onSearchSelect: (search: string) => void;
  className?: string;
}

export const PopularSearches: React.FC<PopularSearchesProps> = ({
  searches = [
    'Fake tech support calls',
    'Romance scam profiles',
    'Investment fraud schemes',
    'Phishing emails',
    'Crypto scam websites',
    'Job interview scams',
    'Online shopping fraud',
    'Tax refund scams',
  ],
  onSearchSelect,
  className = '',
}) => {
  return (
    <div className={`${className}`}>
      {/* Minimal header */}
      <h3 className="text-lg font-light text-slate-900 mb-6 tracking-wide">
        Popular Searches
      </h3>
      
      {/* Clean list without decorative elements */}
      <div className="space-y-3">
        {searches.map((search, index) => (
          <PopularSearchItem
            key={index}
            search={search}
            onClick={() => onSearchSelect(search)}
          />
        ))}
      </div>
    </div>
  );
};

// Minimal Popular Search Item
interface PopularSearchItemProps {
  search: string;
  onClick: () => void;
}

const PopularSearchItem: React.FC<PopularSearchItemProps> = ({
  search,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left py-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-light"
    >
      {search}
    </button>
  );
};