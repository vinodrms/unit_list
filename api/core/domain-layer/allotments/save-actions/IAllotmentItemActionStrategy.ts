import {ThError} from '../../../utils/th-responses/ThError';
import {AllotmentDO} from '../../../data-layer/allotments/data-objects/AllotmentDO';

export interface IAllotmentItemActionStrategy {
	save(resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void });
}