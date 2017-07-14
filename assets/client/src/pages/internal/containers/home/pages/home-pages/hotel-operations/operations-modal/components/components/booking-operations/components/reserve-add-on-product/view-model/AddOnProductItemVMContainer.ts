import {AddOnProductDO} from '../../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductsDO} from '../../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductsDO';
import {ThUtils} from '../../../../../../../../../../../../../../common/utils/ThUtils';
import { AddOnProductItemVM } from './AddOnProductItemVM';
import { AddOnProductBookingReservedItem } from "../../../../../../../../../../../../services/bookings/data-objects/BookingDO";

import * as _ from "underscore";

export class AddOnProductItemVMContainer {
    private _thUtils: ThUtils;
    private _addOnProductVMList: AddOnProductItemVM[];

    constructor(private _ccySymbol: string) {
        this._thUtils = new ThUtils();
        this._addOnProductVMList = [];
    }

    public initItemList(addOnProductContainer: AddOnProductsDO, aopBookingReservedItemList: AddOnProductBookingReservedItem[]) {
        _.forEach(aopBookingReservedItemList, (addOnProduct: AddOnProductBookingReservedItem) => {
            var foundAddOnProduct: AddOnProductDO = addOnProductContainer.getAddOnProductById(addOnProduct.aopId);
            if (!this._thUtils.isUndefinedOrNull(foundAddOnProduct)) {
                this.addAddOnProduct(foundAddOnProduct, addOnProduct.noOfItems);
            }
        });
    }

    public addAddOnProduct(addOnProduct: AddOnProductDO, noOfItems: number) {
        var exists: boolean = false;
        var zeroItems: boolean = false;
        _.forEach(this._addOnProductVMList, (itemVM: AddOnProductItemVM) => {
            if (itemVM.addOnProduct.id === addOnProduct.id) {
                itemVM.noAdded += noOfItems;
                if (itemVM.noAdded == 0) {
                    zeroItems = true;
                } else {
                    itemVM.updateTotalPrice(this._ccySymbol);
                }
                exists = true;
            }
        });
        if (zeroItems) {
            this._addOnProductVMList = _.filter(this._addOnProductVMList, (itemVM: AddOnProductItemVM) => {
                return itemVM.addOnProduct.id !== addOnProduct.id;
            });
        }
        if (exists) { return; }
        var itemVM = new AddOnProductItemVM();
        itemVM.addOnProduct = addOnProduct;
        itemVM.noAdded = noOfItems;
        itemVM.updateTotalPrice(this._ccySymbol);
        this._addOnProductVMList.push(itemVM);
    }

    public removeAddOnProduct(addOnProduct: AddOnProductDO) {
        this._addOnProductVMList = _.filter(this._addOnProductVMList, (itemVM: AddOnProductItemVM) => { return itemVM.addOnProduct.id != addOnProduct.id });
    }

    public getAddOnProductBookingReservedItemList(): AddOnProductBookingReservedItem[] {
        var addOnProductBookingReservedItemList: AddOnProductBookingReservedItem[] = [];
        _.forEach(this._addOnProductVMList, (itemVM: AddOnProductItemVM) => {
            var addonProductReservedItem = new AddOnProductBookingReservedItem();
            addonProductReservedItem.aopId = itemVM.addOnProduct.id;
            addonProductReservedItem.noOfItems = itemVM.noAdded;
            addOnProductBookingReservedItemList.push(addonProductReservedItem);
        });
        return addOnProductBookingReservedItemList;
    }
    public getAddOnProductList(): AddOnProductDO[] {
        return _.map(this._addOnProductVMList, (itemVM: AddOnProductItemVM) => {
            return itemVM.addOnProduct;
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