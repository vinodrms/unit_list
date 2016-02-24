import {BedDO} from '../../../data-layer/common/data-objects/bed/BedDO';
import {ThError} from '../../../utils/th-responses/ThError';

export interface IBedItemActionStrategy {
	save(resolve: { (result: BedDO): void }, reject: { (err: ThError): void });
}