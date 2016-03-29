import {LazyLoadMetaResponseRepoDO} from '../../repo-data-objects/LazyLoadRepoDO';
import {MongoUtils} from './MongoUtils';

import _ = require('underscore');
import mongodb = require('mongodb');
import Collection = mongodb.Collection;

export class MongoDocumentCount {
	private _mongoUtils: MongoUtils;

	errorCallback: { (err: Error): void };
	successCallback: { (meta: LazyLoadMetaResponseRepoDO): void };

	constructor(private _sailsEntity: Sails.Model) {
		this._mongoUtils = new MongoUtils();
	}

	public getDocumentCount(searchCriteria: Object) {
		this._mongoUtils.getNativeMongoCollection(this._sailsEntity).then((nativeCollection: any) => {
			this.getDocumentCountCore(nativeCollection, searchCriteria);
		}).catch((error: any) => {
			this.errorCallback(error);
		});
	}

	private getDocumentCountCore(nativeCollection: Collection, searchCriteria: Object) {
		var preprocessedSearchCriteria = this._mongoUtils.preprocessSearchCriteria(searchCriteria);

		nativeCollection.count(preprocessedSearchCriteria, (err: Error, count: number) => {
			if (err) {
				this.errorCallback(err);
				return;
			}
			if (!_.isNumber(count)) {
				this.errorCallback(new Error("count function did not return a number"));
				return;
			}
			this.successCallback({ numOfItems: count });
		});
	}
}