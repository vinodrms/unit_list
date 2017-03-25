import { BaseDO } from '../../../../../../../common/base/BaseDO';
import { YieldItemStateType } from './YieldItemStateDO';

export class DynamicPriceYieldItemDO extends BaseDO {
    dynamicPriceId: string;
    name: string;
    description: string;
    priceBriefString: string;
    roomCategoryNameForPriceBrief: string;
    openList: YieldItemStateType[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["dynamicPriceId", "name", "description", "priceBriefString", "roomCategoryNameForPriceBrief", "openList"];
    }
}