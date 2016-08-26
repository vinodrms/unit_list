import {BaseDO} from '../../../common/base/BaseDO';
import {AddOnProductSnapshotDO} from './../../../add-on-products/data-objects/AddOnProductSnapshotDO';
import {AttachedAddOnProductItemDO} from './AttachedAddOnProductItemDO';
import {ThUtils} from '../../../../utils/ThUtils';

import _ = require('underscore');

export class PriceProductIncludedItemsDO extends BaseDO {
    includedBreakfastAddOnProductSnapshot: AddOnProductSnapshotDO;
    attachedAddOnProductItemList: AttachedAddOnProductItemDO[];
    indexedAddOnProductIdList: string[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.includedBreakfastAddOnProductSnapshot = new AddOnProductSnapshotDO();
        this.includedBreakfastAddOnProductSnapshot.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "includedBreakfastAddOnProductSnapshot"));

        this.attachedAddOnProductItemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "attachedAddOnProductItemList"), (attachedAddOnProductItemObject: Object) => {
            var attachedAddOnProductItemDO = new AttachedAddOnProductItemDO();
            attachedAddOnProductItemDO.buildFromObject(attachedAddOnProductItemObject);
            this.attachedAddOnProductItemList.push(attachedAddOnProductItemDO);
        });

        this.indexedAddOnProductIdList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "indexedAddOnProductIdList"), (addOnProductId: string) => {
            this.indexedAddOnProductIdList.push(addOnProductId);
        });
    }

    public areValid(): boolean {
        var valid = true;
        _.forEach(this.attachedAddOnProductItemList, (attachedAddOnProductItem: AttachedAddOnProductItemDO) => {
            valid = attachedAddOnProductItem.isValid() ? valid : false;
        });
        return valid;
    }

    public hasBreakfast(): boolean {
        var thUtils = new ThUtils();
        return !thUtils.isUndefinedOrNull(this.includedBreakfastAddOnProductSnapshot)
            && !thUtils.isUndefinedOrNull(this.includedBreakfastAddOnProductSnapshot.id)
            && _.isString(this.includedBreakfastAddOnProductSnapshot.id);
    }

    public getUniqueAddOnProductIdList(): string[] {
        var addOnProductIdList: string[] = [];
        if (this.hasBreakfast()) {
            addOnProductIdList.push(this.includedBreakfastAddOnProductSnapshot.id);
        }
        addOnProductIdList = addOnProductIdList.concat(_.map(this.attachedAddOnProductItemList, (attachedAddOnProductItem: AttachedAddOnProductItemDO) => {
            return attachedAddOnProductItem.addOnProductSnapshot.id;
        }));
        return _.uniq(addOnProductIdList);
    }
}