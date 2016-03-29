import {BaseDO} from '../../../common/base/BaseDO';
import {SettingMetadataDO} from '../common/SettingMetadataDO';
import {AddOnProductCategoryDO} from '../../../common/data-objects/add-on-product/AddOnProductCategoryDO';

export class AddOnProductCategorySettingDO extends BaseDO {
    metadata: SettingMetadataDO;
    value: AddOnProductCategoryDO[];
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new SettingMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (addOnProdCategObject: Object) => {
            var addOnProdCategDO = new AddOnProductCategoryDO();
            addOnProdCategDO.buildFromObject(addOnProdCategObject);
            this.value.push(addOnProdCategDO);
        });
    }
}