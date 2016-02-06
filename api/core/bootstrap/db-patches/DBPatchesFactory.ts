import {UnitPalConfig, DatabaseType} from '../../utils/environment/UnitPalConfig';
import {IDBPatch} from './IDBPatch';
import {SailsMongoDBPatch} from './mongo/SailsMongoDBPatch';

export class DBPatchesFactory {
	private _databaseType: DatabaseType;
	constructor(private _unitPalConfig: UnitPalConfig) {
		this._databaseType = _unitPalConfig.getDatabaseType();
	}

	getDBPatch(): IDBPatch {
		switch (this._databaseType) {
			default:
				return new SailsMongoDBPatch();
		}
	}
}