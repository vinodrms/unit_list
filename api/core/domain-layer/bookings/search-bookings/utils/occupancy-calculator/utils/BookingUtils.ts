import {ThUtils} from '../../../../../../utils/ThUtils';

import _ = require('underscore');

export class BookingUtils {
    private _thUtils: ThUtils;

    constructor() {
        this._thUtils = new ThUtils();
    }

    public combineIndexedOccupancies(destIndexedOccupancy: { [id: string]: number; }, sourceIndexedOccupancy: { [id: string]: number; }): { [id: string]: number; } {
        var combinedIndexedOccupancy = destIndexedOccupancy;

        var objectKeyArray: string[] = Object.keys(sourceIndexedOccupancy);
        _.forEach(objectKeyArray, (objectKey: string) => {
            var previousOccupancy = combinedIndexedOccupancy[objectKey];
            if (this._thUtils.isUndefinedOrNull(previousOccupancy) || !_.isNumber(previousOccupancy)) {
                combinedIndexedOccupancy[objectKey] = sourceIndexedOccupancy[objectKey];
            }
            else {
                var currentOccupancy = sourceIndexedOccupancy[objectKey];
                if (currentOccupancy > previousOccupancy) {
                    combinedIndexedOccupancy[objectKey] = currentOccupancy;
                }
            }
        });
        return combinedIndexedOccupancy;
    }

    public getOccupancyForObjectKey(objectKey: string, indexedOccupancy: { [id: string]: number; }): number {
        var occupancy = indexedOccupancy[objectKey];
        if (this._thUtils.isUndefinedOrNull(occupancy) || !_.isNumber(occupancy)) {
            return 0;
        }
        return occupancy;
    }

    public transformToEmptyStringIfNull(value: string): string {
        if (this._thUtils.isUndefinedOrNull(value) || !_.isString(value)) {
            return "";
        }
        return value;
    }
}