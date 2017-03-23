import { PriceProductPriceDO } from "../../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO";
import { PriceProductPriceType } from "../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice";
import { DynamicPriceDO } from "../../../../../../../../../services/price-products/data-objects/price/DynamicPriceDO";
import { PriceProductVM } from "../../../../../../../../../services/price-products/view-models/PriceProductVM";
import { PriceVM } from "./PriceVM";
import { DynamicPriceVM } from "./DynamicPriceVM";
import { RoomCategoryStatsDO } from "../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO";

export class DynamicPriceVMContainer {

    private _dynamicPriceVMList: DynamicPriceVM[];
    
    constructor(private _priceType: PriceProductPriceType) {
    }

    public get priceType(): PriceProductPriceType {
        return this._priceType;
    }
    
    public initializeFrom(price: PriceProductPriceDO) {
        let newDynamicPriceVMList: DynamicPriceVM[] = [];
    _.forEach(price.dynamicPriceList, (dynamicPrice: DynamicPriceDO) => {
            
            let dynamicPriceVM = new DynamicPriceVM(this._priceType);
            dynamicPriceVM.initializeFrom(dynamicPrice);
            
            newDynamicPriceVMList.push(dynamicPriceVM);
        });
        this._dynamicPriceVMList = newDynamicPriceVMList;

        if(this._dynamicPriceVMList.length > 0) {
            this._dynamicPriceVMList[0].selected = true;
        }
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

    public updateFromRoomCategoryStatsList(roomCategoryStatsList: RoomCategoryStatsDO[]) {
        
        _.forEach(this._dynamicPriceVMList, (dynamicPriceVM: DynamicPriceVM) => {
            dynamicPriceVM.updateFromRoomCategoryStatsList(roomCategoryStatsList);
        });
    }
}
