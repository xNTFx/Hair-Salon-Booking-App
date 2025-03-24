import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  private repository = new UserRepository();

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.repository.findByUsername(username);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.repository.findById(id);
  }
}
