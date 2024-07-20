import { AdminUpdateUserDto } from "../dtos";
import { UserEntity, UserRole } from "../entities";

export abstract class AdminRepository {
    abstract getAllUsers(): Promise<UserEntity[]>;
    abstract getUserRole(email:string): Promise<UserRole>;
    abstract updateUser(updateUserDto:AdminUpdateUserDto): Promise<UserEntity>;
    abstract delete(email:string): Promise<UserEntity>;
}
