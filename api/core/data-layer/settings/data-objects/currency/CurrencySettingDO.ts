import {BaseDO} from '../../../common/base/BaseDO';
import {SettingMetadataDO} from '../common/SettingMetadataDO';
import {CurrencyDO} from '../../../common/data-objects/currency/CurrencyDO';

export class CurrencySettingDO extends BaseDO {
    metadata: SettingMetadataDO;
    value: CurrencyDO[];
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new SettingMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (currencyObject: Object) => {
            var currencyDO = new CurrencyDO();
            currencyDO.buildFromObject(currencyObject);
            this.value.push(currencyDO);
        });
    }
}