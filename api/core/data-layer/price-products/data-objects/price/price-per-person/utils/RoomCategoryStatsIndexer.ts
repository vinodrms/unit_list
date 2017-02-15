import { RoomCategoryStatsDO } from '../../../../../room-categories/data-objects/RoomCategoryStatsDO';
import { ConfigCapacityDO } from '../../../../../common/data-objects/bed-config/ConfigCapacityDO';
import { BedStatsDO } from '../../../../../room-categories/data-objects/bed-stats/BedStatsDO';
import { BedStorageType } from '../../../../../common/data-objects/bed/BedDO';

import _ = require('underscore');

export class RoomCategoryStatsIndexer {
    constructor(private _roomCategoryStats: RoomCategoryStatsDO) {
    }

    public canFitAChildInAdultsBed(queryCapacity: ConfigCapacityDO) {
        var bedStatsList: BedStatsDO[] = this.getBedStats();
        bedStatsList = this.orderByCapacity(bedStatsList);
        let currentCapacity = this.getCurrentCapacity(queryCapacity);
        var bedWithAdultsIndexes: { [index: number]: boolean } = {};

        for (var bedIndex = 0; bedIndex < bedStatsList.length; bedIndex++) {
            let bedStats = bedStatsList[bedIndex];
            if (bedStats.capacity.noAdults > 0) {
                let placedAdultsNo = Math.min(bedStats.capacity.noAdults, currentCapacity.noAdults);
                bedStats.capacity.noAdults -= placedAdultsNo;
                currentCapacity.noAdults -= placedAdultsNo;
                bedWithAdultsIndexes[bedIndex] = true;
            }
            if (currentCapacity.noAdults == 0) {
                break;
            }
        }

        for (var bedIndex = 0; bedIndex < bedStatsList.length; bedIndex++) {
            let bedStats = bedStatsList[bedIndex];
            // if an adult is placed in this bed and there is place for another child return true
            if (bedWithAdultsIndexes[bedIndex] && (bedStats.capacity.noAdults > 0 || bedStats.capacity.noChildren > 0)) {
                return true;
            }
        }
        return false;
    }

    private getBedStats(): BedStatsDO[] {
        var bedStatsList: BedStatsDO[] = [];
        this._roomCategoryStats.bedStatsList.forEach((bedStats: BedStatsDO) => {
            bedStatsList.push(bedStats.buildPrototype());
        });
        return bedStatsList;
    }
    private orderByCapacity(inBedStatsList: BedStatsDO[]): BedStatsDO[] {
        return inBedStatsList.sort((statsA: BedStatsDO, statsB: BedStatsDO) => {
            // stationary beds first, rollaway after
            if (statsA.storageType === BedStorageType.Rollaway && statsB.storageType === BedStorageType.Stationary) {
                return 1;
            }
            if (statsA.storageType === BedStorageType.Stationary && statsB.storageType === BedStorageType.Rollaway) {
                return -1;
            }
            // order from bigger to smaller capacity
            return this.getNoUnitsForCapacity(statsB.capacity) - this.getNoUnitsForCapacity(statsA.capacity);
        });
    }
    private getNoUnitsForCapacity(capacity: ConfigCapacityDO) {
        return (capacity.noAdults * 2) + capacity.noChildren;
    }
    private getCurrentCapacity(queryCapacity: ConfigCapacityDO): ConfigCapacityDO {
        let capacity = new ConfigCapacityDO();
        capacity.noAdults = queryCapacity.noAdults;
        capacity.noChildren = queryCapacity.noChildren;
        capacity.noBabies = queryCapacity.noBabies;
        capacity.noBabyBeds = queryCapacity.noBabyBeds;
        return capacity;
    }
}