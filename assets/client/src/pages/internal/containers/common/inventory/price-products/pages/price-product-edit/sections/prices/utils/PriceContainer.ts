import { PriceProductPriceType, IPriceProductPrice } from '../../../../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import { PriceProductPriceDO } from '../../../../../../../../../services/price-products/data-objects/price/PriceProductPriceDO';
import { PriceExceptionDO } from '../../../../../../../../../services/price-products/data-objects/price/price-exceptions/PriceExceptionDO';
import { PriceProductVM } from '../../../../../../../../../services/price-products/view-models/PriceProductVM';
import { RoomCategoryStatsDO } from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { RoomCategoryDO } from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import { PriceVM } from './PriceVM';

export class PriceContainer {
    private _priceVMList: PriceVM[];

    constructor(private _priceType: PriceProductPriceType) {
        this._priceVMList = [];
    }

    public get priceVMList(): PriceVM[] {
        return this._priceVMList;
    }
    public set priceVMList(priceVMList: PriceVM[]) {
        this._priceVMList = priceVMList;
    }

    public initializeFrom(price: PriceProductPriceDO) {
        if (price.type !== this._priceType) {
            this._priceVMList = [];
            return;
        }
        let newPriceVMList: PriceVM[] = [];
        _.forEach(price.priceList, (innerPrice: IPriceProductPrice) => {
            let priceVM = new PriceVM(this._priceType);
            priceVM.roomCategoryStats = new RoomCategoryStatsDO();
            priceVM.roomCategoryStats.roomCategory = new RoomCategoryDO();
            priceVM.roomCategoryStats.roomCategory.id = innerPrice.getRoomCategoryId();
            priceVM.price = innerPrice;

            let filteredPriceExceptionList: PriceExceptionDO[] = price.getFilteredExceptionsByRoomCategoryId(innerPrice.getRoomCategoryId());
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
        var previousRoomCategoryId: string;
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
            if (previousRoomCategoryId) {
                newPriceVM.previousRoomCategoryId = previousRoomCategoryId;
            }
            newPriceVMList.push(newPriceVM);
            previousRoomCategoryId = roomCategoryStats.roomCategory.id;
        });
        this._priceVMList = newPriceVMList;
    }
    private getPriceVMForRoomCategoryId(roomCategoryId: string): PriceVM {
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
        priceProductVM.priceProduct.price.type = this._priceType;
        priceProductVM.priceProduct.price.priceList = [];
        priceProductVM.priceProduct.price.priceExceptionList = [];
        _.forEach(this._priceVMList, priceVM => {
            priceProductVM.priceProduct.price.priceList.push(priceVM.price);
            priceProductVM.priceProduct.price.priceExceptionList = priceProductVM.priceProduct.price.priceExceptionList.concat(priceVM.exceptionList);
        });
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
}