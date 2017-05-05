import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { ThError } from "../../../utils/th-responses/ThError";
import { AReportSectionGeneratorStrategy } from "../common/report-section-generator/AReportSectionGeneratorStrategy";
import { ReportSectionHeader, ReportSectionMeta } from "../common/result/ReportSection";
import { PriceProductDO } from "../../../data-layer/price-products/data-objects/PriceProductDO";
import { BookingConfirmationStatus, BookingDO } from "../../../data-layer/bookings/data-objects/BookingDO";
import { LazyLoadRepoDO } from "../../../data-layer/common/repo-data-objects/LazyLoadRepoDO";
import { BookingSearchResultRepoDO } from "../../../data-layer/bookings/repositories/IBookingRepository";
import { BookingMeta, BookingDOConstraints } from "../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";

export class BookingsByIntervalReportSectionGenerator extends AReportSectionGeneratorStrategy {
    public static MaxBookings = 2000;
    private _bookingMetaByStatus: { [id: number]: BookingMeta };

    constructor(appContext: AppContext, sessionContext: SessionContext, private _startDate: ThDateDO, private _endDate: ThDateDO) {
        super(appContext, sessionContext);

        this._bookingMetaByStatus = _.indexBy(BookingDOConstraints.BookingMetaList, meta => { return meta.status; });
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: "Bookings"
        }
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [
                "Booking No",
                "External Booking No",
                "Guest Name",
                "Status",
                "Rooms",
                "Start Date",
                "End Date",
                "Nights Billed",
                "Total Charge"
            ]
        };
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        let bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        let lazyLoad = new LazyLoadRepoDO();

        bookingsRepo.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id },
            {
                startDate: this._startDate,
                endDate: this._endDate
            }, {
                pageNumber: 0,
                pageSize: BookingsByIntervalReportSectionGenerator.MaxBookings
            }).then((bookingMetaRsp: BookingSearchResultRepoDO) => {
                let bookingList: BookingDO[] = bookingMetaRsp.bookingList;

                var data: any[] = [];
                bookingList.forEach(booking => {
                    var custString = booking.getIndexedCustomerNames().join(" / ");
                    let row = [
                        booking.displayedReservationNumber,
                        booking.externalBookingReference,
                        custString,
                        this._appContext.thTranslate.translate(this._bookingMetaByStatus[booking.confirmationStatus].name),
                        1,
                        booking.interval.start.toString(),
                        booking.interval.end.toString(),
                        booking.interval.getNumberOfDays(),
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