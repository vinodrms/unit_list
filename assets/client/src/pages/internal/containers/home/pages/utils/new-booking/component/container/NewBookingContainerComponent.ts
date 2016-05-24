import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';

import {BookingStepType} from '../subcomponents/utils/BookingStepType';
import {BookingSearchStepService} from '../subcomponents/booking-search/services/BookingSearchStepService';
import {BookingFillDetailsStepService} from '../subcomponents/booking-fill-details/services/BookingFillDetailsStepService';
import {BookingControllerService} from '../subcomponents/utils/BookingControllerService';

import {NewBookingSearchComponent} from '../subcomponents/booking-search/NewBookingSearchComponent';
import {NewBookingFillDetailsComponent} from '../subcomponents/booking-fill-details/NewBookingFillDetailsComponent';

@Component({
	selector: 'new-booking-container',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/container/template/new-booking-container.html',
	providers: [BookingSearchStepService, BookingFillDetailsStepService,
		BookingControllerService],
	directives: [NewBookingSearchComponent, NewBookingFillDetailsComponent],
	pipes: [TranslationPipe]
})
export class NewBookingContainerComponent extends BaseComponent {
	@Input() showCloseButton: boolean = false;

	@Output() onCloseButtonPressed = new EventEmitter();
	public triggerOnCloseButtonPressed() {
		this.onCloseButtonPressed.next(null);
	}

	constructor(private _bookingCtrlService: BookingControllerService) {
		super();
	}

	public isBookingSearch(): boolean {
		return this._bookingCtrlService.getBookingStepType() === BookingStepType.Search;
	}
	public isFillDetails(): boolean {
		return this._bookingCtrlService.getBookingStepType() === BookingStepType.FillDetails;
	}

	public get pathString(): string {
		var pathString = "";
		var pathList: string[] = this._bookingCtrlService.getStepPath();
		pathList.forEach((path: string) => {
			pathString += "> " + path;
		});
		return pathString;
	}

	public hasPreviousPage(): boolean {
		return this._bookingCtrlService.hasPreviousStep();
	}
	public canMoveNext(): boolean {
		return this._bookingCtrlService.canMoveNext();
	}

	public movePrevious() {
		this._bookingCtrlService.movePrevious();
	}
	public moveNext() {
		this._bookingCtrlService.moveNext();
	}
}