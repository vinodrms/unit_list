import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';

import { ReportMetadataDO, ReportType, FieldType } from '../../data-objects/ReportMetadataDO';
import { IReportMetadataRepository } from '../IReportMetadataRepository';

import _ = require('underscore');

export class MongoReportMetadataRepository implements IReportMetadataRepository {
	private _reportsMetadataList: ReportMetadataDO[];

	constructor() {
		var reportGuestsArriving = new ReportMetadataDO();
		reportGuestsArriving.buildFromObject({
			type: ReportType.GuestsArriving,
			name: "Guests Arriving",
			inputParams: [
				{
					type: FieldType.DateTime,
					name: "time",
					required: true
				}
			],
			columns: [
				{
					type: FieldType.String,
					name: "Customer name"
				},
				{
					type: FieldType.String,
					name: "Room category"
				},
				{
					type: FieldType.String,
					name: "Room number"
				},
				{
					type: FieldType.Number,
					name: "Adults"
				},
				{
					type: FieldType.Number,
					name: "Children"
				},
				{
					type: FieldType.Number,
					name: "Babies"
				},
				{
					type: FieldType.String,
					name: "Booking status"
				},
				{
					type: FieldType.String,
					name: "Total price"
				},
				{
					type: FieldType.String,
					name: "Booking Cancelation Hours"
				},
				{
					type: FieldType.String,
					name: "Notes"
				}
			]
		});

		var reportGuestsInHouse = new ReportMetadataDO();
		reportGuestsArriving.buildFromObject({
			type: ReportType.GuestsArriving,
			name: "Guests Arriving",
			inputParams: [
				{
					type: FieldType.DateTime,
					name: "time",
					required: true
				}
			],
			columns: [
				{
					type: FieldType.String,
					name: "Customer name"
				},
				{
					type: FieldType.String,
					name: "Room number"
				},
				{
					type: FieldType.Number,
					name: "Adults"
				},
				{
					type: FieldType.Number,
					name: "Children"
				},
				{
					type: FieldType.Number,
					name: "Babies"
				},
				{
					type: FieldType.String,
					name: "Departing Date"
				},
				{
					type: FieldType.String,
					name: "Notes"
				}
			]
		});

		this._reportsMetadataList = [reportGuestsArriving, reportGuestsInHouse];
	}

	getAllReportMetadata(): Promise<ReportMetadataDO[]> {
		return new Promise<ReportMetadataDO[]>((resolve: { (result: ReportMetadataDO[]): void }, reject: { (err: ThError): void }) => {
			resolve(this._reportsMetadataList);
		});
	}

	getReportMetadata(type: ReportType): Promise<ReportMetadataDO> {
		return new Promise<ReportMetadataDO>((resolve: { (result: ReportMetadataDO): void }, reject: { (err: ThError): void }) => {
			var retrievedReportMetadata = _.findWhere(this._reportsMetadataList, {type: type});
			resolve(<ReportMetadataDO>retrievedReportMetadata);
		});
	}
}