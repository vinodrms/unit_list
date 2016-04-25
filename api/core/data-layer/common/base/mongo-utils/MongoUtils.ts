import {ThUtils} from '../../../../utils/ThUtils';

import _ = require('underscore');
import mongodb = require('mongodb');
import ObjectID = mongodb.ObjectID;
import Collection = mongodb.Collection;

export class MongoUtils {
	private _thUtils: ThUtils;

	constructor() {
		this._thUtils = new ThUtils();
	}

	public getNativeMongoCollection(sailsEntity: Sails.Model): Promise<Collection> {
        return new Promise<Collection>((resolve, reject) => {
            sailsEntity.native((err, nativeEntity: any) => {
                if (err || !nativeEntity) {
                    reject(err);
                    return;
                }
                resolve(nativeEntity);
            });
        });
    }

	public preprocessSearchCriteria(searchCriteria: any): Object {
		if (!this._thUtils.isUndefinedOrNull(searchCriteria.id) 
				&& this._thUtils.isUndefinedOrNull(searchCriteria.id.$in)) {
			searchCriteria._id = new ObjectID(searchCriteria.id);
			delete searchCriteria["id"];
		}
		else if (!this._thUtils.isUndefinedOrNull(searchCriteria['$and']) && _.isArray(searchCriteria['$and'])) {
			_.map(searchCriteria['$and'], (queryEntry: any) => {
				if (!this._thUtils.isUndefinedOrNull(queryEntry.id)) {
					queryEntry._id = new ObjectID(queryEntry.id);
					delete queryEntry.id;
				}
				return queryEntry;
			});
		}
		return searchCriteria;
	}

	public preprocessUpdateQuery(updates: Object): Object {
		updates["updatedAt"] = this.getISODate();

		var processedUpdates: any = {};
		// these are placed individually on the update query
		var reservedWordList = ["$inc", "$push", "$pop", "$addToSet", "$pull", "$pullAll"];
		reservedWordList.forEach((reservedWord: string) => {
			var reservedWordValue = updates[reservedWord];
			if (!this._thUtils.isUndefinedOrNull(reservedWordValue)) {
				delete updates[reservedWord];
				processedUpdates[reservedWord] = reservedWordValue;
			}
		});
		// the rest of the updates are automatically given to the set attributte
		processedUpdates["$set"] = updates;
		return processedUpdates;
	}
	private getISODate(): Date {
		return new Date((new Date()).toISOString());
	}

	public processQueryResultItem(value: any): Object {
		var object = value;
		if (!this._thUtils.isUndefinedOrNull(object._id)) {
			var objId: ObjectID = object._id;
			object.id = objId.toHexString();
			delete object._id;
		}
		return object;
	}
}