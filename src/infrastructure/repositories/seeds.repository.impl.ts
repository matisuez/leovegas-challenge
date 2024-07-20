
import { SeedsDatasource } from "../../core/datasources/seeds.datasource";
import { SeedsRepository } from "../../core/repositories/seeds.repository";
import { SeedDto, } from "../../core/dtos";

export class SeedsRepositoryImpl implements SeedsRepository {

    constructor(
        private readonly seedsDatasource: SeedsDatasource
    ) {}

    createSeeds(seedsDto: SeedDto[]): Promise<boolean> {
        return this.seedsDatasource.createSeeds(seedsDto);
    }

}
