
import { firstName } from "../src/app";

describe('App file', () => {
    test('Should return Matias Suez', () => {
        expect( firstName ).toBe(`Matias Suez`);
    });
});
