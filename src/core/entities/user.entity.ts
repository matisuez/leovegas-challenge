
export enum UserRole {
    USER =  'USER',
    ADMIN = 'ADMIN',
}

type UserEntityOptions = {
    id: number;
    name?:string;
    email?:string;
    password?:string;
    role: UserRole;
    accessToken?:string;
    available?:boolean; 
}

export class UserEntity {

    public id: number;
    public name: string;
    public email: string;
    public password: string;
    public role: UserRole;
    public accessToken?: string;
    public available: boolean;


    constructor(options:UserEntityOptions) {
        const {
            id,
            name = '',
            email = '',
            password = '',
            role = UserRole.USER,
            accessToken = '',
            available = true,
        } = options;

        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.accessToken = accessToken;
        this.available = available;

    }

    public static fromObject(object: {[key:string]: any}): UserEntity {
        const {
            id,
            name,
            email,
            password,
            role,
            accessToken,
            available,
        } = object;
        const user = new UserEntity({
            id,
            name,
            email,
            password,
            role: role as UserRole,
            accessToken,
            available,
        });
        return user;
    }
}
