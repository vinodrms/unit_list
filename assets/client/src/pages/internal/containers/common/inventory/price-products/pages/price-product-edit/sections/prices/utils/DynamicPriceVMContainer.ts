import { PriceProductPriceDO } from "../../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO";
import { PriceProductPriceType } from "../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice";
import { DynamicPriceDO } from "../../../../../../../../../services/price-products/data-objects/price/DynamicPriceDO";
import { PriceProductVM } from "../../../../../../../../../services/price-products/view-models/PriceProductVM";
import { PriceVM } from "./PriceVM";
import { DynamicPriceVM } from "./DynamicPriceVM";

export class DynamicPriceVMContainer {

    private _dynamicPriceVMList: DynamicPriceVM[];
    
    constructor(private _priceType: PriceProductPriceType) {
    }

    public initializeFrom(price: PriceProductPriceDO) {
        debugger
        let newDynamicPriceVMList: DynamicPriceVM[] = [];
        _.forEach(price.dynamicPriceList, (dynamicPrice: DynamicPriceDO) => {
            
            let dynamicPriceVM = new DynamicPriceVM(this._priceType);
            dynamicPriceVM.initializeFrom(dynamicPrice);
            
            newDynamicPriceVMList.push(dynamicPriceVM);
        });
        this._dynamicPriceVMList = newDynamicPriceVMList;
    }

    public get dynamicPriceVMList(): DynamicPriceVM[] {
        return this._dynamicPriceVMList;
    }

    public isValid(): boolean {
        return true;
    }

    public updatePricesOn(priceProductVM: PriceProductVM) {
    }

    public getPriceVMForRoomCategoryId(roomCategoryId: string): PriceVM {
        return null;
    }
}
