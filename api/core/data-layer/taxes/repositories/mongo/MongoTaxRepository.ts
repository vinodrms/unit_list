import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';
import {ITaxRepository, TaxResponseRepoDO, TaxMetaRepoDO, TaxItemMetaRepoDO} from '../ITaxRepository';
import {TaxDO, TaxStatus, TaxType} from '../../data-objects/TaxDO';

import _ = require('underscore');

export class MongoTaxRepository extends MongoRepository implements ITaxRepository {
	private _taxEntity: Sails.Model;
    constructor() {
        var taxEntity = sails.models.taxesentity;
        super(taxEntity);
        this._taxEntity = taxEntity;
    }

	public getTaxList(taxMeta: TaxMetaRepoDO): Promise<TaxResponseRepoDO> {
		return new Promise<TaxResponseRepoDO>((resolve: { (result: TaxResponseRepoDO): void }, reject: { (err: ThError): void }) => {
			this.getTaxListCore(taxMeta, resolve, reject);
		});
	}
	private getTaxListCore(taxMeta: TaxMetaRepoDO, resolve: { (result: TaxResponseRepoDO): void }, reject: { (err: ThError): void }) {
		var searchCriteria = { "hotelId": taxMeta.hotelId, "status": TaxStatus.Active };
		this._taxEntity.find(searchCriteria).then((dbTaxList: Array<Sails.QueryResult>) => {
            if (!dbTaxList || !_.isArray(dbTaxList)) {
				var thError = new ThError(ThStatusCode.MongoTaxRepositoryInvalidList, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "no existing tax list", taxMeta, thError);
				return;
			}
			var resultDO = this.getQueryResultDO(dbTaxList);
            resolve(resultDO);
        }).catch((err: Error) => {
            var thError = new ThError(ThStatusCode.MongoTaxRepositoryErrorGettingTaxList, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting tax list.", taxMeta, thError);
            reject(thError);
        });
    }
	private getQueryResultDO(dbTaxList: Array<Sails.QueryResult>): TaxResponseRepoDO {
		var taxList: TaxDO[] = [];
		dbTaxList.forEach((dbTax: Sails.QueryResult) => {
			var tax = new TaxDO();
			tax.buildFromObject(dbTax);
			taxList.push(tax);
		});
		return {
			vatList: _.filter(taxList, (tax: TaxDO) => { return tax.type === TaxType.Vat }),
			otherTaxList: _.filter(taxList, (tax: TaxDO) => { return tax.type === TaxType.OtherTax })
		};
	}

	public getTaxByIdAsync(taxMeta: TaxMetaRepoDO, taxId: string, finishGetTaxByIdCallback: { (err: any, response?: TaxDO): void; }) {
		this.getTaxById(taxMeta, taxId).then((result: TaxDO) => {
			finishGetTaxByIdCallback(null, result);
		}).catch((err: any) => {
			finishGetTaxByIdCallback(err);
		});
	}
	private getTaxById(taxMeta: TaxMetaRepoDO, taxId: string): Promise<TaxDO> {
		return new Promise<TaxDO>((resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) => {
			this.getTaxByIdCore(taxMeta, taxId, resolve, reject);
		});
	}
	private getTaxByIdCore(taxMeta: TaxMetaRepoDO, taxId: string, resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) {
		this._taxEntity.findOne({ "hotelId": taxMeta.hotelId, "id": taxId }).then((foundTax: Sails.QueryResult) => {
			if (!foundTax) {
				var thError = new ThError(ThStatusCode.MongoTaxRepositoryTaxNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Tax not found", { taxMeta: taxMeta, taxId: taxId }, thError);
				reject(thError);
				return;
			}
			var tax: TaxDO = new TaxDO();
			tax.buildFromObject(foundTax);
			resolve(tax);
		}).catch((err: Error) => {
			var thError = new ThError(ThStatusCode.MongoTaxRepositoryErrorGettingTax, err);
			ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting tax by id", { taxMeta: taxMeta, taxId: taxId }, thError);
			reject(thError);
		});
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
		this._taxEntity.create(tax).then((createdTax: Sails.QueryResult) => {
			if (!createdTax) {
				var thError = new ThError(ThStatusCode.MongoTaxRepositoryProblemAddingTax, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Error creatng tax", { taxMeta: taxMeta, tax: tax }, thError);
				reject(thError);
				return;
			}
			var tax: TaxDO = new TaxDO();
			tax.buildFromObject(createdTax);
			resolve(tax);
		}).catch((err: Error) => {
			this.logAndReject(err, reject, { taxMeta: taxMeta, tax: tax }, ThStatusCode.MongoTaxRepositoryErrorAddingTax);
		});
	}
	private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
		var errorCode = this.getMongoErrorCode(err);
		if (errorCode == MongoErrorCodes.DuplicateKeyError) {
			var thError = new ThError(ThStatusCode.MongoTaxRepositoryNameAlreadyExists, err);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Tax name already exists", context, thError);
			reject(thError);
			return;
		}
		var thError = new ThError(defaultStatusCode, err);
		ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding tax", context, thError);
		reject(thError);
	}

	public updateTaxAsync(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO, tax: TaxDO, updateTaxCallback: { (err: any, response?: TaxDO): void; }) {
		this.updateTax(taxMeta, taxItemMeta, tax).then((result: TaxDO) => {
			updateTaxCallback(null, result);
		}).catch((err: any) => {
			updateTaxCallback(err);
		});
	}
	private updateTax(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO, tax: TaxDO): Promise<TaxDO> {
		return this.findAndModifyTax(taxMeta, taxItemMeta,
			{
				"type": tax.type,
				"name": tax.name,
				"valueType": tax.valueType,
				"value": tax.value
			});
	}

	public deleteTaxAsync(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO, deleteTaxCallback: { (err: any, response?: TaxDO): void; }) {
		this.deleteTax(taxMeta, taxItemMeta).then((result: TaxDO) => {
			deleteTaxCallback(null, result);
		}).catch((err: any) => {
			deleteTaxCallback(err);
		});
	}
	private deleteTax(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO): Promise<TaxDO> {
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
		var findQuery: Object[] = [
			{ "hotelId": taxMeta.hotelId },
			{ "id": taxItemMeta.id },
			{ "versionId": taxItemMeta.versionId }
		];
		this.findAndModify(
			{
				$and: findQuery
			}, updateQuery).then((updatedDBTax: Object) => {
				if (!updatedDBTax) {
					var thError = new ThError(ThStatusCode.MongoTaxRepositoryProblemUpdatingTax, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating tax - concurrency", { taxMeta: taxMeta, taxItemMeta: taxItemMeta, updateQuery: updateQuery }, thError);
					reject(thError);
					return;
				}
				var tax: TaxDO = new TaxDO();
				tax.buildFromObject(updatedDBTax);
				resolve(tax);
			}).catch((err: Error) => {
				this.logAndReject(err, reject, { taxMeta: taxMeta, updateQuery: updateQuery }, ThStatusCode.MongoTaxRepositoryErrorUpdatingTax);
			});
	}
}