import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import { validateSearchQuery } from '../../utils/validation';

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
  const [validationError, setValidationError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  
  const selectedFilter = FILTER_OPTIONS.find(f => f.value === searchState.filter) || FILTER_OPTIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Validate query when it changes
  useEffect(() => {
    if (searchState.query.trim()) {
      const validation = validateSearchQuery(searchState.query, searchState.filter);
      setValidationError(validation.isValid ? null : validation.error);
    } else {
      setValidationError(null);
    }
  }, [searchState.query, searchState.filter]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (validationError) {
        showToast('error', 'Invalid Input', validationError);
        return;
      }
      onSearch();
    }
  };

  const handleFilterSelect = (value: string) => {
    onFilterChange(value);
    setIsFilterOpen(false);
  };

  const handleSearchClick = () => {
    if (validationError) {
      showToast('error', 'Invalid Input', validationError);
      return;
    }
    onSearch();
  };

  const getPlaceholderText = () => {
    switch (searchState.filter) {
      case 'email':
        return 'Enter email address (e.g., user@example.com)';
      case 'phone':
        return 'Enter phone number (e.g., +1-555-123-4567)';
      case 'name':
        return 'Enter full name (e.g., John Doe)';
      case 'company':
        return 'Enter company name (e.g., Acme Corp)';
      default:
        return 'Enter name, email, phone number, or company...';
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Search input with validation */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder={getPlaceholderText()}
          value={searchState.query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={searchState.isLoading}
          className={`w-full px-6 py-4 text-lg border-0 border-b-2 ${
            validationError ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-slate-900'
          } focus:outline-none transition-colors placeholder-slate-400 bg-transparent`}
        />
        
        {/* Validation error display */}
        {validationError && (
          <div className="absolute top-full left-0 mt-2 text-sm text-red-600 font-light">
            {validationError}
          </div>
        )}
      </div>

      {/* Filter and search controls */}
      <div className="flex items-center justify-center space-x-4">
        {/* Filter dropdown */}
        <FilterDropdown
          ref={dropdownRef}
          options={FILTER_OPTIONS}
          selectedValue={searchState.filter}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          onSelect={handleFilterSelect}
        />

        {/* Search button */}
        <button
          onClick={handleSearchClick}
          disabled={!searchState.query.trim() || searchState.isLoading || !!validationError}
          className="px-8 py-3 bg-slate-900 text-white disabled:bg-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium tracking-wide rounded-lg"
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

const FilterDropdown = React.forwardRef<HTMLDivElement, FilterDropdownProps>(({
  options,
  selectedValue,
  isOpen,
  onToggle,
  onSelect,
}, ref) => {
  const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];

  const handleOptionClick = (value: string) => {
    onSelect(value);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-3 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium tracking-wide border border-slate-200 rounded-lg"
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
        <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg border border-slate-200 rounded-lg z-10 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors text-sm ${
                option.value === selectedValue ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});