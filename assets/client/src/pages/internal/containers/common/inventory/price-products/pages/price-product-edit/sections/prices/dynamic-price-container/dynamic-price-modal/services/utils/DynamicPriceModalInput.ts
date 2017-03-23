import { DynamicPriceVM } from "../../../../utils/DynamicPriceVM";

export class DynamicPriceModalInput {
    private _dynamicPriceVM: DynamicPriceVM;
    private _readonly: boolean;


    constructor(dynamicPriceVM: DynamicPriceVM, readonly: boolean) {
        this._dynamicPriceVM = dynamicPriceVM;
        this._readonly = readonly;
    }

    public get dynamicPriceVM(): DynamicPriceVM {
        return this._dynamicPriceVM;
    }
    public set dynamicPriceVM(priceVM: DynamicPriceVM) {
        this._dynamicPriceVM = priceVM;
    }

    public get readonly(): boolean {
        return this._readonly;
    }
    public set readonly(readonly: boolean) {
        this._readonly = readonly;
    }
}