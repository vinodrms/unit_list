import {ThError} from '../../../utils/th-responses/ThError';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {AddOnProductSearchResultRepoDO} from '../../../data-layer/add-on-products/repositories/IAddOnProductRepository';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductCategoryDO} from '../../../data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';

import _ = require('underscore');

export class AddOnProductItem {
    addOnProduct: AddOnProductDO;
    category: AddOnProductCategoryDO;
}

export class AddOnProductItemContainer {
    itemList: AddOnProductItem[];
    constructor() {
        this.itemList = [];
    }
    public getAddOnProductItemById(addOnProductId: string): AddOnProductItem {
        return _.find(this.itemList, (item: AddOnProductItem) => {
            return item.addOnProduct.id === addOnProductId;
        });
    }
    public getAddOnProductList(): AddOnProductDO[] {
        return _.map(this.itemList, (item: AddOnProductItem) => { return item.addOnProduct });
    }
}

export class AddOnProductLoader {
    private _thUtils: ThUtils;
    private _addOnProductIdList: string[];

    private _addOnProductList: AddOnProductDO[];
    private _addOnProductCategoryList: AddOnProductCategoryDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public load(addOnProductIdList: string[]): Promise<AddOnProductItemContainer> {
        this._addOnProductIdList = addOnProductIdList;
        return new Promise<AddOnProductItemContainer>((resolve: { (result: AddOnProductItemContainer): void }, reject: { (err: ThError): void }) => {
            this.loadCore(resolve, reject);
        });
    }
    private loadCore(resolve: { (result: AddOnProductItemContainer): void }, reject: { (err: ThError): void }) {
        if (this._addOnProductIdList.length == 0) {
            resolve(new AddOnProductItemContainer());
            return;
        }
        var addOnProductRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
        addOnProductRepo.getAddOnProductList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { addOnProductIdList: this._addOnProductIdList })
            .then((searchResult: AddOnProductSearchResultRepoDO) => {
                this._addOnProductList = searchResult.addOnProductList;

                var settingsRepo = this._appContext.getRepositoryFactory().getSettingsRepository();
                return settingsRepo.getAddOnProductCategories();
            }).then((addOnProductCategoryList: AddOnProductCategoryDO[]) => {
                this._addOnProductCategoryList = addOnProductCategoryList;
                resolve(this.buildAddOnProductItemContainer());
            }).catch((error: any) => {
                reject(error);
            });
    }
    private buildAddOnProductItemContainer(): AddOnProductItemContainer {
        var container = new AddOnProductItemContainer();
        _.forEach(this._addOnProductList, (addOnProduct: AddOnProductDO) => {
            var addOnProductItem: AddOnProductItem = new AddOnProductItem();
            addOnProductItem.addOnProduct = addOnProduct;
            addOnProductItem.category = this.getAddOnProductCategoryById(addOnProduct.categoryId);
            container.itemList.push(addOnProductItem);
        });
        return container;
    }
    private getAddOnProductCategoryById(categoryId: string): AddOnProductCategoryDO {
        return _.find(this._addOnProductCategoryList, (addOnProductCateg: AddOnProductCategoryDO) => {
            return addOnProductCateg.id === categoryId;
        });
    }
}