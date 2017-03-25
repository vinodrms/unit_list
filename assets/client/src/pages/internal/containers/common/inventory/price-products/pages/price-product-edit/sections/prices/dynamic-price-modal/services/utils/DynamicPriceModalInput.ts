import { DynamicPriceVM } from "../../../utils/DynamicPriceVM";
import { PriceProductPriceType } from "../../../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice";

export class DynamicPriceModalInput {
    private _dynamicPriceVM: DynamicPriceVM;
    private _priceType: PriceProductPriceType;
    private _readOnly: boolean;

    constructor(dynamicPriceVM: DynamicPriceVM, priceType: PriceProductPriceType, readOnly?: boolean) {
        this._dynamicPriceVM = dynamicPriceVM;
        this._priceType = priceType;
        this._readOnly = readOnly;
    }

    public get dynamicPriceVM(): DynamicPriceVM {
        return this._dynamicPriceVM;
    }
    public set dynamicPriceVM(priceVM: DynamicPriceVM) {
        this._dynamicPriceVM = priceVM;
    }
    public get priceType(): PriceProductPriceType {
        return this._priceType;
    }
    public get readOnly(): boolean {
        return this._readOnly;
    }
}