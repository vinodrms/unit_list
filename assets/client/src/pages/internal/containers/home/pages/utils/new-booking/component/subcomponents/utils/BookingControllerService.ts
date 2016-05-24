import {Injectable} from '@angular/core';
import {BookingStepType} from './BookingStepType';
import {IBookingStepService} from './IBookingStepService';
import {BookingSearchStepService} from '../booking-search/services/BookingSearchStepService';
import {BookingFillDetailsStepService} from '../booking-fill-details/services/BookingFillDetailsStepService';

@Injectable()
export class BookingControllerService implements IBookingStepService {
	private _bookingSteps: IBookingStepService[];
	private _bookingStepIndex: number;

	constructor(private _bookingSearchStep: BookingSearchStepService,
		private _fillDetailsStep: BookingFillDetailsStepService) {
		this._bookingSteps = [
			_bookingSearchStep,
			_fillDetailsStep
		];
		this._bookingStepIndex = 0;
	}

	public getBookingStepType(): BookingStepType {
		return this._currentBookingStep.getBookingStepType();
	}
	public canMoveNext(): boolean {
		return this._currentBookingStep.canMoveNext();
	}
	public hasPreviousStep(): boolean {
		return this._bookingStepIndex > 0;
	}

	public getStepPath(): string[] {
		return this._currentBookingStep.getStepPath();
	}
	private get _currentBookingStep(): IBookingStepService {
		return this._bookingSteps[this._bookingStepIndex];
	}

	public movePrevious() {
		if (this.hasPreviousStep) {
			this._bookingStepIndex--;
		}
	}
	public moveNext() {
		if (this.canMoveNext() && this._bookingStepIndex < this._bookingSteps.length - 1) {
			this._bookingStepIndex++;
		}
	}
}