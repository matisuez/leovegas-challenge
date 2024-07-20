

import { SeedsRepository } from "../../../src/core/repositories/seeds.repository";
import { SeedDto } from "../../../src/core/dtos/";

describe('seeds.repository.ts SeedsRepository', () => {
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

    class MockSeedsRepository implements SeedsRepository {
        createSeeds = jest.fn(async (seeds: SeedDto[]): Promise<boolean> => {
            return true;
        });
    }

    test('Should test the abstract class methods', async () => {
        const mockSeedsRepository = new MockSeedsRepository();

        expect(mockSeedsRepository).toBeInstanceOf(MockSeedsRepository);
        expect(mockSeedsRepository).toHaveProperty('createSeeds');

        const result = await mockSeedsRepository.createSeeds(mockSeeds);
        expect(result).toBe(true);
        expect(mockSeedsRepository.createSeeds).toHaveBeenCalledWith(mockSeeds);
    });
});
