import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {IDBPatch} from '../IDBPatch';
import {MongoPatchApplier} from './patch-applier/MongoPatchApplier';
import async = require("async");

export enum LockStatus {
	Unlocked,
	Locked
}

export abstract class AMongoDBPatch implements IDBPatch {
	private static PatchType: string = "MongoDBPatch";
	private _nativeSystemPatchesEntity: any;
	private _appliedPatches: number[];

	constructor() {
	}

	public applyPatches(): Promise<boolean> {
		return new Promise<any>((resolve, reject) => {
			this.applyPatchesCore(resolve, reject);
		});
	}
	private applyPatchesCore(resolve: { (result: any): void }, reject: { (err: ThError): void }) {
		async.waterfall([
			((finishEnsuredIndexCallback) => {
				this.ensureIndexAsync(finishEnsuredIndexCallback);
			}),
			((result: any, finishUpdatedLockStatusCallback) => {
				this.acquireLockAsync(finishUpdatedLockStatusCallback);
			}),
			((result: any, finishApplyingPatchCallback) => {
				var patchApplier: MongoPatchApplier = new MongoPatchApplier(this._appliedPatches);
				patchApplier.applyAsync(finishApplyingPatchCallback);
			}),
			((newPatches: string[], finishUpdatedLockStatusCallback) => {
				this.releaseLockAndUpdatePatchesAsync(finishUpdatedLockStatusCallback, newPatches);
			})
		], ((error: any, result: any) => {
			if (error) {
				var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, error);
				reject(thError);
			}
			else {
				resolve(true);
			}
		}));
	}

	private ensureIndexAsync(finishEnsuredIndexCallback: { (err: any, result?: any): void; }) {
		this.ensureIndex().then((result: any) => {
			finishEnsuredIndexCallback(null, result);
		}).catch((error: any) => {
			finishEnsuredIndexCallback(error);
		});
	}
	private ensureIndex(): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.ensureIndexCore(resolve, reject);
		});
	}
	private ensureIndexCore(resolve: { (result: any): void }, reject: { (err: ThError): void }) {
		this.getNativeSystemPatchesEntity().then((nativeSystemPatchesEntity: any) => {
			this._nativeSystemPatchesEntity = nativeSystemPatchesEntity;
			this._nativeSystemPatchesEntity.ensureIndex("patchType", { unique: true }, ((err, indexName) => {
				if (err || !indexName) {
					var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, err);
					ThLogger.getInstance().logError(ThLogLevel.Error, "AMongoDBPatch - ensuring patchType index on native system patches collection", { step: "Bootstrap" }, thError);
					reject(thError);
					return;
				}
				resolve(true);
			}));
		}).catch((error: any) => {
			var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, error);
			reject(thError);
		});
	}
	protected abstract getNativeSystemPatchesEntity(): any;

	private acquireLockAsync(finishUpdatedLockStatusCallback: { (err: any, result?: any): void; }) {
		this.updateLockStatusAsync(finishUpdatedLockStatusCallback, LockStatus.Unlocked, LockStatus.Locked, null);
	}
	private releaseLockAndUpdatePatchesAsync(finishUpdatedLockStatusCallback: { (err: any, result?: any): void; }, newPatches: string[]) {
		this.updateLockStatusAsync(finishUpdatedLockStatusCallback, LockStatus.Locked, LockStatus.Unlocked, newPatches);
	}

	private updateLockStatusAsync(finishUpdatedLockStatusCallback: { (err: any, result?: any): void; }, currentStatus: LockStatus, newStatus: LockStatus, newPatches: string[]) {
		this.updateLockStatus(currentStatus, newStatus, newPatches).then((result: any) => {
			finishUpdatedLockStatusCallback(null, result);
		}).catch((error: any) => {
			finishUpdatedLockStatusCallback(error);
		});
	}
	private updateLockStatus(currentStatus: LockStatus, newStatus: LockStatus, newPatches: string[]): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.updateLockStatusCore(resolve, reject, currentStatus, newStatus, newPatches);
		});
	}
	private updateLockStatusCore(resolve: { (result: any): void }, reject: { (err: ThError): void }, currentStatus: LockStatus, newStatus: LockStatus, newPatches: string[]) {
		var setClause = {
			$set: {
				lock: newStatus,
				patchType: AMongoDBPatch.PatchType
			}
		};
		if (newPatches) {
			setClause.$set['patches'] = newPatches;
		}
		this._nativeSystemPatchesEntity.findAndModify({ lock: currentStatus }, [], setClause, { upsert: true, new: true }, (err, record) => {
			if (err || !record || !record.value) {
				var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, err);
				ThLogger.getInstance().logError(ThLogLevel.Warning, "AMongoDBPatch - Error getting native SystemPatches lock!", { step: "Bootstrap" }, thError);
				reject(thError);
				return;
			}
			this._appliedPatches = record.value.patches;
			if (!this._appliedPatches) {
				this._appliedPatches = [];
			}
			resolve(true);
		});
	}
}