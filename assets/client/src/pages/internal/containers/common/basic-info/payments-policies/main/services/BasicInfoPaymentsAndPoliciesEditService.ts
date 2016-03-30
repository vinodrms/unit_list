import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext, ThServerApi, ThError} from '../../../../../../../../common/utils/AppContext';
import {PaymentMethodVMContainer} from '../services/utils/PaymentMethodVMContainer';
import {HotelDO} from '../../../../../../services/hotel/data-objects/hotel/HotelDO';
import {HotelService} from '../../../../../../services/hotel/HotelService';
import {HotelDetailsDO} from '../../../../../../services/hotel/data-objects/HotelDetailsDO';

@Injectable()
export class BasicInfoPaymentsAndPoliciesEditService {
	public didSubmitForm: boolean = false;

	private _paymentMethods: PaymentMethodVMContainer;
	private _hotel: HotelDO;

    constructor(private _appContext: AppContext,
		private _hotelService: HotelService) {
	}
	public bootstrap(paymentMethods: PaymentMethodVMContainer, hotel: HotelDO) {
		this._paymentMethods = paymentMethods;
		this._hotel = hotel;
	}
	public didUpdateCcyCode(ccyCode: string) {
		this._hotel.ccyCode = ccyCode;
	}

	public didSelectPaymentMethod(): boolean {
		return this._paymentMethods.getSelectedPaymentMethodIdList().length > 0;
	}

	private isValid() {
		return this._hotel.ccyCode && this._paymentMethods.getSelectedPaymentMethodIdList().length > 0;
	}
	public savePaymentsAndPolicies(): Observable<any> {
		this.didSubmitForm = true;
		if (!this.isValid()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return this.reject();
		}
		this._hotel.paymentMethodIdList = this._paymentMethods.getSelectedPaymentMethodIdList();
		return new Observable<any>((observer: Observer<any>) => {
			this._hotelService.updatePaymentsAndPolicies(this._hotel).subscribe((hotel: HotelDetailsDO) => {
				observer.next(hotel);
				observer.complete();
			}, (error: ThError) => {
				this._appContext.toaster.error(error.message);
				observer.error(error);
				observer.complete();
			});
		});
	}
	private reject(): Observable<any> {
		return new Observable((serviceObserver: Observer<any>) => {
			serviceObserver.error(true);
			serviceObserver.complete();
		});
	}
}