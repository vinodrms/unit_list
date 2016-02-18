import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ATaxItemActionStrategy} from './ATaxItemActionStrategy';
import {IValidationStructure} from '../../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {NumberValidationRule} from '../../../../../utils/th-validation/rules/NumberValidationRule';
import {StringValidationRule} from '../../../../../utils/th-validation/rules/StringValidationRule';
import {TaxDO} from '../../../../../data-layer/common/data-objects/taxes/TaxDO';
import {HotelMetaRepoDO, TaxRepoDO, TaxMetaRepoDO} from '../../../../../data-layer/hotel/repositories/IHotelRepository';
import {HotelDO} from '../../../../../data-layer/hotel/data-objects/HotelDO';

export class OtherTaxItemUpdateStrategyDO {
	id: string;
	type: number;
	name: string;
	value: number;
	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "id",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
			{
				key: "type",
				validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
			},
			{
				key: "name",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(100))
			},
			{
				key: "value",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
			}
		])
	}
}


export class OtherTaxItemUpdateStrategy extends ATaxItemActionStrategy {
	constructor(appContext: AppContext, sessionContext: SessionContext, taxObject: Object) {
		super(appContext, sessionContext, taxObject);
	}

	protected getValidationStructure(): IValidationStructure {
		return OtherTaxItemUpdateStrategyDO.getValidationStructure();
	}
	protected buildTaxDO(): TaxDO {
		var taxData = <OtherTaxItemUpdateStrategyDO>this._taxObject;
		var taxDO = new TaxDO();
		taxDO.id = taxData.id;
		taxDO.type = taxData.type;
		taxDO.name = taxData.name;
		taxDO.value = taxData.value;
		return taxDO;
	}
	public saveAsync(hotelMeta: HotelMetaRepoDO, finishedSavingTaxItemCallback: { (err: ThError, updatedHotel?: HotelDO): void; }) {
		var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
		return hotelRepository.updateTaxesOtherTaxItemAsync(hotelMeta, this.getTaxMetaRepoDO(), this.getTaxRepoDO(), finishedSavingTaxItemCallback);
	}
	private getTaxMetaRepoDO(): TaxMetaRepoDO {
		return {
			id: this._builtTaxDO.id
		};
	}
}