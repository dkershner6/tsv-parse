import { TSVLineResult } from '.';

export default interface TSVResult {
    fieldNames?: string[];
    lines: TSVLineResult[];
}
