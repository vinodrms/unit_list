import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {BookingStepType} from './BookingStepType';
import {IBookingStepService} from './IBookingStepService';
import {IBookingCustomerRegisterSelector, IBookingCustomerRegisterController} from './IBookingCustomerRegister';
import {BookingSearchStepService} from '../booking-search/services/BookingSearchStepService';
import {BookingFillDetailsStepService} from '../booking-fill-details/services/BookingFillDetailsStepService';
import {BookingCustomerRegisterStepService} from '../booking-customer-register/services/BookingCustomerRegisterStepService';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';

@Injectable()
export class BookingControllerService implements IBookingStepService, IBookingCustomerRegisterSelector, IBookingCustomerRegisterController {
	private _bookingSteps: IBookingStepService[];
	private _bookingStepIndex: number;
	private _customerObserver: Observer<CustomerDO>;

	constructor(private _appContext: AppContext,
		private _bookingSearchStep: BookingSearchStepService,
		private _fillDetailsStep: BookingFillDetailsStepService,
		private _custRegisterStep: BookingCustomerRegisterStepService) {
		this._bookingSteps = [
			_bookingSearchStep,
			_fillDetailsStep
		];
		this._bookingStepIndex = 0;
	}

	public getBookingStepType(): BookingStepType {
		return this.currentBookingStep.getBookingStepType();
	}
	public canMoveNext(): boolean {
		return this.currentBookingStep.canMoveNext();
	}
	public hasPreviousStep(): boolean {
		return this._bookingStepIndex > 0 || this.isCustomerRegister();
	}
	public getStepPath(): string[] {
		return this.currentBookingStep.getStepPath();
	}
	public getErrorString(): string {
		return this.currentBookingStep.getErrorString();
	}
	public didAppear() { }
	public didDisappear() { }
	private get currentBookingStep(): IBookingStepService {
		if (this.isCustomerRegister()) {
			return this._custRegisterStep;
		}
		return this._bookingSteps[this._bookingStepIndex];
	}

	public movePrevious() {
		if (this.isCustomerRegister()) {
			this._customerObserver.complete();
			this._customerObserver = null;
		}
		else if (this.hasPreviousStep()) {
			this.modifyBookingStep(-1);
		}
	}
	public moveNext() {
		if (this.canMoveNext() && this._bookingStepIndex < this._bookingSteps.length - 1) {
			this.modifyBookingStep(1);
		}
	}
	private modifyBookingStep(stepIndexOffset: number) {
		this.currentBookingStep.didDisappear();
		this._bookingStepIndex += stepIndexOffset;
		this.currentBookingStep.didAppear();
	}

	public selectCustomerFromRegister(): Observable<CustomerDO> {
		return new Observable<CustomerDO>((customerObserver: Observer<CustomerDO>) => {
			this._custRegisterStep.basePathList = this.currentBookingStep.getStepPath();
			this._customerObserver = customerObserver;
		});
	}
	private isCustomerRegister(): boolean {
		return !this._appContext.thUtils.isUndefinedOrNull(this._customerObserver);
	}
	public closeCustomerRegister() {
		if (this._customerObserver) {
			this._customerObserver.complete();
			this._customerObserver = null;
		}
	}
	public didSelectCustomer(customer: CustomerDO) {
		if (this._customerObserver) {
			this._customerObserver.next(customer);
			this.closeCustomerRegister();
		}
	}
}