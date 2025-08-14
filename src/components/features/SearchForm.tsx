import React, { useState } from 'react';

interface SearchState {
  query: string;
  filter: string;
  isLoading: boolean;
}

interface SearchFormProps {
  searchState: SearchState;
  onQueryChange: (query: string) => void;
  onFilterChange: (filter: string) => void;
  onSearch: () => void;
  className?: string;
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Fields' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
];

export const SearchForm: React.FC<SearchFormProps> = ({
  searchState,
  onQueryChange,
  onFilterChange,
  onSearch,
  className = '',
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const selectedFilter = FILTER_OPTIONS.find(f => f.value === searchState.filter) || FILTER_OPTIONS[0];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Clean search input without card wrapper */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Enter name, email, phone number, or company..."
          value={searchState.query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={searchState.isLoading}
          className="w-full px-6 py-4 text-lg border-0 border-b-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-colors placeholder-slate-400 bg-transparent"
        />
      </div>

      {/* Simplified filter and search */}
      <div className="flex items-center justify-center space-x-4">
        {/* Minimal filter dropdown */}
        <FilterDropdown
          options={FILTER_OPTIONS}
          selectedValue={searchState.filter}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          onSelect={(value) => {
            onFilterChange(value);
            setIsFilterOpen(false);
          }}
        />

        {/* Clean search button */}
        <button
          onClick={onSearch}
          disabled={!searchState.query.trim() || searchState.isLoading}
          className="px-8 py-3 bg-slate-900 text-white disabled:bg-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium tracking-wide"
        >
          {searchState.isLoading ? 'SEARCHING...' : 'SEARCH'}
        </button>
      </div>
    </div>
  );
};

// Minimal Filter Dropdown Component
interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selectedValue: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  selectedValue,
  isOpen,
  onToggle,
  onSelect,
}) => {
  const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-3 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium tracking-wide"
      >
        <span>{selectedOption.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg border border-slate-200 z-10">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors text-sm text-slate-700"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};