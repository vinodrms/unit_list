import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';
import {ITaxRepository, TaxResponseRepoDO, TaxMetaRepoDO, TaxItemMetaRepoDO} from '../ITaxRepository';
import {TaxDO, TaxStatus, TaxType} from '../../data-objects/TaxDO';

import _ = require('underscore');

export class MongoTaxRepository extends MongoRepository implements ITaxRepository {
	constructor() {
        super(sails.models.taxesentity);
    }

	public getTaxList(taxMeta: TaxMetaRepoDO): Promise<TaxResponseRepoDO> {
		return new Promise<TaxResponseRepoDO>((resolve: { (result: TaxResponseRepoDO): void }, reject: { (err: ThError): void }) => {
			this.getTaxListCore(taxMeta, resolve, reject);
		});
	}
	private getTaxListCore(taxMeta: TaxMetaRepoDO, resolve: { (result: TaxResponseRepoDO): void }, reject: { (err: ThError): void }) {
		var searchCriteria = { "hotelId": taxMeta.hotelId, "status": TaxStatus.Active };
		this.findMultipleDocuments({ criteria: searchCriteria },
			(err: Error) => {
				var thError = new ThError(ThStatusCode.TaxRepositoryErrorGettingTaxList, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting tax list.", taxMeta, thError);
				reject(thError);
			},
			(dbTaxList: Array<Object>) => {
				var resultDO = this.getQueryResultDO(dbTaxList);
				resolve(resultDO);
			}
		);
    }
	private getQueryResultDO(dbTaxList: Array<Object>): TaxResponseRepoDO {
		var taxList: TaxDO[] = [];
		dbTaxList.forEach((dbTax: Object) => {
			var tax = new TaxDO();
			tax.buildFromObject(dbTax);
			taxList.push(tax);
		});
		return {
			vatList: _.filter(taxList, (tax: TaxDO) => { return tax.type === TaxType.Vat }),
			otherTaxList: _.filter(taxList, (tax: TaxDO) => { return tax.type === TaxType.OtherTax })
		};
	}

	public getTaxById(taxMeta: TaxMetaRepoDO, taxId: string): Promise<TaxDO> {
		return new Promise<TaxDO>((resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) => {
			this.getTaxByIdCore(taxMeta, taxId, resolve, reject);
		});
	}
	private getTaxByIdCore(taxMeta: TaxMetaRepoDO, taxId: string, resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) {
		this.findOneDocument({ "hotelId": taxMeta.hotelId, "id": taxId },
			() => {
				var thError = new ThError(ThStatusCode.TaxRepositoryTaxNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Tax not found", { taxMeta: taxMeta, taxId: taxId }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.TaxRepositoryErrorGettingTax, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting tax by id", { taxMeta: taxMeta, taxId: taxId }, thError);
				reject(thError);
			},
			(foundTax: Object) => {
				var tax: TaxDO = new TaxDO();
				tax.buildFromObject(foundTax);
				resolve(tax);
			}
		);
	}

	public addTax(taxMeta: TaxMetaRepoDO, tax: TaxDO): Promise<TaxDO> {
		return new Promise<TaxDO>((resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) => {
			this.addTaxCore(taxMeta, tax, resolve, reject);
		});
	}
	private addTaxCore(taxMeta: TaxMetaRepoDO, tax: TaxDO, resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) {
		tax.hotelId = taxMeta.hotelId;
		tax.versionId = 0;
		tax.status = TaxStatus.Active;
		this.createDocument(tax,
			(err: Error) => {
				this.logAndReject(err, reject, { taxMeta: taxMeta, tax: tax }, ThStatusCode.TaxRepositoryErrorAddingTax);
			},
			(createdTax: Object) => {
				var tax: TaxDO = new TaxDO();
				tax.buildFromObject(createdTax);
				resolve(tax);
			}
		);
	}
	private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
		var errorCode = this.getMongoErrorCode(err);
		if (errorCode == MongoErrorCodes.DuplicateKeyError) {
			var thError = new ThError(ThStatusCode.TaxRepositoryNameAlreadyExists, err);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Tax name already exists", context, thError);
			reject(thError);
			return;
		}
		var thError = new ThError(defaultStatusCode, err);
		ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding tax", context, thError);
		reject(thError);
	}

	public updateTax(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO, tax: TaxDO): Promise<TaxDO> {
		return this.findAndModifyTax(taxMeta, taxItemMeta,
			{
				"type": tax.type,
				"name": tax.name,
				"valueType": tax.valueType,
				"value": tax.value
			});
	}
	public deleteTax(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO): Promise<TaxDO> {
		return this.findAndModifyTax(taxMeta, taxItemMeta,
			{
				"status": TaxStatus.Deleted
			});
	}
	private findAndModifyTax(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO, updateQuery: Object): Promise<TaxDO> {
		return new Promise<TaxDO>((resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) => {
			this.findAndModifyTaxCore(taxMeta, taxItemMeta, updateQuery, resolve, reject);
		});
	}
	private findAndModifyTaxCore(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO, updateQuery: any, resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) {
		updateQuery.$inc = { "versionId": 1 };
		var findQuery: Object = {
			"hotelId": taxMeta.hotelId,
			"id": taxItemMeta.id,
			"versionId": taxItemMeta.versionId
		};
		this.findAndModifyDocument(
			findQuery, updateQuery,
			() => {
				var thError = new ThError(ThStatusCode.TaxRepositoryProblemUpdatingTax, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating tax - concurrency", { taxMeta: taxMeta, taxItemMeta: taxItemMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(err: Error) => {
				this.logAndReject(err, reject, { taxMeta: taxMeta, updateQuery: updateQuery }, ThStatusCode.TaxRepositoryErrorUpdatingTax);
			},
			(updatedDBTax: Object) => {
				var tax: TaxDO = new TaxDO();
				tax.buildFromObject(updatedDBTax);
				resolve(tax);
			}
		);
	}
}