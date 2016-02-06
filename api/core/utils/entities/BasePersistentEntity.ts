export class BasePersistentEntity {
    attributes: Object;
    tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }
    getCollectionName(): String {
        return this.tableName;
    }
}