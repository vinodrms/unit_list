import { Component, OnInit, AfterViewInit, ViewChildren, Input, Output, EventEmitter } from '@angular/core';

import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';

import {IYieldManagerDashboardFilter} from '../../YieldManagerDashboardComponent'

import {HotelService} from '../../../../../../../../services/hotel/HotelService';
import {HotelDetailsDO} from '../../../../../../../../services/hotel/data-objects/HotelDetailsDO';

@Component({
	selector: 'yield-timeframe-header',
	templateUrl: 'client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-timeframe-header/template/yield-timeframe-header.html'
})
export class YieldTimeFrameHeaderComponent implements OnInit {
	public selectedDate: ThDateDO;
	private _yieldManager: IYieldManagerDashboardFilter;

	constructor(
		private _hotelService: HotelService,
		private _appContext: AppContext) {
	}

	ngOnInit() {
		this._hotelService.getHotelDetailsDO().subscribe((details: HotelDetailsDO) => {
			this.selectedDate = details.currentThTimestamp.thDateDO.buildPrototype();
			this._yieldManager.updateYieldTimeFrameParams(this.selectedDate, 21);
			}, (error:any) => {
				this._appContext.toaster.error(error.message);
			});
	}

	public get yieldManager(): IYieldManagerDashboardFilter {
		return this._yieldManager;
	}

	public set yieldManager(v: IYieldManagerDashboardFilter) {
		this._yieldManager = v;
	}

	public nextDay() {
		this.selectedDate.addDays(1);
		this.refresh();
	}

	public previousDay() {
		this.selectedDate.addDays(-1);
		this.refresh();
	}

	public getDateShortString() {
		return this.selectedDate.getShortDisplayString(this._appContext.thTranslation);
	}

	public refresh() {
		this._yieldManager.updateYieldTimeFrameParams(this.selectedDate, 21);
	}
}