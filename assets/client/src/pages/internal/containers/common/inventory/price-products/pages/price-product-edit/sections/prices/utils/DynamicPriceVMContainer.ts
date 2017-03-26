import { PriceProductPriceDO } from "../../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO";
import { PriceProductPriceType } from "../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice";
import { DynamicPriceDO } from "../../../../../../../../../services/price-products/data-objects/price/DynamicPriceDO";
import { PriceProductVM } from "../../../../../../../../../services/price-products/view-models/PriceProductVM";
import { PriceVM } from "./PriceVM";
import { DynamicPriceVM } from "./DynamicPriceVM";
import { RoomCategoryStatsDO } from "../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO";
import { RoomCategoryDO } from "../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO";
import { ThUtils } from "../../../../../../../../../../../common/utils/ThUtils";

export class DynamicPriceVMContainer {
    private _thUtils: ThUtils;

    private _selectedDynamicPriceIndex: number;
    private _dynamicPriceVMList: DynamicPriceVM[];

    constructor(private _priceType: PriceProductPriceType) {
        this._thUtils = new ThUtils();

        let defaultDynamicPriceVM = new DynamicPriceVM(_priceType);
        defaultDynamicPriceVM.name = "Default Pricing";
        defaultDynamicPriceVM.description = "";
        defaultDynamicPriceVM.priceVMList = [];
        defaultDynamicPriceVM.selected = true;
        this._selectedDynamicPriceIndex = 0;
        this._dynamicPriceVMList = [defaultDynamicPriceVM];
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

        if (this._dynamicPriceVMList.length > 0) {
            this._selectedDynamicPriceIndex = 0;
            this.selectDynamicPrice(this._selectedDynamicPriceIndex);
        }
    }

    public get selectedDynamicPriceIndex(): number {
        return this._selectedDynamicPriceIndex;
    }

    public selectDynamicPrice(index: number) {
        this.dynamicPriceVMList.forEach(dynamicPrice => {
            dynamicPrice.selected = false;
        });
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
        let isValid = true;
        _.forEach(this._dynamicPriceVMList, (dynamicPriceVM: DynamicPriceVM) => {
            if (!dynamicPriceVM.isValid()) {
                isValid = false;
            }
        });
        return isValid;
    }

    public updatePricesOn(priceProductVM: PriceProductVM) {
        this.removeDeletedDynamicPricesOnPriceProduct(priceProductVM);

        priceProductVM.priceProduct.price.type = this._priceType;

        _.forEach(this._dynamicPriceVMList, (dynamicPriceVM: DynamicPriceVM) => {
            dynamicPriceVM.updatePricesOn(priceProductVM);
        });
    }

    private removeDeletedDynamicPricesOnPriceProduct(priceProductVM: PriceProductVM) {
        let dynamicPriceIdList =
            _.chain(this._dynamicPriceVMList)
                .map((dynamicPriceVM: DynamicPriceVM) => {
                    return dynamicPriceVM.dynamicPriceDO.id
                })
                .filter((dynamicPriceId: string) => {
                    return !this._thUtils.isUndefinedOrNull(dynamicPriceId);
                })
                .value();

        priceProductVM.priceProduct.price.dynamicPriceList =
            _.filter(priceProductVM.priceProduct.price.dynamicPriceList, (dynamicPriceDO: DynamicPriceDO) => {
                return _.contains(dynamicPriceIdList, dynamicPriceDO.id);
            });
    }

    public updateFromRoomCategoryStatsList(roomCategoryStatsList: RoomCategoryStatsDO[]) {
        _.forEach(this._dynamicPriceVMList, (dynamicPriceVM: DynamicPriceVM) => {
            dynamicPriceVM.updateFromRoomCategoryStatsList(roomCategoryStatsList);
        });
    }
}
