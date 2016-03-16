import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {YieldManagerFilterDO} from '../../data-layer/common/data-objects/yield-manager-filter/YieldManagerFilterDO';
import {YieldManagerFilterConfigurationDO} from '../../data-layer/hotel-configurations/data-objects/yield-manager-filter/YieldManagerFilterConfigurationDO';

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
		settingsRepo.getDefaultYieldManagerFilters()
			.then((defaultFilterList: YieldManagerFilterDO[]) => {
				var hotelConfigRepo = this._appContext.getRepositoryFactory().getHotelConfigurationsRepository();
				return hotelConfigRepo.initYieldManagerFilterConfigurationWithDefaults({ hotelId: this._hotelId }, defaultFilterList);
			})
			.then((ymFilterConfiguration: YieldManagerFilterConfigurationDO) => {
				resolve(true);
			}).catch((error: any) => {
				reject(error);
			});
	}
}