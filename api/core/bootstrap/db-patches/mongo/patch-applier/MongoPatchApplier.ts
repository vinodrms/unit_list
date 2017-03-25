import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { ThLogger, ThLogLevel } from "../../../../utils/logging/ThLogger";
import { IMongoPatchApplier } from './utils/IMongoPatchApplier';
import { ATransactionalMongoPatch } from './utils/ATransactionalMongoPatch';
import { MongoPatchUtils } from './patches/MongoPatchUtils';
import { MongoPatchType } from './patches/MongoPatchType';
import async = require("async");
import _ = require("underscore");

export class MongoPatchApplier implements IMongoPatchApplier {
	private _mongoPatchAppliers: ATransactionalMongoPatch[];

	constructor(private _appliedPatches: MongoPatchType[]) {
		this.initPatchAppliers();
	}
	private initPatchAppliers() {
		this._mongoPatchAppliers = MongoPatchUtils.PatchList;
	}
	public applyAsync(finishApplyingPatchCallback: { (err: ThError, result?: MongoPatchType[]): void; }) {
		this.apply().then((result: MongoPatchType[]) => {
			finishApplyingPatchCallback(null, result);
		}).catch((error: any) => {
			var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, error);
			finishApplyingPatchCallback(thError);
		});
	}
	public apply(): Promise<MongoPatchType[]> {
		return new Promise<MongoPatchType[]>((resolve, reject) => {
			this.applyCore(resolve, reject);
		});
	}
	private applyCore(resolve: { (result: MongoPatchType[]): void }, reject: { (err: ThError): void }) {
		var applierIndex = 0;
		async.whilst(
			(() => {
				return applierIndex < this._mongoPatchAppliers.length;
			}),
			((finishApplySinglePatchCallback: any) => {
				var patchApplier: ATransactionalMongoPatch = this._mongoPatchAppliers[applierIndex++];

				if (!_.contains(this._appliedPatches, patchApplier.getPatchType())) {
					patchApplier.apply().then((result: boolean) => {
						this._appliedPatches.push(patchApplier.getPatchType());
						finishApplySinglePatchCallback(null, result);
					}).catch((err: Error) => {
						var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, err);
						ThLogger.getInstance().logError(ThLogLevel.Error, "error applying patch", { "patchType": patchApplier.getPatchType() }, thError);
						finishApplySinglePatchCallback(thError);
					});
				}
				else {
					finishApplySinglePatchCallback(null, true);
				}
			}),
			((err: Error) => {
				if (err) {
					var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, err);
					reject(thError);
				}
				else {
					resolve(_.uniq(this._appliedPatches));
				}
			})
		);
	}
}