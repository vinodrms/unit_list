import {AddOnProductDO} from '../../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductsDO} from '../../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductsDO';
import {ThUtils} from '../../../../../../../../../../../../../../common/utils/ThUtils';
import {AddOnProductItemVM} from './AddOnProductItemVM';

export class AddOnProductItemVMContainer {
    private _thUtils: ThUtils;
    private _addOnProductVMList: AddOnProductItemVM[];

    constructor(private _ccySymbol: string) {
        this._thUtils = new ThUtils();
        this._addOnProductVMList = [];
    }

    public initItemList(addOnProductContainer: AddOnProductsDO, addOnProductIdList: string[]) {
        _.forEach(addOnProductIdList, (addOnProductId: string) => {
            var foundAddOnProduct: AddOnProductDO = addOnProductContainer.getAddOnProductById(addOnProductId);
            if (!this._thUtils.isUndefinedOrNull(foundAddOnProduct)) {
                this.addAddOnProduct(foundAddOnProduct);
            }
        });
    }

    public addAddOnProduct(addOnProduct: AddOnProductDO) {
        var exists: boolean = false;
        _.forEach(this._addOnProductVMList, (itemVM: AddOnProductItemVM) => {
            if (itemVM.addOnProduct.id === addOnProduct.id) {
                itemVM.noAdded++;
                itemVM.updateTotalPrice(this._ccySymbol);
                exists = true;
            }
        });
        if (exists) { return; }
        var itemVM = new AddOnProductItemVM();
        itemVM.addOnProduct = addOnProduct;
        itemVM.noAdded = 1;
        itemVM.updateTotalPrice(this._ccySymbol);
        this._addOnProductVMList.push(itemVM);
    }

    public removeAddOnProduct(addOnProduct: AddOnProductDO) {
        this._addOnProductVMList = _.filter(this._addOnProductVMList, (itemVM: AddOnProductItemVM) => { return itemVM.addOnProduct.id != addOnProduct.id });
    }

    public getAddOnProductIdList(): string[] {
        var addOnProductIdList: string[] = [];
        _.forEach(this._addOnProductVMList, (itemVM: AddOnProductItemVM) => {
            for (var index = 0; index < itemVM.noAdded; index++) {
                addOnProductIdList.push(itemVM.addOnProduct.id);
            }
        });
        return addOnProductIdList;
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