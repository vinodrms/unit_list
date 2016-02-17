import {RepositoryCleanerWrapper} from './RepositoryCleanerWrapper';
import {TestContext} from '../helpers/TestContext';
import {DefaultHotelBuilder} from './builders/DefaultHotelBuilder';
import {HotelDO} from '../../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../../core/data-layer/hotel/data-objects/user/UserDO';
import {PaymentMethodDO} from '../../core/data-layer/common/data-objects/payment-method/PaymentMethodDO';

import async = require('async');

export class DefaultDataBuilder {
	private _repositoryCleaner: RepositoryCleanerWrapper;

	private _password: string = "TestTest,01";
	private _email: string = "paraschiv.ionut@gmail.com";
	private _hotelDO: HotelDO;
	private _userDO: UserDO;
	private _paymentMethods: PaymentMethodDO[];

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
		async.waterfall([
			((cleanRepoCallback) => {
				this._repositoryCleaner.cleanRepositoryAsync(cleanRepoCallback);
			}),
			((prevResult: any, finishBuildHotel) => {
				var hotelBuilder = new DefaultHotelBuilder(this._testContext.appContext, this._password, this._email);
				var hotel = hotelBuilder.getHotel();
				this._testContext.appContext.getRepositoryFactory().getHotelRepository().addHotelAsync(hotel, finishBuildHotel);
			}),
			((savedHotel: HotelDO, finishBuildSessionDO) => {
				this._hotelDO = savedHotel;
				this._userDO = savedHotel.userList[0];
				this._testContext.updateSessionContext({ user: this._userDO, hotel: this._hotelDO });
				finishBuildSessionDO(null, true);
			}),
			((result: any, getPaymentMethodsCallback) => {
				var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
				settingsRepository.getPaymentMethodsAsync(getPaymentMethodsCallback);
			}),
			((paymentMethods: PaymentMethodDO[], finishBuildOtherDO) => {
				this._paymentMethods = paymentMethods;
				// TODO: add other necessary build steps (e.g.: beds, price products etc.)
				finishBuildOtherDO(null, true);
			})
		], ((error: any, result: any) => {
			if (error) {
				reject(error);
			}
			else {
				resolve(result);
			}
		}));
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
	public get paymentMethods(): PaymentMethodDO[] {
		return this._paymentMethods;
	}
}