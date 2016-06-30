import {ThUtils} from '../ThUtils';

export class GenericOccurenciesIndexer<T> {
    private _thUtils: ThUtils;

    private _indexedStringOccurencies: { [id: string]: number; };

    constructor(elementArray: T[], private _stringConversionFunction: { (element: T): string }) {
        this._thUtils = new ThUtils();
        this.indexElementOccurencies(elementArray);
    }
    private indexElementOccurencies(elementArray: T[]) {
        this._indexedStringOccurencies = _.countBy(elementArray, (element: T) => {
            return this._stringConversionFunction(element);
        });
    }

    public getNoOfOccurenciesForElement(element: T): number {
        return this.getNoOfOccurenciesForStringElement(this._stringConversionFunction(element));

    }
    public getNoOfOccurenciesForStringElement(stringElement: string): number {
        var noOfOccurencies: number = this._indexedStringOccurencies[stringElement];
        if (this._thUtils.isUndefinedOrNull(noOfOccurencies) || !_.isNumber(noOfOccurencies)) {
            return 0;
        }
        return noOfOccurencies;
    }

    public getNoOfOccurenciesForElementList(elementList: T[]): number {
        var noOfOccurencies = 0;
        _.forEach(elementList, (element: T) => {
            noOfOccurencies += this.getNoOfOccurenciesForElement(element);
        });
        return noOfOccurencies;
    }
}