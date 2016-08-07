import {PriceProductYieldItemDO} from '../data-objects/PriceProductYieldItemDO';
import {ColorFilterVM} from '../../filter/view-models/ColorFilterVM';
import {TextFilterVM} from '../../filter/view-models/TextFilterVM';

export class PriceProductYieldItemVM {
    private _priceProductYieldItemDO: PriceProductYieldItemDO;
    private _colorFilterList: ColorFilterVM[];
    private _textFilterList: TextFilterVM[];

    constructor() {
        this._colorFilterList = [];
        this._textFilterList = [];
    }

    public get priceProductYieldItemDO(): PriceProductYieldItemDO {
        return this._priceProductYieldItemDO;
    }
    public set priceProductYieldItemDO(priceProductYieldItemDO: PriceProductYieldItemDO) {
        this._priceProductYieldItemDO = priceProductYieldItemDO;
    }
    public get colorFilterList(): ColorFilterVM[] {
        return this._colorFilterList;
    }
    public set colorFilterList(colorFilterList: ColorFilterVM[]) {
        this._colorFilterList = colorFilterList;
    }
    public get textFilterList(): TextFilterVM[] {
        return this._textFilterList;
    }
    public set textFilterList(textFilterList: TextFilterVM[]) {
        this._textFilterList = textFilterList;
    }
}