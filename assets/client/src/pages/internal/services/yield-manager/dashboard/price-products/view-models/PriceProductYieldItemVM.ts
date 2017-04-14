import { PriceProductYieldItemDO } from '../data-objects/PriceProductYieldItemDO';
import { ColorFilterVM } from '../../filter/view-models/ColorFilterVM';
import { TextFilterVM } from '../../filter/view-models/TextFilterVM';
import { DynamicPriceYieldItemDO } from "../data-objects/DynamicPriceYieldItemDO";

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
    public get id() {
        return this._priceProductYieldItemDO.priceProductId;
    }
    public get name() {
        return this._priceProductYieldItemDO.priceProductName;
    }

    public get lastRoomAvailability(): boolean {
        return this._priceProductYieldItemDO.lastRoomAvailability;
    }

    public canYieldDynamicPrices(): boolean {
        return this._priceProductYieldItemDO.dynamicPriceList.length > 1
            && !this._priceProductYieldItemDO.hasParent();
    }

    public get dynamicPriceList(): DynamicPriceYieldItemDO[] {
        return this._priceProductYieldItemDO.dynamicPriceList;
    }

    public get priceBriefString(): string {
        return this._priceProductYieldItemDO.dynamicPriceList[0].priceBriefString;
    }
    public get roomCategoryNameForPriceBrief(): string {
        return this._priceProductYieldItemDO.dynamicPriceList[0].roomCategoryNameForPriceBrief;
    }
}