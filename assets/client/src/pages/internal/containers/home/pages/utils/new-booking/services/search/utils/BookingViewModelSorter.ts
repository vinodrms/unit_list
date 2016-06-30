import {SortOptions, SortOrder} from '../../../../../../../../services/common/ILazyLoadRequestService';
import {BookingResultVM} from '../view-models/BookingResultVM';
import {ConfigCapacityDO} from '../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';

export class BookingViewModelSorter {
    constructor() {
    }

    public sortBookingSearchResultsBy(bookingSearchResultVMList: BookingResultVM[], sortOptions: SortOptions): BookingResultVM[] {
        var sortedResults = _.sortBy(bookingSearchResultVMList, (bookingSearchResultVM: BookingResultVM) => {
            if (sortOptions.objectPropertyId === 'roomCapacity') {
                var roomCapacity: ConfigCapacityDO = bookingSearchResultVM[sortOptions.objectPropertyId];
                return (roomCapacity.noAdults * 2) + roomCapacity.noChildren;
            }
            if (sortOptions.objectPropertyId === 'totalPriceString') {
                return bookingSearchResultVM.totalPrice;
            }
            return bookingSearchResultVM[sortOptions.objectPropertyId];
        });
        if (sortOptions.sortOrder === SortOrder.Descending) {
            sortedResults = sortedResults.reverse();
        }
        return sortedResults;
    }
}