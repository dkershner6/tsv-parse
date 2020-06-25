import TSVParserOptions, {
    TSV_PARSER_DEFAULT_OPTIONS
} from './TSVParserOptions';
import TSVLineResult from './TSVLineResult';
import TSVResult from './TSVResult';

const TAB = '\t';
const NEWLINE_REGEX = /\r?\n/;

const parse = (
    tsvString: string,
    options?: Partial<TSVParserOptions>
): TSVResult => {
    const optionsToUse = { ...TSV_PARSER_DEFAULT_OPTIONS, ...options };

    const lines = tsvToLines(tsvString);
    if (optionsToUse.headerRow) {
        const headerRow = lines.shift();
        const fieldNames = headerRow.split(TAB).filter(Boolean);
        return {
            fieldNames,
            lines: lines
                .map((line) => parseLine(line, fieldNames, optionsToUse))
                .filter(Boolean)
        };
    }
    throw new Error(
        'Feature not implemented yet (yes, I know its the default)'
    );
};

const tsvToLines = (tsvString: string): string[] => {
    return tsvString.split(NEWLINE_REGEX);
};

const parseLine = (
    tsvLine: string,
    fieldNames?: string[],
    options?: TSVParserOptions
): TSVLineResult => {
    try {
        if (fieldNames) {
            return parseLineWithHeader(tsvLine, fieldNames, options);
        }
    } catch (error) {
        return { error: true, errorMessage: error.message };
    }
};

const parseLineWithHeader = (
    tsvLine: string,
    fieldNames: string[],
    options?: TSVParserOptions
): TSVLineResult => {
    const numberOfValues = fieldNames.length;
    const lineValues = tsvLine.split(TAB);

    if (options.ignoreBlankRows) {
        if (lineValues.every((lineValue) => !lineValue || lineValue === '')) {
            return null;
        }
    }

    if (options.ignoreBlankHeaderlessData) {
        while (lineValues.length > numberOfValues) {
            const lastValue = lineValues.pop();
            if (lastValue && lastValue !== '') {
                return {
                    error: true,
                    errorMessage: `Line has ${
                        lineValues.length + 1
                    } values, but header indicates ${numberOfValues} values.`
                };
            }
        }
    }

    if (lineValues.length !== numberOfValues) {
        return {
            error: true,
            errorMessage: `Line has ${lineValues.length} values, but header indicates ${numberOfValues} values.`
        };
    }

    return {
        error: false,
        parsedLine: mapValuesToFieldNames(lineValues, fieldNames)
    };
};

const mapValuesToFieldNames = (
    lineValues: string[],
    fieldNames: string[]
): Record<string, string> => {
    const result = {};
    for (let index = 0; index < lineValues.length; index++) {
        result[fieldNames[index]] = lineValues[index];
    }
    return result;
};

export default parse;
