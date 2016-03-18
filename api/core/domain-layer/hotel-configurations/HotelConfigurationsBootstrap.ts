import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {YieldFilterDO} from '../../data-layer/common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterConfigurationDO} from '../../data-layer/hotel-configurations/data-objects/yield-filter/YieldFilterConfigurationDO';

export class HotelConfigurationsBootstrap {
	constructor(private _appContext: AppContext, private _hotelId: string) {
	}
	public bootstrap(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.bootstrapCore(resolve, reject);
		});
	}
	private bootstrapCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		this.bootstrapYieldManagerFilters().then((result: boolean) => {
			// add other bootstrap steps if necessary
			resolve(true);
		}).catch((error: any) => {
			reject(error);
		});
	}

	private bootstrapYieldManagerFilters(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.bootstrapYieldManagerFiltersCore(resolve, reject);
		});
	}
	private bootstrapYieldManagerFiltersCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		var settingsRepo = this._appContext.getRepositoryFactory().getSettingsRepository();
		settingsRepo.getDefaultYieldFilters()
			.then((defaultFilterList: YieldFilterDO[]) => {
				var hotelConfigRepo = this._appContext.getRepositoryFactory().getYieldFilterConfigurationsRepository();
				return hotelConfigRepo.initYieldFilterConfigurationWithDefaults({ hotelId: this._hotelId }, defaultFilterList);
			})
			.then((ymFilterConfiguration: YieldFilterConfigurationDO) => {
				resolve(true);
			}).catch((error: any) => {
				reject(error);
			});
	}
}