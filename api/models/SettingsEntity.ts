import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class SettingsEntity extends BasePersistentEntity {
    static TableName = "Settings";

    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();
    }
    private buildCustomAttributes() {
        this.attributes = {
            code: {
                type: 'string',
                required: true
            },
            name: {
                type: 'string',
                required: true
            },
            value: {
                type: 'json'
            }
		};
    }
}

var model: SettingsEntity = new SettingsEntity(SettingsEntity.TableName);
export = model;