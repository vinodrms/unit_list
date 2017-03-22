import { PriceProductPriceDO } from "../../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO";
import { PriceProductPriceType } from "../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice";
import { DynamicPriceDO } from "../../../../../../../../../services/price-products/data-objects/price/DynamicPriceDO";
import { PriceProductVM } from "../../../../../../../../../services/price-products/view-models/PriceProductVM";
import { PriceVM } from "./PriceVM";
import { DynamicPriceVM } from "./DynamicPriceVM";

export class DynamicPriceVMContainer {

    private _priceContainerList: DynamicPriceVM[];
    
    constructor(private _priceType: PriceProductPriceType) {
    }

    public initializeFrom(price: PriceProductPriceDO) {
        debugger
        let newPriceContainerList: DynamicPriceVM[] = [];
        _.forEach(price.dynamicPriceList, (dynamicPrice: DynamicPriceDO) => {
            
            let priceContainer = new DynamicPriceVM(this._priceType);
            // priceContainer.initializeFrom(dynamicPrice);
            
            
            newPriceContainerList.push(priceContainer);
        });
        this._priceContainerList = newPriceContainerList;
    }

    public get priceContainerList(): DynamicPriceVM[] {
        return this._priceContainerList;
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
