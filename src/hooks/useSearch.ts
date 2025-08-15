import { useState } from 'react';

// Types for the API response
interface Case {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  actions: string;
  description?: string;
  reportedBy?: string;
  createdAt: string;
  // Verdict system fields
  verdictScore: number;
  totalVotes: number;
  guiltyVotes: number;
  notGuiltyVotes: number;
  lastVotedAt?: string;
  // Computed fields from backend
  verdictStatus?: string; // "Guilty", "Not Guilty", "Controversial"
  verdictConfidence?: number; // Percentage confidence
  verdictSummary?: VerdictSummary;
}

interface VerdictSummary {
  status: string;
  score: number;
  totalVotes: number;
  guiltyVotes: number;
  notGuiltyVotes: number;
  confidence: number;
}

interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

interface SearchResponse {
  filter: string;
  value: string;
  found: boolean;
  message: string;
  results: Case[];
  pagination: Pagination;
}

interface VoteResponse {
  success: boolean;
  message: string;
  caseId: number;
  vote: string;
  verdict: VerdictSummary;
}

interface SearchState {
  query: string;
  filter: string;
  isLoading: boolean;
  results: Case[];
  pagination: Pagination | null;
  error: string | null;
  hasSearched: boolean;
  lastSearchMessage: string;
  // Voting state
  votingInProgress: Set<number>;
}

interface UseSearchReturn {
  searchState: SearchState;
  updateQuery: (query: string) => void;
  updateFilter: (filter: string) => void;
  performSearch: (page?: number, size?: number) => Promise<void>;
  resetSearch: () => void;
  loadNextPage: () => Promise<void>;
  loadPreviousPage: () => Promise<void>;
  // Voting methods
  castVote: (caseId: number, vote: 'guilty' | 'not_guilty') => Promise<boolean>;
  isVotingInProgress: (caseId: number) => boolean;
}

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const useSearch = (): UseSearchReturn => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    filter: 'all',
    isLoading: false,
    results: [],
    pagination: null,
    error: null,
    hasSearched: false,
    lastSearchMessage: '',
    votingInProgress: new Set(),
  });

  const updateQuery = (query: string) => {
    setSearchState(prev => ({ ...prev, query, error: null }));
  };

  const updateFilter = (filter: string) => {
    setSearchState(prev => ({ ...prev, filter, error: null }));
  };

  const performSearch = async (page: number = 0, size: number = 20) => {
    if (!searchState.query.trim()) {
      setSearchState(prev => ({ ...prev, error: 'Please enter a search term' }));
      return;
    }
    
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Ensure page and size are numbers
      const pageNum = Number(page) || 0;
      const sizeNum = Number(size) || 20;
      
      // Build URL manually to avoid issues
      const baseUrl = `${API_BASE_URL}/api/v1/search`;
      const params = new URLSearchParams({
        filter: searchState.filter,
        value: searchState.query.trim(),
        page: pageNum.toString(),
        size: sizeNum.toString()
      });
      
      const fullUrl = `${baseUrl}?${params.toString()}`;
      console.log('Searching:', fullUrl);

      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Invalid search parameters');
        }
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }
      
      const data: SearchResponse = await response.json();
      
      setSearchState(prev => ({
        ...prev,
        results: data.results,
        pagination: data.pagination,
        hasSearched: true,
        lastSearchMessage: data.message,
        error: null,
      }));
      
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while searching';
      
      setSearchState(prev => ({
        ...prev,
        error: errorMessage,
        results: [],
        pagination: null,
        hasSearched: true,
        lastSearchMessage: '',
      }));
    } finally {
      setSearchState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const castVote = async (caseId: number, vote: 'guilty' | 'not_guilty'): Promise<boolean> => {
    // Prevent duplicate votes
    if (searchState.votingInProgress.has(caseId)) {
      return false;
    }

    // Mark voting as in progress
    setSearchState(prev => ({
      ...prev,
      votingInProgress: new Set([...prev.votingInProgress, caseId])
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/case/${caseId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cast vote');
      }

      const voteResponse: VoteResponse = await response.json();

      // Update the case in results with new verdict data
      setSearchState(prev => ({
        ...prev,
        results: prev.results.map(caseItem => {
          if (caseItem.id === caseId) {
            return {
              ...caseItem,
              verdictScore: voteResponse.verdict.score,
              totalVotes: voteResponse.verdict.totalVotes,
              guiltyVotes: voteResponse.verdict.guiltyVotes,
              notGuiltyVotes: voteResponse.verdict.notGuiltyVotes,
              verdictSummary: voteResponse.verdict,
              lastVotedAt: new Date().toISOString(),
            };
          }
          return caseItem;
        }),
        votingInProgress: new Set([...prev.votingInProgress].filter(id => id !== caseId))
      }));

      return true;

    } catch (error) {
      console.error('Vote error:', error);
      
      // Remove from voting progress
      setSearchState(prev => ({
        ...prev,
        votingInProgress: new Set([...prev.votingInProgress].filter(id => id !== caseId))
      }));

      // You might want to show an error toast here
      return false;
    }
  };

  const isVotingInProgress = (caseId: number): boolean => {
    return searchState.votingInProgress.has(caseId);
  };

  const loadNextPage = async () => {
    if (!searchState.pagination?.hasNext) return;
    
    const nextPage = searchState.pagination.currentPage + 1;
    const pageSize = searchState.pagination.pageSize;
    await performSearch(nextPage, pageSize);
  };

  const loadPreviousPage = async () => {
    if (!searchState.pagination?.hasPrevious) return;
    
    const prevPage = searchState.pagination.currentPage - 1;
    const pageSize = searchState.pagination.pageSize;
    await performSearch(prevPage, pageSize);
  };

  const resetSearch = () => {
    setSearchState({
      query: '',
      filter: 'all',
      isLoading: false,
      results: [],
      pagination: null,
      error: null,
      hasSearched: false,
      lastSearchMessage: '',
      votingInProgress: new Set(),
    });
  };

  return {
    searchState,
    updateQuery,
    updateFilter,
    performSearch,
    resetSearch,
    loadNextPage,
    loadPreviousPage,
    castVote,
    isVotingInProgress,
  };
};

// Export types for use in components
export type { Case, Pagination, SearchResponse, VerdictSummary }; 