import { AppContext } from "../../../../../utils/AppContext";
import { SessionContext } from "../../../../../utils/SessionContext";
import { ThError } from "../../../../../utils/th-responses/ThError";
import { BookingDotComConfigurationDO } from "../../../../../data-layer/integrations/booking-dot-com/BookingDotComConfigurationDO";
import { PriceProductDO } from "../../../../../data-layer/price-products/data-objects/PriceProductDO";
import { ThTimestampDO } from "../../../../../utils/th-dates/data-objects/ThTimestampDO";
import { HotelDO } from "../../../../../data-layer/hotel/data-objects/HotelDO";
import { AxiosInstance, AxiosResponse } from "axios";
import { xml2js, json2xml } from "xml-js";
import { ThStatusCode } from "../../../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../../../utils/logging/ThLogger";
import { IBookingDotComCredentials } from "../common/IBookingDotComCredentials";
import { ThDateIntervalDO } from "../../../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { BookingDotComRoomCategoryConfigurationsDO, BookingDotComRoomCategoryConfigurationDO } from "../../../../../data-layer/integrations/booking-dot-com/room-configuration/BookingDotComRoomCategoryConfigurationDO";
import { BookingDotComPriceProductConfigurationsDO, BookingDotComPriceProductConfigurationDO } from "../../../../../data-layer/integrations/booking-dot-com/price-product-configuration/BookingDotComPriceProductConfigurationDO";
import { RoomDO } from "../../../../../data-layer/rooms/data-objects/RoomDO";
import { PriceProductSearchResultRepoDO, IPriceProductRepository } from "../../../../../data-layer/price-products/repositories/IPriceProductRepository";
import { RoomSearchResultRepoDO, IRoomRepository } from "../../../../../data-layer/rooms/repositories/IRoomRepository";
import { ThDateDO } from "../../../../../utils/th-dates/data-objects/ThDateDO";
import { IAvailabilityRequest } from "./IAvailabilityRequest";
import { IRoomRateDetailsPerDate } from "./IRoomRateDetailsPerDate";
import { IndexedBookingInterval } from "../../../../../data-layer/price-products/utils/IndexedBookingInterval";
import { ConfigCapacityDO } from "../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO";
import { ThDateUtils } from "../../../../../utils/th-dates/ThDateUtils";
import { IHotelRepository } from "../../../../../data-layer/hotel/repositories/IHotelRepository";
import { IBookingRepository } from "../../../../../data-layer/bookings/repositories/IBookingRepository";
import { RoomCategoryStatsAggregator } from "../../../../room-categories/aggregators/RoomCategoryStatsAggregator";
import { RoomCategoryStatsDO } from "../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";
import { PriceProductPriceQueryDO } from "../../../../../data-layer/price-products/data-objects/price/IPriceProductPrice";

var Axios = require('axios');
require('xml-js');


interface RoomRatesPerDateQuery {
    date: ThDateDO,
    enabledPriceProductList: PriceProductDO[],
    enabledRooms: RoomDO[],
    roomCategoryConfiguration: BookingDotComRoomCategoryConfigurationsDO,
    priceProductConfiguration: BookingDotComPriceProductConfigurationsDO,
    roomCategoryStatsList: RoomCategoryStatsDO[]
}

export class AvailabilityApiCaller {
    private appContext: AppContext;
    private sessionContext: SessionContext;

    public constructor(appContext: AppContext, sessionContext: SessionContext) {
        this.appContext = appContext;
        this.sessionContext = sessionContext;
    }

    public synchronizeRateCategories(days: number): Promise<void> {
        return new Promise<void>((resolve: { (): void }, reject: { (err: ThError): void }) => {
            return this.synchronizeRateCategoriesCore(days, resolve, reject);
        });
    }

