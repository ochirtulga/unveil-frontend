import React, { useState } from 'react';
import { Case, Pagination } from '../../hooks/useSearch';
import { CaseDetailModal } from './CaseDetailModal';

interface SearchResultsProps {
  results: Case[];
  pagination: Pagination | null;
  message: string;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onVote: (caseId: number, vote: 'guilty' | 'not_guilty') => Promise<boolean>;
  isVotingInProgress: (caseId: number) => boolean;
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
  onVote,
  isVotingInProgress,
  className = '',
}) => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const handleCaseClick = (caseItem: Case) => {
    console.log('Case clicked:', caseItem);
    setSelectedCase(caseItem);
  };

  const handleCloseModal = () => {
    setSelectedCase(null);
  };

  // Always show something if we have any search activity
  if (!hasSearched && !isLoading) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border border-slate-300 border-t-slate-900"></div>
            <span className="text-slate-600 font-light tracking-wide">Searching cases...</span>
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
            <p className="text-slate-700 font-light mb-2">No Cases Found</p>
            <p className="text-slate-500 text-sm font-light">{message}</p>
          </div>
        </div>
      )}

      {/* Results found - Simplified Table */}
      {!isLoading && !error && results.length > 0 && (
        <>
          {/* Results Summary */}
          <div className="mb-8">
            <p className="text-slate-700 font-light tracking-wide">{message}</p>
            {pagination && (
              <p className="text-sm text-slate-500 font-light mt-1 tracking-wide">
                Page {pagination.currentPage + 1} of {pagination.totalPages} • {pagination.totalElements} total cases
              </p>
            )}
          </div>

          {/* Simplified Cases Table */}
          <div className="overflow-y-auto max-h-[850px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-2 text-sm font-light text-slate-700 tracking-wide">IDENTIFIER</th>
                  <th className="text-left py-4 px-2 text-sm font-light text-slate-700 tracking-wide">CONTACT</th>
                  <th className="text-left py-4 px-2 text-sm font-light text-slate-700 tracking-wide">TYPE</th>
                  <th className="text-left py-4 px-2 text-sm font-light text-slate-700 tracking-wide">VERDICT</th>
                  <th className="text-left py-4 px-2 text-sm font-light text-slate-700 tracking-wide">REPORTED</th>
                </tr>
              </thead>
              <tbody>
                {results.map((caseItem, index) => (
                  <CaseResultRow 
                    key={caseItem.id} 
                    case={caseItem} 
                    isEven={index % 2 === 0}
                    onCaseClick={handleCaseClick}
                  />
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

      {/* Case Detail Modal */}
      {selectedCase && (
        <CaseDetailModal
          case={selectedCase}
          isOpen={!!selectedCase}
          onClose={handleCloseModal}
          onVote={onVote}
          isVotingInProgress={isVotingInProgress(selectedCase.id)}
        />
      )}
    </div>
  );
};

// Individual Case Row Component
interface CaseResultRowProps {
  case: Case;
  isEven: boolean;
  onCaseClick: (caseItem: Case) => void;
}

const CaseResultRow: React.FC<CaseResultRowProps> = ({ 
  case: caseItem, 
  isEven, 
  onCaseClick 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMainIdentifier = () => {
    return caseItem.name || caseItem.email || caseItem.phone || 'Unknown';
  };

  const getContactInfo = () => {
    const contacts = [];
    if (caseItem.email) contacts.push(caseItem.email);
    if (caseItem.phone) contacts.push(caseItem.phone);
    return contacts.join(' • ') || '-';
  };

  return (
    <tr 
      className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${isEven ? 'bg-white' : 'bg-slate-25'}`}
      onClick={() => onCaseClick(caseItem)}
    >
      <td className="py-4 px-2">
        <div className="font-light text-slate-900">
          {getMainIdentifier()}
        </div>
        {caseItem.company && (
          <div className="text-xs text-slate-500 font-light mt-1">
            {caseItem.company}
          </div>
        )}
      </td>
      
      <td className="py-4 px-2">
        <div className="font-mono text-sm text-slate-700 font-light">
          {getContactInfo()}
        </div>
      </td>
      
      <td className="py-4 px-2">
        <span className="inline-block px-2 py-1 text-xs font-light text-slate-600 bg-slate-100 tracking-wide">
          {caseItem.actions}
        </span>
      </td>
      
      <td className="py-4 px-2">
        <SimpleVerdictBadge case={caseItem} />
      </td>
      
      <td className="py-4 px-2">
        <div className="text-sm text-slate-500 font-light">
          {formatDate(caseItem.createdAt)}
        </div>
      </td>
    </tr>
  );
};

// Simplified Verdict Badge Component
interface SimpleVerdictBadgeProps {
  case: Case;
}

const SimpleVerdictBadge: React.FC<SimpleVerdictBadgeProps> = ({ case: caseItem }) => {
  const getSimpleVerdict = () => {
    if (caseItem.verdictScore > 0) return 'Guilty';
    if (caseItem.verdictScore < 0) return 'Not Guilty';
    return 'Controversial'; // Instead of "On Trial"
  };

  const getVerdictStyle = () => {
    const verdict = getSimpleVerdict();
    switch (verdict) {
      case 'Guilty':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Not Guilty':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Controversial':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const verdict = getSimpleVerdict();

  return (
    <div className="space-y-1">
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border ${getVerdictStyle()}`}>
        {verdict}
      </span>
      {caseItem.totalVotes > 0 && (
        <div className="text-xs text-slate-500 font-light">
          {caseItem.totalVotes} {caseItem.totalVotes === 1 ? 'vote' : 'votes'}
        </div>
      )}
    </div>
  );
};

// Pagination Component (unchanged)
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