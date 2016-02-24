import {RepositoryCleanerWrapper} from './RepositoryCleanerWrapper';
import {TestContext} from '../helpers/TestContext';
import {DefaultHotelBuilder} from './builders/DefaultHotelBuilder';
import {HotelDO} from '../../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../../core/data-layer/hotel/data-objects/user/UserDO';
import {PaymentMethodDO} from '../../core/data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {AmenityDO} from '../../core/data-layer/common/data-objects/amenity/AmenityDO';

export class DefaultDataBuilder {
	private static FirstUserIndex = 0;
	private _repositoryCleaner: RepositoryCleanerWrapper;

	private _password: string = "TestTest,01";
	private _email: string = "paraschiv.ionut@gmail.com";
	private _hotelDO: HotelDO;
	private _userDO: UserDO;
	private _paymentMethodList: PaymentMethodDO[];
	private _hotelAmenityList: AmenityDO[];

	constructor(private _testContext: TestContext) {
		this._repositoryCleaner = new RepositoryCleanerWrapper(this._testContext.appContext.getUnitPalConfig());
	}
	public buildWithDoneCallback(done) {
		this.build().then((result: any) => {
			done();
		}).catch((e) => {
			done(e);
		});
	}
	private build(): Promise<Object> {
		return new Promise<Object>((resolve, reject) => {
			this.buildCore(resolve, reject);
		});
	}
	private buildCore(resolve: { (result: boolean): void }, reject: { (err: any): void }) {
		this._repositoryCleaner.cleanRepository()
			.then((result: any) => {
				var hotelBuilder = new DefaultHotelBuilder(this._testContext.appContext, this._password, this._email);
				var hotel = hotelBuilder.getHotel();

				return this._testContext.appContext.getRepositoryFactory().getHotelRepository().addHotel(hotel);
			}).then((savedHotel: HotelDO) => {
				this._hotelDO = savedHotel;
				this._userDO = savedHotel.userList[DefaultDataBuilder.FirstUserIndex];
				this._testContext.updateSessionContext({ user: this._userDO, hotel: this._hotelDO });

				return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: any): void }) => { resolve(true); });
			}).then((prevResult: any) => {
				var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();

				return settingsRepository.getPaymentMethods();
			}).then((paymentMethodList: PaymentMethodDO[]) => {
				this._paymentMethodList = paymentMethodList;

				var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
				return settingsRepository.getHotelAmenities();
			}).then((hotelAmenityList: AmenityDO[]) => {
				this._hotelAmenityList = hotelAmenityList;
				
				// TODO: add other necessary build steps (e.g.: beds, price products etc.)
				resolve(true);
			}).catch((err: any) => {
				reject(err);
			});
	}

	public get password(): string {
		return this._password;
	}
	public get email(): string {
		return this._email;
	}
	public get hotelDO(): HotelDO {
		return this._hotelDO;
	}
	public get userDO(): UserDO {
		return this._userDO;
	}
	public get paymentMethodList(): PaymentMethodDO[] {
		return this._paymentMethodList;
	}
	public get hotelAmenityList(): AmenityDO[] {
		return this._hotelAmenityList;
	}
}