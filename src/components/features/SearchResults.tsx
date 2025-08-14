import React from 'react';
import { BadActor, Pagination } from '../../hooks/useSearch';

interface SearchResultsProps {
  results: BadActor[];
  pagination: Pagination | null;
  message: string;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  className?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  pagination,
  message,
  isLoading,
  error,
  hasSearched,
  onNextPage,
  onPreviousPage,
  className = '',
}) => {
  // Debug logging
  console.log('SearchResults render:', { 
    resultsCount: results.length, 
    isLoading, 
    error, 
    hasSearched, 
    message 
  });

  // Always show something if we have any search activity
  if (!hasSearched && !isLoading) {
    console.log('SearchResults: Not rendering - no search performed');
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border border-slate-300 border-t-slate-900"></div>
            <span className="text-slate-600 font-light tracking-wide">Searching...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <p className="text-red-600 font-light mb-2">Search Error</p>
            <p className="text-slate-500 text-sm font-light">{error}</p>
          </div>
        </div>
      )}

      {/* No results state */}
      {!isLoading && !error && results.length === 0 && hasSearched && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <p className="text-slate-700 font-light mb-2">No Results Found</p>
            <p className="text-slate-500 text-sm font-light">{message}</p>
          </div>
        </div>
      )}

      {/* Results found - Minimalistic Table */}
      {!isLoading && !error && results.length > 0 && (
        <>
          {/* Results Summary */}
          <div className="mb-8">
            <p className="text-slate-700 font-light tracking-wide">{message}</p>
            {pagination && (
              <p className="text-sm text-slate-500 font-light mt-1 tracking-wide">
                Page {pagination.currentPage + 1} of {pagination.totalPages} • {pagination.totalElements} total results
              </p>
            )}
          </div>

          {/* Minimalistic Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-2 text-sm font-light text-slate-700 tracking-wide">NAME</th>
                  <th className="text-left py-4 px-2 text-sm font-light text-slate-700 tracking-wide">EMAIL</th>
                  <th className="text-left py-4 px-2 text-sm font-light text-slate-700 tracking-wide">PHONE</th>
                  <th className="text-left py-4 px-2 text-sm font-light text-slate-700 tracking-wide">COMPANY</th>
                  <th className="text-left py-4 px-2 text-sm font-light text-slate-700 tracking-wide">TYPE</th>
                  <th className="text-left py-4 px-2 text-sm font-light text-slate-700 tracking-wide">REPORTED</th>
                </tr>
              </thead>
              <tbody>
                {results.map((badActor, index) => (
                  <SearchResultRow key={badActor.id} badActor={badActor} isEven={index % 2 === 0} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <SearchPagination
              pagination={pagination}
              onNextPage={onNextPage}
              onPreviousPage={onPreviousPage}
            />
          )}
        </>
      )}
    </div>
  );
};

// Individual Result Row Component
interface SearchResultRowProps {
  badActor: BadActor;
  isEven: boolean;
}

const SearchResultRow: React.FC<SearchResultRowProps> = ({ badActor, isEven }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <tr className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${isEven ? 'bg-white' : 'bg-slate-25'}`}>
      <td className="py-4 px-2">
        <div className="font-light text-slate-900">
          {badActor.name || '-'}
        </div>
      </td>
      
      <td className="py-4 px-2">
        <div className="font-mono text-sm text-slate-700 font-light break-all">
          {badActor.email || '-'}
        </div>
      </td>
      
      <td className="py-4 px-2">
        <div className="font-mono text-sm text-slate-700 font-light">
          {badActor.phone || '-'}
        </div>
      </td>
      
      <td className="py-4 px-2">
        <div className="text-slate-700 font-light">
          {badActor.company || '-'}
        </div>
      </td>
      
      <td className="py-4 px-2">
        <span className="inline-block px-2 py-1 text-xs font-light text-slate-600 bg-slate-100 tracking-wide">
          {badActor.actions}
        </span>
      </td>
      
      <td className="py-4 px-2">
        <div className="text-sm text-slate-500 font-light">
          {formatDate(badActor.createdAt)}
        </div>
      </td>
    </tr>
  );
};

// Minimalistic Pagination Component
interface SearchPaginationProps {
  pagination: Pagination;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const SearchPagination: React.FC<SearchPaginationProps> = ({
  pagination,
  onNextPage,
  onPreviousPage,
}) => {
  return (
    <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-200">
      <div className="text-sm text-slate-500 font-light tracking-wide">
        Showing {((pagination.currentPage) * pagination.pageSize) + 1}-{Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)} of {pagination.totalElements}
      </div>
      
      <div className="flex items-center space-x-6">
        <button
          onClick={onPreviousPage}
          disabled={!pagination.hasPrevious}
          className="text-sm font-light text-slate-600 hover:text-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors tracking-wide"
        >
          Previous
        </button>
        
        <div className="flex items-center space-x-1">
          <span className="text-sm text-slate-700 font-light tracking-wide">
            {pagination.currentPage + 1} of {pagination.totalPages}
          </span>
        </div>
        
        <button
          onClick={onNextPage}
          disabled={!pagination.hasNext}
          className="text-sm font-light text-slate-600 hover:text-slate-900 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors tracking-wide"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Individual Result Card Component
interface SearchResultCardProps {
  badActor: BadActor;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ badActor }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getActionsColor = (actions: string) => {
    const colors: Record<string, string> = {
      'Tech Support': 'bg-blue-100 text-blue-800',
      'Romance': 'bg-pink-100 text-pink-800',
      'Investment': 'bg-yellow-100 text-yellow-800',
      'Phishing': 'bg-red-100 text-red-800',
      'Employment': 'bg-green-100 text-green-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Government': 'bg-gray-100 text-gray-800',
    };
    return colors[actions] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {badActor.name && (
              <h3 className="text-lg font-medium text-slate-900 mb-1">{badActor.name}</h3>
            )}
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionsColor(badActor.actions)}`}>
                {badActor.actions}
              </span>
              <span className="text-sm text-slate-500">•</span>
              <span className="text-sm text-slate-500">Reported {formatDate(badActor.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {badActor.email && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-slate-700 font-mono break-all">{badActor.email}</span>
            </div>
          )}
          
          {badActor.phone && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-slate-700 font-mono">{badActor.phone}</span>
            </div>
          )}
          
          {badActor.company && (
            <div className="flex items-center space-x-2 md:col-span-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-slate-700">{badActor.company}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {badActor.description && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">{badActor.description}</p>
          </div>
        )}

        {/* Reported By */}
        {badActor.reportedBy && (
          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <span>Reported by: {badActor.reportedBy}</span>
          </div>
        )}
      </div>
    </div>
  );
};