import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class RoomCategoriesEntity extends BasePersistentEntity {
    static TableName = "RoomCategories";
    
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
            displayName: {
                type: 'string',
                required: true
            },
            status: {
                type: 'integer',
                required: true    
            }
        };
    }
}

var model: RoomCategoriesEntity = new RoomCategoriesEntity(RoomCategoriesEntity.TableName);
export = model;