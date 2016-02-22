import {ATaxItemActionStrategy} from './ATaxItemActionStrategy';
import {IValidationStructure} from '../../../../../utils/th-validation/structure/core/IValidationStructure';
import {TaxDO} from '../../../../../data-layer/common/data-objects/taxes/TaxDO';
import {HotelMetaRepoDO} from '../../../../../data-layer/hotel/repositories/IHotelRepository';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {HotelDO} from '../../../../../data-layer/hotel/data-objects/HotelDO';

export class InvalidTaxItemActionStrategy extends ATaxItemActionStrategy {
	constructor() {
		super(null, null, null);
		this._isValidStrategy = false;
	}
	protected getValidationStructure(): IValidationStructure {
		return null;
	}
	protected buildTaxDO(): TaxDO {
		return null;
	}
	public saveAsync(hotelMeta: HotelMetaRepoDO, finishedSavingTaxItemCallback: { (err: ThError, updatedHotel?: HotelDO): void; }) {
	}
}