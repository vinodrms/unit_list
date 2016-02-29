import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class RoomsEntity extends BasePersistentEntity {
    static TableName = "Rooms";
    
    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();    
    }
    
    private buildCustomAttributes() {
        this.attributes = {
            
        };
    }
}

var model: RoomsEntity = new RoomsEntity(RoomsEntity.TableName);
export = model;