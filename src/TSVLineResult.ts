export default interface TSVLineResult {
    error: boolean;
    errorMessage?: string;
    parsedLine?: unknown;
}
