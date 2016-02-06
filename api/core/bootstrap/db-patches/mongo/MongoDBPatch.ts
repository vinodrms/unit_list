import {IDBPatch} from '../IDBPatch';
import {MongoPatchApplier} from './patch-applier/MongoPatchApplier';
import async = require("async");

export enum LockStatus {
	Unlocked,
	Locked
}

export class MongoDBPatch implements IDBPatch {
	private static PatchType: string = "MongoDBPatch";
	private _systemPatchesEntity: Sails.Model;
	private _nativeSystemPatchesEntity: any;
	private _appliedPatches: number[];

	constructor() {
		this._systemPatchesEntity = sails.models.systempatchesentity;
	}

	public applyPatches(): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.applyPatchesCore(resolve, reject);
		});
	}
	private applyPatchesCore(resolve, reject) {
		async.waterfall([
			((finishEnsuredIndexCallback) => {
				this.ensureIndexAsyncWrapper(finishEnsuredIndexCallback);
			}),
			((result: any, finishUpdatedLockStatusCallback) => {
				this.acquireLockAsyncWrapper(finishUpdatedLockStatusCallback);
			}),
			((result: any, finishApplyingPatchCallback) => {
				var patchApplier: MongoPatchApplier = new MongoPatchApplier(this._appliedPatches);
				patchApplier.applyAsyncWrapper(finishApplyingPatchCallback);
			}),
			((newPatches: string[], finishUpdatedLockStatusCallback) => {
				this.releaseLockAndUpdatePatchesAsyncWrapper(finishUpdatedLockStatusCallback, newPatches);
			})
		], ((error: any, result: any) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(result);
			}
		}));
	}

	private ensureIndexAsyncWrapper(finishEnsuredIndexCallback: { (err: any, result?: any): void; }) {
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
	private ensureIndexCore(resolve, reject) {
		this._systemPatchesEntity.native((err, nativeSystemPatchesEntity) => {
			if (err || !nativeSystemPatchesEntity) {
				reject("Error getting native SystemPatches collection!");
				return;
			}
			this._nativeSystemPatchesEntity = nativeSystemPatchesEntity;

			this._nativeSystemPatchesEntity.ensureIndex("patchType", { unique: true }, ((err, indexName) => {
				if (err || !indexName) {
					reject("Error ensuring unique index");
					return;
				}
				resolve(true);
			}));
		});
	}

	private acquireLockAsyncWrapper(finishUpdatedLockStatusCallback: { (err: any, result?: any): void; }) {
		this.updateLockStatusAsyncWrapper(finishUpdatedLockStatusCallback, LockStatus.Unlocked, LockStatus.Locked, null);
	}
	private releaseLockAndUpdatePatchesAsyncWrapper(finishUpdatedLockStatusCallback: { (err: any, result?: any): void; }, newPatches: string[]) {
		this.updateLockStatusAsyncWrapper(finishUpdatedLockStatusCallback, LockStatus.Locked, LockStatus.Unlocked, newPatches);
	}

	private updateLockStatusAsyncWrapper(finishUpdatedLockStatusCallback: { (err: any, result?: any): void; }, currentStatus: LockStatus, newStatus: LockStatus, newPatches: string[]) {
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
	private updateLockStatusCore(resolve, reject, currentStatus: LockStatus, newStatus: LockStatus, newPatches: string[]) {
		var setClause = {
			$set: {
				lock: newStatus,
				patchType: MongoDBPatch.PatchType
			}
		};
		if (newPatches) {
			setClause.$set['patches'] = newPatches;
		}
		this._nativeSystemPatchesEntity.findAndModify({ lock: currentStatus }, [], setClause, { upsert: true, new: true }, (err, record) => {
			if (err || !record || !record.value) {
				reject("Error getting native SystemPatches lock!");
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