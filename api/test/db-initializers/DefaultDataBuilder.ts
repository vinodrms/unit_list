import { RepositoryCleanerWrapper } from './RepositoryCleanerWrapper';
import { TestContext } from '../helpers/TestContext';
import { DefaultHotelBuilder } from './builders/DefaultHotelBuilder';
import { DefaultBedBuilder } from './builders/DefaultBedBuilder';
import { DefaultRoomBuilder } from './builders/DefaultRoomBuilder';
import { DefaultRoomCategoryBuilder } from './builders/DefaultRoomCategoryBuilder';
import { HotelDO } from '../../core/data-layer/hotel/data-objects/HotelDO';
import { UserDO } from '../../core/data-layer/hotel/data-objects/user/UserDO';
import { PaymentMethodDO } from '../../core/data-layer/common/data-objects/payment-method/PaymentMethodDO';
import { AddOnProductCategoryDO, AddOnProductCategoryType } from '../../core/data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import { AmenityDO } from '../../core/data-layer/common/data-objects/amenity/AmenityDO';
import { BedTemplateDO } from '../../core/data-layer/common/data-objects/bed-template/BedTemplateDO';
import { BedDO } from '../../core/data-layer/common/data-objects/bed/BedDO';
import { RoomDO } from '../../core/data-layer/rooms/data-objects/RoomDO';
import { RoomAttributeDO } from '../../core/data-layer/common/data-objects/room-attribute/RoomAttributeDO';
import { RoomCategoryDO } from '../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import { DefaultTaxBuilder } from './builders/DefaultTaxBuilder';
import { TaxResponseRepoDO } from '../../core/data-layer/taxes/repositories/ITaxRepository';
import { DefaultAddOnProductBuilder } from './builders/DefaultAddOnProductBuilder';
import { AddOnProductDO } from '../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import { DefaultCustomerBuilder } from './builders/DefaultCustomerBuilder';
import { CustomerDO } from '../../core/data-layer/customers/data-objects/CustomerDO';
import { YieldFilterDO } from '../../core/data-layer/common/data-objects/yield-filter/YieldFilterDO';
import { RoomCategoryStatsAggregator } from '../../core/domain-layer/room-categories/aggregators/RoomCategoryStatsAggregator';
import { RoomCategoryStatsDO } from '../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { DefaultPriceProductBuilder } from './builders/DefaultPriceProductBuilder';
import { PriceProductDO } from '../../core/data-layer/price-products/data-objects/PriceProductDO';
import { HotelConfigurationsBootstrap } from '../../core/domain-layer/hotel-configurations/HotelConfigurationsBootstrap';
import { YieldFilterConfigurationDO } from '../../core/data-layer/hotel-configurations/data-objects/yield-filter/YieldFilterConfigurationDO';
import { DefaultAllotmentBuilder } from './builders/DefaultAllotmentBuilder';
import { AllotmentDO } from '../../core/data-layer/allotments/data-objects/AllotmentDO';
import { DefaultBookingBuilder } from './builders/DefaultBookingBuilder';
import { BookingDO } from '../../core/data-layer/bookings/data-objects/BookingDO';
import { DefaultInvoiceGroupBuilder } from './builders/DefaultInvoiceGroupBuilder';
import { InvoiceGroupDO } from '../../core/data-layer/invoices-deprecated/data-objects/InvoiceGroupDO';
import { InvoiceDO } from '../../core/data-layer/invoices-deprecated/data-objects/InvoiceDO';

import _ = require("underscore");

export class DefaultDataBuilder {
    public static DefaultEmail = "paraschiv.ionut@gmail.com";
    private static FirstUserIndex = 0;
    private _repositoryCleaner: RepositoryCleanerWrapper;

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
    private _invoiceGroupList: InvoiceGroupDO[];

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

                var hotelBuilder = new DefaultHotelBuilder(this._testContext.appContext, DefaultDataBuilder.DefaultEmail, this._paymentMethodList);
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
                return priceProductBuilder.loadPriceProducts(priceProductBuilder, this._roomCategoryStatsList,
                    this._taxes, this._addOnProductList, this.breakfastAddOnProductCategory.id);
            }).then((priceProductList: PriceProductDO[]) => {
                this._priceProductList = priceProductList;

                var customerBuilder = new DefaultCustomerBuilder(this._testContext, this._priceProductList);
                return customerBuilder.loadCustomers(customerBuilder);
            }).then((customerList: CustomerDO[]) => {
                this._customerList = customerList;

                var allotmentBuilder = new DefaultAllotmentBuilder(this._testContext);
                return allotmentBuilder.loadAllotments(allotmentBuilder, this._priceProductList, this._customerList);
            }).then((allotmentList: AllotmentDO[]) => {
                this._allotmentList = allotmentList;

                var bookingBuilder = new DefaultBookingBuilder(this._testContext);
                return bookingBuilder.loadBookings(bookingBuilder, this._hotelDO, this._customerList, this._roomCategoryStatsList, this.priceProductList, this.addOnProductList);
            }).then((bookingList: BookingDO[]) => {
                this._bookingList = bookingList;

                var invoiceGroupBuilder = new DefaultInvoiceGroupBuilder(this._testContext);
                return invoiceGroupBuilder.loadInvoiceGroups(invoiceGroupBuilder, this._hotelDO, this._customerList, this._addOnProductList, this._bookingList);
            }).then((invoiceGroupList: InvoiceGroupDO[]) => {
                this._invoiceGroupList = invoiceGroupList;

                resolve(true);
            }).catch((err: any) => {
                reject(err);
            });
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
    public get breakfastAddOnProductCategory(): AddOnProductCategoryDO {
        return _.find(this._addOnProductCategoryList, (aopCateg: AddOnProductCategoryDO) => {
            return aopCateg.type === AddOnProductCategoryType.Breakfast;
        });
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
    public get invoiceGroupList(): InvoiceGroupDO[] {
        return this._invoiceGroupList;
    }
    public getNoUnpaidInvoices(): number {
        var noUnpaidInvoices = 0;
        _.forEach(this._invoiceGroupList, (invoiceGroup: InvoiceGroupDO) => {
            _.forEach(invoiceGroup.invoiceList, (invoice: InvoiceDO) => {
                if (!invoice.isClosed()) { noUnpaidInvoices++; };
            });
        });
        return noUnpaidInvoices;
    }
    public get defaultTimezone(): string {
        return this._hotelDO.timezone;
    }
}
