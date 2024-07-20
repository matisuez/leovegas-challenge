
export class CustomError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number = 400,
    ) {
        super(message);
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class ConflictError extends CustomError {
    constructor(message: string) {
        super(message, 409);
    }
}

export class TooManyRequestsError extends CustomError {
    constructor(message: string) {
        super(message, 429);
    }
}

export class InternalServerError extends CustomError {
    constructor(message: string) {
        super(message, 500);
    }
}