    private synchronizeRateCategoriesCore(days: number, resolve: { (): void }, reject: { (err: ThError): void }) {
        let bookingDotComConfiguration: BookingDotComConfigurationDO;
        let enabledPriceProductList: PriceProductDO[];
        let hotelTimestamp: ThTimestampDO;

        this.hotelRepository.getHotelById(this.sessionContext.sessionDO.hotel.id).then((hotel: HotelDO) => {

            bookingDotComConfiguration = hotel.bookingDotComConfigurationDO;
            if (!bookingDotComConfiguration.enabled) {
                resolve();
                return;
            }

            let requestData = this.getSynchronizeRateCategoriesRequestData(
                {
                    username: bookingDotComConfiguration.authentication.accountName,
                    password: bookingDotComConfiguration.authentication.accountPassword,
                    hotelId: bookingDotComConfiguration.hotelConfiguration.hotelId
                },
                this.getSyncInterval(ThTimestampDO.buildThTimestampForTimezone(hotel.timezone).thDateDO, days),
                bookingDotComConfiguration.roomCategoryConfiguration,
                bookingDotComConfiguration.priceProductConfiguration
            );

            let axiosInstance: AxiosInstance = Axios.create();
            return axiosInstance.post('https://supply-xml.booking.com/hotels/xml/availability',
                requestData);
        }).then((response: AxiosResponse) => {
            let xmlResponse = response.data;
            let jsonResponse = xml2js(xmlResponse);
            let errorElement = jsonResponse["elements"].find((element: Object) => { return element["name"] == "error"; });

            if (!this.appContext.thUtils.isUndefinedOrNull(errorElement)) {
                var thError = new ThError(ThStatusCode.ConfigureBookingDotComPriceProductsError, jsonResponse["error"]);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Booking.com API error.", xmlResponse, thError);
                reject(thError);
                return;
            }
            resolve();
        }).catch((error: any) => {
            if (error instanceof ThError) {
                reject(error);
                return;
            }

            let thError = new ThError(ThStatusCode.ConfigureBookingDotComPriceProductsError, error);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error synchronizing rate categories.", null, thError);
            reject(thError);
        });
    }

    private getSynchronizeRateCategoriesRequestData(
        credentials: IBookingDotComCredentials,
        syncInterval: ThDateIntervalDO,
        roomCategoryConfiguration: BookingDotComRoomCategoryConfigurationsDO,
        priceProductConfiguration: BookingDotComPriceProductConfigurationsDO
    ): Promise<String> {
        return new Promise<String>((resolve: { (result: String): void }, reject: { (err: ThError): void }) => {
            return this.getSynchronizeRateCategoriesRequestDataCore(resolve, reject, credentials, syncInterval, roomCategoryConfiguration, priceProductConfiguration);
        });
    }

    private getSynchronizeRateCategoriesRequestDataCore(resolve: { (result: String): void }, reject: { (err: ThError): void }, credentials: IBookingDotComCredentials,
        syncInterval: ThDateIntervalDO,
        roomCategoryConfiguration: BookingDotComRoomCategoryConfigurationsDO,
        priceProductConfiguration: BookingDotComPriceProductConfigurationsDO) {

        let roomCategoryStatsList: RoomCategoryStatsDO[];
        let enabledPriceProductList: PriceProductDO[];
        let enabledPriceProductConfigurationIdList =
            priceProductConfiguration.priceProductConfigurations
                .filter((ppConfig: BookingDotComPriceProductConfigurationDO) => { return ppConfig.enabled })
                .map((ppConfig: BookingDotComPriceProductConfigurationDO) => { return ppConfig.priceProductId });

        let enabledRooms: RoomDO[];
        let enabledRoomCategoriesIdList = roomCategoryConfiguration.roomCategoryConfigurations
            .map((roomCategoryConfig: BookingDotComRoomCategoryConfigurationDO) => { return roomCategoryConfig.ourRoomCategoryId });

        this.priceProductRepository.getPriceProductList(this.hotelMeta, {
            priceProductIdList: enabledPriceProductConfigurationIdList
        }).then((result: PriceProductSearchResultRepoDO) => {
            enabledPriceProductList = result.priceProductList;

            return this.roomsRepository.getRoomList(this.hotelMeta, { categoryIdList: enabledRoomCategoriesIdList });
        }).then((result: RoomSearchResultRepoDO) => {
            enabledRooms = result.roomList;

            let roomCategStatsAggregator = new RoomCategoryStatsAggregator(this.appContext, this.sessionContext);
            return roomCategStatsAggregator.getRoomCategoryStatsList();
        }).then((result: RoomCategoryStatsDO[]) => {
            roomCategoryStatsList = result;

            let roomRatesPerDateCalculators = [];
            let syncDates = syncInterval.getThDateDOList();
            syncDates.forEach((date: ThDateDO) => {
                roomRatesPerDateCalculators.push(
                    this.getRoomRatesForDate({
                        date: date,
                        enabledPriceProductList: enabledPriceProductList,
                        enabledRooms: enabledRooms,
                        roomCategoryConfiguration: roomCategoryConfiguration,
                        priceProductConfiguration: priceProductConfiguration,
                        roomCategoryStatsList: roomCategoryStatsList
                    }))
            })

            return Promise.all(roomRatesPerDateCalculators);
        }).then((result: IRoomRateDetailsPerDate[][]) => {
            let roomRateList = result.reduce((acc, value) => { return acc.concat(value) }, []);

            let requestObject: IAvailabilityRequest = {
                username: credentials.username,
                password: credentials.password,
                hotel_id: credentials.hotelId,
                room: roomRateList
            };

            let httpDataObject = new Object();
            httpDataObject["request"] = requestObject;
            var jsonRequestObject = JSON.stringify(httpDataObject);
            var xmlData: String = json2xml(jsonRequestObject, { compact: true, spaces: 4 });
            resolve(xmlData);
        });
    }

