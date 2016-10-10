import {ReportMetadataDO} from './ReportMetadataDO';
import {BaseDO} from '../../common/base/BaseDO';

export class ReportDO extends BaseDO{
	metadata: ReportMetadataDO;
	data: any[][];

	protected getPrimitivePropertyKeys(): string[] {
		return ["metadata", "data"];
	}
}