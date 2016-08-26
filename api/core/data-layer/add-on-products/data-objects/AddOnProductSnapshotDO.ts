import {BaseDO} from '../../common/base/BaseDO';

export class AddOnProductSnapshotDO extends BaseDO {
    id: string;
    categoryId: string;
    name: string;
    price: number;
    internalCost: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "categoryId", "name", "price", "internalCost"];
    }
}