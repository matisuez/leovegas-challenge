
import {prisma} from '../../data/postgres';

import { SeedsDatasource } from '../../core/datasources/seeds.datasource';
import { SeedDto } from '../../core/dtos/seed.dto';

export class SeedsDatasourceImpl implements SeedsDatasource {

    async createSeeds(seeds:SeedDto[]): Promise<boolean> {
        const result = await prisma.user.createMany({
            data: seeds,
        });
        return result.count === seeds.length;
    }

}
