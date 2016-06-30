import {SortOptions, SortOrder} from '../../../../../../../../services/common/ILazyLoadRequestService';
import {BookingItemVM} from '../view-models/BookingItemVM';
import {ConfigCapacityDO} from '../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';

export class BookingViewModelSorter {
    constructor() {
    }

    public sortBookingSearchResultsBy(bookingItemVMList: BookingItemVM[], sortOptions: SortOptions): BookingItemVM[] {
        var sortedResults = _.sortBy(bookingItemVMList, (bookingItemVM: BookingItemVM) => {
            if (sortOptions.objectPropertyId === 'roomCapacity') {
                var roomCapacity: ConfigCapacityDO = bookingItemVM[sortOptions.objectPropertyId];
                return (roomCapacity.noAdults * 2) + roomCapacity.noChildren;
            }
            if (sortOptions.objectPropertyId === 'totalPriceString') {
                return bookingItemVM.totalPrice;
            }
            return bookingItemVM[sortOptions.objectPropertyId];
        });
        if (sortOptions.sortOrder === SortOrder.Descending) {
            sortedResults = sortedResults.reverse();
        }
        return sortedResults;
    }
}