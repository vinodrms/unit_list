import {BaseDO} from '../../../common/base/BaseDO';
import {SettingMetadataDO} from '../common/SettingMetadataDO';
import {RoomAttributeDO} from '../../../common/data-objects/room-attribute/RoomAttributeDO';

export class RoomAttributeSettingDO extends BaseDO {
    metadata: SettingMetadataDO;
    value: RoomAttributeDO[];
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new SettingMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (roomAttributeObject: Object) => {
            var roomAttributeDO = new RoomAttributeDO();
            roomAttributeDO.buildFromObject(roomAttributeObject);
            this.value.push(roomAttributeDO);
        });
    }
}