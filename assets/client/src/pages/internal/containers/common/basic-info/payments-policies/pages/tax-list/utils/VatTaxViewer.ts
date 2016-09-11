import {TaxContainerDO} from '../../../../../../../services/taxes/data-objects/TaxContainerDO';
import {TaxDO} from '../../../../../../../services/taxes/data-objects/TaxDO';
import {ITaxViewer} from './ITaxViewer';

export class VatTaxViewer implements ITaxViewer {
	getName(): string {
		return "VAT";
	}
	getDescription(): string {
		return "All VAT’s used by property";
	}
	filterTaxes(taxContainer: TaxContainerDO): TaxDO[] {
		return taxContainer.vatList;
	}
	canAddNewTax(ccyCode: string): { result: boolean, error?: string } {
		return {
			result: true
		}
	}
}