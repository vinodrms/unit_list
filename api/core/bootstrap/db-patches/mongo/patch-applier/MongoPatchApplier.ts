import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {IMongoPatchApplier} from './utils/IMongoPatchApplier';
import {ATransactionalMongoPatch, MongoPatcheType} from './utils/ATransactionalMongoPatch';
import {MongoPatch0} from './patches/patch0/MongoPatch0';
import {MongoPatch1} from './patches/patch1/MongoPatch1';
import async = require("async");
import _ = require("underscore");

export class MongoPatchApplier implements IMongoPatchApplier {
	private _mongoPatchAppliers: ATransactionalMongoPatch[];

	constructor(private _appliedPatches: MongoPatcheType[]) {
		this.initPatchAppliers();
	}

	private initPatchAppliers() {
		this._mongoPatchAppliers = [new MongoPatch0(), new MongoPatch1()];
	}
	public applyAsync(finishApplyingPatchCallback: { (err: ThError, result?: MongoPatcheType[]): void; }) {
		this.apply().then((result: MongoPatcheType[]) => {
			finishApplyingPatchCallback(null, result);
		}).catch((error: any) => {
			var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, error);
			finishApplyingPatchCallback(thError);
		});
	}
	public apply(): Promise<MongoPatcheType[]> {
		return new Promise<MongoPatcheType[]>((resolve, reject) => {
			this.applyCore(resolve, reject);
		});
	}
	private applyCore(resolve: { (result: MongoPatcheType[]): void }, reject: { (err: ThError): void }) {
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