import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class RoomsEntity extends BasePersistentEntity {
    static TableName = "Rooms";
    
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
            name: {
                type: "string",
                required: true
            },
            floor: {
                type: "integer",
                required: true
            },
            categoryId: {
                type: "string",
                required: true
            },
            amenityIdList: {
                type: "array",
                defaultsTo: []
            },
            attributeIdList: {
                type: "array",
                defaultsTo: []
            },
            notes: {
                type: "string"
            },
            maintenanceStatus: {
                type: "integer"  
            },
            maintenanceMessage: {
                type: "string",
                defaultsTo: ""
            },
            maintenanceHistory: {
                type: "json"
            },
            status: {
                type: 'integer',
                required: true    
            }
        };
    }
}

var model: RoomsEntity = new RoomsEntity(RoomsEntity.TableName);
export = model;