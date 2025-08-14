import React from 'react';
import { Layout, Container } from '../layout/Layout';
import { HeroSection } from './HeroSection';
import { SearchForm } from './SearchForm';
import { SearchResults } from './SearchResults';
import { PopularSearches } from './PopularSearches';
import { RecentReports } from './RecentReports';
import { useSearch } from '../../hooks/useSearch';

interface HomepageProps {
  className?: string;
}

export const Homepage: React.FC<HomepageProps> = ({ className = '' }) => {
  const { searchState, updateQuery, updateFilter, performSearch, loadNextPage, loadPreviousPage } = useSearch();

  const handlePopularSearchSelect = (search: string) => {
    updateQuery(search);
  };

  const handleLogoClick = () => {
    // Reset search state when logo is clicked
    updateQuery('');
    updateFilter('all');
  };

  const handleReportClick = (report: any) => {
    console.log('Report clicked:', report);
    // TODO: Navigate to report details or show modal
  };

  // Show search results if we have searched or are searching
  const showSearchResults = searchState.hasSearched || searchState.isLoading;

  return (
    <Layout onLogoClick={handleLogoClick} className={className}>
      <Container size="md">
        <div className="py-16">
          {/* Hero Section - hide when showing results */}
          {!showSearchResults && (
            <HeroSection className="mb-16" />
          )}
          
          {/* Search Form */}
          <SearchForm
            searchState={searchState}
            onQueryChange={updateQuery}
            onFilterChange={updateFilter}
            onSearch={performSearch}
            className={showSearchResults ? "mb-12" : "mb-20"}
          />

          {/* Search Results */}
          {showSearchResults && (
            <SearchResults
              results={searchState.results}
              pagination={searchState.pagination}
              message={searchState.lastSearchMessage}
              isLoading={searchState.isLoading}
              error={searchState.error}
              hasSearched={searchState.hasSearched}
              onNextPage={loadNextPage}
              onPreviousPage={loadPreviousPage}
              className="mb-12"
            />
          )}

          {/* Content Grid - only show when not displaying search results */}
          {!showSearchResults && (
            <>
              <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
                <PopularSearches onSearchSelect={handlePopularSearchSelect} />
                <RecentReports onReportClick={handleReportClick} />
              </div>

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
          Trusted by communities worldwide to verify suspicious contacts and protect against fraud.
        </p>
        
        <div className="flex items-center justify-center space-x-8 mt-6">
          <div className="text-center">
            <div className="text-xl font-light text-slate-900 mb-1">50,000+</div>
            <div className="text-xs text-slate-500 font-light tracking-wide">VERIFIED REPORTS</div>
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