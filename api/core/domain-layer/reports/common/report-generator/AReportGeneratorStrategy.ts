import { AppContext } from '../../../../utils/AppContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { IValidationStructure } from '../../../../utils/th-validation/structure/core/IValidationStructure';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { IReportGeneratorStrategy } from './IReportGeneratorStrategy';
import { ReportGroup } from '../result/ReportGroup';
import { ReportGroupMeta } from '../result/ReportGroup';
import { ReportItem } from '../result/ReportItem';
import { IReportItemGenerator } from '../report-item-generator/IReportItemGenerator';

import _ = require('underscore');

export abstract class AReportGeneratorStrategy implements IReportGeneratorStrategy {

	constructor(protected _appContext: AppContext) {
	}

	public generate(params: Object): Promise<ReportGroup> {
		return new Promise<ReportGroup>((resolve: { (result: ReportGroup): void }, reject: { (err: ThError): void }) => {
			this.generateCore(resolve, reject, params);
		});
	}

	private generateCore(resolve: { (result: ReportGroup): void }, reject: { (err: ThError): void }, params: Object) {
		var validationResult = this.getParamsValidationStructure().validateStructure(params);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, params);
			parser.logAndReject("Error validating params for report strategy", reject);
			return;
		}
		this.loadParameters(params);

		var meta = this.getMeta();
		meta.name = this._appContext.thTranslate.translate(meta.name);

		var reportGroup = new ReportGroup(meta);
		var generators = this.getGenerators();
		var itemPromiseList: Promise<ReportItem>[] = [];
		_.forEach(generators, (g: IReportItemGenerator) => {
			itemPromiseList.push(g.generate());
		});
		Promise.all(itemPromiseList).then((itemList: ReportItem[]) => {
			reportGroup.itemList = itemList;
			resolve(reportGroup);
		}).catch((e: ThError) => {
			reject(e);
		});
	}

	protected abstract getParamsValidationStructure(): IValidationStructure;
	protected abstract loadParameters(params: any);
	protected abstract getMeta(): ReportGroupMeta;
	protected abstract getGenerators(): IReportItemGenerator[];
}