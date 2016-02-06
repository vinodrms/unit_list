import {IMongoPatchApplier} from './utils/IMongoPatchApplier';
import {AMongoPatch, MongoPatcheType} from './utils/AMongoPatch';
import {MongoPatch0} from './patches/MongoPatch0';
import async = require("async");
import _ = require("underscore");

export class MongoPatchApplier implements IMongoPatchApplier {
	private _mongoPatchAppliers: AMongoPatch[];

	constructor(private _appliedPatches: MongoPatcheType[]) {
		this.initPatchAppliers();
	}

	private initPatchAppliers() {
		this._mongoPatchAppliers = [new MongoPatch0()];
	}
	public applyAsync(finishApplyingPatchCallback: { (err: any, result?: string[]): void; }) {
		this.apply().then((result: any) => {
			finishApplyingPatchCallback(null, result);
		}).catch((error: any) => {
			finishApplyingPatchCallback(error);
		});
	}
	public apply(): Promise<any> {
		return new Promise<Object>((resolve, reject) => {
			this.applyCore(resolve, reject);
		});
	}
	private applyCore(resolve, reject) {
		var applierIndex = 0;
		async.whilst(
			(() => {
				return applierIndex < this._mongoPatchAppliers.length;
			}),
			((finishApplySinglePatchCallback: any) => {
				var patchApplier: AMongoPatch = this._mongoPatchAppliers[applierIndex++];

				if (!_.contains(this._appliedPatches, patchApplier.getPatchType())) {
					patchApplier.apply().then((result: any) => {
						this._appliedPatches.push(patchApplier.getPatchType());
						finishApplySinglePatchCallback(null, result);
					}).catch((err: Error) => {
						finishApplySinglePatchCallback(err);
					});
				}
				else {
					finishApplySinglePatchCallback(null, "");
				}
			}),
			((err: Error) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(_.uniq(this._appliedPatches));
				}
			})
		);
	}
}