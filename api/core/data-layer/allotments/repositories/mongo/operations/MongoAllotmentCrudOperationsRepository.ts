import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { MongoRepository } from '../../../../common/base/MongoRepository';
import { AllotmentMetaRepoDO, AllotmentItemMetaRepoDO } from '../../IAllotmentRepository';
import { AllotmentDO, AllotmentStatus } from '../../../data-objects/AllotmentDO';
import { AllotmentRepositoryHelper } from './helpers/AllotmentRepositoryHelper';

export class MongoAllotmentCrudOperationsRepository extends MongoRepository {
	private _helper: AllotmentRepositoryHelper;

	constructor(allotmentEntity: any) {
		super(allotmentEntity);
		this._helper = new AllotmentRepositoryHelper();
	}
	public addAllotment(meta: AllotmentMetaRepoDO, allotment: AllotmentDO): Promise<AllotmentDO> {
		return new Promise<AllotmentDO>((resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) => {
			this.addAllotmentCore(meta, allotment, resolve, reject);
		});
	}
	private addAllotmentCore(meta: AllotmentMetaRepoDO, allotment: AllotmentDO, resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) {
		allotment.hotelId = meta.hotelId;
		allotment.versionId = 0;

		this.createDocument(allotment,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.AllotmentRepositoryErrorAddingAllotment, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding allotment", { meat: meta, allotment: allotment }, thError);
				reject(thError);
			},
			(createdAllotment: Object) => {
				resolve(this._helper.buildAllotmentDOFrom(createdAllotment));
			}
		);
	}

	public getAllotmentById(meta: AllotmentMetaRepoDO, allotmentId: string): Promise<AllotmentDO> {
		return new Promise<AllotmentDO>((resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) => {
			this.getAllotmentByIdCore(meta, allotmentId, resolve, reject);
		});
	}
	private getAllotmentByIdCore(meta: AllotmentMetaRepoDO, allotmentId: string, resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) {
		this.findOneDocument({ "hotelId": meta.hotelId, "id": allotmentId },
			() => {
				var thError = new ThError(ThStatusCode.AllotmentRepositoryAllotmentNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Allotment not found", { meta: meta, allotmentId: allotmentId }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.AllotmentRepositoryErrorGettingAllotment, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting allotment by id", { meta: meta, allotmentId: allotmentId }, thError);
				reject(thError);
			},
			(foundAllotment: Object) => {
				resolve(this._helper.buildAllotmentDOFrom(foundAllotment));
			}
		);
	}

	public updateAllotment(meta: AllotmentMetaRepoDO, itemMeta: AllotmentItemMetaRepoDO, allotment: AllotmentDO): Promise<AllotmentDO> {
		return this.findAndModifyAllotment(meta, itemMeta, {},
			{
				"notes": allotment.notes,
				"availability": allotment.availability
			});
	}
	public updateAllotmentStatus(meta: AllotmentMetaRepoDO, itemMeta: AllotmentItemMetaRepoDO, status: AllotmentStatus): Promise<AllotmentDO> {
		return this.findAndModifyAllotment(meta, itemMeta, {},
			{
				"status": status
			});
	}
	private findAndModifyAllotment(meta: AllotmentMetaRepoDO, itemMeta: AllotmentItemMetaRepoDO, findQuery: Object, updateQuery: Object): Promise<AllotmentDO> {
		return new Promise<AllotmentDO>((resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) => {
			this.findAndModifyAllotmentCore(meta, itemMeta, findQuery, updateQuery, resolve, reject);
		});
	}
	private findAndModifyAllotmentCore(meta: AllotmentMetaRepoDO, itemMeta: AllotmentItemMetaRepoDO, findQuery: Object, updateQuery: any, resolve: { (result: AllotmentDO): void }, reject: { (err: ThError): void }) {
		updateQuery.$inc = { "versionId": 1 };
		findQuery["hotelId"] = meta.hotelId;
		findQuery["id"] = itemMeta.id;
		findQuery["versionId"] = itemMeta.versionId;

		this.findAndModifyDocument(findQuery, updateQuery,
			() => {
				var thError = new ThError(ThStatusCode.AllotmentRepositoryProblemUpdatingAllotment, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating allotment - concurrency", { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.AllotmentRepositoryErrorUpdatingAllotment, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating allotment", { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(updatedDBAllotment: Object) => {
				resolve(this._helper.buildAllotmentDOFrom(updatedDBAllotment));
			}
		);
	}
}