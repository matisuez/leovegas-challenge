import { 
    CustomError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    TooManyRequestsError,
    InternalServerError
} from '../../../src/core/errors/custom.error';

describe('Custom Errors', () => {
    describe('CustomError', () => {
        it('should create a CustomError with default status code 400', () => {
            const error = new CustomError('Custom error message');
            expect(error.message).toBe('Custom error message');
            expect(error.statusCode).toBe(400);
        });

        it('should create a CustomError with specified status code', () => {
            const error = new CustomError('Custom error message', 500);
            expect(error.message).toBe('Custom error message');
            expect(error.statusCode).toBe(500);
        });
    });

    describe('BadRequestError', () => {
        it('should create a BadRequestError with status code 400', () => {
            const error = new BadRequestError('Bad request');
            expect(error.message).toBe('Bad request');
            expect(error.statusCode).toBe(400);
        });
    });

    describe('UnauthorizedError', () => {
        it('should create an UnauthorizedError with status code 401', () => {
            const error = new UnauthorizedError('Unauthorized');
            expect(error.message).toBe('Unauthorized');
            expect(error.statusCode).toBe(401);
        });
    });

    describe('ForbiddenError', () => {
        it('should create a ForbiddenError with status code 403', () => {
            const error = new ForbiddenError('Forbidden');
            expect(error.message).toBe('Forbidden');
            expect(error.statusCode).toBe(403);
        });
    });

    describe('NotFoundError', () => {
        it('should create a NotFoundError with status code 404', () => {
            const error = new NotFoundError('Not found');
            expect(error.message).toBe('Not found');
            expect(error.statusCode).toBe(404);
        });
    });

    describe('ConflictError', () => {
        it('should create a ConflictError with status code 409', () => {
            const error = new ConflictError('Conflict');
            expect(error.message).toBe('Conflict');
            expect(error.statusCode).toBe(409);
        });
    });

    describe('TooManyRequestsError', () => {
        it('should create a TooManyRequestsError with status code 429', () => {
            const error = new TooManyRequestsError('Too many requests');
            expect(error.message).toBe('Too many requests');
            expect(error.statusCode).toBe(429);
        });
    });

    describe('InternalServerError', () => {
        it('should create an InternalServerError with status code 500', () => {
            const error = new InternalServerError('Internal server error');
            expect(error.message).toBe('Internal server error');
            expect(error.statusCode).toBe(500);
        });
    });
});
