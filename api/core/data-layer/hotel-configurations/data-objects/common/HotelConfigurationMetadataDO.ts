import {BaseDO} from '../../../common/base/BaseDO';

export enum HotelConfigurationType {
    YieldFilter
};

export class HotelConfigurationMetadataDO extends BaseDO {
    constructor() {
        super();
    }
    type: HotelConfigurationType;
    name: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["type", "name"];
    }
}