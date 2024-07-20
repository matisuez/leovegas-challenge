import { SeedDto } from "../dtos/seed.dto";

export abstract class SeedsDatasource {
    abstract createSeeds(seeds:SeedDto[]): Promise<boolean>;
}
