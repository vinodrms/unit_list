import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class HotelConfigurationsEntity extends BasePersistentEntity {
    static TableName = "HotelConfigurations";

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
            metadata: {
                type: 'json',
                required: true
            },
            value: {
                type: 'json',
                required: true
            }
        };
    }
}

var model: HotelConfigurationsEntity = new HotelConfigurationsEntity(HotelConfigurationsEntity.TableName);
export = model;