import { ReportDO } from '../../data-layer/reports/data-objects/ReportDO';
import _ = require("underscore");

let endOfLine = require('os').EOL;

export class ReportGroupDO {
	public name: string;
	reportsList: ReportDO[];

	public buildCSVString() {
		let csvString = "";
		this.reportsList.forEach((report: ReportDO) => {
			let rcsv = this.buildCSVStringForReport(report);
			csvString += rcsv + endOfLine;
		});
		return csvString;
	}

	private buildCSVStringForReport(report: ReportDO) {
		let rCSV = "";
		var columnNames = _.map(report.metadata.columns, function(col){ return col.name; });
		rCSV += report.metadata.name + endOfLine;
		rCSV += this.buildCSVRowForArray(columnNames);
		report.data.forEach(row => {
			rCSV += this.buildCSVRowForArray(row);
		});
		return rCSV;
	}

	private buildCSVRowForArray(data: any[]) {
		let rowCSV = "";
		for (let i = 0; i < data.length - 1; i++) {
			rowCSV += this.transformValue(data[i]) + ',';
		}
		rowCSV += this.transformValue(data[data.length - 1]) + endOfLine;
		return rowCSV;
	}

	private transformValue(data){
		return (data)? data : "";
	}
}