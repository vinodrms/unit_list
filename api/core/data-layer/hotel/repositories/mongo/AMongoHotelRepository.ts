import {MongoRepository} from '../../../common/base/MongoRepository';
import {IRepositoryCleaner} from '../../../common/base/IRepositoryCleaner';
import {HotelDO} from '../../data-objects/HotelDO';
import {UserDO} from '../../data-objects/user/UserDO';
import {IHotelRepository, HotelMetaRepoDO, BasicHotelInfoRepoDO, UserAccountActivationRepoDO,
RequestResetPasswordRepoDO, ResetPasswordRepoDO, PaymentsPoliciesRepoDO, PaymentMethodIdListRepoDO, TaxMetaRepoDO, TaxRepoDO} from '../IHotelRepository';
import {ActionTokenDO} from '../../data-objects/user/ActionTokenDO';
import {HotelContactDetailsDO} from '../../data-objects/hotel-contact-details/HotelContactDetailsDO';
import {GeoLocationDO} from '../../../common/data-objects/geo-location/GeoLocationDO';

export abstract class AMongoHotelRepository extends MongoRepository implements IHotelRepository, IRepositoryCleaner {
	public addHotelAsync(hotel: HotelDO, finishAddHotelCallback: { (err: any, savedHotel?: HotelDO): void; }) {
		this.addHotel(hotel).then((savedHotel: HotelDO) => {
			finishAddHotelCallback(null, savedHotel);
		}).catch((error: any) => {
			finishAddHotelCallback(error);
		});
	}
	protected abstract addHotel(hotel: HotelDO): Promise<HotelDO>;

	public getHotelByUserEmailAsync(email: string, finishGetHotelByUserEmailCallback: { (err: any, hotel?: HotelDO): void; }) {
		this.getHotelByUserEmail(email).then((hotel: HotelDO) => {
			finishGetHotelByUserEmailCallback(null, hotel);
		}).catch((error: any) => {
			finishGetHotelByUserEmailCallback(error);
		});
	}
	public abstract getHotelByUserEmail(email: string): Promise<HotelDO>;

	public getHotelByIdAsync(id: string, finishGetHotelByIdCallback: { (err: any, hotel?: HotelDO): void; }) {
		this.getHotelById(id).then((hotel: HotelDO) => {
			finishGetHotelByIdCallback(null, hotel);
		}).catch((error: any) => {
			finishGetHotelByIdCallback(error);
		});
	}
	protected abstract getHotelById(id: string): Promise<HotelDO>;

	public abstract cleanRepository(): Promise<Object>;

	public abstract activateUserAccount(activationParams: UserAccountActivationRepoDO): Promise<UserDO>;

	public requestResetPasswordAsync(reqParams: RequestResetPasswordRepoDO, finishUpdateTokenCallback: { (err: any, user?: UserDO): void; }) {
		this.requestResetPassword(reqParams).then((updatedUser: UserDO) => {
			finishUpdateTokenCallback(null, updatedUser);
		}).catch((error: any) => {
			finishUpdateTokenCallback(error);
		});
	}
	protected abstract requestResetPassword(reqParams: RequestResetPasswordRepoDO): Promise<UserDO>;

	public resetPasswordAsync(resetParams: ResetPasswordRepoDO, finishResetPasswordCallback: { (err: any, user?: UserDO): void; }) {
		this.resetPassword(resetParams).then((updatedUser: UserDO) => {
			finishResetPasswordCallback(null, updatedUser);
		}).catch((error: any) => {
			finishResetPasswordCallback(error);
		});
	}
	protected abstract resetPassword(resetParams: ResetPasswordRepoDO): Promise<UserDO>;

	public updateBasicInformationAsync(hotelMeta: HotelMetaRepoDO, basicInfo: BasicHotelInfoRepoDO, updateBasicInformationCallback: { (err: any, updatedHotel?: HotelDO): void; }) {
		this.updateBasicInformation(hotelMeta, basicInfo).then((updatedHotel: HotelDO) => {
			updateBasicInformationCallback(null, updatedHotel);
		}).catch((error: any) => {
			updateBasicInformationCallback(error);
		});
	}
	protected abstract updateBasicInformation(hotelMeta: HotelMetaRepoDO, basicInfo: BasicHotelInfoRepoDO): Promise<HotelDO>;

