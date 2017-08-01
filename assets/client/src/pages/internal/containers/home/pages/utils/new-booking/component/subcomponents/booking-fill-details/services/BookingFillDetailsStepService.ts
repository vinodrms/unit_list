import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {IBookingStepService} from '../../utils/IBookingStepService';
import {BookingStepType} from '../../utils/BookingStepType';
import {BookingCartItemVM, BillingValidationResult} from '../../../../services/search/view-models/BookingCartItemVM';
import {BookingCartService} from '../../../../services/search/BookingCartService';

import * as _ from "underscore";

@Injectable()
export class BookingFillDetailsStepService implements IBookingStepService {
	private _stepPath: string[];

	private _canGoToNextStep: boolean = false;
	private _errorString: string = "";

	didAppearObservable: Observable<boolean>;
	private _didAppearObserver: Observer<boolean>;

	constructor(private _appContext: AppContext) {
		this._stepPath = [this._appContext.thTranslation.translate("Billing Details")];
		this.didAppearObservable = new Observable<boolean>((didAppearObserver: Observer<boolean>) => {
			this._didAppearObserver = didAppearObserver;
		});
	}

	public getBookingStepType(): BookingStepType {
		return BookingStepType.FillDetails;
	}
	public canMoveNext(): boolean {
		return this._canGoToNextStep;
	}
	public getStepPath(): string[] {
		return this._stepPath;
	}
	public getErrorString(): string {
		return this._appContext.thTranslation.translate(this._errorString);
	}
	public didAppear() {
		if (this._didAppearObserver) { this._didAppearObserver.next(true) };
	}
	public didDisappear() {}

	public checkBookingCartValidity(bookingCartService: BookingCartService) {
		if (bookingCartService.bookingItemVMList.length == 0) {
			this._canGoToNextStep = false;
			this._errorString = "";
			return;
		}
		var bookingCartIsValid: boolean = true;
		_.forEach(bookingCartService.bookingItemVMList, (bookingCartItem: BookingCartItemVM) => {
			var validationResult: BillingValidationResult = bookingCartItem.checkValidity();
			if(!validationResult.valid) {
				bookingCartIsValid = false;
				this._errorString = "Configure billing details for all the bookings";
			}
		});
		this._canGoToNextStep = bookingCartIsValid;
		if(this._canGoToNextStep) { this._errorString = ""; }
	}
}