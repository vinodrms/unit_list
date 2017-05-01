import { ThError } from '../../../utils/th-responses/ThError';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ThUtils } from '../../../utils/ThUtils';
import { AddOnProductSearchResultRepoDO, AddOnProductSearchCriteriaRepoDO } from '../../../data-layer/add-on-products/repositories/IAddOnProductRepository';
import { AddOnProductDO } from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import { AddOnProductCategoryDO } from '../../../data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';

import _ = require('underscore');

export class AddOnProductItem {
    addOnProduct: AddOnProductDO;
    category: AddOnProductCategoryDO;
}

export class AddOnProductItemContainer {
    private _itemList: AddOnProductItem[];
    private _indexedAopItemsByAopId: { [index: string]: AddOnProductItem; };

    constructor(itemList: AddOnProductItem[]) {
        this._itemList = itemList;
    }
    public getAddOnProductItemById(addOnProductId: string): AddOnProductItem {
        if (!this._indexedAopItemsByAopId) {
            this.indexAopItemsByAopId();
        }
        return this._indexedAopItemsByAopId[addOnProductId];
    }
    private indexAopItemsByAopId() {
        this._indexedAopItemsByAopId = _.indexBy(this._itemList, (item: AddOnProductItem) => { return item.addOnProduct.id });
    }

    public getAddOnProductList(): AddOnProductDO[] {
        return _.map(this._itemList, (item: AddOnProductItem) => { return item.addOnProduct });
    }
}

export class AddOnProductLoader {
    private _thUtils: ThUtils;

    private _addOnProductList: AddOnProductDO[];
    private _addOnProductCategoryList: AddOnProductCategoryDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public load(addOnProductIdList: string[]): Promise<AddOnProductItemContainer> {
        return new Promise<AddOnProductItemContainer>((resolve: { (result: AddOnProductItemContainer): void }, reject: { (err: ThError): void }) => {
            if (!_.isArray(addOnProductIdList) || addOnProductIdList.length == 0) {
                resolve(new AddOnProductItemContainer([]));
                return;
            }
            this.loadCore(resolve, reject, { addOnProductIdList: addOnProductIdList });
        });
    }
    public loadAll(): Promise<AddOnProductItemContainer> {
        return new Promise<AddOnProductItemContainer>((resolve: { (result: AddOnProductItemContainer): void }, reject: { (err: ThError): void }) => {
            this.loadCore(resolve, reject, {});
        });
    }

    private loadCore(resolve: { (result: AddOnProductItemContainer): void }, reject: { (err: ThError): void }, searchCriteria: AddOnProductSearchCriteriaRepoDO) {
        var addOnProductRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
        addOnProductRepo.getAddOnProductList({ hotelId: this._sessionContext.sessionDO.hotel.id }, searchCriteria)
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
        var itemList: AddOnProductItem[] = [];
        _.forEach(this._addOnProductList, (addOnProduct: AddOnProductDO) => {
            var addOnProductItem: AddOnProductItem = new AddOnProductItem();
            addOnProductItem.addOnProduct = addOnProduct;
            addOnProductItem.category = this.getAddOnProductCategoryById(addOnProduct.categoryId);
            itemList.push(addOnProductItem);
        });
        return new AddOnProductItemContainer(itemList);
    }
    private getAddOnProductCategoryById(categoryId: string): AddOnProductCategoryDO {
        return _.find(this._addOnProductCategoryList, (addOnProductCateg: AddOnProductCategoryDO) => {
            return addOnProductCateg.id === categoryId;
        });
    }
}