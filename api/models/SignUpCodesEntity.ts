import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class SignUpCodesEntity extends BasePersistentEntity {
    static TableName = "SignUpCodes";

    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();
    }
    private buildCustomAttributes() {
        this.attributes = {
            value: {
                type: 'string'
            }
        };
    }
}

var model: SignUpCodesEntity = new SignUpCodesEntity(SignUpCodesEntity.TableName);
export = model;