import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../src/data/postgres/index";

describe('Init PostgreSQL', () => {

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('Should return postgres connection in true', async() => {
        try {
            await prisma.$connect();
            const result = await prisma.$queryRaw`SELECT 1`;
            expect(result).toBeTruthy();
        } catch (error) {
            console.error("Error connecting to PostgreSQL", error);
            expect(true).toBe(false);
        }
    });

    test('Should throw an error', async() => {
        const prismaFake = new PrismaClient({
            datasources: {
                db: {
                    url: 'postgresql://invaliduser:invalidpassword@localhost:5432/invaliddb'
                }
            }
        });
        try {
            await prismaFake.$connect();
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toBeDefined();
        } finally {
            await prismaFake.$disconnect();
        }
    });
});
