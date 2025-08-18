// src/hooks/useSearch.ts - Quick fix version
import { useState } from 'react';
import { useToast } from '../components/context/ToastContext';
import { validateSearchQuery, sanitizeInput } from '../utils/validation';

// Optional verification context - won't break if provider is missing
let useVerification: any;
try {
  const { useVerification: useVerificationImport } = require('../components/context/VerificationContext');
  useVerification = useVerificationImport;
} catch {
  // Fallback if VerificationContext doesn't exist
  useVerification = () => ({
    verificationState: { isVerified: false, email: null, verificationToken: null },
    isVerificationRequired: () => true
  });
}

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
  // Verification methods
  checkVerificationRequired: () => boolean;
}

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const useSearch = (): UseSearchReturn => {
  const { showToast } = useToast();
  
  // Safe verification hook usage
  let verificationState: any = { isVerified: false, email: null, verificationToken: null };
  let isVerificationRequired = () => true;
  
  try {
    const verification = useVerification();
    verificationState = verification.verificationState;
    isVerificationRequired = verification.isVerificationRequired;
  } catch {
    // Fallback - no verification available
    console.log('Verification context not available, falling back to IP-based voting');
  }
  
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
    const sanitizedQuery = sanitizeInput(query);
    setSearchState(prev => ({ ...prev, query: sanitizedQuery, error: null }));
  };

  const updateFilter = (filter: string) => {
    setSearchState(prev => ({ ...prev, filter, error: null }));
  };

  const performSearch = async (page: number = 0, size: number = 20) => {
    // Validate search query
    const validation = validateSearchQuery(searchState.query, searchState.filter);
    if (!validation.isValid) {
      showToast('error', 'Invalid Search', validation.error);
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
          const errorMessage = errorData.error || 'Invalid search parameters';
          showToast('error', 'Search Error', errorMessage);
          throw new Error(errorMessage);
        }
        if (response.status === 429) {
          showToast('warning', 'Rate Limited', 'Too many requests. Please wait a moment and try again.');
          throw new Error('Rate limited');
        }
        if (response.status >= 500) {
          showToast('error', 'Server Error', 'Our servers are experiencing issues. Please try again later.');
          throw new Error('Server error');
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

      // Show success message if results found
      if (data.results.length > 0) {
        showToast('success', 'Search Complete', data.message);
      } else {
        showToast('info', 'No Results', 'No matching cases found for your search.');
      }
      
    } catch (error) {
      console.error('Search error:', error);
      
      // Only show toast if we haven't already shown one above
      if (error instanceof Error && !error.message.includes('Rate limited') && 
          !error.message.includes('Server error') && !error.message.includes('Invalid search parameters')) {
        const errorMessage = 'An unexpected error occurred while searching. Please try again.';
        showToast('error', 'Search Failed', errorMessage);
      }
      
      setSearchState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Search failed',
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
    // Check if verification is required (if verification system is available)
    try {
      if (isVerificationRequired()) {
        showToast('warning', 'Verification Required', 'Please verify your email address to vote on cases.');
        return false;
      }
    } catch {
      // No verification system available, continue with IP-based voting
      showToast('info', 'Voting', 'Voting with IP-based verification...');
    }

    // Prevent duplicate votes
    if (searchState.votingInProgress.has(caseId)) {
      showToast('warning', 'Vote in Progress', 'Please wait for your previous vote to complete.');
      return false;
    }

    // Mark voting as in progress
    setSearchState(prev => ({
      ...prev,
      votingInProgress: new Set([...prev.votingInProgress, caseId])
    }));

    try {
      // Include verification token in request if available
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (verificationState.verificationToken) {
        headers['Authorization'] = `Bearer ${verificationState.verificationToken}`;
      }

      const bodyData: any = { vote };
      if (verificationState.email) {
        bodyData.email = verificationState.email;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/case/${caseId}/vote`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.error?.includes('already voted')) {
            showToast('warning', 'Already Voted', 'You have already voted on this case.');
          } else if (errorData.error?.includes('verification')) {
            showToast('error', 'Verification Failed', 'Your verification has expired. Please verify your email again.');
          } else {
            showToast('error', 'Invalid Vote', errorData.error || 'Unable to cast vote.');
          }
          return false;
        }
        if (response.status === 401) {
          showToast('error', 'Unauthorized', 'Your verification has expired. Please verify your email again.');
          return false;
        }
        if (response.status === 429) {
          showToast('warning', 'Rate Limited', 'Too many vote attempts. Please wait a moment.');
          return false;
        }
        if (response.status >= 500) {
          showToast('error', 'Server Error', 'Unable to process vote due to server issues.');
          return false;
        }
        throw new Error(`Vote failed: ${response.status}`);
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

      // Show success message
      const voteText = vote === 'guilty' ? 'Guilty' : 'Not Guilty';
      showToast('success', 'Vote Recorded', `Your "${voteText}" vote has been recorded successfully.`);

      return true;

    } catch (error) {
      console.error('Vote error:', error);
      
      // Remove from voting progress
      setSearchState(prev => ({
        ...prev,
        votingInProgress: new Set([...prev.votingInProgress].filter(id => id !== caseId))
      }));

      // Show generic error if we haven't shown a specific one
      if (error instanceof Error && !error.message.includes('Vote failed')) {
        showToast('error', 'Vote Failed', 'Unable to record your vote. Please try again.');
      }

      return false;
    }
  };

  const isVotingInProgress = (caseId: number): boolean => {
    return searchState.votingInProgress.has(caseId);
  };

  const checkVerificationRequired = (): boolean => {
    try {
      return isVerificationRequired();
    } catch {
      return false; // No verification system available
    }
  };

  const loadNextPage = async () => {
    if (!searchState.pagination?.hasNext) {
      showToast('info', 'Last Page', 'You are already on the last page of results.');
      return;
    }
    
    const nextPage = searchState.pagination.currentPage + 1;
    const pageSize = searchState.pagination.pageSize;
    await performSearch(nextPage, pageSize);
  };

  const loadPreviousPage = async () => {
    if (!searchState.pagination?.hasPrevious) {
      showToast('info', 'First Page', 'You are already on the first page of results.');
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
    showToast('info', 'Search Reset', 'Search has been cleared.');
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

// Export types for use in components
export type { Case, Pagination, SearchResponse, VerdictSummary };