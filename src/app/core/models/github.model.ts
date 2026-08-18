/**
 * Public GitHub user profile (subset of fields).
 * Source: https://api.github.com/users/:username
 */
export interface GithubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  htmlUrl: string;
}

/**
 * Public GitHub repository (subset of fields).
 * Source: https://api.github.com/users/:username/repos
 */
export interface GithubRepository {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  updatedAt: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
}

/**
 * Sort options for the GitHub repositories list.
 */
export type GithubRepoSort = 'updated' | 'stars' | 'forks';
