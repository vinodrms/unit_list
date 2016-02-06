import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class SystemPatchesEntity extends BasePersistentEntity {
    static TableName = "SystemPatches";

    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();
    }
    private buildCustomAttributes() {
        this.attributes = {
			patchType: {
				type: 'string',
                required: true
			},
            lock: {
                type: 'integer',
                required: true
            },
            patches: {
                type: 'array',
				defaultsTo: []
            }
		};
    }
}

var model: SystemPatchesEntity = new SystemPatchesEntity(SystemPatchesEntity.TableName);
export = model;