import { 
    Request,
    Response,
} from 'express';

export class UsersController {

    constructor() {}

    public getMyInfo = async(req:Request, res:Response) => {
        res.status(200).json({
            message: `User info got`,
        })
    }

    public updateMyInfo = async(req:Request, res:Response) => {
        res.status(200).json({
            message: `User info updated`,
        })
    }

}

