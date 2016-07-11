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
import {YieldFilterDO} from '../../core/data-layer/common/data-objects/yield-filter/YieldFilterDO';
import {RoomCategoryStatsAggregator} from '../../core/domain-layer/room-categories/aggregators/RoomCategoryStatsAggregator';
import {RoomCategoryStatsDO} from '../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {DefaultPriceProductBuilder} from './builders/DefaultPriceProductBuilder';
import {PriceProductDO} from '../../core/data-layer/price-products/data-objects/PriceProductDO';
import {HotelConfigurationsBootstrap} from '../../core/domain-layer/hotel-configurations/HotelConfigurationsBootstrap';
import {YieldFilterConfigurationDO} from '../../core/data-layer/hotel-configurations/data-objects/yield-filter/YieldFilterConfigurationDO';
import {DefaultAllotmentBuilder} from './builders/DefaultAllotmentBuilder';
import {AllotmentDO} from '../../core/data-layer/allotments/data-objects/AllotmentDO';
import {DefaultBookingBuilder} from './builders/DefaultBookingBuilder';
import {BookingDO} from '../../core/data-layer/bookings/data-objects/BookingDO';

import _ = require("underscore");

export class DefaultDataBuilder {
    private static FirstUserIndex = 0;
    private _repositoryCleaner: RepositoryCleanerWrapper;

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
    private _defaultYieldFilters: YieldFilterDO[];
    private _yieldFilters: YieldFilterDO[];
    private _priceProductList: PriceProductDO[];
    private _allotmentList: AllotmentDO[];
    private _bookingList: BookingDO[];

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
                var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();

                return settingsRepository.getPaymentMethods();
            }).then((paymentMethodList: PaymentMethodDO[]) => {
                this._paymentMethodList = paymentMethodList;

                var hotelBuilder = new DefaultHotelBuilder(this._testContext.appContext, this._email, this._paymentMethodList);
                var hotel = hotelBuilder.getHotel();
                return this._testContext.appContext.getRepositoryFactory().getHotelRepository().addHotel(hotel);
            }).then((savedHotel: HotelDO) => {
                this._hotelDO = savedHotel;
                this._userDO = savedHotel.userList[DefaultDataBuilder.FirstUserIndex];
                this._testContext.updateSessionContext({ user: this._userDO, hotel: this._hotelDO });

                return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: any): void }) => { resolve(true); });
            }).then((prevResult: any) => {
                var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
                return settingsRepository.getDefaultYieldFilters();
            }).then((yieldFilterList: YieldFilterDO[]) => {
                this._defaultYieldFilters = yieldFilterList;

                var hotelConfigBootstrap = new HotelConfigurationsBootstrap(this._testContext.appContext, this._hotelDO.id);
                return hotelConfigBootstrap.bootstrap();
            }).then((bootstrapResult: boolean) => {

                var yieldFiltersRepository = this._testContext.appContext.getRepositoryFactory().getYieldFilterConfigurationsRepository();
                return yieldFiltersRepository.getYieldFilterConfiguration({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id });
            }).then((yieldFilterConfiguration: YieldFilterConfigurationDO) => {
                this._yieldFilters = yieldFilterConfiguration.value;

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
                return roomCategoryBuilder.loadRoomCategories(roomCategoryBuilder, this._bedList);
            }).then((addedRoomCategories: RoomCategoryDO[]) => {
                this._roomCategoryList = addedRoomCategories;
                console.log('before reading the new bed');
                
                var bedIdList: string[] = _.map(this._bedList, (bed: BedDO) => { return bed.id });
                return this._testContext.appContext.getRepositoryFactory().getBedRepository().getBedById({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, bedIdList[0]);
            }).then((result: any) => {
                console.log('after reading the new bed:  ' + JSON.stringify(result));
                
                var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
                return settingsRepository.getRoomAmenities();
            }).then((roomAmenityList: AmenityDO[]) => {
                this._roomAmenityList = roomAmenityList;

                var settingsRepository = this._testContext.appContext.getRepositoryFactory().getSettingsRepository();
                return settingsRepository.getRoomAttributes();
            }).then((roomAttributeList: RoomAttributeDO[]) => {
                this._roomAttributeList = roomAttributeList;

                var roomBuilder = new DefaultRoomBuilder(this._testContext);
                return roomBuilder.loadRooms(roomBuilder, this._roomCategoryList, this._roomAttributeList, this._roomAmenityList);
            }).then((roomList: RoomDO[]) => {
                this._roomList = roomList;

                var roomCategoryIdList: string[] = _.map(this._roomList, (room: RoomDO) => { return room.categoryId });
                var distinctRoomCategoryIdList = _.uniq(roomCategoryIdList, function (roomCategoryId) { return roomCategoryId; });
                var aggregator = new RoomCategoryStatsAggregator(this._testContext.appContext, this._testContext.sessionContext);

                return aggregator.getRoomCategoryStatsList(distinctRoomCategoryIdList);
            }).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
                this._roomCategoryStatsList = roomCategoryStatsList;

                var priceProductBuilder = new DefaultPriceProductBuilder(this._testContext);
                return priceProductBuilder.loadPriceProducts(priceProductBuilder, this._roomCategoryStatsList, this._taxes, this._addOnProductList);
            })
            .then((priceProductList: PriceProductDO[]) => {
                this._priceProductList = priceProductList;

                var customerBuilder = new DefaultCustomerBuilder(this._testContext, this._priceProductList);
                return customerBuilder.loadCustomers(customerBuilder);
            }).then((customerList: CustomerDO[]) => {
                this._customerList = customerList;

                var allotmentBuilder = new DefaultAllotmentBuilder(this._testContext);
                return allotmentBuilder.loadAllotments(allotmentBuilder, this._priceProductList, this._customerList);
            }).then((allotmentList: AllotmentDO[]) => {
                this._allotmentList = allotmentList;

                //     var bookingBuilder = new DefaultBookingBuilder(this._testContext);
                //     return bookingBuilder.loadBookings(bookingBuilder, this._hotelDO, this._customerList, this.roomCategoryList, this.priceProductList);
                // }).then((bookingList: BookingDO[]) => {
                //     this._bookingList = bookingList;

                resolve(true);
            }).catch((err: any) => {
                reject(err);
            });
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
    public get defaultYieldFilters(): YieldFilterDO[] {
        return this._defaultYieldFilters;
    }
    public get yieldFilters(): YieldFilterDO[] {
        return this._yieldFilters;
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
    public get allotmentList(): AllotmentDO[] {
        return this._allotmentList;
    }
    public get bookingList(): BookingDO[] {
        return this._bookingList;
    }
    public get defaultTimezone(): string {
        return this._hotelDO.timezone;
    }
}