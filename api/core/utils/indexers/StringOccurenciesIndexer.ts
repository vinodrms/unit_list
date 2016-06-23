import {GenericOccurenciesIndexer} from './GenericOccurenciesIndexer';

export class StringOccurenciesIndexer extends GenericOccurenciesIndexer<string>{
    constructor(stringArray: string[]) {
        super(stringArray, (stringValue: string) => { return stringValue });
    }
}