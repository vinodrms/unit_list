import {BaseDO} from '../../../common/base/BaseDO';
import {SettingMetadataDO} from '../common/SettingMetadataDO';
import {CountryDO} from '../../../common/data-objects/country/CountryDO';

export class CountrySettingDO extends BaseDO {
    metadata: SettingMetadataDO;
    value: CountryDO[];
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.metadata = new SettingMetadataDO();
        this.metadata.buildFromObject(object["metadata"]);

        this.value = [];
        this.forEachElementOf(object["value"], (countryObject: Object) => {
            var countryDO = new CountryDO();
            countryDO.buildFromObject(countryObject);
            this.value.push(countryDO);
        });
    }
}