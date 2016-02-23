import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class TaxesEntity extends BasePersistentEntity {
    static TableName = "Taxes";

    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();
    }
    private buildCustomAttributes() {
        this.attributes = {
			hotelId: {
                type: 'string',
                required: true
            },
			versionId: {
				type: 'integer',
				required: true,
				defaultsTo: 0
			},
            type: {
                type: 'integer',
                required: true
            },
			status: {
                type: 'integer',
                required: true
            },
            name: {
                type: 'string',
                required: true
            },
			valueType: {
				type: 'integer',
				required: true
			},
			value: {
				type: 'float',
                required: true
			}
		};
    }
}

var model: TaxesEntity = new TaxesEntity(TaxesEntity.TableName);
export = model;