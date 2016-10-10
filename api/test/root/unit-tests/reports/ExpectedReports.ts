import { ReportMetadataDO, ReportType, FieldType } from '../../../../core/data-layer/reports/data-objects/ReportMetadataDO';
import { ReportDO } from '../../../../core/data-layer/reports/data-objects/ReportDO';

var reportGuestsArrivingMetadata = new ReportMetadataDO();

reportGuestsArrivingMetadata.buildFromObject({
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

var reportGuestsInHouseMetadata = new ReportMetadataDO();
reportGuestsArrivingMetadata.buildFromObject({
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
			name : "Notes"
		}
	]
});

let row1 = ['Daniel 1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10'];
let row2 = ['Nikola 1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10'];
let expectedGuestArrivalsReport = new ReportDO();
expectedGuestArrivalsReport.metadata = reportGuestsArrivingMetadata;
expectedGuestArrivalsReport.data = [row1, row2];

let reportsMetadataList = [reportGuestsArrivingMetadata, reportGuestsInHouseMetadata];

export var ExpectedReports = { 
	reportsMetadataList : reportsMetadataList,
	reports: {
		GuestArrivalsReport : expectedGuestArrivalsReport
	}
}

