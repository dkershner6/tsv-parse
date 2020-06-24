import parse from './parse';
import simpleMock from './__mocks__/simple';
import withTooManyValues from './__mocks__/withTooManyValues';
import tabsEverywhere from './__mocks__/tabsEverywhere';

describe('parse', () => {
    describe('With HeaderRow', () => {
        const options = { headerRow: true };

        it('Should parse a simple TSV', () => {
            const results = parse(simpleMock, options);

            results.forEach((result) => {
                expect(result.error).toBeFalsy();
                expect(Object.keys(result.result)).toHaveLength(3);
            });
        });

        it('Should find an error when a line with too many values is found', () => {
            const results = parse(withTooManyValues, options);

            results.forEach((result) => {
                expect(result.error).toBeTruthy();
                expect(result.errorMessage).toEqual(
                    `Line has ${4} values, but header indicates ${3} values.`
                );
            });
        });

        it('Should fail somehow if tabs are just all over the place', () => {
            const results = parse(tabsEverywhere, options);

            results.forEach((result) => {
                expect(result.error).toBeTruthy();
                expect(result.errorMessage).toEqual(
                    `Line has ${9} values, but header indicates ${3} values.`
                );
            });
        });
    });
});
