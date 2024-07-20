import { SeedDto } from "../dtos/seed.dto";

export abstract class SeedsRepository {
    abstract createSeeds(seeds:SeedDto[]): Promise<boolean>;
}