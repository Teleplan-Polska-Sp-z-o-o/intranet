import { IUser } from "../../interfaces/user/UserTypes";

/**
 * Represents a simplified user entity implementing the IUser interface.
 *
 * The IUser interface defines a user structure with the following properties:
 * - id: number
 * - uuid?: string
 * - username: string
 * - domain?: string
 *
 */
class SimpleUser implements IUser {
  /** The unique identifier for the user (e.g., DB user ID) */
  id: number = 0;
  /** The unique identifier for the service user (optional, e.g., UUID) */
  uuid?: string;
  /** The username for the user (e.g., DB username or service name) */
  username: string = "";
  /** The domain of the user (optional) */
  domain?: string;

  /**
   * Constructor for the SimpleUser class.
   */
  constructor() {}

  /**
   * Builds a SimpleUser object from an IUser object.
   * @param {IUser} user - The user object to build from.
   * @returns {SimpleUser} The built SimpleUser instance.
   */
  public build = (user: IUser): SimpleUser => {
    this.id = user.id;
    this.uuid = user?.uuid;
    this.username = user.username;
    this.domain = user?.domain;
    return this;
  };

  public getNormalizedUsername(): string {
    if (!this.username) throw Error("Username is empty string.");
    const parts = this.username.split(".");

    const removeNumbers = (s: string) => s.replace(/\d+/g, "");
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

    return `${capitalize(removeNumbers(parts[0]))} ${capitalize(removeNumbers(parts[1]))}`;
  }
}

export { SimpleUser };
