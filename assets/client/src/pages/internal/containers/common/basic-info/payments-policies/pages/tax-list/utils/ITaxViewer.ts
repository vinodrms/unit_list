import {TaxContainerDO} from '../../../../../../../services/taxes/data-objects/TaxContainerDO';
import {TaxDO} from '../../../../../../../services/taxes/data-objects/TaxDO';

export interface ITaxViewer {
	getName(): string;
	getDescription(): string;
	filterTaxes(taxContainer: TaxContainerDO): TaxDO[];
	canAddNewTax(ccyCode: string): { result: boolean, error?: string };
}