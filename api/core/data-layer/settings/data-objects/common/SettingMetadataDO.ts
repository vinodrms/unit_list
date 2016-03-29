import {BaseDO} from '../../../common/base/BaseDO';

export enum SettingType {
    Countries,
    CurrencyCodes,
    HotelAmenities,
    RoomAmenities,
    PaymentMethods,
    BedTemplates,
	AddOnProductCategory,
    RoomAttributes,
    RoomTypes,
    RoomSalesCategories,
    YieldFilter
};

export class SettingMetadataDO extends BaseDO {
    constructor() {
        super();
    }
    type: SettingType;
    name: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["type", "name"];
    }
}