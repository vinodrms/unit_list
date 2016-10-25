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
		reportGuestsInHouse.buildFromObject({
			type: ReportType.GuestsInHouse,
			name: "Guests In House",
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
					type: FieldType.Date,
					name: "Departing Date"
				},
				{
					type: FieldType.String,
					name: "Notes"
				}
			]
		});

		var reportGuestsDeparting = new ReportMetadataDO();
		reportGuestsDeparting.buildFromObject({
			type: ReportType.GuestsDeparting,
			name: "Guests Departing",
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
					type: FieldType.Number,
					name: "Total Price"
				},
				{
					type: FieldType.String,
					name: "Notes"
				}
			]
		});

		var shiftReportByPaymentMethod = new ReportMetadataDO();
		shiftReportByPaymentMethod.buildFromObject({
			type: ReportType.ShiftReportPaymentMethod,
			name: "Shift Report - Payment report",
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
					name: "Payment method"
				},
				{
					type: FieldType.Number,
					name: "Transactions"
				},
				{
					type: FieldType.Number,
					name: "Amount"
				}
			]
		});		
		this._reportsMetadataList = [reportGuestsArriving, reportGuestsInHouse, reportGuestsDeparting, shiftReportByPaymentMethod];
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