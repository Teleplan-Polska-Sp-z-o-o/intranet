import { UserLoginDetails } from "../../orm/entity/user/UserLoginDetailsEntity";
import { dataSource } from "../../config/orm/dataSource";
import { IUser } from "../../interfaces/user/UserTypes";
import { User } from "../../orm/entity/user/UserEntity";
import { DataSource, EntityManager } from "typeorm";
import { SimpleUser } from "../user/SimpleUser";

class UserHeartbeat {
  constructor() {}

  static getLastLoginRecord = async (
    user: IUser,
    entityManager: EntityManager | DataSource
  ): Promise<UserLoginDetails> => {
    const userId = new SimpleUser().build(user).id;
    // Find the most recent login record for the user
    const latestLoginDetails = await entityManager.getRepository(UserLoginDetails).findOne({
      where: { user: { id: userId }, logoutTime: null },
      order: { loginTime: "DESC" },
    });

    return latestLoginDetails;
  };

  static saveLoginDetails = async (user: IUser) => {
    try {
      await dataSource.transaction(async (transactionalEntityManager) => {
        const userEntity = await transactionalEntityManager
          .getRepository(User)
          .findOne({ where: { username: user.username } });

        const latestLoginDetails = await UserHeartbeat.getLastLoginRecord(
          user,
          transactionalEntityManager
        );

        if (latestLoginDetails && !latestLoginDetails.logoutTime) {
          // Remove the previous session if it's still open
          await transactionalEntityManager
            .getRepository(UserLoginDetails)
            .remove(latestLoginDetails);
        }

        // Create a new login details record
        const loginDetails = new UserLoginDetails(userEntity);
        await transactionalEntityManager.getRepository(UserLoginDetails).save(loginDetails);
      });
    } catch (error) {
      console.log(`saveLoginDetails at UserHeartbeat, error: ${error}`);
    }
  };

  static updateLogoutDetails = async (user: IUser) => {
    await dataSource.transaction(async (transactionalEntityManager) => {
      // Find the most recent login record for the user
      const latestLoginDetails = await UserHeartbeat.getLastLoginRecord(
        user,
        transactionalEntityManager
      );

      if (latestLoginDetails) {
        // Update the logout time and calculate the duration
        latestLoginDetails.logoutTime = new Date();

        latestLoginDetails.duration = Math.floor(
          (latestLoginDetails.logoutTime.getTime() - latestLoginDetails.loginTime.getTime()) / 1000
        ); // Calculate duration in seconds
        await transactionalEntityManager.getRepository(UserLoginDetails).save(latestLoginDetails);
      }
    });
  };

  static cleanOldRecords = async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    await dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(UserLoginDetails)
        .where("loginTime < :oneWeekAgo", { oneWeekAgo })
        .execute();
    });
  };
}

export { UserHeartbeat };
