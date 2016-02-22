import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class BedConfigurationsEntity extends BasePersistentEntity {
    static TableName = "BedConfigurations";
    
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
            bedList: {
                type: 'array',
                required: true
            }   
        };
    }
}

var model: BedConfigurationsEntity = new BedConfigurationsEntity(BedConfigurationsEntity.TableName);
export = model;