    private getRoomRatesForDate(query: RoomRatesPerDateQuery) {
        return new Promise<IRoomRateDetailsPerDate[]>((resolve: { (result: IRoomRateDetailsPerDate[]): void }, reject: { (err: ThError): void }) => {
            return this.getRoomRatesForDateCore(resolve, reject, query);
        });
    }

    private getRoomRatesForDateCore(
        resolve: { (result: IRoomRateDetailsPerDate[]): void },
        reject: { (err: ThError): void },
        query: RoomRatesPerDateQuery
    ) {

        let roomRates: IRoomRateDetailsPerDate[] = [];

        query.enabledPriceProductList.forEach((priceProduct: PriceProductDO) => {
            let ppRoomCategories = priceProduct.roomCategoryIdList;

            let associatedRoomCategoryConfigurations: BookingDotComRoomCategoryConfigurationDO[] =
                query.roomCategoryConfiguration.roomCategoryConfigurations.filter((roomCategoryConfiguration: BookingDotComRoomCategoryConfigurationDO) => {
                    return ppRoomCategories.indexOf(roomCategoryConfiguration.ourRoomCategoryId) !== -1;
                });

            let rateId =
                query.priceProductConfiguration.priceProductConfigurations.find(
                    (priceProductConfig: BookingDotComPriceProductConfigurationDO) => { return priceProductConfig.priceProductId == priceProduct.id }
                ).rateCategoryId;

            let bookingInterval = new ThDateIntervalDO();
            bookingInterval.start = query.date;
            bookingInterval.end = query.date;
            let indexedBookingInterval = new IndexedBookingInterval(bookingInterval);
            let configCapacity = new ConfigCapacityDO();
            configCapacity.noAdults = 1;

            associatedRoomCategoryConfigurations.forEach((roomCategory: BookingDotComRoomCategoryConfigurationDO) => {
                let price = priceProduct.price.getEnabledDynamicPriceForDate(query.date).getPriceForDate(
                    {
                        bookingInterval: indexedBookingInterval,
                        configCapacity: configCapacity,
                        roomCategoryId: roomCategory.ourRoomCategoryId,
                        roomCategoryStatsList: query.roomCategoryStatsList
                    }, query.date);
                let roomsToSell = query.roomCategoryStatsList.find((roomCategoryStats: RoomCategoryStatsDO) => { return roomCategoryStats.roomCategory.id == roomCategory.ourRoomCategoryId }).noOfRooms;

                roomRates.push({
                    "_attributes": { id: roomCategory.roomId },
                    date: {
                        "_attributes": { value: query.date.toString("-", false) },
                        rate: { "_attributes": { id: rateId } },
                        price: 1,
                        roomstosell: 0
                    },
                });
            });
        });

        resolve(roomRates);
    }

    private getSyncInterval(start: ThDateDO, days: number): ThDateIntervalDO {
        let end = new ThDateUtils().addDaysToThDateDO(start, days);

        let syncInterval = new ThDateIntervalDO();
        syncInterval.start = start;
        syncInterval.end = end;

        return syncInterval;
    }

    private get hotelMeta(): any {
        return {
            hotelId: this.hotelId
        }
    }

    private get hotelId(): string {
        return this.sessionContext.sessionDO.hotel.id;
    }

    private get hotelRepository(): IHotelRepository {
        return this.appContext.getRepositoryFactory().getHotelRepository();
    }

    private get bookingRepository(): IBookingRepository {
        return this.appContext.getRepositoryFactory().getBookingRepository();
    }

    private get priceProductRepository(): IPriceProductRepository {
        return this.appContext.getRepositoryFactory().getPriceProductRepository();
    }

    private get roomsRepository(): IRoomRepository {
        return this.appContext.getRepositoryFactory().getRoomRepository();
    }
}
