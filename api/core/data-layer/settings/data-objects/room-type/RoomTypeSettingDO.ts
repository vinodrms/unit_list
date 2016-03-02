import {BaseDO} from '../../../common/base/BaseDO';
import {SettingMetadataDO} from '../common/SettingMetadataDO';
import {RoomTypeDO} from '../../../common/data-objects/room-type/RoomTypeDO';

export class RoomTypeSettingDO extends BaseDO {
    metadata: SettingMetadataDO;
    value: RoomTypeDO[];
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new SettingMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (roomTypeObject: Object) => {
            var roomTypeDO = new RoomTypeDO();
            roomTypeDO.buildFromObject(roomTypeObject);
            this.value.push(roomTypeDO);
        });
    }
}