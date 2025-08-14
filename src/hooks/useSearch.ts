import { useState } from 'react';

// Types for the API response
interface BadActor {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  actions: string;
  description?: string;
  reportedBy?: string;
  createdAt: string;
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
  results: BadActor[];
  pagination: Pagination;
}

interface SearchState {
  query: string;
  filter: string;
  isLoading: boolean;
  results: BadActor[];
  pagination: Pagination | null;
  error: string | null;
  hasSearched: boolean;
  lastSearchMessage: string;
}

interface UseSearchReturn {
  searchState: SearchState;
  updateQuery: (query: string) => void;
  updateFilter: (filter: string) => void;
  performSearch: (page?: number, size?: number) => Promise<void>;
  resetSearch: () => void;
  loadNextPage: () => Promise<void>;
  loadPreviousPage: () => Promise<void>;
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
  };
};

// Export types for use in components
export type { BadActor, Pagination, SearchResponse };