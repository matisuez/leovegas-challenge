import { SeedsDatasource } from "../../../src/core/datasources/seeds.datasource";
import { SeedsRepositoryImpl } from "../../../src/infrastructure/repositories/seeds.repository.impl";
import { SeedDto } from "../../../src/core/dtos";

const mockSeedsDatasource = {
    createSeeds: jest.fn(),
} as unknown as SeedsDatasource;

describe('SeedsRepositoryImpl', () => {
    const seedsRepository = new SeedsRepositoryImpl(mockSeedsDatasource);

    const seedsDto: SeedDto[] = [
        {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            accessToken: 'token123'
        },
        {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            password: 'password456',
            accessToken: 'token456'
        }
    ];

    describe('createSeeds', () => {
        it('Should call seedsDatasource.createSeeds and return true', async () => {
            (mockSeedsDatasource.createSeeds as jest.Mock).mockResolvedValue(true);

            const result = await seedsRepository.createSeeds(seedsDto);

            expect(mockSeedsDatasource.createSeeds).toHaveBeenCalledWith(seedsDto);
            expect(result).toBe(true);
        });

        it('Should handle errors from seedsDatasource.createSeeds', async () => {
            const error = new Error('Error creating seeds');
            (mockSeedsDatasource.createSeeds as jest.Mock).mockRejectedValue(error);

            await expect(seedsRepository.createSeeds(seedsDto)).rejects.toThrow('Error creating seeds');
        });
    });
});
