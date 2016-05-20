import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {ThTimestamp} from '../../../utils/th-dates/ThTimestamp';
import {AllotmentDO, AllotmentStatus} from '../../../data-layer/allotment/data-objects/AllotmentDO';
import {AllotmentSearchResultRepoDO} from '../../../data-layer/allotment/repositories/IAllotmentRepository';
import {ArchiveAllotmentItem} from '../ArchiveAllotmentItem';

import _ = require('underscore');

export class AllotmentArchiverProcess {
	private _referenceTimestamp: ThTimestamp;

	constructor(private _appContext: AppContext, private _hotel: HotelDO) {
	}

	public archive(referenceTimestamp: ThTimestamp): Promise<AllotmentDO[]> {
		this._referenceTimestamp = referenceTimestamp;
		return new Promise<AllotmentDO[]>((resolve: { (result: AllotmentDO[]): void }, reject: { (err: ThError): void }) => {
			this.archiveCore(resolve, reject);
		});
	}
	private archiveCore(resolve: { (result: AllotmentDO[]): void }, reject: { (err: ThError): void }) {
		var allotmentRepository = this._appContext.getRepositoryFactory().getAllotmentRepository();
		allotmentRepository.getAllotmentList({ hotelId: this._hotel.id }, {
			status: AllotmentStatus.Active,
			maxExpiryUtcTimestamp: this._referenceTimestamp.getUtcTimestamp()
		}).then((searchResult: AllotmentSearchResultRepoDO) => {
			var allotmentList = _.filter(searchResult.allotmentList, (allotment: AllotmentDO) => {
				return allotment.openInterval.end.isBefore(this._referenceTimestamp.thDateDO);
			});
			var promiseList: Promise<AllotmentDO>[] = [];
			_.forEach(allotmentList, (allotment: AllotmentDO) => {
				promiseList.push(
					allotmentRepository.updateAllotmentStatus({ hotelId: this._hotel.id }, {
						id: allotment.id,
						versionId: allotment.versionId
					}, AllotmentStatus.Archived)
				);
			});
			return Promise.all(promiseList);
		}).then((allotmentList: AllotmentDO[]) => {
			resolve(allotmentList);
		}).catch((error: any) => {
			reject(error);
		});
	}
}