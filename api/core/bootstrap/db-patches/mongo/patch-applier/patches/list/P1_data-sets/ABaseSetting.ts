import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {ThUtils} from '../../../../../../../utils/ThUtils';

export class ABaseSetting {
    protected _thUtils: ThUtils;
    constructor(private _settingType: SettingType, private _settingName: string) {
        this._thUtils = new ThUtils();
    }

    protected getSettingMetadata(): SettingMetadataDO {
        var settingMetadata = new SettingMetadataDO();
        settingMetadata.type = this._settingType;
        settingMetadata.name = this._settingName;
        return settingMetadata;
    }
}