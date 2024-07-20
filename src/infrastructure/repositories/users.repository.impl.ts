
import { UsersDatasource } from "../../core/datasources/users.datasource";
import { UsersRepository } from "../../core/repositories/users.repository";
import { UpdateUserDto } from "../../core/dtos";

export class UsersRepositoryImpl implements UsersRepository {

    constructor(
        private readonly usersDatasource: UsersDatasource
    ) {}

    getMyInfo(email: string) {
        return this.usersDatasource.getMyInfo(email);
    }

    updateMyInfo(updateUserDto: UpdateUserDto) {
        return this.usersDatasource.updateMyInfo(updateUserDto);
    }

}
