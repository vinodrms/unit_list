import {RepositoryCleanerWrapper} from './RepositoryCleanerWrapper';
import {TestContext} from '../helpers/TestContext';
import {DefaultHotelBuilder} from './builders/DefaultHotelBuilder';
import {DefaultBedBuilder} from './builders/DefaultBedBuilder';
import {DefaultRoomBuilder} from './builders/DefaultRoomBuilder';
import {DefaultRoomCategoryBuilder} from './builders/DefaultRoomCategoryBuilder';
import {HotelDO} from '../../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../../core/data-layer/hotel/data-objects/user/UserDO';
import {PaymentMethodDO} from '../../core/data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {AddOnProductCategoryDO} from '../../core/data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {AmenityDO} from '../../core/data-layer/common/data-objects/amenity/AmenityDO';
import {BedTemplateDO} from '../../core/data-layer/common/data-objects/bed-template/BedTemplateDO';
import {BedDO} from '../../core/data-layer/common/data-objects/bed/BedDO';
import {RoomDO} from '../../core/data-layer/rooms/data-objects/RoomDO';
import {RoomAttributeDO} from '../../core/data-layer/common/data-objects/room-attribute/RoomAttributeDO';
import {RoomCategoryDO} from '../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {DefaultTaxBuilder} from './builders/DefaultTaxBuilder';
import {TaxResponseRepoDO} from '../../core/data-layer/taxes/repositories/ITaxRepository';
import {DefaultAddOnProductBuilder} from './builders/DefaultAddOnProductBuilder';
import {AddOnProductDO} from '../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import {DefaultCustomerBuilder} from './builders/DefaultCustomerBuilder';
import {CustomerDO} from '../../core/data-layer/customers/data-objects/CustomerDO';
import {RoomAggregator} from '../../core/domain-layer/rooms/aggregators/RoomAggregator';
import {RoomCategoryStatsDO} from '../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {DefaultPriceProductBuilder} from './builders/DefaultPriceProductBuilder';
import {PriceProductDO} from '../../core/data-layer/price-products/data-objects/PriceProductDO';

import _ = require("underscore");

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
    private _roomList: RoomDO[];
    private _roomCategoryList: RoomCategoryDO[];
	private _roomCategoryStatsList: RoomCategoryStatsDO[];
    private _roomAttributeList: RoomAttributeDO[];
    private _roomAmenityList: AmenityDO[];
    private _taxes: TaxResponseRepoDO;
    private _addOnProductCategoryList: AddOnProductCategoryDO[];
    private _addOnProductList: AddOnProductDO[];
    private _customerList: CustomerDO[];
	private _priceProductList: PriceProductDO[];

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

                var bedBuilder = new DefaultBedBuilder(this._testContext);
                return bedBuilder.loadBeds(bedBuilder, bedTemplateList);
            }).then((addedBeds: BedDO[]) => {
                this._bedList = addedBeds;

                var roomCategoryBuilder = new DefaultRoomCategoryBuilder(this._testContext);
                return roomCategoryBuilder.loadRoomCategories(roomCategoryBuilder);
            }).then((addedRoomCategories: RoomCategoryDO[]) => {
                this._roomCategoryList = addedRoomCategories;

                var customerBuilder = new DefaultCustomerBuilder(this._testContext);
                return customerBuilder.loadCustomers(customerBuilder);
            }).then((customerList: CustomerDO[]) => {
                this._customerList = customerList;

                var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
                return settingsRepository.getRoomAmenities();
            }).then((roomAmenityList: AmenityDO[]) => {
                this._roomAmenityList = roomAmenityList;

                var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
                return settingsRepository.getRoomAttributes();
            }).then((roomAttributeList: RoomAttributeDO[]) => {
                this._roomAttributeList = roomAttributeList;

                var roomBuilder = new DefaultRoomBuilder(this._testContext);
                return roomBuilder.loadRooms(roomBuilder, this._bedList, this._roomCategoryList, this._roomAttributeList, this._roomAmenityList);
            }).then((roomList: RoomDO[]) => {
                this._roomList = roomList;

				var roomCategoryIdList: string[] = _.map(this._roomList, (room: RoomDO) => { return room.categoryId });
				var aggregator = new RoomAggregator(this._testContext.appContext);
				return aggregator.getRoomCategoryStatsList({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, roomCategoryIdList);
			}).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
				this._roomCategoryStatsList = roomCategoryStatsList;

				var priceProductBuilder = new DefaultPriceProductBuilder(this._testContext);
				return priceProductBuilder.loadPriceProducts(priceProductBuilder, this._roomCategoryStatsList, this._taxes, this._addOnProductList);
			}).then((priceProductList: PriceProductDO[]) => {
				this._priceProductList = priceProductList;

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
    public get bedTemplateList(): BedTemplateDO[] {
        return this._bedTemplateList;
    }
    public get bedList(): BedDO[] {
        return this._bedList;
    }
    public get roomCategoryList(): RoomCategoryDO[] {
        return this._roomCategoryList;
    }
	public get roomCategoryStatsList(): RoomCategoryStatsDO[] {
        return this._roomCategoryStatsList;
    }
    public get roomAttributeList(): RoomAttributeDO[] {
        return this._roomAttributeList;
    }
    public get roomAmenityList(): AmenityDO[] {
        return this._roomAmenityList;
    }
    public get roomList(): RoomDO[] {
        return this._roomList;
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
    public get customerList(): CustomerDO[] {
        return this._customerList;
    }
	public get priceProductList(): PriceProductDO[] {
        return this._priceProductList;
    }
}