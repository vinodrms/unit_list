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

export class BookingsForPriceProductReportSectionGenerator extends AReportSectionGeneratorStrategy {
    public static MaxBookings = 2000;
    private _bookingMetaByStatus: { [id: number]: BookingMeta };

    constructor(appContext: AppContext, sessionContext: SessionContext,
        private _priceProduct: PriceProductDO, private _confirmationStatusList: BookingConfirmationStatus[]) {
        super(appContext, sessionContext);
        this._bookingMetaByStatus = _.indexBy(BookingDOConstraints.BookingMetaList, meta => { return meta.status; });
    }

    protected getMeta(): ReportSectionMeta {
        return {
            title: this._priceProduct.name
        }
    }

    protected getHeader(): ReportSectionHeader {
        return {
            display: true,
            values: [
                "Reference",
                "Start Date",
                "End Date",
                "Status",
                "Customers",
                "Total Charge"
            ]
        };
    }

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        let bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        let lazyLoad = new LazyLoadRepoDO();

        bookingsRepo.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id },
            {
                confirmationStatusList: this._confirmationStatusList,
                priceProductId: this._priceProduct.id
            }, {
                pageNumber: 0,
                pageSize: BookingsForPriceProductReportSectionGenerator.MaxBookings
            }).then((bookingMetaRsp: BookingSearchResultRepoDO) => {
                let bookingList: BookingDO[] = bookingMetaRsp.bookingList;

                var data: any[] = [];
                bookingList.forEach(booking => {
                    var custString = booking.getIndexedCustomerNames().join(" / ");
                    let row = [
                        booking.groupBookingReference + " / " + booking.bookingReference,
                        booking.interval.start.toString(),
                        booking.interval.end.toString(),
                        this._appContext.thTranslate.translate(this._bookingMetaByStatus[booking.confirmationStatus].name),
                        custString,
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