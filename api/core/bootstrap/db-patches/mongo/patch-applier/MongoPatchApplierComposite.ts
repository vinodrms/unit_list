import {IMongoPatchApplier} from './IMongoPatchApplier';
import {MongoPatch1} from './patches/MongoPatch1';

import async = require("async");
import _ = require("underscore");

export class MongoPatchApplierComposite implements IMongoPatchApplier {
	private _mongoPatchAppliers: IMongoPatchApplier[];

	constructor(private _appliedPatches: string[]) {
		this.initPatchAppliers();
	}
	private initPatchAppliers() {
		this._mongoPatchAppliers = [new MongoPatch1()];

	}
	public getPatchName(): string {
		return "CompositePath";
	}
	public applyAsyncWrapper(finishApplyingPatchCallback: { (err: any, result?: string[]): void; }) {
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
				var patchApplier: IMongoPatchApplier = this._mongoPatchAppliers[applierIndex++];
				if (!_.contains(this._appliedPatches, patchApplier.getPatchName())) {
					patchApplier.apply().then((result: any) => {
						this._appliedPatches.push(patchApplier.getPatchName());
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