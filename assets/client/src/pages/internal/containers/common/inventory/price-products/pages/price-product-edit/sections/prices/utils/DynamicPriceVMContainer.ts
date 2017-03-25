import { PriceProductPriceDO } from "../../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO";
import { PriceProductPriceType } from "../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice";
import { DynamicPriceDO } from "../../../../../../../../../services/price-products/data-objects/price/DynamicPriceDO";
import { PriceProductVM } from "../../../../../../../../../services/price-products/view-models/PriceProductVM";
import { PriceVM } from "./PriceVM";
import { DynamicPriceVM } from "./DynamicPriceVM";
import { RoomCategoryStatsDO } from "../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO";
import { RoomCategoryDO } from "../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO";

export class DynamicPriceVMContainer {
    private _selectedDynamicPriceIndex: number;
    private _dynamicPriceVMList: DynamicPriceVM[];
    
    constructor(private _priceType: PriceProductPriceType) {
        this._selectedDynamicPriceIndex = 0;
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
            this._selectedDynamicPriceIndex = 0;
            this.selectDynamicPrice(this._selectedDynamicPriceIndex);
        }
    }

    public get selectedDynamicPriceIndex(): number {
		return this._selectedDynamicPriceIndex;
	}

    public selectDynamicPrice(index: number) {
		this.dynamicPriceVMList[this._selectedDynamicPriceIndex].selected = false;
		this.dynamicPriceVMList[index].selected = true;
		this._selectedDynamicPriceIndex = index;
    }

    public get selectedDynamicPriceVM(): DynamicPriceVM {
		return this._dynamicPriceVMList[this._selectedDynamicPriceIndex];
	}

    public get dynamicPriceVMList(): DynamicPriceVM[] {
        return this._dynamicPriceVMList;
    }

    public set dynamicPriceVMList(dynamicPriceVMList: DynamicPriceVM[]) {
        this._dynamicPriceVMList = dynamicPriceVMList;
    }

    public isValid(): boolean {
        return true;
    }

    public updatePricesOn(priceProductVM: PriceProductVM) {
        _.forEach(this._dynamicPriceVMList, (dynamicPriceVM: DynamicPriceVM) => {
            dynamicPriceVM.updatePricesOn(priceProductVM);    
        });
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
