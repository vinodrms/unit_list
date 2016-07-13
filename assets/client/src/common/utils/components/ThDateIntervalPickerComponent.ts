import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ThDataValidators} from '../form-utils/utils/ThDataValidators';
import {TranslationPipe} from '../localization/TranslationPipe';
import {ThDatePickerComponent} from './ThDatePickerComponent';
import {ThDateDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateDO';
import {ThDateIntervalDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateUtils} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateUtils';

@Component({
	selector: 'th-date-interval-picker',
	template: `
		<div class="row">
			<div [ngClass]="{'col-md-4 col-sm-6 col-xs-12': !showExpandedView, 'col-xs-6': showExpandedView}">
				<th-date-picker
					[readonly]="readonly"
					[initialThDate]="dateInterval.start"
					[minThDate]="minDate"
					[label]="startDateLabel"
					[labelFont]="startDateFont"
					[showLabel]="showLabels"
					(didSelectThDate)="didSelectStartDate($event)"
					>
				</th-date-picker>
				<span class="unitpal-font date-interval-picker-arrow" [ngClass]="{'normal': !showExpandedView, 'expanded': showExpandedView}">></span>
			</div>
			<div [ngClass]="{'col-md-4 col-sm-6 col-xs-12': !showExpandedView, 'col-xs-6': showExpandedView}">
				<th-date-picker
					[readonly]="readonly"
					[initialThDate]="dateInterval.end"
					[minThDate]="minEndDate"
					[label]="endDateLabel"
					[labelFont]="endDateFont"
					[showLabel]="showLabels"
					(didSelectThDate)="didSelectEndDate($event)"
					>
				</th-date-picker>
			</div>
			<div class="col-md-2 col-sm-6 col-xs-12" *ngIf="showNoOfNights">
				<div class="form-group" style="padding-top: 5px;">
					<label>{{ 'Nights' | translate }}</label>
					<div class="input-group" [ngClass]="{'form-warning': !noOfNightsIsValid()}">
						<input type="number" class="form-control" [ngModel]="noOfNights" (ngModelChange)="didChangeNoOfNights($event)">
					</div>
					<label class="form-warning"><small><i class="fa fa-info-circle"></i> {{'Enter a valid number of nights' | translate}}</small></label>
				</div>
			</div>
		</div>
	`,
	pipes: [TranslationPipe],
	directives: [ThDatePickerComponent]
})
export class ThDateIntervalPickerComponent {
	public static MaxNoOfDaysFromInterval = 186;

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
	@Input() startDateLabel: string = "Start Date";
	@Input() startDateFont: string;
	@Input() endDateLabel: string = "End Date";
	@Input() endDateFont: string;
	@Input() showNoOfNights: boolean = false;
	@Input() showExpandedView: boolean = false;
	@Input() showLabels: boolean = true;
	@Input() restrictedInterval: boolean = false;
	noOfNights: number = 0;

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
		this.updateNoOfNights();
	}

	private updateDateInterval() {
		if (this._initialThDateInterval && this._initialThDateInterval.isValid()) {
			this.dateInterval = this._initialThDateInterval;
		}
		else {
			this.setDefaultDateInterval(this._dateUtils.getTodayThDayeDO());
			this.triggerSelectedDateInterval();
		}
		this.updateNoOfNights();
	}

	didSelectStartDate(startDate: ThDateDO) {
		this.dateInterval.start = startDate;
		this.minEndDate = this._dateUtils.addDaysToThDateDO(startDate.buildPrototype(), 1);

		if (this.dateInterval.end.isBefore(this.minEndDate)) {
			this.dateInterval.end = this.minEndDate.buildPrototype();
			this.updateNoOfNights();
		}
		else if (this.dateInterval.getNumberOfDays() > ThDateIntervalPickerComponent.MaxNoOfDaysFromInterval && this.restrictedInterval) {
			this.dateInterval.end = this.dateInterval.start.buildPrototype();
			this.dateInterval.end = this._dateUtils.addDaysToThDateDO(this.dateInterval.end, ThDateIntervalPickerComponent.MaxNoOfDaysFromInterval);
			this.updateNoOfNights();
		}
		this.triggerSelectedDateInterval();
	}
	didSelectEndDate(endDate: ThDateDO) {
		this.dateInterval.end = endDate;
		if (this.dateInterval.getNumberOfDays() > ThDateIntervalPickerComponent.MaxNoOfDaysFromInterval && this.restrictedInterval) {
			this.dateInterval.start = this.dateInterval.end.buildPrototype();
			this.dateInterval.start = this._dateUtils.addDaysToThDateDO(this.dateInterval.start, -ThDateIntervalPickerComponent.MaxNoOfDaysFromInterval);
		}
		this.triggerSelectedDateInterval();
		this.updateNoOfNights();
	}
	didChangeNoOfNights(noOfNights: number) {
		this.noOfNights = noOfNights;
		if (this.noOfNightsIsValid()) {
			this.dateInterval.end = this.dateInterval.start.buildPrototype();
			this.dateInterval.end = this._dateUtils.addDaysToThDateDO(this.dateInterval.end, this.noOfNights);
			this.didSelectEndDate(this.dateInterval.end);
		}
	}
	private updateNoOfNights() {
		this.noOfNights = this.dateInterval.getNumberOfDays();
	}
	noOfNightsIsValid(): boolean {
		return _.isNumber(this.noOfNights) && ThDataValidators.isValidInteger(this.noOfNights) && this.noOfNights >= 1 && this.noOfNights <= ThDateIntervalPickerComponent.MaxNoOfDaysFromInterval;
	}
}