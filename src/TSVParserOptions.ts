export const TSV_PARSER_DEFAULT_OPTIONS: TSVParserOptions = {
    headerRow: true,
    ignoreBlankRows: true,
    ignoreBlankHeaderlessData: true,
};

export default interface TSVParserOptions {
    /** Set false to just return data in arrays, otherwise returns JSON objects  */
    headerRow: boolean;
    /** Ignore rows that have all blank strings */
    ignoreBlankRows: boolean;
    /** Ignore blank data that has no header. Requires headerRow = true */
    ignoreBlankHeaderlessData: boolean;
}
