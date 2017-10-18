import {ThUtils} from '../../../../../../../../../../../../../../common/utils/ThUtils';
import { AddOnProductItemVM } from './AddOnProductItemVM';
import { AddOnProductBookingReservedItem } from "../../../../../../../../../../../../services/bookings/data-objects/BookingDO";
import { AddOnProductSnapshotDO } from "../../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductSnapshotDO";
import * as _ from "underscore";

export class AddOnProductItemVMContainer {
    private _thUtils: ThUtils;
    private _addOnProductVMList: AddOnProductItemVM[];

    constructor(private _ccySymbol: string) {
        this._thUtils = new ThUtils();
        this._addOnProductVMList = [];
    }

    public initItemList(aopBookingReservedItemList: AddOnProductBookingReservedItem[]) {
        _.forEach(aopBookingReservedItemList, (addOnProduct: AddOnProductBookingReservedItem) => {
            this.addAddOnProduct(addOnProduct.aopSnapshot, addOnProduct.noOfItems);
        });
    }

    public addAddOnProduct(addOnProduct: AddOnProductSnapshotDO, noOfItems: number) {
        var itemVM = new AddOnProductItemVM();
        itemVM.addOnProductSnapshot = addOnProduct;
        itemVM.noAdded = noOfItems;
        itemVM.updateTotalPrice(this._ccySymbol);
        this._addOnProductVMList.push(itemVM);
    }

    public removeAddOnProduct(addOnProduct: AddOnProductSnapshotDO) {
        this._addOnProductVMList = _.filter(this._addOnProductVMList, (itemVM: AddOnProductItemVM) => { return itemVM.addOnProductSnapshot != addOnProduct });
    }

    public getAddOnProductBookingReservedItemList(): AddOnProductBookingReservedItem[] {
        var addOnProductBookingReservedItemList: AddOnProductBookingReservedItem[] = [];
        _.forEach(this._addOnProductVMList, (itemVM: AddOnProductItemVM) => {
            var addonProductReservedItem = new AddOnProductBookingReservedItem();
            addonProductReservedItem.aopSnapshot = itemVM.addOnProductSnapshot;
            addonProductReservedItem.noOfItems = itemVM.noAdded;
            addOnProductBookingReservedItemList.push(addonProductReservedItem);
        });
        return addOnProductBookingReservedItemList;
    }
    public getAddOnProductList(): AddOnProductSnapshotDO[] {
        return _.map(this._addOnProductVMList, (itemVM: AddOnProductItemVM) => {
            return itemVM.addOnProductSnapshot;
        });
    }

    public buildPrototype(): AddOnProductItemVMContainer {
        var container = new AddOnProductItemVMContainer(this._ccySymbol);
        _.forEach(this._addOnProductVMList, (addOnProductVM: AddOnProductItemVM) => {
            container.addOnProductVMList.push(addOnProductVM.buildPrototype());
        });
        return container;
    }

    public get addOnProductVMList(): AddOnProductItemVM[] {
        return this._addOnProductVMList;
    }
    public set addOnProductVMList(addOnProductVMList: AddOnProductItemVM[]) {
        this._addOnProductVMList = addOnProductVMList;
    }
}