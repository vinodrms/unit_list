import {ColorFilterVM} from '../view-models/ColorFilterVM';
import {TextFilterVM} from '../view-models/TextFilterVM';
import {YieldFilterDO, YieldFilterType} from '../../../../common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../../../common/data-objects/yield-filter/YieldFilterValueDO';
import {ColorFilter, ColorMeta} from '../../../../common/data-objects/yield-filter/ColorFilter';

export class FilterConverter {
    private _colorFilter: ColorFilter;

    constructor() {
        this._colorFilter = new ColorFilter();
    }

    public convertToColorFilter(yieldFilterDO: YieldFilterDO, yieldValue: YieldFilterValueDO): ColorFilterVM {
        var colorMeta: ColorMeta = this._colorFilter.getColorMetaByColorCode(yieldValue.colorCode);
        return new ColorFilterVM({
            filterId: yieldFilterDO.id,
            valueId: yieldValue.id,
            colorName: colorMeta.displayName,
            cssClass: colorMeta.cssClass,
            description: yieldValue.description,
            filterName: yieldFilterDO.label
        });
    }

    public convertToTextFilter(yieldFilterDO: YieldFilterDO, yieldValue: YieldFilterValueDO): TextFilterVM {
        var colorMeta: ColorMeta = this._colorFilter.getColorMetaByColorCode(yieldValue.colorCode);
        return new TextFilterVM({
            filterId: yieldFilterDO.id,
            valueId: yieldValue.id,
            displayName: yieldValue.label,
            description: yieldValue.description,
            filterName: yieldFilterDO.label
        });
    }
}