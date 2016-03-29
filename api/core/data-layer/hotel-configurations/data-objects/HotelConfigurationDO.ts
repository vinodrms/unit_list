import {BaseDO} from '../../common/base/BaseDO';
import {HotelConfigurationMetadataDO} from './common/HotelConfigurationMetadataDO';

export class HotelConfigurationDO extends BaseDO {
    
    constructor() {
        super();
    }
    
    id: string;
    versionId: number;
    hotelId: string;
    metadata: HotelConfigurationMetadataDO;
    value: any;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId"];
    }
    
}