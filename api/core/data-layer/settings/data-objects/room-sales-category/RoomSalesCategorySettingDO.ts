import {BaseDO} from '../../../common/base/BaseDO';
import {SettingMetadataDO} from '../common/SettingMetadataDO';
import {RoomSalesCategoryDO} from '../../../common/data-objects/room-sales-category/RoomSalesCategoryDO';

export class RoomSalesCategorySettingDO extends BaseDO {
    metadata: SettingMetadataDO;
    value: RoomSalesCategoryDO[];
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new SettingMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (roomSalesCategoryObject: Object) => {
            var roomSalesCategoryDO = new RoomSalesCategoryDO();
            roomSalesCategoryDO.buildFromObject(roomSalesCategoryObject);
            this.value.push(roomSalesCategoryDO);
        });
    }
}