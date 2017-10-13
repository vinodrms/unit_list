import { Component, Input, Output, EventEmitter, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { ThDateDO, ThMonth } from '../../../pages/internal/services/common/data-objects/th-dates/ThDateDO';
import { ThDateUtils } from '../../../pages/internal/services/common/data-objects/th-dates/ThDateUtils';

import moment from "moment";

declare var $: any;

@Component({
	selector: 'th-date-picker',
	template: `
		<div class="form-group">
			<label *ngIf="showLabel">{{ label | translate }}
				<span *ngIf="labelFont" class="unitpal-font" style="font-size: 18px;">{{labelFont}}</span>
			</label>
			<div class="input-group" th-clickable>
				<span *ngIf="showIcon" class="input-group-addon"><small></small> <i class="fa fa-calendar-o"></i></span>
				<span class="form-control" [ngClass]="{'disabled-text': readonly}">{{ selectedThDate | thdate }}</span>
			</div>
		</div>
	`
})
export class ThDatePickerComponent implements AfterViewInit {
	@Input() showLabel: boolean = true;
	@Input() label: string = "Select a date";
	@Input() labelFont: string;
	@Input() showIcon: boolean = true;

	private _initialThDate: ThDateDO;
	public get initialThDate(): ThDateDO {
		return this._initialThDate;
	}
	@Input()
	public set initialThDate(initialThDate: ThDateDO) {
		this._initialThDate = initialThDate;
		this.selectedThDate = initialThDate;
		this.initializeDatePicker();
	}

	private _minThDate: ThDateDO = ThDateDO.buildThDateDO(1900, ThMonth.January, 1);
	public get minThDate(): ThDateDO {
		return this._minThDate;
	}
	@Input()
	public set minThDate(minThDate: ThDateDO) {
		this._minThDate = minThDate;
		this.initializeDatePicker();
	}
	private _readonly: boolean;
	public get readonly(): boolean {
		return this._readonly;
	}
	@Input()
	public set readonly(readonly: boolean) {
		this._readonly = readonly;
		this.destroyIfNecessary();
		this.recreateIfNecessary();
	}

	@Output() didSelectThDate = new EventEmitter();
	public triggerSelectedDate() {
		this.didSelectThDate.next(this.selectedThDate);
	}
	private _selectedThDate: ThDateDO;
	public get selectedThDate(): ThDateDO {
		return this._selectedThDate;
	}
	@Input()
	public set selectedThDate(date: ThDateDO) {
		this._selectedThDate = date;
		if (this.getJQueryElement() && this.getJQueryElement().data('daterangepicker')) {
			this.getJQueryElement().data('daterangepicker').setStartDate(date);
			this.getJQueryElement().data('daterangepicker').setEndDate(date);
		}
	}

	private didInitView: boolean = false;
	private _thDateUtils = new ThDateUtils();
	private _didInitDateRangePickerElement: boolean = false;

	constructor( @Inject(ElementRef) private _elementRef: ElementRef) {
	}

	ngAfterViewInit() {
		this.didInitView = true;
		this.initializeDatePicker();
	}
	private initializeDatePicker() {
		if (!this.didInitView || this._readonly) {
			return;
		}
		var options: Object = {
			singleDatePicker: true,
			showDropdowns: true
		};
		if (this.validThDate(this._minThDate)) {
			options["minDate"] = this._thDateUtils.convertThDateDOToMoment(this._minThDate);
		}
		if (this.initialThDate && this.initialThDate.year) {
			var initialMoment = moment([this.initialThDate.year, this.initialThDate.month, this.initialThDate.day]);
			if (initialMoment.isValid()) {
				options["startDate"] = initialMoment;
			}
		}
		var jQueryElement: any = this.getJQueryElement();
		jQueryElement.daterangepicker(options, (start: moment.Moment, end: moment.Moment, label) => {
			this.didSelectMoment(start);
		});
		this._didInitDateRangePickerElement = true;
	}
	private getJQueryElement(): any {
		return $(this._elementRef.nativeElement).find(".input-group");
	}

	private didSelectMoment(dateMoment: moment.Moment) {
		var newThDate = new ThDateDO();
		newThDate.day = dateMoment.date();
		newThDate.month = dateMoment.month();
		newThDate.year = dateMoment.year();
		this.selectedThDate = newThDate;
		this.triggerSelectedDate();
	}
	private validThDate(thDateDO: ThDateDO): boolean {
		return thDateDO && thDateDO.isValid && thDateDO.isValid();
	}
	private destroyIfNecessary() {
		if (this.readonly && this._didInitDateRangePickerElement) {
			var jQueryElement: any = this.getJQueryElement();
			var datePickerObject: any = jQueryElement.data('daterangepicker');
			datePickerObject.remove();
			this._didInitDateRangePickerElement = false;
		}
	}
	private recreateIfNecessary() {
		if (!this.readonly && !this._didInitDateRangePickerElement) {
			this.initializeDatePicker();
		}
	}
}