	public addPaymentsPoliciesAsync(hotelMeta: HotelMetaRepoDO, paymPoliciesParams: PaymentsPoliciesRepoDO, addPaymentsPoliciesCallback: { (err: any, updatedHotel?: HotelDO): void; }) {
		this.addPaymentsPolicies(hotelMeta, paymPoliciesParams).then((updatedHotel: HotelDO) => {
			addPaymentsPoliciesCallback(null, updatedHotel);
		}).catch((error: any) => {
			addPaymentsPoliciesCallback(error);
		});
	}
	protected abstract addPaymentsPolicies(hotelMeta: HotelMetaRepoDO, paymPoliciesParams: PaymentsPoliciesRepoDO): Promise<HotelDO>;

	public updatePaymentMethodIdListAsync(hotelMeta: HotelMetaRepoDO, updatePaymMethodParams: PaymentMethodIdListRepoDO, updatePaymMethodsCallback: { (err: any, updatedHotel?: HotelDO): void; }) {
		this.updatePaymentMethodIdList(hotelMeta, updatePaymMethodParams).then((updatedHotel: HotelDO) => {
			updatePaymMethodsCallback(null, updatedHotel);
		}).catch((error: any) => {
			updatePaymMethodsCallback(error);
		});
	}
	protected abstract updatePaymentMethodIdList(hotelMeta: HotelMetaRepoDO, updatePaymMethodParams: PaymentMethodIdListRepoDO): Promise<HotelDO>;

	public updateTaxesVatItemAsync(hotelMeta: HotelMetaRepoDO, vatMeta: TaxMetaRepoDO, newVat: TaxRepoDO, updateVatCallback: { (err: any, updatedHotel?: HotelDO): void; }) {
		this.updateTaxesVatItem(hotelMeta, vatMeta, newVat).then((updatedHotel: HotelDO) => {
			updateVatCallback(null, updatedHotel);
		}).catch((error: any) => {
			updateVatCallback(error);
		});
	}
	protected abstract updateTaxesVatItem(hotelMeta: HotelMetaRepoDO, vatMeta: TaxMetaRepoDO, newVat: TaxRepoDO): Promise<HotelDO>;

	public updateTaxesOtherTaxItemAsync(hotelMeta: HotelMetaRepoDO, taxMeta: TaxMetaRepoDO, newTax: TaxRepoDO, updateTaxesCallback: { (err: any, updatedHotel?: HotelDO): void; }) {
		this.updateTaxesOtherTaxItem(hotelMeta, taxMeta, newTax).then((updatedHotel: HotelDO) => {
			updateTaxesCallback(null, updatedHotel);
		}).catch((error: any) => {
			updateTaxesCallback(error);
		});
	}
	protected abstract updateTaxesOtherTaxItem(hotelMeta: HotelMetaRepoDO, taxMeta: TaxMetaRepoDO, newTax: TaxRepoDO): Promise<HotelDO>;

	public addTaxesVatItemAsync(hotelMeta: HotelMetaRepoDO, newVat: TaxRepoDO, addVatCallback: { (err: any, updatedHotel?: HotelDO): void; }) {
		this.addTaxesVatItem(hotelMeta, newVat).then((updatedHotel: HotelDO) => {
			addVatCallback(null, updatedHotel);
		}).catch((error: any) => {
			addVatCallback(error);
		});
	}
	protected abstract addTaxesVatItem(hotelMeta: HotelMetaRepoDO, newVat: TaxRepoDO): Promise<HotelDO>;

	public addTaxesOtherTaxItemAsync(hotelMeta: HotelMetaRepoDO, newTax: TaxRepoDO, addTaxesCallback: { (err: any, updatedHotel?: HotelDO): void; }) {
		this.addTaxesOtherTaxItem(hotelMeta, newTax).then((updatedHotel: HotelDO) => {
			addTaxesCallback(null, updatedHotel);
		}).catch((error: any) => {
			addTaxesCallback(error);
		});
	}
	protected abstract addTaxesOtherTaxItem(hotelMeta: HotelMetaRepoDO, newTax: TaxRepoDO): Promise<HotelDO>;
}