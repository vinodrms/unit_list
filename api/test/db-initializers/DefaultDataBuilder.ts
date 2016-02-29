import {RepositoryCleanerWrapper} from './RepositoryCleanerWrapper';
import {TestContext} from '../helpers/TestContext';
import {DefaultHotelBuilder} from './builders/DefaultHotelBuilder';
import {DefaultBedBuilder} from './builders/DefaultBedBuilder';
import {HotelDO} from '../../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../../core/data-layer/hotel/data-objects/user/UserDO';
import {PaymentMethodDO} from '../../core/data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {AddOnProductCategoryDO} from '../../core/data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {AmenityDO} from '../../core/data-layer/common/data-objects/amenity/AmenityDO';
import {BedTemplateDO} from '../../core/data-layer/common/data-objects/bed-template/BedTemplateDO';
import {BedDO} from '../../core/data-layer/common/data-objects/bed/BedDO';
import {DefaultTaxBuilder} from './builders/DefaultTaxBuilder';
import {TaxResponseRepoDO} from '../../core/data-layer/taxes/repositories/ITaxRepository';
import {DefaultAddOnProductBuilder} from './builders/DefaultAddOnProductBuilder';
import {AddOnProductDO} from '../../core/data-layer/add-on-products/data-objects/AddOnProductDO';

export class DefaultDataBuilder {
	private static FirstUserIndex = 0;
	private _repositoryCleaner: RepositoryCleanerWrapper;

	private _password: string = "TestTest,01";
	private _email: string = "paraschiv.ionut@gmail.com";
	private _hotelDO: HotelDO;
	private _userDO: UserDO;
	private _paymentMethodList: PaymentMethodDO[];
	private _hotelAmenityList: AmenityDO[];
    private _bedTemplateList: BedTemplateDO[];
    private _bedList: BedDO[];
	private _taxes: TaxResponseRepoDO;
	private _addOnProductCategoryList: AddOnProductCategoryDO[];  
	private _addOnProductList: AddOnProductDO[];

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

				var taxBuilder = new DefaultTaxBuilder(this._testContext);
				return taxBuilder.loadTaxes(taxBuilder, this._testContext);
			}).then((loadedTaxes: TaxResponseRepoDO) => {
				this._taxes = loadedTaxes;

				var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
				return settingsRepository.getAddOnProductCategories();
			}).then((addOnProductCategoryList: AddOnProductCategoryDO[]) => {
				this._addOnProductCategoryList = addOnProductCategoryList;

				var addOnProductBuilder = new DefaultAddOnProductBuilder(this._testContext);
				return addOnProductBuilder.loadAddOnProducts(addOnProductBuilder, this._addOnProductCategoryList, this._taxes);
			}).then((addOnProductList: AddOnProductDO[]) => {
				this._addOnProductList = addOnProductList;
				
				var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
                return settingsRepository.getBedTemplates();
			}).then((bedTemplateList: BedTemplateDO[]) => {
                this._bedTemplateList = bedTemplateList;
                
                var bedBuilder = new DefaultBedBuilder(this._testContext.appContext, this._bedTemplateList);
                var bedListToBeAdded = bedBuilder.getBedList();
                var bedRepository = this._testContext.appContext.getRepositoryFactory().getBedRepository();
                var addBedsPromiseList: Promise<BedDO>[] = [];
                bedListToBeAdded.forEach((bedToBeAdded: BedDO) => {
                    addBedsPromiseList.push(bedRepository.addBed({ hotelId: this._hotelDO.id}, bedToBeAdded));    
                });
                return Promise.all(addBedsPromiseList);
            }).then((addedBeds: BedDO[]) => {
                this._bedList = addedBeds;
                
                // TODO: add other necessary build steps (e.g.: beds, price products etc.)
                resolve(true);
            })
            .catch((err: any) => {
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
    public get bedTemplateList(): BedTemplateDO[] {
        return this._bedTemplateList;
    }
    public get bedList(): BedDO[] {
        return this._bedList;
    }
	public get taxes(): TaxResponseRepoDO {
		return this._taxes;
	}
	public get addOnProductCategoryList(): AddOnProductCategoryDO[] {
		return this._addOnProductCategoryList;
	}
	public get addOnProductList(): AddOnProductDO[] {
		return this._addOnProductList;
	}
}