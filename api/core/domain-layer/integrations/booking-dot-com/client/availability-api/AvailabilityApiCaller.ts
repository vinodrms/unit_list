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
import { BookingOccupancyCalculator } from "../../../../bookings/search-bookings/utils/occupancy-calculator/BookingOccupancyCalculator";
import { IBookingOccupancy } from "../../../../bookings/search-bookings/utils/occupancy-calculator/results/IBookingOccupancy";
import { PriceProductConstraintDO } from "../../../../../data-layer/price-products/data-objects/constraint/PriceProductConstraintDO";
import { PriceProductConstraintType } from "../../../../../data-layer/price-products/data-objects/constraint/IPriceProductConstraint";
import { MinimumLengthOfStayConstraintDO } from "../../../../../data-layer/price-products/data-objects/constraint/constraints/MinimumLengthOfStayConstraintDO";
import { ThDateIntervalUtils } from "../../../../../utils/th-dates/ThDateIntervalUtils";
import { BookingDotComHotelConfigurationDO } from "../../../../../data-layer/integrations/booking-dot-com/hotel-configuration/BookingDotComHotelConfigurationDO";

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

    public synchronizeAvailabilityAndRates(days: number): Promise<BookingDotComConfigurationDO> {
        return new Promise<BookingDotComConfigurationDO>((resolve: { (config: BookingDotComConfigurationDO): void }, reject: { (err: ThError): void }) => {
            return this.synchronizeAvailabilityAndRatesCore(days, resolve, reject);
        });
    }

    private synchronizeAvailabilityAndRatesCore(days: number, resolve: { (config: BookingDotComConfigurationDO): void }, reject: { (err: ThError): void }) {
        let bookingDotComConfiguration: BookingDotComConfigurationDO;
        let enabledPriceProductList: PriceProductDO[];
        let hotelTimestamp: ThTimestampDO;

        this.hotelRepository.getHotelById(this.sessionContext.sessionDO.hotel.id).then((hotel: HotelDO) => {
            bookingDotComConfiguration = hotel.bookingDotComConfigurationDO;
            if (!bookingDotComConfiguration.enabled) {
                resolve(bookingDotComConfiguration);
                return;
            }

            return this.getSynchronizeAvailabilityAndRatesRequestData(
                {
                    username: bookingDotComConfiguration.authentication.accountName,
                    password: bookingDotComConfiguration.authentication.accountPassword,
                    hotelId: bookingDotComConfiguration.hotelConfiguration.hotelId
                },
                this.getSyncInterval(ThTimestampDO.buildThTimestampForTimezone(hotel.timezone).thDateDO, days),
                bookingDotComConfiguration.roomCategoryConfiguration,
                bookingDotComConfiguration.priceProductConfiguration
            );
        }).then((requestData) => {
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

            return this.hotelRepository.getHotelById(this.sessionContext.sessionDO.hotel.id);
        }).then((hotel: HotelDO) => {
            let lastSyncTimestamp = new Date().getTime();
            return this.hotelRepository.updateLastSyncTimestamp({
                id: hotel.id,
                versionId: hotel.versionId
            }, lastSyncTimestamp);
        }).then((updatedHotel: HotelDO) => {
            resolve(updatedHotel.bookingDotComConfigurationDO);
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

    private getSynchronizeAvailabilityAndRatesRequestData(
        credentials: IBookingDotComCredentials,
        syncInterval: ThDateIntervalDO,
        roomCategoryConfiguration: BookingDotComRoomCategoryConfigurationsDO,
        priceProductConfiguration: BookingDotComPriceProductConfigurationsDO
    ): Promise<String> {
        return new Promise<String>((resolve: { (result: String): void }, reject: { (err: ThError): void }) => {
            return this.getSynchronizeAvailabilityAndRatesRequestDataCore(resolve, credentials, syncInterval, roomCategoryConfiguration, priceProductConfiguration);
        });
    }

    private getSynchronizeAvailabilityAndRatesRequestDataCore(resolve: { (result: String): void }, credentials: IBookingDotComCredentials,
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
                    this.getRoomAvailabilityAndRatesForDate({
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
            let jsonRequestObject = JSON.stringify(httpDataObject);
            let xmlData: String = json2xml(jsonRequestObject, { compact: true, spaces: 4 });
            resolve(xmlData);
        });
    }

    private getRoomAvailabilityAndRatesForDate(query: RoomRatesPerDateQuery) {
        return new Promise<IRoomRateDetailsPerDate[]>((resolve: { (result: IRoomRateDetailsPerDate[]): void }, reject: { (err: ThError): void }) => {
            return this.getRoomAvailabilityAndRatesForDateCore(resolve, reject, query);
        });
    }

    private getRoomAvailabilityAndRatesForDateCore(
        resolve: { (result: IRoomRateDetailsPerDate[]): void },
        reject: { (err: ThError): void },
        query: RoomRatesPerDateQuery
    ) {
        let dateUtils = new ThDateUtils();
        let bookingInterval = new ThDateIntervalDO();
        bookingInterval.start = query.date;
        bookingInterval.end = dateUtils.addDaysToThDateDO(query.date, 1);

        let indexedBookingInterval = new IndexedBookingInterval(bookingInterval);
        let roomRates: IRoomRateDetailsPerDate[] = [];

        let occupancyCalculator = new BookingOccupancyCalculator(this.appContext, this.sessionContext, query.enabledRooms);
        occupancyCalculator.compute(bookingInterval).then((occupancy: IBookingOccupancy) => {
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

                let minStayConstraint = priceProduct.constraints.constraintList.find((constraint: PriceProductConstraintDO) => {
                    return constraint.type === PriceProductConstraintType.MinimumLengthOfStay;
                });

                let minStay = 0;
                if (!this.appContext.thUtils.isUndefinedOrNull(minStayConstraint)) {
                    minStay = (<MinimumLengthOfStayConstraintDO>minStayConstraint.constraint).lengthOfStay;
                }

                let openIntervalUtils = new ThDateIntervalUtils(priceProduct.openIntervalList);
                let openForArrivalIntervalUtils = new ThDateIntervalUtils(priceProduct.openForArrivalIntervalList);
                let openForDepartureIntervalUtils = new ThDateIntervalUtils(priceProduct.openForDepartureIntervalList);

                let open = openIntervalUtils.containsThDateDO(query.date);
                let operForArrival = openForArrivalIntervalUtils.containsThDateDO(query.date);
                let openForDeparture = openForDepartureIntervalUtils.containsThDateDO(query.date);

                associatedRoomCategoryConfigurations.forEach((roomCategory: BookingDotComRoomCategoryConfigurationDO) => {
                    let roomCategoryStats = query.roomCategoryStatsList.find((stats: RoomCategoryStatsDO) => {
                        return stats.roomCategory.id === roomCategory.ourRoomCategoryId;
                    });
                    let oneAdultCapacity = new ConfigCapacityDO();
                    oneAdultCapacity.noAdults = 1;

                    let maxAdultCapacity = new ConfigCapacityDO();
                    maxAdultCapacity.noAdults = roomCategoryStats.capacity.totalCapacity.noAdults;

                    let enabledDynamicPrice = priceProduct.price.getEnabledDynamicPriceForDate(query.date);
                    let priceForOneAdult = enabledDynamicPrice.getPriceForDate(
                        {
                            bookingInterval: indexedBookingInterval,
                            configCapacity: oneAdultCapacity,
                            roomCategoryId: roomCategory.ourRoomCategoryId,
                            roomCategoryStatsList: query.roomCategoryStatsList
                        }, query.date);

                    let priceForMaxAdultsCapacity = enabledDynamicPrice.getPriceForDate(
                        {
                            bookingInterval: indexedBookingInterval,
                            configCapacity: maxAdultCapacity,
                            roomCategoryId: roomCategory.ourRoomCategoryId,
                            roomCategoryStatsList: query.roomCategoryStatsList
                        }, query.date);


                    let totalAvailableRooms = query.roomCategoryStatsList.find((roomCategoryStats: RoomCategoryStatsDO) => { return roomCategoryStats.roomCategory.id == roomCategory.ourRoomCategoryId }).noOfRooms;
                    let roomsToSell = totalAvailableRooms - occupancy.getOccupancyForRoomCategoryId(roomCategory.ourRoomCategoryId);

                    let roomRate = {
                        "_attributes": { id: roomCategory.roomId },
                        date: {
                            "_attributes": { value: query.date.toString("-", false) },
                            rate: { "_attributes": { id: rateId } },
                            price: priceForMaxAdultsCapacity,
                            // disabling this attribute, as it seems that the single rate type needs to be activated by
                            // booking.com for the property
                            // price1: priceForOneAdult,
                            roomstosell: roomsToSell
                        },
                    };

                    if (minStay !== 0) {
                        roomRate.date["minimumstay"] = minStay;
                    }
                    if (!open) {
                        roomRate.date["closed"] = 1;
                    }
                    if (!operForArrival) {
                        roomRate.date["closedonarrival"] = 1;
                    }
                    if (!openForDeparture) {
                        roomRate.date["closedondeparture"] = 1;
                    }

                    roomRates.push(roomRate);
                });
            });

            resolve(roomRates);
        });
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
