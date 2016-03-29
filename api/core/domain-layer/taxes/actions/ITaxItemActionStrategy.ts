import {TaxDO} from '../../../data-layer/taxes/data-objects/TaxDO';
import {ThError} from '../../../utils/th-responses/ThError';

export interface ITaxItemActionStrategy {
	save(resolve: { (result: TaxDO): void }, reject: { (err: ThError): void });
}