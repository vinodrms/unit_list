import {ThError} from '../../../../utils/th-responses/ThError';
import {YieldFilterConfigurationDO} from '../../../../data-layer/hotel-configurations/data-objects/yield-filter/YieldFilterConfigurationDO';

export interface IYieldFilterValueActionStrategy {
	save(resolve: { (result: YieldFilterConfigurationDO): void }, reject: { (err: ThError): void });
}