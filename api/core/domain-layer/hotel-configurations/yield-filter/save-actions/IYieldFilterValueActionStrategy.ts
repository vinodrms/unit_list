import {ThError} from '../../../../utils/th-responses/ThError';
import {YieldFilterValueDO} from '../../../../data-layer/common/data-objects/yield-filter/YieldFilterValueDO';

export interface IYieldFilterValueActionStrategy {
	save(resolve: { (result: YieldFilterValueDO): void }, reject: { (err: ThError): void });
}