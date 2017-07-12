import { SortOptions, SortOrder } from '../../../../../../../../services/common/ILazyLoadRequestService';
import { BookingCartItemVM } from '../view-models/BookingCartItemVM';
import { ConfigCapacityDO } from '../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';

import * as _ from "underscore";

export class BookingViewModelSorter {
    constructor() {
    }

    public sortBookingSearchResultsBy(bookingItemVMList: BookingCartItemVM[], sortOptions: SortOptions): BookingCartItemVM[] {
        var sortedResults = _.sortBy(bookingItemVMList, (bookingItemVM: BookingCartItemVM) => {
            if (sortOptions.objectPropertyId === 'roomCapacity') {
                var roomCapacity: ConfigCapacityDO = bookingItemVM[sortOptions.objectPropertyId];
                return (roomCapacity.noAdults * 4) + (roomCapacity.noChildren * 2) + roomCapacity.noBabies;
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