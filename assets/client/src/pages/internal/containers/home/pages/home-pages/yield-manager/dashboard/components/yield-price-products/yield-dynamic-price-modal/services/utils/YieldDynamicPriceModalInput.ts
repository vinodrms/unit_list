import { PriceProductYieldItemVM } from "../../../../../../../../../../../services/yield-manager/dashboard/price-products/view-models/PriceProductYieldItemVM";
import { DynamicPriceYieldItemDO } from "../../../../../../../../../../../services/yield-manager/dashboard/price-products/data-objects/DynamicPriceYieldItemDO";
import { ThDateDO } from "../../../../../../../../../../../services/common/data-objects/th-dates/ThDateDO";

export class YieldDynamicPriceModalInput {
    private _ppYieldItemVM: PriceProductYieldItemVM;
    private _dynamicPriceYieldItem: DynamicPriceYieldItemDO;
    private _startDate: ThDateDO;

    public get ppYieldItemVM(): PriceProductYieldItemVM {
        return this._ppYieldItemVM;
    }
    public set ppYieldItemVM(ppYieldItemVM: PriceProductYieldItemVM) {
        this._ppYieldItemVM = ppYieldItemVM;
    }

    public get dynamicPriceYieldItem(): DynamicPriceYieldItemDO {
        return this._dynamicPriceYieldItem;
    }
    public set dynamicPriceYieldItem(dynamicPriceYieldItem: DynamicPriceYieldItemDO) {
        this._dynamicPriceYieldItem = dynamicPriceYieldItem;
    }

    public get startDate(): ThDateDO {
        return this._startDate;
    }
    public set startDate(startDate: ThDateDO) {
        this._startDate = startDate;
    }
}