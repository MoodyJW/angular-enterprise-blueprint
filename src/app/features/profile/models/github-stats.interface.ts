/**
 * GitHub statistics for the Profile feature.
 *
 * Contains aggregated data fetched from the GitHub GraphQL API
 * to display on the "About Me" page.
 */
export interface GitHubStats {
  /**
   * GitHub username.
   */
  login: string;

  /**
   * Display name (can be different from username).
   */
  name: string | null;

  /**
   * GitHub profile avatar URL.
   */
  avatarUrl: string;

  /**
   * GitHub profile location.
   */
  location: string | null;

  /**
   * Company/organization from GitHub profile.
   */
  company: string | null;

  /**
   * GitHub profile email.
   */
  email: string | null;

  /**
   * Direct URL to GitHub profile.
   */
  htmlUrl: string;

  /**
   * Account creation date (ISO string).
   */
  createdAt: string;

  /**
   * Total repositories (public + private).
   */
  totalRepos: number;

  /**
   * Total pull requests created.
   */
  pullRequests: number;

  /**
   * Total commits in the last year (from contribution graph).
   */
  totalCommits: number;

  /**
   * Total lines of code added in the last year.
   */
  totalLinesAdded: number;

  /**
   * Total lines of code removed in the last year.
   */
  totalLinesRemoved: number;
}
