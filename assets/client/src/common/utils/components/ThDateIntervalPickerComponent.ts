import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ThDatePickerComponent} from './ThDatePickerComponent';
import {ThDateDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateDO';
import {ThDateIntervalDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateUtils} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateUtils';

@Component({
	selector: 'th-date-interval-picker',
	template: `
		<div class="row">
			<div class="col-xs-12 col-sm-4">
				<th-date-picker
					[readonly]="readonly"
					[initialThDate]="dateInterval.start"
					[minThDate]="minDate"
					[label]="'Start Date'"
					(didSelectThDate)="didSelectStartDate($event)"
					>
				</th-date-picker>
			</div>
			<div class="col-xs-12 col-sm-4">
				<th-date-picker
					[readonly]="readonly"
					[initialThDate]="dateInterval.end"
					[minThDate]="minEndDate"
					[label]="'End Date'"
					(didSelectThDate)="didSelectEndDate($event)"
					>
				</th-date-picker>
			</div>
		</div>
	`,
	directives: [ThDatePickerComponent]
})
export class ThDateIntervalPickerComponent {
	private _dateUtils: ThDateUtils = new ThDateUtils();

	private _initialThDateInterval: ThDateIntervalDO;
	public get initialThDateInterval(): ThDateIntervalDO {
		return this._initialThDateInterval;
	}
	@Input()
	public set initialThDateInterval(initialThDateInterval: ThDateIntervalDO) {
		this._initialThDateInterval = initialThDateInterval;
		this.updateDateInterval();
	}

	private _minDate: ThDateDO;
	public get minDate(): ThDateDO {
		return this._minDate;
	}
	@Input()
	public set minDate(minDate: ThDateDO) {
		this._minDate = minDate;
	}

	private _readonly: boolean;
	public get readonly(): boolean {
		return this._readonly;
	}
	@Input()
	public set readonly(readonly: boolean) {
		this._readonly = readonly;
	}

	@Output() didSelectThDateInterval = new EventEmitter();
	public triggerSelectedDateInterval() {
		this.didSelectThDateInterval.next(this.dateInterval);
	}

	dateInterval: ThDateIntervalDO;
	minEndDate: ThDateDO;

	constructor() {
		this.setDefaultDateInterval(this._dateUtils.getTodayThDayeDO());
	}
	private setDefaultDateInterval(startDate: ThDateDO) {
		this.dateInterval = this._dateUtils.getTodayToTomorrowInterval();
		this.minEndDate = this._dateUtils.addDaysToThDateDO(startDate.buildPrototype(), 1);
	}

	private updateDateInterval() {
		if (this._initialThDateInterval && this._initialThDateInterval.isValid()) {
			this.dateInterval = this._initialThDateInterval;
		}
		else {
			this.setDefaultDateInterval(this._dateUtils.getTodayThDayeDO());
			this.triggerSelectedDateInterval();
		}
	}

	didSelectStartDate(startDate: ThDateDO) {
		this.dateInterval.start = startDate;
		this.minEndDate = this._dateUtils.addDaysToThDateDO(startDate.buildPrototype(), 1);

		if (this.dateInterval.end.isBefore(this.minEndDate)) {
			this.dateInterval.end = this.minEndDate.buildPrototype();
		}
		this.triggerSelectedDateInterval();
	}
	didSelectEndDate(endDate: ThDateDO) {
		this.dateInterval.end = endDate;
		this.triggerSelectedDateInterval();
	}
}