// src/hooks/useSearch.ts
import { useState } from 'react';
import { useToast } from '../components/context/ToastContext';
import { useVerification } from '../components/context/VerificationContext';
import { validateSearchQuery, sanitizeInput } from '../utils/validation';
import { apiService, handleApiError } from '../services/api';
import { config } from '../config';
import { TOAST_TYPES } from '../utils/constants';

// Types for the API response
export interface Case {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  actions: string;
  description?: string;
  reportedBy?: string;
  createdAt: string;
  verdictScore: number;
  totalVotes: number;
  guiltyVotes: number;
  notGuiltyVotes: number;
  lastVotedAt?: string;
  verdictSummary?: VerdictSummary;
}

export interface VerdictSummary {
  status: string;
  score: number;
  totalVotes: number;
  guiltyVotes: number;
  notGuiltyVotes: number;
  confidence: number;
}

export interface Pagination {
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
  verificationMethod?: string;
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
  votingInProgress: Set<number>;
  isShowingLatest: boolean;
}

interface UseSearchReturn {
  searchState: SearchState;
  updateQuery: (query: string) => void;
  updateFilter: (filter: string) => void;
  performSearch: (page?: number, size?: number) => Promise<void>;
  resetSearch: () => void;
  loadNextPage: () => Promise<void>;
  loadPreviousPage: () => Promise<void>;
  castVote: (caseId: number, vote: 'guilty' | 'not_guilty') => Promise<boolean>;
  isVotingInProgress: (caseId: number) => boolean;
  checkVerificationRequired: () => boolean;
}

export const useSearch = (): UseSearchReturn => {
  const { showToast } = useToast();
  const { verificationState, isVerificationRequired } = useVerification();
  
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
    isShowingLatest: true
  });

  const updateQuery = (query: string) => {
    const sanitizedQuery = sanitizeInput(query);
    setSearchState(prev => ({ ...prev, query: sanitizedQuery, error: null }));
  };

  const updateFilter = (filter: string) => {
    setSearchState(prev => ({ ...prev, filter, error: null }));
  };

  const performSearch = async (page: number = 0, size: number = config.search.defaultPageSize) => {
    const validation = validateSearchQuery(searchState.query, searchState.filter);
    if (!validation.isValid) {
      showToast(TOAST_TYPES.ERROR, 'Invalid Search', validation.error!);
      return;
    }
    
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data: SearchResponse = await apiService.search({
        filter: searchState.filter,
        value: searchState.query.trim(),
        page,
        size,
      });
      
      setSearchState(prev => ({
        ...prev,
        results: data.results,
        pagination: data.pagination,
        hasSearched: true,
        lastSearchMessage: data.message,
        error: null,
      }));

      const toastType = data.results.length > 0 ? TOAST_TYPES.SUCCESS : TOAST_TYPES.INFO;
      const toastMessage = data.results.length > 0 ? data.message : 'No matching cases found';
      showToast(toastType, 'Search Complete', toastMessage);
      
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = handleApiError(error);
      
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
    if (isVerificationRequired()) {
      showToast(TOAST_TYPES.WARNING, 'Verification Required', 'Please verify your email address to vote on cases.');
      return false;
    }

    if (searchState.votingInProgress.has(caseId)) {
      showToast(TOAST_TYPES.WARNING, 'Vote in Progress', 'Please wait for your previous vote to complete.');
      return false;
    }

    setSearchState(prev => ({
      ...prev,
      votingInProgress: new Set([...prev.votingInProgress, caseId])
    }));

    try {
      const voteResponse: VoteResponse = await apiService.vote(
        caseId,
        vote,
        verificationState.email || undefined,
        verificationState.verificationToken || undefined
      );

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

      const voteText = vote === 'guilty' ? 'Guilty' : 'Not Guilty';
      const verificationMethod = voteResponse.verificationMethod || 'email';
      showToast(TOAST_TYPES.SUCCESS, 'Vote Recorded', `Your "${voteText}" vote has been recorded successfully via ${verificationMethod} verification.`);

      return true;

    } catch (error) {
      console.error('Vote error:', error);
      
      setSearchState(prev => ({
        ...prev,
        votingInProgress: new Set([...prev.votingInProgress].filter(id => id !== caseId))
      }));

      const errorMessage = handleApiError(error);
      showToast(TOAST_TYPES.ERROR, 'Vote Failed', errorMessage);
      return false;
    }
  };

  const loadNextPage = async () => {
    if (!searchState.pagination?.hasNext) {
      showToast(TOAST_TYPES.INFO, 'Last Page', 'You are already on the last page of results.');
      return;
    }
    
    const nextPage = searchState.pagination.currentPage + 1;
    const pageSize = searchState.pagination.pageSize;
    await performSearch(nextPage, pageSize);
  };

  const loadPreviousPage = async () => {
    if (!searchState.pagination?.hasPrevious) {
      showToast(TOAST_TYPES.INFO, 'First Page', 'You are already on the first page of results.');
      return;
    }
    
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

  const isVotingInProgress = (caseId: number): boolean => {
    return searchState.votingInProgress.has(caseId);
  };

  const checkVerificationRequired = (): boolean => {
    return isVerificationRequired();
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
    checkVerificationRequired,
  };
};