import {BaseDO} from '../../../../../../common/base/BaseDO';
import {AddOnProductSnapshotDO} from './../../../add-on-products/data-objects/AddOnProductSnapshotDO';
import {AttachedAddOnProductItemDO} from './AttachedAddOnProductItemDO';
import {ThUtils} from '../../../../../../common/utils/ThUtils';

import * as _ from "underscore";

export class PriceProductIncludedItemsDO extends BaseDO {
    includedBreakfastAddOnProductSnapshot: AddOnProductSnapshotDO;
    attachedAddOnProductItemList: AttachedAddOnProductItemDO[];
    indexedAddOnProductIdList: string[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["indexedAddOnProductIdList"];
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
    }

    public hasBreakfast(): boolean {
        var thUtils = new ThUtils();
        return !thUtils.isUndefinedOrNull(this.includedBreakfastAddOnProductSnapshot)
            && !thUtils.isUndefinedOrNull(this.includedBreakfastAddOnProductSnapshot.id)
            && _.isString(this.includedBreakfastAddOnProductSnapshot.id);
    }

    public buildPrototype(): PriceProductIncludedItemsDO {
        var copy = new PriceProductIncludedItemsDO();
        copy.buildFromObject(this);
        return copy;
    }
}