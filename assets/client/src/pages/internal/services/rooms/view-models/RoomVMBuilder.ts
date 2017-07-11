import {ThUtils} from '../../../../../common/utils/ThUtils';
import {RoomDO} from '../data-objects/RoomDO';
import {RoomsDO} from '../data-objects/RoomsDO';
import {RoomVM} from './RoomVM';
import {RoomAmenitiesDO} from '../../settings/data-objects/RoomAmenitiesDO';
import {RoomAttributesDO} from '../../settings/data-objects/RoomAttributesDO';
import {AmenityDO} from '../../common/data-objects/amenity/AmenityDO';
import {RoomAttributeDO} from '../../common/data-objects/room-attribute/RoomAttributeDO';
import {RoomCategoryStatsDO} from '../../room-categories/data-objects/RoomCategoryStatsDO';

import * as _ from 'underscore';

export class RoomVMBuilder {
    private _thUtils: ThUtils;

    constructor(private _roomAmenities: RoomAmenitiesDO, private _roomAttributes: RoomAttributesDO,
        private _roomCategoriesStats: RoomCategoryStatsDO[]) {
        this._thUtils = new ThUtils();
    }

    public buildRoomVMListFrom(pageDataObject: Object): RoomVM[] {
        var rooms = new RoomsDO();
        rooms.buildFromObject(pageDataObject);

        var roomVMList: RoomVM[] = [];
        _.forEach(rooms.roomList, (room: RoomDO) => {
            var roomVM = new RoomVM();
            roomVM.room = room;

            roomVM.roomAmenityList = [];
            _.forEach(room.amenityIdList, (amenityId: string) => {
                var roomAmenity = _.find(this._roomAmenities.roomAmenityList, (roomAmenity: AmenityDO) => {
                    return roomAmenity.id === amenityId;
                });
                if (!this._thUtils.isUndefinedOrNull(roomAmenity)) {
                    roomVM.roomAmenityList.push(roomAmenity);
                }
            });

            roomVM.roomAttributeList = [];
            _.forEach(room.attributeIdList, (attributeId: string) => {
                var roomAttribute = _.find(this._roomAttributes.roomAttributeList, (roomAttribute: RoomAttributeDO) => {
                    return roomAttribute.id === attributeId;
                });
                if (!this._thUtils.isUndefinedOrNull(roomAttribute)) {
                    roomVM.roomAttributeList.push(roomAttribute);
                }
            });

            roomVM.categoryStats = _.find(this._roomCategoriesStats, (roomCategoryStats: RoomCategoryStatsDO) => {
                return roomCategoryStats.roomCategory.id === room.categoryId;
            });

            if (!this._thUtils.isUndefinedOrNull(roomVM.categoryStats)) {
                roomVM.category = roomVM.categoryStats.roomCategory;
            }

            roomVMList.push(roomVM);
        });
        return roomVMList;
    }
}