import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class HotelInventorySnapshotEntity extends BasePersistentEntity {
    static TableName = "HotelInventorySnapshots";

    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();
    }

    private buildCustomAttributes() {
        this.attributes = {
            versionId: {
                type: 'integer',
                required: true,
                defaultsTo: 0
            },
            hotelId: {
                type: 'string',
                required: true
            },
            roomList: {
                type: "array",
                defaultsTo: []
            },
            thDate: {
                type: 'json',
                required: true
            },
            thDateUtcTimestamp: {
                type: 'integer',
                required: true
            }
        };
    }
}

var model: HotelInventorySnapshotEntity = new HotelInventorySnapshotEntity(HotelInventorySnapshotEntity.TableName);
export = model;