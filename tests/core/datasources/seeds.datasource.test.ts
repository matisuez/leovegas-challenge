import { SeedsDatasource } from "../../../src/core/datasources/seeds.datasource";
import { SeedDto } from "../../../src/core/dtos/seed.dto";

describe('seeds.datasource.ts SeedsDatasource', () => {
    const mockSeeds: SeedDto[] = [
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

    class MockSeedsDatasource implements SeedsDatasource {
        createSeeds = jest.fn(async (seeds: SeedDto[]): Promise<boolean> => {
            return true;
        });
    }

    test('Should test the abstract class methods', async () => {
        const mockSeedsDatasource = new MockSeedsDatasource();

        expect(mockSeedsDatasource).toBeInstanceOf(MockSeedsDatasource);
        expect(mockSeedsDatasource).toHaveProperty('createSeeds');

        const result = await mockSeedsDatasource.createSeeds(mockSeeds);
        expect(result).toBe(true);
        expect(mockSeedsDatasource.createSeeds).toHaveBeenCalledWith(mockSeeds);
    });
});
