/* eslint-disable jest/no-mocks-import */ // I didn't know naming back then
import simpleMock from "./__mocks__/simple";
import tabsEverywhere from "./__mocks__/tabsEverywhere";
import withTooManyValues from "./__mocks__/withTooManyValues";
import parse from "./parse";

describe("parse", () => {
    describe("With HeaderRow", () => {
        const options = { headerRow: true };

        it("Should parse a simple TSV", () => {
            const results = parse(simpleMock, options);

            results.lines.forEach((line) => {
                expect(line.error).toBeFalsy();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                expect(Object.keys(line.parsedLine as any)).toHaveLength(3);
            });
        });

        it("Should find an error when a line with too many values is found", () => {
            const results = parse(withTooManyValues, options);

            results.lines.forEach((line) => {
                expect(line.error).toBeTruthy();
                expect(line.errorMessage).toEqual(
                    `Line has ${4} values, but header indicates ${3} values.`,
                );
            });
        });

        it("Should fail if tabs are just all over the place and options are set to not ignore extra tabs", () => {
            const results = parse(tabsEverywhere, {
                ...options,
                ignoreBlankHeaderlessData: false,
            });

            results.lines.forEach((line) => {
                expect(line.error).toBeTruthy();
                expect(line.errorMessage).toEqual(
                    `Line has ${9} values, but header indicates ${3} values.`,
                );
            });
        });

        it("Should succeed if tabs are just all over the place and options are set to ignore extra tabs", () => {
            const results = parse(tabsEverywhere, {
                ...options,
            });

            results.lines.forEach((line) => {
                expect(line.error).toBeFalsy();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                expect(Object.keys(line.parsedLine as any)).toHaveLength(3);
            });
        });
    });
});
