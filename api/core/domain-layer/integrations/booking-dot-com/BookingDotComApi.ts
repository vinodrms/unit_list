import { ThError } from "../../../utils/th-responses/ThError";
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { HotelDO } from "../../../data-layer/hotel/data-objects/HotelDO";
import { BookingDotComConfigurationDO } from "../../../data-layer/integrations/booking-dot-com/BookingDotComConfigurationDO";

import {AxiosInstance, AxiosResponse, AxiosError} from 'axios';
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { config } from "bluebird";
import { ThDateUtils } from "../../../utils/th-dates/ThDateUtils";
import { ThTimestampDO } from "../../../utils/th-dates/data-objects/ThTimestampDO";
import {Element, json2xml, xml2json, xml2js} from 'xml-js';
import { BookingDotComPriceProductConfigurationDO } from "../../../data-layer/integrations/booking-dot-com/price-product-configuration/BookingDotComPriceProductConfigurationDO";
import { PriceProductSearchResultRepoDO } from "../../../data-layer/price-products/repositories/IPriceProductRepository";
import { PriceProductDO } from "../../../data-layer/price-products/data-objects/PriceProductDO";
import { BookingDotComRoomCategoryConfigurationDO } from "../../../data-layer/integrations/booking-dot-com/room-configuration/BookingDotComRoomCategoryConfigurationDO";
import { RoomSearchResultRepoDO } from "../../../data-layer/rooms/repositories/IRoomRepository";
import { RoomDO } from "../../../data-layer/rooms/data-objects/RoomDO";
import { RoomCategorySearchResultRepoDO } from "../../../data-layer/room-categories/repositories/IRoomCategoryRepository";
import { RoomCategoryDO } from "../../../data-layer/room-categories/data-objects/RoomCategoryDO";
import { ThDateIntervalDO } from "../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { ConfigCapacityDO } from "../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO";
import { IndexedBookingInterval } from "../../../data-layer/price-products/utils/IndexedBookingInterval";
import { RoomCategoryStatsDO } from "../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";
import { RoomCategoryStatsAggregator } from "../../room-categories/aggregators/RoomCategoryStatsAggregator";


var Axios = require('axios');
require('xml-js');

import _ = require('underscore');

interface AvailabilityRequestObject {
    username: string;
    password: string;
    hotel_id: string;
    version?: string;
    room: {"_attributes": {id: string};
        date: {"_attributes": {value: string};
            rate?: {"_attributes": {id: string}};
            roomstosell?: number;
            price?: number;
            price1?: number;
            closed?: number;
            minimumstay_arrival?: number;
            minimumstay?: number;
            maximumstay_arrival?: number;
            maximumstay?: number;
            exactstay?: number;
            exactstay_arrival?: number;
            closedonarrival?: number;
            closedondeparture?: number;
        }
    }[];
}

export class BookingDotComApi {

    private appContext: AppContext;
    private sessionContext: SessionContext;

    public constructor(appContext: AppContext, sessionContext: SessionContext) {
        this.appContext = appContext;
        this.sessionContext = sessionContext;
    }

    public synchronizeRateCategories(): Promise<void> {
        return new Promise<void>((resolve: { (): void }, reject: { (err: ThError): void }) => {        
            return this.synchronizeRateCategoriesCore(resolve, reject);
        });
    }

