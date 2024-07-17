import { 
    Request,
    Response,
} from 'express';

export class AuthController {

    constructor() {}

    public login = async(req:Request, res:Response) => {
        res.status(200).json({
            message: `User logged`,
        })
    }

    public register = async(req:Request, res:Response) => {
        res.status(201).json({
            message: `User registered`,
        })
    }

}

