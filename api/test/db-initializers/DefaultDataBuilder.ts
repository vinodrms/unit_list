import {RepositoryCleanerWrapper} from './RepositoryCleanerWrapper';
import {TestContext} from '../helpers/TestContext';
import {DefaultHotelBuilder} from './builders/DefaultHotelBuilder';
import {DefaultBedConfigurationBuilder} from './builders/DefaultBedConfigurationBuilder';
import {HotelDO} from '../../core/data-layer/hotel/data-objects/HotelDO';
import {BedConfigurationDO} from '../../core/data-layer/bed-configuration/data-objects/BedConfigurationDO';
import {UserDO} from '../../core/data-layer/hotel/data-objects/user/UserDO';
import {PaymentMethodDO} from '../../core/data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {BedTemplateDO} from '../../core/data-layer/common/data-objects/bed-template/BedTemplateDO';
import {AmenityDO} from '../../core/data-layer/common/data-objects/amenity/AmenityDO';

import async = require('async');

export class DefaultDataBuilder {
	private static FirstUserIndex = 0;
	private _repositoryCleaner: RepositoryCleanerWrapper;

	private _password: string = "TestTest,01";
	private _email: string = "paraschiv.ionut@gmail.com";
	private _hotelDO: HotelDO;
	private _userDO: UserDO;
    private _bedConfigurationDO: BedConfigurationDO;
	private _paymentMethodList: PaymentMethodDO[];
    private _bedTemplateList: BedTemplateDO[];    
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
				this._userDO = savedHotel.userList[DefaultDataBuilder.FirstUserIndex];
				this._testContext.updateSessionContext({ user: this._userDO, hotel: this._hotelDO });
				finishBuildSessionDO(null, true);
			}),
			((result: any, getPaymentMethodsCallback) => {
				var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
				settingsRepository.getPaymentMethodsAsync(getPaymentMethodsCallback);
			}),
			((paymentMethods: PaymentMethodDO[], getHotelAmenityListCallback) => {
				this._paymentMethodList = paymentMethods;
				var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
				settingsRepository.getHotelAmenitiesAsync(getHotelAmenityListCallback);
			}),
			((hotelAmenityList: AmenityDO[], finishBuildOtherDO) => {
				this._hotelAmenityList = hotelAmenityList;
				// TODO: add other necessary build steps (e.g.: beds, price products etc.)
				finishBuildOtherDO(null, true);
			}),
            ((result: any, getBedTemplatesCallback) => {
				var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
				settingsRepository.getBedTemplatesAsync(getBedTemplatesCallback);
			}),
			((bedTemplates: BedTemplateDO[], finishBuildOtherDO) => {
				this._bedTemplateList = bedTemplates;
				var bedConfigurationBuilder: DefaultBedConfigurationBuilder = new DefaultBedConfigurationBuilder(this._testContext.appContext, this._hotelDO.id, this._bedTemplateList);
                var bedConfiguration: BedConfigurationDO = bedConfigurationBuilder.getBedConfiguration();
                this._testContext.appContext.getRepositoryFactory().getBedConfigurationRepository().addBedConfigurationAsync(bedConfiguration, finishBuildOtherDO);
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
	public get paymentMethodList(): PaymentMethodDO[] {
		return this._paymentMethodList;
	}
    public get bedTemplateList(): BedTemplateDO[] {
        return this._bedTemplateList;
    }
	public get hotelAmenityList(): AmenityDO[] {
		return this._hotelAmenityList;
	}
}