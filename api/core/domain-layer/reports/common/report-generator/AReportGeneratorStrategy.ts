import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from "../../../../utils/SessionContext";
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
import { HotelDO } from "../../../../data-layer/hotel/data-objects/HotelDO";
import { ThTimestampDO } from "../../../../utils/th-dates/data-objects/ThTimestampDO";

export abstract class AReportGeneratorStrategy implements IReportGeneratorStrategy {
	protected _thUtils: ThUtils;
	protected _reportGroup: ReportGroup;

	constructor(protected _appContext: AppContext, protected _sessionContext: SessionContext) {
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
		this.loadDependentData().then((result: any) => {
			return this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id);
		}).then((loadedHotel: HotelDO) => {
			this.prepareMeta(loadedHotel);
			var generators = this.getSectionGenerators();
			var itemPromiseList: Promise<ReportSection>[] = [];
			_.forEach(generators, (g: IReportSectionGeneratorStrategy) => {
				itemPromiseList.push(g.generate());
			});
			return Promise.all(itemPromiseList);
		}).then((itemList: ReportSection[]) => {
			this._reportGroup.sectionList = itemList;
			resolve(this._reportGroup);
		}).catch((e) => {
			reject(e);
		});
	}

	private prepareMeta(loadedHotel: HotelDO) {
		var meta = this.getMeta();
		meta.name = this._appContext.thTranslate.translate(meta.name);
		meta.reference = this._thUtils.generateShortId();
		this._reportGroup = new ReportGroup(meta);
		meta.generationTime = this._appContext.thTranslate.translate("Generated At") + ": " + ThTimestampDO.buildThTimestampForTimezone(loadedHotel.timezone).toString();
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