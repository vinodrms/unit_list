import {TaxContainerDO} from '../../../../../../../services/taxes/data-objects/TaxContainerDO';
import {TaxDO} from '../../../../../../../services/taxes/data-objects/TaxDO';
import {ITaxViewer} from './ITaxViewer';

export class OtherTaxViewer implements ITaxViewer {
	getName(): string {
		return "Other Taxes";
	}
	getDescription(): string {
		return "e.g. City Tax";
	}
	filterTaxes(taxContainer: TaxContainerDO): TaxDO[] {
		return taxContainer.otherTaxList;
	}
	canAddNewTax(ccyCode: string): { result: boolean, error?: string } {
		if (!ccyCode) {
			return {
				result: false,
				error: "You must select a currency before adding an other tax"
			}
		}
		return {
			result: true
		}
	}
}