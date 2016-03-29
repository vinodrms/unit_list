import {HotelConfigurationType, HotelConfigurationMetadataDO} from '../data-objects/common/HotelConfigurationMetadataDO';
import {YieldFilterConfigurationDO} from '../data-objects/yield-filter/YieldFilterConfigurationDO';
import {YieldFilterDO} from '../../common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../common/data-objects/yield-filter/YieldFilterValueDO';
import {HotelConfigurationMetaRepoDO} from './mongo/AMongoHotelConfigurationRepository';

export interface YieldFilterMetaRepoDO {
    filterId: string;    
}

export interface YieldFilterValueMetaRepoDO {
    filterValueId: string;
}

export interface IYieldFilterConfigurationRepository {
    
    initYieldFilterConfigurationWithDefaults(meta: HotelConfigurationMetaRepoDO, initialYieldFilterList: YieldFilterDO[]): Promise<YieldFilterConfigurationDO>;
    getYieldFilterConfiguration(meta: HotelConfigurationMetaRepoDO): Promise<YieldFilterConfigurationDO>;
    
    addYieldFilterValue(meta: HotelConfigurationMetaRepoDO, filterMeta: YieldFilterMetaRepoDO, yieldFilterValue: YieldFilterValueDO): Promise<YieldFilterConfigurationDO>;
    updateYieldFilterValue(meta: HotelConfigurationMetaRepoDO, filterMeta: YieldFilterMetaRepoDO, filterValueMeta: YieldFilterValueMetaRepoDO, yieldFilterDO: YieldFilterValueDO): Promise<YieldFilterConfigurationDO>;
}