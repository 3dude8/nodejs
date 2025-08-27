// Type definitions for cached data structures

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CachedPostsResult {
  posts: any[]; 
  pagination: PaginationInfo;
}

export interface CachedUser {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type guard functions
export function isCachedPostsResult(data: any): data is CachedPostsResult {
  return (
    data &&
    typeof data === 'object' &&
    Array.isArray(data.posts) &&
    data.pagination &&
    typeof data.pagination.currentPage === 'number' &&
    typeof data.pagination.totalPages === 'number' &&
    typeof data.pagination.totalPosts === 'number' &&
    typeof data.pagination.hasNext === 'boolean' &&
    typeof data.pagination.hasPrev === 'boolean'
  );
}

export function isCachedUser(data: any): data is CachedUser {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'number' &&
    typeof data.name === 'string' &&
    typeof data.email === 'string' &&
    data.createdAt instanceof Date &&
    data.updatedAt instanceof Date
  );
}

export function isPost(data: any): data is any {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'number' &&
    typeof data.title === 'string' &&
    typeof data.content === 'string'
  );
}
