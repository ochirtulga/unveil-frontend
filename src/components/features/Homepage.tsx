// src/components/features/Homepage.tsx
import React, { useEffect } from 'react';
import { Layout, Container } from '../layout/Layout';
import { HeroSection } from './HeroSection';
import { SearchForm } from './SearchForm';
import { SearchResults } from './SearchResults';
import { useSearch } from '../../hooks/useSearch';

interface HomepageProps {
  className?: string;
}

export const Homepage: React.FC<HomepageProps> = ({ className = '' }) => {
  const { 
    searchState, 
    updateQuery, 
    updateFilter, 
    performSearch, 
    loadLatestCases,
    loadNextPage, 
    loadPreviousPage, 
    castVote, 
    isVotingInProgress,
    resetSearch
  } = useSearch();

  // Load latest cases when component mounts
  useEffect(() => {
    // Only load if we haven't loaded anything yet
    if (!searchState.hasSearched && !searchState.isLoading && searchState.results.length === 0) {
      loadLatestCases();
    }
  }, []); // Empty dependency array - only run on mount

  const handlePopularSearchSelect = (search: string) => {
    updateQuery(search);
    performSearch();
  };

  const handleLogoClick = () => {
    // Reset search state and load latest cases
    resetSearch();
    // Small delay to ensure state is reset
    setTimeout(() => {
      loadLatestCases();
    }, 100);
  };

  // Show search results or latest cases
  const showResults = searchState.hasSearched || searchState.isLoading || 
                     (searchState.isShowingLatest && searchState.results.length > 0);
  
  // Determine the current mode for display purposes
  const getCurrentMode = () => {
    if (searchState.query.trim() && searchState.hasSearched) {
      return 'search';
    } else if (searchState.isShowingLatest && searchState.results.length > 0) {
      return 'latest';
    } else if (searchState.isLoading) {
      return 'loading';
    }
    return 'none';
  };

  const currentMode = getCurrentMode();

  return (
    <Layout onLogoClick={handleLogoClick} className={className}>
      <Container size="md">
        <div className="py-16">
          {/* Minimalistic Hero Section - Always Visible */}
          <div className="text-center mb-12">
            {!showResults ? (
              // Full hero when no results
              <div>
                <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-6 tracking-tight">
                  Find Out Truth
                </h1>
                <p className="text-lg text-slate-600 max-w-xl mx-auto mb-12 font-light leading-relaxed">
                  Search our comprehensive database to verify suspicious contacts and protect yourself from scams.
                </p>
              </div>
            ) : (
              // Minimal hero when showing results
              <div>
                <h1 className="text-3xl md:text-4xl font-light text-slate-900 mb-4 tracking-tight">
                  Find Out Truth
                </h1>
                <p className="text-sm text-slate-600 max-w-lg mx-auto mb-8 font-light">
                  Community-driven scam verification platform
                </p>
              </div>
            )}
          </div>
          
          {/* Search Form */}
          <SearchForm
            searchState={searchState}
            onQueryChange={updateQuery}
            onFilterChange={updateFilter}
            onSearch={performSearch}
            className="mb-12"
          />

          {/* Results Section */}
          {showResults && (
            <>
              {/* Results Header */}
              <div className="mb-8">
                {currentMode === 'latest' && !searchState.isLoading && (
                  <div className="text-center">
                    <h2 className="text-xl font-light text-slate-900 mb-2 tracking-wide">
                      Latest Cases
                    </h2>
                    <p className="text-slate-600 font-light mb-6 text-sm">
                      Most recently reported cases from the community
                    </p>
                  </div>
                )}
                
                {currentMode === 'search' && !searchState.isLoading && (
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-light text-slate-900 mb-2 tracking-wide">
                      Search Results
                    </h2>
                    <button
                      onClick={handleLogoClick}
                      className="text-sm text-slate-600 hover:text-slate-900 font-light tracking-wide transition-colors"
                    >
                      ← Back to Latest Cases
                    </button>
                  </div>
                )}

                {currentMode === 'loading' && (
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-light text-slate-900 mb-2 tracking-wide">
                      {searchState.query.trim() ? 'Searching Cases' : 'Loading Latest Cases'}
                    </h2>
                  </div>
                )}
              </div>

              {/* Search Results Component */}
              <SearchResults
                results={searchState.results}
                pagination={searchState.pagination}
                message={searchState.lastSearchMessage}
                isLoading={searchState.isLoading}
                error={searchState.error}
                hasSearched={searchState.hasSearched}
                isShowingLatest={searchState.isShowingLatest}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onVote={castVote}
                isVotingInProgress={isVotingInProgress}
                className="mb-12"
              />
            </>
          )}

          {/* Content Grid - only show when not displaying any results and not loading */}
          {!showResults && !searchState.isLoading && (
            <>
              {/* Minimal footer info */}
              <MinimalFooterInfo className="mt-8" />
            </>
          )}
        </div>
      </Container>
    </Layout>
  );
};

// Minimal Footer Information
interface MinimalFooterInfoProps {
  className?: string;
}

const MinimalFooterInfo: React.FC<MinimalFooterInfoProps> = ({ className = '' }) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="max-w-md mx-auto">
        <p className="text-sm text-slate-500 font-light leading-relaxed">
          Trusted by communities worldwide to verify suspicious cases and protect against fraud.
        </p>
        
        <div className="flex items-center justify-center space-x-8 mt-6">
          <div className="text-center">
            <div className="text-xl font-light text-slate-900 mb-1">50,000+</div>
            <div className="text-xs text-slate-500 font-light tracking-wide">VERIFIED CASES</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-light text-slate-900 mb-1">1M+</div>
            <div className="text-xs text-slate-500 font-light tracking-wide">USERS PROTECTED</div>
          </div>
        </div>
      </div>
    </div>
  );
};