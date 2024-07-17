import { 
    Request,
    Response,
} from 'express';

export class AdminController {

    constructor() {}

    public getAllUsers = async(req:Request, res:Response) => {
        res.status(200).json({
            message: `Users got`,
        })
    }

    public updateUser = async(req:Request, res:Response) => {
        res.status(200).json({
            message: `User updated`,
        })
    }

    public deleteUser = async(req:Request, res:Response) => {
        res.status(200).json({
            message: `User deleted`,
        })
    }

}

