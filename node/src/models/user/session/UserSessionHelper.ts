import { DataSource, EntityManager } from "typeorm";
import { User } from "../../../orm/entity/user/UserEntity";
import { UserLoginDetails } from "../../../orm/entity/user/UserLoginDetailsEntity";

class UserLoginHelper {
  /**
   * Save a new login record and remove any existing open sessions based on user ID.
   */
  static async saveLoginDetails(
    userId: number,
    entityManager: EntityManager | DataSource
  ): Promise<UserLoginDetails> {
    try {
      const userEntity = await entityManager.getRepository(User).findOne({
        where: { id: userId },
        lock: { mode: "pessimistic_write" }, // Lock the user record to prevent race conditions
      });

      if (!userEntity) {
        throw new Error(`User with ID ${userId} not found.`);
      }

      // Check if there is an existing open session for this user
      const existingSession = await entityManager
        .getRepository(UserLoginDetails)
        .createQueryBuilder("session")
        .leftJoinAndSelect("session.user", "user")
        .where("user.id = :userId", { userId })
        .andWhere("session.logoutTime IS NULL")
        .orderBy("session.loginTime", "DESC")
        .getOne();

      if (existingSession) {
        return existingSession;
      }

      // Create a new login details record
      const loginDetails = new UserLoginDetails(userEntity);
      await entityManager.getRepository(UserLoginDetails).save(loginDetails);

      return loginDetails;
    } catch (error) {
      console.error(`Error saving login details: ${error}`);
    }
  }

  /**
   * Update the logout details for the user's most recent session based on user ID.
   */
  static async updateLogoutDetails(userId: number, entityManager: EntityManager | DataSource) {
    try {
      const existingSession = await entityManager
        .getRepository(UserLoginDetails)
        .createQueryBuilder("session")
        .leftJoinAndSelect("session.user", "user")
        .where("user.id = :userId", { userId })
        .andWhere("session.logoutTime IS NULL")
        .orderBy("session.loginTime", "DESC")
        .getOne();

      if (existingSession) {
        existingSession.logoutTime = new Date();
        existingSession.duration = Math.floor(
          (existingSession.logoutTime.getTime() - existingSession.loginTime.getTime()) / 1000
        );
        await entityManager.getRepository(UserLoginDetails).save(existingSession);
      }
    } catch (error) {
      console.error(`Error updating logout details: ${error}`);
    }
  }
}

export { UserLoginHelper };
