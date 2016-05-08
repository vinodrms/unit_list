import {Component, Input, Output, EventEmitter, ElementRef, AfterViewInit, Inject} from '@angular/core';
import {TranslationPipe} from '../localization/TranslationPipe';
import {ThDateDO} from '../../../pages/internal/services/common/data-objects/th-dates/ThDateDO';
import {ThDatePipe} from '../pipes/ThDatePipe';

@Component({
    selector: 'th-date-picker',
    template: `   
		<div class="form-group">
			<label>{{ label | translate }}</label>
			<div class="input-group">
				<span class="input-group-addon"><small></small> <i class="fa fa-calendar-o"></i></span>
				<span class="form-control" style="padding-top: 0px;">{{ selectedThDate | thdate }}</span>
			</div>
		</div>
	`,
	pipes: [TranslationPipe, ThDatePipe]
})

export class ThDatePickerComponent implements AfterViewInit {
	@Input() label: string = "Select a date";

	private _initialThDate: ThDateDO;
	public get initialThDate(): ThDateDO {
		return this._initialThDate;
	}
	@Input()
	public set initialThDate(initialThDate: ThDateDO) {
		this._initialThDate = initialThDate;
		this.selectedThDate = initialThDate;
	}

	@Output() didSelectThDate = new EventEmitter();
	public triggerSelectedDate() {
		this.didSelectThDate.next(this.selectedThDate);
	}

	selectedThDate: ThDateDO;

	constructor( @Inject(ElementRef) private _elementRef: ElementRef) {
	}

	ngAfterViewInit() {
		this.initializeDatePicker();
	}
	private initializeDatePicker() {
		var options: Object = { singleDatePicker: true, showDropdowns: true };
		if (this.initialThDate && this.initialThDate.year) {
			var initialMoment = moment([this.initialThDate.year, this.initialThDate.month, this.initialThDate.day]);
			if (initialMoment.isValid()) {
				options["startDate"] = initialMoment;
			}
		}
		var jQueryElement: any = $(this._elementRef.nativeElement).find(".input-group");
		jQueryElement.daterangepicker(options, (start: moment.Moment, end: moment.Moment, label) => {
			this.didSelectMoment(start);
		});
	}
	private didSelectMoment(dateMoment: moment.Moment) {
		var newThDate = new ThDateDO();
		newThDate.day = dateMoment.date();
		newThDate.month = dateMoment.month();
		newThDate.year = dateMoment.year();
		this.selectedThDate = newThDate;
		this.triggerSelectedDate();
	}
}