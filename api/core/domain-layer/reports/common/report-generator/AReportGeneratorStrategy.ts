import { AppContext } from '../../../../utils/AppContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThUtils } from '../../../../utils/ThUtils';
import { IValidationStructure } from '../../../../utils/th-validation/structure/core/IValidationStructure';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { IReportGeneratorStrategy } from './IReportGeneratorStrategy';
import { ReportGroup } from '../result/ReportGroup';
import { ReportGroupMeta } from '../result/ReportGroup';
import { ReportSection } from '../result/ReportSection';
import { IReportSectionGeneratorStrategy } from '../report-section-generator/IReportSectionGeneratorStrategy';

import _ = require('underscore');

export abstract class AReportGeneratorStrategy implements IReportGeneratorStrategy {
	protected _thUtils: ThUtils;

	constructor(protected _appContext: AppContext) {
		this._thUtils = new ThUtils();
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
		meta.reference = this._thUtils.generateShortId();
		var reportGroup = new ReportGroup(meta);

		this.loadDependentData().then((result: any) => {
			var generators = this.getSectionGenerators();
			var itemPromiseList: Promise<ReportSection>[] = [];
			_.forEach(generators, (g: IReportSectionGeneratorStrategy) => {
				itemPromiseList.push(g.generate());
			});
			return Promise.all(itemPromiseList);
		}).then((itemList: ReportSection[]) => {
			reportGroup.sectionList = itemList;
			resolve(reportGroup);
		}).catch((e) => {
			reject(e);
		});
	}

	private loadDependentData(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.loadDependentDataCore(resolve, reject);
		});
	}
	// this function should be overriden when the sections depend on some common data
	protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		resolve(true);
	}

	protected abstract getParamsValidationStructure(): IValidationStructure;
	protected abstract loadParameters(params: any);
	protected abstract getMeta(): ReportGroupMeta;
	protected abstract getSectionGenerators(): IReportSectionGeneratorStrategy[];
}