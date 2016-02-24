import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThUtils} from '../../../../utils/ThUtils';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../common/base/MongoRepository';
import {IRepositoryCleaner} from '../../../common/base/IRepositoryCleaner';
import {IBedRepository, BedMetaRepoDO, BedItemMetaRepoDO} from '../IBedRepository';
import {BedDO, BedStatus} from '../../../common/data-objects/bed/BedDO';

import async = require('async');
import _ = require('underscore');

export class MongoBedRepository extends MongoRepository implements IBedRepository, IRepositoryCleaner {
    private _bedsEntity: Sails.Model;

    constructor() {
        var bedsEntity = sails.models.bedsentity;
        super(bedsEntity);
        this._bedsEntity = bedsEntity;
    }
    
    public cleanRepository(): Promise<Object> {
        return this._bedsEntity.destroy({});
    }
    
    public getBedList(bedMeta: BedMetaRepoDO): Promise<BedDO[]> {
		return new Promise<BedDO[]>((resolve: { (result: BedDO[]): void }, reject: { (err: ThError): void }) => {
			this.getBedListCore(bedMeta, resolve, reject);
		});
	}
    private getBedListCore(bedMeta: BedMetaRepoDO, resolve: { (result: BedDO[]): void }, reject: { (err: ThError): void }) {
		var searchCriteria = { "hotelId": bedMeta.hotelId, "status": BedStatus.Active };
		this._bedsEntity.find(searchCriteria).then((dbBedList: Array<Sails.QueryResult>) => {
            if (!dbBedList || !_.isArray(dbBedList)) {
				var thError = new ThError(ThStatusCode.MongoBedRepositoryInvalidList, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "no existing bed list", bedMeta, thError);
				return;
			}
			var resultDO = this.getQueryResultDO(dbBedList);
            resolve(resultDO);
        }).catch((err: Error) => {
            var thError = new ThError(ThStatusCode.MongoBedRepositoryErrorGettingBedList, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting bed list.", bedMeta, thError);
            reject(thError);
        });
    }
    private getQueryResultDO(dbBedList: Array<Sails.QueryResult>): BedDO[] {
		var bedList: BedDO[] = [];
		dbBedList.forEach((dbBed: Sails.QueryResult) => {
			var bed = new BedDO();
			bed.buildFromObject(dbBed);
			bedList.push(bed);
		});
        return bedList;
	}
    
    public getBedById(bedMeta: BedMetaRepoDO, bedId: string): Promise<BedDO> {
		return new Promise<BedDO>((resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) => {
			this.getBedByIdCore(bedMeta, bedId, resolve, reject);
		});
	}
    private getBedByIdCore(bedMeta: BedMetaRepoDO, bedId: string, resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
		this._bedsEntity.findOne({ "hotelId": bedMeta.hotelId, "id": bedId }).then((foundBed: Sails.QueryResult) => {
			if (!foundBed) {
				var thError = new ThError(ThStatusCode.MongoBedRepositoryBedNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Bed not found", { bedMeta: bedMeta, bedId: bedId }, thError);
				reject(thError);
				return;
			}
			var bed: BedDO = new BedDO();
			bed.buildFromObject(foundBed);
			resolve(bed);
		}).catch((err: Error) => {
			var thError = new ThError(ThStatusCode.MongoBedRepositoryErrorGettingBed, err);
			ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting bed by id", { bedMeta: bedMeta, bedId: bedId }, thError);
			reject(thError);
		});
	}
    
    public addBed(bedMeta: BedMetaRepoDO, bed: BedDO): Promise<BedDO> {
		return new Promise<BedDO>((resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) => {
			this.addBedCore(bedMeta, bed, resolve, reject);
		});
	}
	private addBedCore(bedMeta: BedMetaRepoDO, bed: BedDO, resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
		bed.hotelId = bedMeta.hotelId;
		bed.versionId = 0;
		bed.status = BedStatus.Active;
		this._bedsEntity.create(bed).then((createdBed: Sails.QueryResult) => {
			if (!createdBed) {
				var thError = new ThError(ThStatusCode.MongoBedRepositoryErrorAddingBed, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Error creatng bed", { bedMeta: bedMeta, bed: bed }, thError);
				reject(thError);
				return;
			}
			var bed: BedDO = new BedDO();
			bed.buildFromObject(createdBed);
			resolve(bed);
		}).catch((err: Error) => {
			this.logAndReject(err, reject, { bedMeta: bedMeta, bed: bed }, ThStatusCode.MongoBedRepositoryErrorAddingBed);
		});
	}
    private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
		var errorCode = this.getMongoErrorCode(err);
		if (errorCode == MongoErrorCodes.DuplicateKeyError) {
			var thError = new ThError(ThStatusCode.MongoBedRepositoryNameAlreadyExists, err);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Bed name already exists", context, thError);
			reject(thError);
			return;
		}
		var thError = new ThError(defaultStatusCode, err);
		ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding bed", context, thError);
		reject(thError);
	}
    
    public updateBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO, bed: BedDO): Promise<BedDO> {
		return this.findAndModifyBed(bedMeta, bedItemMeta, bed);
	}
    public deleteBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO): Promise<BedDO> {
		return this.findAndModifyBed(bedMeta, bedItemMeta,
			{
				"status": BedStatus.Deleted
			});
	}
    private findAndModifyBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO, updateQuery: Object): Promise<BedDO> {
		return new Promise<BedDO>((resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) => {
			this.findAndModifyBedCore(bedMeta, bedItemMeta, updateQuery, resolve, reject);
		});
	}
    private findAndModifyBedCore(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO, updateQuery: any, resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
		updateQuery.$inc = { "versionId": 1 };
		var findQuery: Object[] = [
			{ "hotelId": bedMeta.hotelId },
			{ "id": bedItemMeta.id },
			{ "versionId": bedItemMeta.versionId }
		];
		this.findAndModify(
			{
				$and: findQuery
			}, updateQuery).then((updatedDBBed: Object) => {
				if (!updatedDBBed) {
					var thError = new ThError(ThStatusCode.MongoBedRepositoryErrorUpdatingBed, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating bed - concurrency", { bedMeta: bedMeta, bedItemMeta: bedItemMeta, updateQuery: updateQuery }, thError);
					reject(thError);
					return;
				}
				var bed: BedDO = new BedDO();
				bed.buildFromObject(updatedDBBed);
				resolve(bed);
			}).catch((err: Error) => {
				this.logAndReject(err, reject, { bedMeta: bedMeta, updateQuery: updateQuery }, ThStatusCode.MongoBedRepositoryErrorUpdatingBed);
			});
	}
}