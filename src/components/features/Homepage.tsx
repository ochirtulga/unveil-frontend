import React from 'react';
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
    loadNextPage, 
    loadPreviousPage, 
    castVote, 
    isVotingInProgress,
    resetSearch
  } = useSearch();


  const handleLogoClick = () => {
    // Reset search state when logo is clicked
    resetSearch();
  };

  // Show search results if we have searched, are searching, or showing latest cases
  // But don't hide results just because someone is typing in the search field
  const showResults = searchState.hasSearched || searchState.isLoading || 
                     (searchState.isShowingLatest && searchState.results.length > 0);
  
  // Determine the current mode for display purposes
  const getCurrentMode = () => {
    if (searchState.hasSearched) {
      return 'search';
    } else if (searchState.isShowingLatest && searchState.results.length > 0) {
      return 'latest';
    }
    return 'none';
  };

  const currentMode = getCurrentMode();

  return (
    <Layout onLogoClick={handleLogoClick} className={className}>
      <Container size="md">
        <div className="py-16">
          {/* Hero Section - hide when showing results */}
          {!showResults && (
            <HeroSection className="mb-16" />
          )}
          
          {/* Search Form */}
          <SearchForm
            searchState={searchState}
            onQueryChange={updateQuery}
            onFilterChange={updateFilter}
            onSearch={performSearch}
            className={showResults ? "mb-12" : "mb-20"}
          />

          {/* Results Section */}
          {showResults && (
            <>
              {/* Results Header */}
              <div className="mb-8">
                {currentMode === 'latest' && !searchState.isLoading && (
                  <div className="text-center">
                    <h2 className="text-2xl font-light text-slate-900 mb-4 tracking-wide">
                      Latest Cases
                    </h2>
                    <p className="text-slate-600 font-light mb-6">
                      Showing the most recently reported cases. Use the search above to find specific information.
                    </p>
                  </div>
                )}
                
                {currentMode === 'search' && !searchState.isLoading && (
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-light text-slate-900 mb-2 tracking-wide">
                      Search Results
                    </h2>
                    <button
                      onClick={resetSearch}
                      className="text-sm text-slate-600 hover:text-slate-900 font-light tracking-wide transition-colors"
                    >
                      ← Back to Latest Cases
                    </button>
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

          {/* Content Grid - only show when not displaying any results */}
          {!showResults && (
            <>
              {/* Optional: Add popular searches and recent reports sections */}
              {/* <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
                <PopularSearches onSearchSelect={handlePopularSearchSelect} />
                <RecentReports onReportClick={handleCaseClick} />
              </div> */}

              {/* Simplified footer info */}
              <MinimalFooterInfo className="mt-20" />
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
        
        {/* <div className="flex items-center justify-center space-x-8 mt-6">
          <div className="text-center">
            <div className="text-xl font-light text-slate-900 mb-1">50,000+</div>
            <div className="text-xs text-slate-500 font-light tracking-wide">VERIFIED CASES</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-light text-slate-900 mb-1">1M+</div>
            <div className="text-xs text-slate-500 font-light tracking-wide">USERS PROTECTED</div>
          </div>
        </div> */}
      </div>
    </div>
  );
};