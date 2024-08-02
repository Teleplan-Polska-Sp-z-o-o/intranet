import { dataSource } from "../../../config/dataSource";
import { UserLoginHelper } from "./UserSessionHelper";

/**
 * Singleton class to manage user sessions with automatic timeout-based removal of inactive users.
 */
class UserSessionManager {
  private static instance: UserSessionManager;
  private activeUsers: Map<number, NodeJS.Timeout>;

  /**
   * Private constructor to prevent direct instantiation.
   * Initializes the map to track active users and their timeouts.
   */
  private constructor() {
    this.activeUsers = new Map<number, NodeJS.Timeout>();
  }

  /**
   * Returns the single instance of UserSessionManager, creating it if it doesn't exist.
   * @returns {UserSessionManager} The singleton instance of UserSessionManager.
   */
  public static getInstance(): UserSessionManager {
    if (!UserSessionManager.instance) {
      UserSessionManager.instance = new UserSessionManager();
    }
    return UserSessionManager.instance;
  }

  /**
   * Adds a user to the active list or updates their timeout if they are already present.
   * @param {number} userId - The unique identifier of the user.
   * @param {number} [timeoutDuration=3600000] - The timeout duration in milliseconds (default is 60 seconds).
   */
  public async addUser(userId: number, timeoutDuration: number = 3600000): Promise<void> {
    if (this.activeUsers.has(userId)) {
      this.updateUserTimeout(userId, timeoutDuration);
    } else {
      await dataSource.transaction(async (entityManager) => {
        await UserLoginHelper.saveLoginDetails(userId, entityManager);
      });
      this.setUserTimeout(userId, timeoutDuration);
    }
  }

  /**
   * Removes a user from the active list and clears their associated timeout.
   * @param {number} userId - The unique identifier of the user to remove.
   * @private
   */
  private removeUser(userId: number): void {
    if (this.activeUsers.has(userId)) {
      clearTimeout(this.activeUsers.get(userId)!);
      this.activeUsers.delete(userId);
    }
  }

  /**
   * Sets or resets the user's timeout for being active in the session.
   * @param {number} userId - The unique identifier of the user.
   * @param {number} timeoutDuration - The timeout duration in milliseconds.
   * @private
   */
  private setUserTimeout(userId: number, timeoutDuration: number): void {
    const timeout = setTimeout(async () => {
      await dataSource.transaction(async (entityManager) => {
        await UserLoginHelper.updateLogoutDetails(userId, entityManager);
      });
      this.removeUser(userId);
    }, timeoutDuration);
    this.activeUsers.set(userId, timeout);
  }

  /**
   * Updates the user's timeout if they are in the active list, or warns if they are not.
   * @param {number} userId - The unique identifier of the user.
   * @param {number} [timeoutDuration=3600000] - The new timeout duration in milliseconds (default is 60 seconds).
   */
  public updateUserTimeout(userId: number, timeoutDuration: number = 3600000): void {
    if (this.activeUsers.has(userId)) {
      clearTimeout(this.activeUsers.get(userId)!);
      this.setUserTimeout(userId, timeoutDuration);
    }
  }

  /**
   * Checks if a user is currently active in the session.
   * @param {number} userId - The unique identifier of the user.
   * @returns {boolean} True if the user is active, false otherwise.
   */
  public isUserActive(userId: number): boolean {
    return this.activeUsers.has(userId);
  }
}

export { UserSessionManager };
