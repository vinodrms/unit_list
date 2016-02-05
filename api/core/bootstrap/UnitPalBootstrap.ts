import {UnitPalConfig} from '../utils/environment/UnitPalConfig';
import {DBPatchesFactory} from './db-patches/DBPatchesFactory';
import {IDBPatch} from './db-patches/IDBPatch';

export class UnitPalBootstrap {
	private _unitPalConfig: UnitPalConfig;
	constructor() {
		this._unitPalConfig = new UnitPalConfig();
	}
	bootstrap(callback: { (): void; }) {
		var dbPatchesFactory = new DBPatchesFactory(this._unitPalConfig);
		var dbPatch: IDBPatch = dbPatchesFactory.getDBPatch();
		dbPatch.applyPatches().then((result: any) => {
			callback();
		}).catch((error: any) => {
			callback();
		});
	}
}