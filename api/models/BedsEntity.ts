import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class BedsEntity extends BasePersistentEntity {
    static TableName = "Beds";
    
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
            bedTemplateId: {
                type: 'string',
                required: true
            },
            storageType: {
                type: 'integer',
                required: true
            },
            accommodationType: {
                type: 'integer',
                required: true
            },
            name: {
                type: 'string',
                required: true
            },
            size: {
                type: 'json',
                required: false
            },
            capacity: {
                type: 'json',
                required: false
            },
            status: {
                type: 'integer',
                required: true
            }
        };
    }
}

var model: BedsEntity = new BedsEntity(BedsEntity.TableName);
export = model;