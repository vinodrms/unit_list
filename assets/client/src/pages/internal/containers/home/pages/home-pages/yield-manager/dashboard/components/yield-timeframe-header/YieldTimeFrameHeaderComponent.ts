import { Component, OnInit, AfterViewInit, ViewChildren, Input, Output, EventEmitter } from '@angular/core';

import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';

import {IYieldManagerDashboardFilter} from '../../YieldManagerDashboardComponent'

import {HotelService} from '../../../../../../../../services/hotel/HotelService';
import {HotelDetailsDO} from '../../../../../../../../services/hotel/data-objects/HotelDetailsDO';

interface ITimeFrameOption{
	noDays: number,
	label: string,
	active:boolean
}

@Component({
	selector: 'yield-timeframe-header',
	templateUrl: 'client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-timeframe-header/template/yield-timeframe-header.html'
})
export class YieldTimeFrameHeaderComponent implements OnInit {
	public selectedDate: ThDateDO;
	public selectedTimeFrame: ITimeFrameOption;
	private _yieldManager: IYieldManagerDashboardFilter;

	public timeFrameOptionsList: ITimeFrameOption[];

	constructor(
		private _hotelService: HotelService,
		private _appContext: AppContext) {
			this.timeFrameOptionsList = [
				{
					noDays: 7,
					label: "1 " + this._appContext.thTranslation.translate("Week"),
					active: false
				},
				{
					noDays: 14,
					label: "2 " + this._appContext.thTranslation.translate("Weeks"),
					active: false
				},
				{
					noDays: 21,
					label: "3 " + this._appContext.thTranslation.translate("Weeks"),
					active: true
				}
			]
			this.selectedTimeFrame = this.timeFrameOptionsList[2];
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
		var dayName = this.selectedDate.getLongDayDisplayString(this._appContext.thTranslation);
		var longDateString = this.selectedDate.getLongDisplayString(this._appContext.thTranslation)
		return dayName + " " + longDateString;
	}

	public refresh() {
		this._yieldManager.updateYieldTimeFrameParams(this.selectedDate, this.selectedTimeFrame.noDays);
	}

	public activateTimeFrame(timeFrameOption:ITimeFrameOption){
		this.timeFrameOptionsList.forEach(element => {
			element.active = false;
		});
		timeFrameOption.active = true;
		this.selectedTimeFrame = timeFrameOption;
		this.refresh();
	}

}