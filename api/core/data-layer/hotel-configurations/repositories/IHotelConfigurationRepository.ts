import {HotelConfigurationType, HotelConfigurationMetadataDO} from '../data-objects/common/HotelConfigurationMetadataDO';
import {YieldManagerFilterConfigurationDO} from '../data-objects/yield-manager-filter/YieldManagerFilterConfigurationDO';
import {YieldManagerFilterDO} from '../../common/data-objects/yield-manager-filter/YieldManagerFilterDO';

export interface IHotelConfigurationMeta {
    hotelId: string;
}

export interface IHotelConfigurationItemMeta {
    type: HotelConfigurationType;
	versionId: number;
}

export interface IHotelConfigurationRepository {
    initYieldManagerFilterConfigurationWithDefaults(meta: IHotelConfigurationMeta, initialYieldManagerFilterList: YieldManagerFilterDO[]): Promise<YieldManagerFilterConfigurationDO>;
    getYieldManagerFilterConfiguration(meta: IHotelConfigurationMeta): Promise<YieldManagerFilterConfigurationDO>;
}