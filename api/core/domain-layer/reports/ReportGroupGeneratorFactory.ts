import { AppContext } from '../../utils/AppContext';
import { ThUtils } from '../../utils/ThUtils';
import { ReportDO } from '../../data-layer/reports/data-objects/ReportDO';

import { IReportGroupGeneratorStrategy } from './CommonInterfaces';
import { BackUpReportCollectionGenerator } from './backup-report/BackUpReportCollectionGenerator';
import { KeyMetricsReportGroupGenerator } from './key-metrics/KeyMetricsReportGroupGenerator';

export enum ReportGroupType{
	Backup,
	KeyMetrics
}

export class ReportGroupGeneratorFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext,private _sessionContext) {
		this._thUtils = new ThUtils();
	}

	public getGeneratorStrategy(type: ReportGroupType): IReportGroupGeneratorStrategy {
		switch (type) {
			case ReportGroupType.Backup:
				return new BackUpReportCollectionGenerator(this._appContext, this._sessionContext);
			case ReportGroupType.KeyMetrics:
				return new KeyMetricsReportGroupGenerator(this._appContext, this._sessionContext);
			default:
				throw Error("Report not supported");
		}
	}
}