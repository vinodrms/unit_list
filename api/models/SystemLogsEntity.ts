import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class SystemLogsEntity extends BasePersistentEntity {
    static TableName = "SystemLogs";

    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();
    }
    private buildCustomAttributes() {
        this.attributes = {
		};
    }
}

var model: SystemLogsEntity = new SystemLogsEntity(SystemLogsEntity.TableName);
export = model;