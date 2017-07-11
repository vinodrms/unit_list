import { PriceProductPriceType, IPriceProductPrice } from '../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import { PriceProductPriceDO } from '../../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO';
import { PriceExceptionDO } from '../../../../../../../../../services/price-products/data-objects/price/price-exceptions/PriceExceptionDO';
import { PriceProductVM } from '../../../../../../../../../services/price-products/view-models/PriceProductVM';
import { RoomCategoryStatsDO } from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { RoomCategoryDO } from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import { PriceVM } from './PriceVM';
import { DynamicPriceDO } from "../../../../../../../../../services/price-products/data-objects/price/DynamicPriceDO";
import { PricePerPersonDO } from "../../../../../../../../../services/price-products/data-objects/price/price-per-person/PricePerPersonDO";
import { SinglePriceDO } from "../../../../../../../../../services/price-products/data-objects/price/single-price/SinglePriceDO";
import { AppContext } from "../../../../../../../../../../../common/utils/AppContext";
import { ThUtils } from "../../../../../../../../../../../common/utils/ThUtils";

import * as _ from "underscore";

export class DynamicPriceVM {
    private _thUtils: ThUtils;

    private _dynamicPriceDO: DynamicPriceDO;
    private _priceVMList: PriceVM[];
    private _selected: boolean;

    constructor(
        private _priceType: PriceProductPriceType) {
        this._thUtils = new ThUtils();
        this._dynamicPriceDO = new DynamicPriceDO(this._priceType);
        this._priceVMList = [];
    }

    public get name(): string {
        return this._dynamicPriceDO.name;
    }
    public set name(name: string) {
        this._dynamicPriceDO.name = name;
    }
    public get description(): string {
        return this._dynamicPriceDO.description;
    }
    public set description(description: string) {
        this._dynamicPriceDO.description = description;
    }
    public get priceVMList(): PriceVM[] {
        return this._priceVMList;
    }
    public set priceVMList(priceVMList: PriceVM[]) {
        this._priceVMList = priceVMList;
    }
    public get selected(): boolean {
        return this._selected;
    }
    public set selected(selected: boolean) {
        this._selected = selected;
    }
    public get dynamicPriceDO(): DynamicPriceDO {
        return this._dynamicPriceDO;
    }

    public editOnPricesAndExceptionsIsAllowed(readonly: boolean): boolean {
        if (readonly && !this._thUtils.isUndefinedOrNull(this.dynamicPriceDO.id)) {
            return false;
        }
        return true;
    }

    public initializeFrom(dynamicPriceDO: DynamicPriceDO) {
        this._dynamicPriceDO = dynamicPriceDO;
        this._selected = false;

        if (dynamicPriceDO.type !== this._priceType) {
            this._priceVMList = [];
            return;
        }
        let newPriceVMList: PriceVM[] = [];

        _.forEach(dynamicPriceDO.priceList, (innerPrice: IPriceProductPrice) => {
            let priceVM = new PriceVM(this._priceType);
            priceVM.roomCategoryStats = new RoomCategoryStatsDO();
            priceVM.roomCategoryStats.roomCategory = new RoomCategoryDO();
            priceVM.roomCategoryStats.roomCategory.id = innerPrice.getRoomCategoryId();
            priceVM.price = innerPrice;

            let filteredPriceExceptionList: PriceExceptionDO[] = dynamicPriceDO.getFilteredExceptionsByRoomCategoryId(innerPrice.getRoomCategoryId());
            _.forEach(filteredPriceExceptionList, (exp: PriceExceptionDO) => {
                priceVM.priceExceptionsByWeekday[exp.dayFromWeek] = exp.price;
            });

            priceVM.indexExceptions();
            newPriceVMList.push(priceVM);
        });
        this._priceVMList = newPriceVMList;
    }

    public updateFromRoomCategoryStatsList(roomCategoryStatsList: RoomCategoryStatsDO[]) {
        let newPriceVMList: PriceVM[] = [];
        _.forEach(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
            let newPriceVM = new PriceVM(this._priceType);

            let currentPriceVM = this.getPriceVMForRoomCategoryId(roomCategoryStats.roomCategory.id);
            var currentPrice: IPriceProductPrice;
            if (currentPriceVM) {
                currentPrice = currentPriceVM.price;
                newPriceVM.priceExceptionsByWeekday = currentPriceVM.priceExceptionsByWeekday;
                newPriceVM.indexExceptions();
            }
            else {
                currentPrice = PriceProductPriceDO.buildPriceInstance(this._priceType);
            }

            newPriceVM.roomCategoryStats = roomCategoryStats;
            newPriceVM.price = currentPrice.prototypeForStats(roomCategoryStats);
            newPriceVMList.push(newPriceVM);
        });
        this._priceVMList = newPriceVMList;
    }
    public getPriceVMForRoomCategoryId(roomCategoryId: string): PriceVM {
        return _.find(this._priceVMList, (priceVM: PriceVM) => { return priceVM.price.getRoomCategoryId() === roomCategoryId });
    }

    public isValid(): boolean {
        var valid = true;
        _.forEach(this._priceVMList, (priceVM: PriceVM) => {
            if (!priceVM.isValid()) {
                valid = false;
            }
        });
        return valid;
    }

    public updatePricesOn(priceProductVM: PriceProductVM) {
        let dynamicPrice: DynamicPriceDO = priceProductVM.priceProduct.price.getDynamicPriceById(this._dynamicPriceDO.id);
        if (this._thUtils.isUndefinedOrNull(dynamicPrice)) {
            dynamicPrice = new DynamicPriceDO(this._dynamicPriceDO.type);
            dynamicPrice.name = this._dynamicPriceDO.name;
            dynamicPrice.description = this._dynamicPriceDO.description;
        }

        dynamicPrice.priceList = [];
        dynamicPrice.priceExceptionList = [];
        _.forEach(this._priceVMList, priceVM => {
            dynamicPrice.priceList.push(priceVM.price);
            dynamicPrice.priceExceptionList = dynamicPrice.priceExceptionList.concat(priceVM.exceptionList);
        });
        if (this._thUtils.isUndefinedOrNull(dynamicPrice.id)) {
            priceProductVM.priceProduct.price.dynamicPriceList.push(dynamicPrice);
        }
    }

    public copyPrices(sourceRoomCategoryId: string, destinationRoomCategoryId: string) {
        var sourcePriceVM = this.getPriceVMForRoomCategoryId(sourceRoomCategoryId);
        var destPriceVM = this.getPriceVMForRoomCategoryId(destinationRoomCategoryId);
        if (!sourcePriceVM || !destPriceVM) {
            return;
        }
        var sourcePriceDO = sourcePriceVM.price;
        var destPriceDO = destPriceVM.price;
        destPriceDO.copyPricesFrom(sourcePriceDO);
    }

    public resetPrices() {
        _.forEach(this._priceVMList, (priceVM: PriceVM) => {
            priceVM.price.resetPrices();
        });
    }

    public resetExceptions() {
        this._priceVMList.forEach(priceVM => {
            priceVM.exceptionList = [];
        });
    }

    public buildPrototype(): DynamicPriceVM {
        let dynamicPriceCopy: DynamicPriceVM = new DynamicPriceVM(this._priceType);
        dynamicPriceCopy._dynamicPriceDO.buildFromObject(this._dynamicPriceDO);
        dynamicPriceCopy.priceVMList = [];

        _.forEach(this.priceVMList, (priceVM: PriceVM) => {
            dynamicPriceCopy.priceVMList.push(priceVM.buildPrototype());
        });

        return dynamicPriceCopy;
    }
}