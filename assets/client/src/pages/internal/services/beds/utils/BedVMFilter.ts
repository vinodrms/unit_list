import {BedVM} from '../view-models/BedVM';
import {RoomCategoryDO} from '../../room-categories/data-objects/RoomCategoryDO';
import {BedMetaDO} from '../../room-categories/data-objects/bed-config/BedMetaDO';
import {ThUtils} from '../../../../../common/utils/ThUtils';

export class BedVMFilter {
    private _thUtils: ThUtils;

    constructor(private _bedVMList: BedVM[]) {
        this._thUtils = new ThUtils();
    }

    public getFilteredBedsForRoomCategory(roomCategory: RoomCategoryDO): BedVM[] {
        var filteredBedVMList: BedVM[] = [];
        _.forEach(roomCategory.bedConfig.bedMetaList, (bedMeta: BedMetaDO) => {
            var bedVM = _.find(this._bedVMList, (bedVM: BedVM) => {
                return bedVM.bed.id === bedMeta.bedId;
            });
            if (!this._thUtils.isUndefinedOrNull(bedVM)) {
                for (var i = 0; i < bedMeta.noOfInstances; ++i) {
                    filteredBedVMList.push(bedVM);
                }
            }
        });
        var sortedRoomItemVMList = filteredBedVMList.sort((firstItem: BedVM, secondItem: BedVM) => {
            return firstItem.bed.storageType - secondItem.bed.storageType;
        });
        return sortedRoomItemVMList;
    }
}