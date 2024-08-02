import { DataSource, EntityManager } from "typeorm";
import { User } from "../../../orm/entity/user/UserEntity";
import { UserLoginDetails } from "../../../orm/entity/user/UserLoginDetailsEntity";

class UserLoginHelper {
  /**
   * Save a new login record and remove any existing open sessions based on user ID.
   */
  static async saveLoginDetails(userId: number, entityManager: EntityManager | DataSource) {
    try {
      const userEntity = await entityManager.getRepository(User).findOne({ where: { id: userId } });

      if (!userEntity) {
        throw new Error(`User with ID ${userId} not found.`);
      }

      // Create a new login details record
      const loginDetails = new UserLoginDetails(userEntity);
      await entityManager.getRepository(UserLoginDetails).save(loginDetails);
    } catch (error) {
      console.error(`Error saving login details: ${error}`);
    }
  }

  /**
   * Update the logout details for the user's most recent session based on user ID.
   */
  static async updateLogoutDetails(userId: number, entityManager: EntityManager | DataSource) {
    try {
      const latestLoginDetails = await entityManager.getRepository(UserLoginDetails).findOne({
        where: { user: { id: userId }, logoutTime: null },
        order: { loginTime: "DESC" },
      });

      if (latestLoginDetails) {
        latestLoginDetails.logoutTime = new Date();
        latestLoginDetails.duration = Math.floor(
          (latestLoginDetails.logoutTime.getTime() - latestLoginDetails.loginTime.getTime()) / 1000
        );
        await entityManager.getRepository(UserLoginDetails).save(latestLoginDetails);
      }
    } catch (error) {
      console.error(`Error updating logout details: ${error}`);
    }
  }
}

export { UserLoginHelper };
