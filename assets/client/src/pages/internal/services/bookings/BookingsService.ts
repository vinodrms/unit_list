import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ALazyLoadRequestService} from '../common/ALazyLoadRequestService';
import {BookingDO} from './data-objects/BookingDO';
import {BookingsDO} from './data-objects/BookingsDO';
import {BookingVM} from './view-models/BookingVM';
import {EagerCustomersService} from '../customers/EagerCustomersService';
import {CustomersDO} from '../customers/data-objects/CustomersDO';
import {HotelAggregatorService} from '../hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../hotel/utils/HotelAggregatedInfo';

@Injectable()
export class BookingsService extends ALazyLoadRequestService<BookingVM> {
    constructor(appContext: AppContext,
        private _eagerCustomersService: EagerCustomersService,
        private _hotelAggregatorService: HotelAggregatorService) {
        super(appContext, ThServerApi.BookingsCount, ThServerApi.Bookings);
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<BookingVM[]> {
        var bookings = new BookingsDO();
        bookings.buildFromObject(pageDataObject);
        var customerIdList: string[] = bookings.getUniqueCustomerIdList();

        return Observable.combineLatest(
            this._eagerCustomersService.getCustomersById(customerIdList),
            this._hotelAggregatorService.getHotelAggregatedInfo()
        ).map((result: [CustomersDO, HotelAggregatedInfo]) => {
            var customers: CustomersDO = result[0];
            var hotelInfo: HotelAggregatedInfo = result[1];

            var bookingVMList: BookingVM[] = [];
            _.forEach(bookings.bookingList, (booking: BookingDO) => {
                var bookingVM = new BookingVM(this._appContext.thTranslation);
                bookingVM.booking = booking;
                bookingVM.customerList = [];
                _.forEach(booking.customerIdList, (customerId: string) => {
                    bookingVM.customerList.push(customers.getCustomerById(customerId));
                });
                bookingVM.ccy = hotelInfo.ccy;

                bookingVMList.push(bookingVM);
            });
            return bookingVMList;
        });
    }

    public searchByText(text: string) {
        this.updateSearchCriteria({
            searchTerm: text
        });
    }
}