    private synchronizeRateCategoriesCore(resolve: { (): void }, reject: { (err: ThError): void }) {
        var bookingDotComConfiguration: BookingDotComConfigurationDO;   
        var hotelTimestamp: ThTimestampDO;
        var priceProductList: PriceProductDO[];
        this.appContext.getRepositoryFactory().getHotelRepository().getHotelById(this.sessionContext.sessionDO.hotel.id).then((hotel: HotelDO) => {
            hotelTimestamp = ThTimestampDO.buildThTimestampForTimezone(hotel.timezone);
            bookingDotComConfiguration = hotel.bookingDotComConfigurationDO;
            if (!bookingDotComConfiguration.enabled) {
                resolve();
                return;
            }
            var enabledPriceProductConfigurations = _.filter(bookingDotComConfiguration.priceProductConfiguration.priceProductConfigurations, (ppConfig: BookingDotComPriceProductConfigurationDO) => {return ppConfig.enabled});
            return this.appContext.getRepositoryFactory().getPriceProductRepository().getPriceProductList({hotelId: this.sessionContext.sessionDO.hotel.id},
                {priceProductIdList: _.map(enabledPriceProductConfigurations, (ppConfig: BookingDotComPriceProductConfigurationDO) => {return ppConfig.priceProductId})});
        }).then((searchResult: PriceProductSearchResultRepoDO) => {
            priceProductList = searchResult.priceProductList;
            var roomCategStatsAggregator = new RoomCategoryStatsAggregator(this.appContext, this.sessionContext);
            return roomCategStatsAggregator.getRoomCategoryStatsList();
        }).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
            var requestData = this.getSynchronizeRateCategoriesRequestData(bookingDotComConfiguration, hotelTimestamp, roomCategoryStatsList, priceProductList);
            var axiosInstance: AxiosInstance = Axios.create();
            return axiosInstance.post('https://supply-xml.booking.com/hotels/xml/availability',
                requestData);
        }).then((response: AxiosResponse) => {
            var xmlResponse = response.data;
            var jsonResponse = xml2js(xmlResponse);
            var errorElement =_.find(jsonResponse["elements"], (element: Object) => {return element["name"] == "error";});
            if (!this.appContext.thUtils.isUndefinedOrNull(errorElement)) {
                var thError = new ThError(ThStatusCode.ConfigureBookingDotComPriceProductsError, jsonResponse["error"]);
                reject(thError);
                return;
            }
            resolve();
        }).catch((error: AxiosError) => {
            var thError = new ThError(ThStatusCode.ConfigureBookingDotComPriceProductsError, error);
            reject(thError);
        });;
    }

    private getSynchronizeRateCategoriesRequestData(configuration: BookingDotComConfigurationDO, hotelTimestamp: ThTimestampDO, roomCategoryStatsList: RoomCategoryStatsDO[], priceProductList: PriceProductDO[]): String {
    
        var requestObject: AvailabilityRequestObject = {
            username: configuration.authentication.accountName,
            password: configuration.authentication.accountPassword,
            hotel_id: configuration.hotelConfiguration.hotelId,
            room: []
        };

        var bookingInterval = new ThDateIntervalDO();
        bookingInterval.start = hotelTimestamp.thDateDO;
        bookingInterval.end = hotelTimestamp.thDateDO;
        var indexedBookingInterval = new IndexedBookingInterval(bookingInterval);
        var configCapacity = new ConfigCapacityDO();
        configCapacity.noAdults = 1;

        _.each(priceProductList, (priceProduct: PriceProductDO) => {
            var associatedRoomCategories: BookingDotComRoomCategoryConfigurationDO[] = _.filter(configuration.roomCategoryConfiguration.roomCategoryConfigurations, (roomCategoryConfiguration: BookingDotComRoomCategoryConfigurationDO) => {
                return priceProduct.roomCategoryIdList.includes(roomCategoryConfiguration.ourRoomCategoryId);
            });
            _.each(associatedRoomCategories, (roomCategory: BookingDotComRoomCategoryConfigurationDO) => {
                requestObject.room.push({"_attributes": {id: roomCategory.roomId},
                    date: {"_attributes": {value: hotelTimestamp.thDateDO.toString("-", false)},
                        rate: {"_attributes": {id:_.find(configuration.priceProductConfiguration.priceProductConfigurations, (priceProductConfig: BookingDotComPriceProductConfigurationDO) => {return priceProductConfig.priceProductId == priceProduct.id}).rateCategoryId}},
                        price: priceProduct.price.getEnabledDynamicPriceForDate(hotelTimestamp.thDateDO).getPriceForDate({bookingInterval: indexedBookingInterval, configCapacity: configCapacity, roomCategoryId: roomCategory.ourRoomCategoryId, roomCategoryStatsList: roomCategoryStatsList}, hotelTimestamp.thDateDO),
                        roomstosell: _.find(roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {return roomCategoryStats.roomCategory.id == roomCategory.ourRoomCategoryId}).noOfRooms
                    },
                });
            });
        });

        var httpDataObject = new Object();
        httpDataObject["request"] = requestObject;
        var jsonRequestObject = JSON.stringify(httpDataObject);
        var xmlData: String = json2xml(jsonRequestObject, {compact: true, spaces: 4});
        return xmlData;
    }
}