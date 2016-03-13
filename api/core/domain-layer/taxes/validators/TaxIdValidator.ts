import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {TaxResponseRepoDO} from '../../../data-layer/taxes/repositories/ITaxRepository';
import {TaxDO} from '../../../data-layer/taxes/data-objects/TaxDO';

export class TaxIdValidator {
	private _thUtils: ThUtils;
	private _taxIdList: string[];

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public validateTaxId(taxId: string): Promise<boolean> {
		return this.validateTaxIdList([taxId]);
	}

	public validateTaxIdList(taxIdList: string[]): Promise<boolean> {
		this._taxIdList = taxIdList;
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.validateTaxIdListCore(resolve, reject);
		});
	}
	private validateTaxIdListCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		var taxRepository = this._appContext.getRepositoryFactory().getTaxRepository();
		taxRepository.getTaxList({ hotelId: this._sessionContext.sessionDO.hotel.id })
			.then((taxResponse: TaxResponseRepoDO) => {
				var validTaxIdList = this.getIdList(taxResponse.otherTaxList);
				validTaxIdList = validTaxIdList.concat(this.getIdList(taxResponse.vatList));
				if (!this._thUtils.firstArrayIncludedInSecond(this._taxIdList, validTaxIdList)) {
					var thError = new ThError(ThStatusCode.TaxIdValidatorInvalidTaxId, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid tax id list", this._taxIdList, thError);
					throw thError;
				}
				resolve(true);
			}).catch((error: any) => {
				reject(error);
			});
	}
	private getIdList(taxList: TaxDO[]): string[] {
		return _.map(taxList, (tax: TaxDO) => {
			return tax.id;
		});
	}
}