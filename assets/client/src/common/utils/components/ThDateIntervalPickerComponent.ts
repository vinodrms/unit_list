import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThDataValidators } from '../form-utils/utils/ThDataValidators';
import { ThDateDO } from '../../../pages/internal/services/common/data-objects/th-dates/ThDateDO';
import { ThDateIntervalDO } from '../../../pages/internal/services/common/data-objects/th-dates/ThDateIntervalDO';
import { ThDateUtils } from '../../../pages/internal/services/common/data-objects/th-dates/ThDateUtils';

import * as _ from "underscore";

@Component({
	selector: 'th-date-interval-picker',
	template: `
		<div class="row">
			<div [ngClass]="{'col-md-4 col-sm-6 col-xs-12': !showExpandedView, 'col-xs-12 col-sm-6': showExpandedView}">
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
			<div [ngClass]="{'col-md-4 col-sm-6 col-xs-12': !showExpandedView, 'col-xs-12 col-sm-6': showExpandedView}">
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
						<input type="number" class="form-control" [ngModel]="noOfNights" (ngModelChange)="didChangeNoOfNights($event)" name="noOfNights">
					</div>
					<label class="form-warning"><small><i class="fa fa-info-circle"></i> {{'Enter a valid number of nights' | translate}}</small></label>
				</div>
			</div>
		</div>
	`
})
export class ThDateIntervalPickerComponent implements OnInit {
	public static MaxNoOfDaysFromInterval = 186;

	private _dateUtils: ThDateUtils = new ThDateUtils();
	private _didReceiveInitialInterval = false;
	private _didInit = false;

	private _initialThDateInterval: ThDateIntervalDO;
	public get initialThDateInterval(): ThDateIntervalDO {
		return this._initialThDateInterval;
	}
	@Input()
	public set initialThDateInterval(initialThDateInterval: ThDateIntervalDO) {
		this._didReceiveInitialInterval = true;
		this._initialThDateInterval = initialThDateInterval;
		this.initDateInterval();
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
	@Input() allowSameEndDateAsStartDate: boolean = false;
	noOfNights: number = 0;

	@Output() didSelectThDateInterval = new EventEmitter();
	public triggerSelectedDateInterval() {
		this.didSelectThDateInterval.next(this.dateInterval);
	}

	dateInterval: ThDateIntervalDO;
	minEndDate: ThDateDO;

	constructor() {
		this.initDefaultDateInterval(this._dateUtils.getTodayThDayeDO());
	}
	private initDefaultDateInterval(startDate: ThDateDO) {
		this.dateInterval = this._dateUtils.getTodayToTomorrowInterval();
		this.minEndDate = this._dateUtils.addDaysToThDateDO(startDate.buildPrototype(), this.allowSameEndDateAsStartDate ? 0 : 1);
		this.updateNoOfNights();
	}

	public ngOnInit() {
		this._didInit = true;
		this.initDateInterval();
	}

	private initDateInterval() {
		if (!this._didReceiveInitialInterval || !this._didInit) { return; }
		if (this._initialThDateInterval && this._initialThDateInterval.isValid()) {
			this.dateInterval = this._initialThDateInterval;
			this.minEndDate = this._dateUtils.addDaysToThDateDO(this._initialThDateInterval.start.buildPrototype(), this.allowSameEndDateAsStartDate ? 0 : 1);
		}
		else {
			this.initDefaultDateInterval(this._dateUtils.getTodayThDayeDO());
			this.triggerSelectedDateInterval();
		}
		this.updateNoOfNights();
	}

	didSelectStartDate(startDate: ThDateDO) {
		this.dateInterval.start = startDate;
		this.minEndDate = this._dateUtils.addDaysToThDateDO(startDate.buildPrototype(), this.allowSameEndDateAsStartDate ? 0 : 1);

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