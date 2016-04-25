import {ITaxViewer} from './ITaxViewer';
import {VatTaxViewer} from './VatTaxViewer';
import {OtherTaxViewer} from './OtherTaxViewer';
import {TaxType} from '../../../../../../../services/taxes/data-objects/TaxDO';

export class TaxViewerFactory {
	public getTaxViewer(taxType: TaxType): ITaxViewer {
		switch (taxType) {
			case TaxType.Vat:
				return new VatTaxViewer();
			default:
				return new OtherTaxViewer();
		}
	}
}