
import { AdminDatasource } from "../../core/datasources/admin.datasource";
import { AdminRepository } from "../../core/repositories/admin.repository";
import { AdminUpdateUserDto } from "../../core/dtos";
import { UserEntity, UserRole } from "../../core/entities";

export class AdminRepositoryImpl implements AdminRepository {

    constructor(
        private readonly adminDatasource: AdminDatasource
    ) {}
    getAllUsers(): Promise<UserEntity[]> {
        return this.adminDatasource.getAllUsers();
    }
    getUserRole(email: string): Promise<UserRole> {
        return this.adminDatasource.getUserRole(email);
    }
    updateUser(updateUserDto: AdminUpdateUserDto): Promise<UserEntity> {
        return this.adminDatasource.updateUser(updateUserDto);
    }
    delete(email: string): Promise<UserEntity> {
        return this.adminDatasource.delete(email);
    }

    

}
