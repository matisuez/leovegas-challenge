import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { CustomError, BadRequestError, InternalServerError } from '../../src/core/errors/custom.error';
import { validateFields, errorHandler } from '../../src/presentation/middlewares';

jest.mock('express-validator', () => ({
    validationResult: jest.fn(),
}));

describe('Middleware - validateFields', () => {
    const mockRequest = {} as Request;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as jest.MockedFunction<NextFunction>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should call next if no validation errors', () => {
        (validationResult as unknown as jest.Mock).mockReturnValue({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([]),
        });

        validateFields(mockRequest, mockResponse, mockNext);

        expect(validationResult).toHaveBeenCalledWith(mockRequest);
        expect(mockNext).toHaveBeenCalled();
    });

    it('Should throw BadRequestError if there are validation errors', () => {
        const errorsArray = [
            { path: 'email', msg: 'Invalid email' },
            { path: 'password', msg: 'Invalid password' },
        ];
        (validationResult as unknown as jest.Mock).mockReturnValue({
            isEmpty: jest.fn().mockReturnValue(false),
            array: jest.fn().mockReturnValue(errorsArray),
        });

        validateFields(mockRequest, mockResponse, mockNext);

        expect(validationResult).toHaveBeenCalledWith(mockRequest);
        expect(mockNext).toHaveBeenCalledWith(new BadRequestError('Bad Request: email Invalid email, password Invalid password'));
    });

    it('Should handle unexpected errors with InternalServerError', () => {
        (validationResult as unknown as jest.Mock).mockReturnValue({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([]),
        });

        const unexpectedError = new Error('Unexpected error');

        mockNext.mockImplementationOnce(() => {
            throw unexpectedError;
        });

        try {
            validateFields(mockRequest, mockResponse, mockNext);
        } catch (error) {
            expect(mockNext).toHaveBeenCalledWith(new InternalServerError('Internal Server Error'));
        }
    });
});

describe('Middleware - errorHandler', () => {
    const mockRequest = {} as Request;
    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Should handle CustomError', () => {
        const customError = new BadRequestError('Bad Request');

        errorHandler(customError, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(customError.statusCode);
        expect(mockResponse.json).toHaveBeenCalledWith({
            statusCode: customError.statusCode,
            message: customError.message,
        });
    });

    it('Should handle non-CustomError as InternalServerError', () => {
        const error = new Error('Unexpected error');

        errorHandler(error, mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    });
});