import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { ThError } from "../../../utils/th-responses/ThError";
import { AReportSectionGeneratorStrategy } from "../common/report-section-generator/AReportSectionGeneratorStrategy";
import { ReportSectionHeader, ReportSectionMeta } from "../common/result/ReportSection";
import { PriceProductDO } from "../../../data-layer/price-products/data-objects/PriceProductDO";
import { BookingConfirmationStatus, BookingDO } from "../../../data-layer/bookings/data-objects/BookingDO";
import { LazyLoadRepoDO } from "../../../data-layer/common/repo-data-objects/LazyLoadRepoDO";
import { BookingSearchResultRepoDO, BookingSearchCriteriaRepoDO } from "../../../data-layer/bookings/repositories/IBookingRepository";
import { BookingMeta, BookingDOConstraints } from "../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";
import { ThDateIntervalDO } from "../../../utils/th-dates/data-objects/ThDateIntervalDO";

import _ = require("underscore");

export class BookingsReportSectionGenerator extends AReportSectionGeneratorStrategy {
    public static MaxBookings = 2000;
    private _bookingMetaByStatus: { [id: number]: BookingMeta };

    constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object,
        private _priceProduct: PriceProductDO, private _confirmationStatusList: BookingConfirmationStatus[],  private _startDate: ThDateDO, private _endDate: ThDateDO, private _creationStartDate?: ThDateDO, private _creationEndDate?: ThDateDO) {
        super(appContext, sessionContext, globalSummary);
        this._bookingMetaByStatus = _.indexBy(BookingDOConstraints.BookingMetaList, meta => { return meta.status; });
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: this._priceProduct.name
        }
    }

    protected getGlobalSummary(): Object {
		return {};
	}

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [
                "Booking No",
                "External Booking No",
                "Guest Name",
                "Reference",
                "Start Date",
                "End Date",
                "Nights Billed",
                "Status",
                "Rooms",
                "Adults",
                "Children",
                "Babies",
                "Total Charge"
            ]
        };
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        let bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        let lazyLoad = new LazyLoadRepoDO();

        let interval = new ThDateIntervalDO();
        interval.start = this._startDate;
        interval.end = this._endDate;

        let bookingSearchCriteria: BookingSearchCriteriaRepoDO = {
                confirmationStatusList: this._confirmationStatusList,
                priceProductId: this._priceProduct.id,
                interval: interval
            };
        if (this._creationStartDate && this._creationEndDate) {
            bookingSearchCriteria.creationInterval = ThDateIntervalDO.buildThDateIntervalDO(
                this._creationStartDate, this._creationEndDate
            );
        }
        bookingsRepo.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id },
            bookingSearchCriteria, {
                pageNumber: 0,
                pageSize: BookingsReportSectionGenerator.MaxBookings
            }).then((bookingMetaRsp: BookingSearchResultRepoDO) => {
                let bookingList: BookingDO[] = bookingMetaRsp.bookingList;

                var data: any[] = [];
                bookingList.forEach(booking => {
                    var custString = booking.getIndexedCustomerNames().join(" / ");
                    let row = [
                        booking.displayedReservationNumber,
                        booking.externalBookingReference,
                        custString,
                        booking.displayedReservationNumber,
                        booking.interval.start.toString(),
                        booking.interval.end.toString(),
                        booking.interval.getNumberOfDays(),
                        this._appContext.thTranslate.translate(this._bookingMetaByStatus[booking.confirmationStatus].name),
                        1,
                        booking.configCapacity.noAdults,
                        booking.configCapacity.noChildren,
                        booking.configCapacity.noBabies,
                        booking.price.totalBookingPrice.toString()
                    ];
                    data.push(row);
                });
                resolve(data);
            }).catch(e => {
                reject(e);
            })
    }
}