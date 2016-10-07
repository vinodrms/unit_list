import { ReportMetadataDO, ReportType, FieldType } from '../../../../core/data-layer/reports/data-objects/ReportMetadataDO';

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
			name : "Notes"
		}
	]
});

var reportsMetadataList = [reportGuestsArriving, reportGuestsInHouse];

export { reportsMetadataList as expectedReportsMetadataList};

