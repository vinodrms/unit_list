import { DepartureItemInfoDO, DepartureItemCustomerInfoDO } from "../data-objects/DepartureItemInfoDO";
import { ThUtils } from "../../../../../../../common/utils/ThUtils";

import * as _ from "underscore";

export interface IndexedDepartures {
    departuresIndexedByBookings?: { [bookingId: string]: DepartureItemInfoDO[] };
    departuresIndexedByCustomers?: { [customerId: string]: DepartureItemInfoDO[] };
}

export class DepartureItemIndexer {
    private _indexedDepartures: IndexedDepartures;
    private _thUtils: ThUtils;

    constructor(private _departureItemList: DepartureItemInfoDO[]) {
        this._thUtils = new ThUtils();

        this._indexedDepartures = {};
    }

    public getIndexedDepartures(): IndexedDepartures {
        this.indexDepartureItemsByBookingId();
        this.indexDepartureItemsByCustomerId();

        return this._indexedDepartures;
    }

    private indexDepartureItemsByBookingId() {
        let departureItemsByBookingId: { [bookingId: string]: DepartureItemInfoDO[] } = {};

        let departureItemsAttachedToBookings = [];

        _.forEach(this._departureItemList, (departureItemDO: DepartureItemInfoDO) => {
            if (!this._thUtils.isUndefinedOrNull(departureItemDO.bookingId)) {
                departureItemsByBookingId[departureItemDO.bookingId] = [];
                departureItemsByBookingId[departureItemDO.bookingId].push(departureItemDO);

                departureItemsAttachedToBookings.push(departureItemDO);
            }
        });

        let indexedBookingsByCustomerId = this.getIndexedBookingsByCustomerId();
        this._departureItemList = _.difference(this._departureItemList, departureItemsAttachedToBookings);

        _.forEach(this._departureItemList, (departureItemDO: DepartureItemInfoDO) => {
            if (!this._thUtils.isUndefinedOrNull(departureItemDO.isBookingBilledToCompany)
                && departureItemDO.isBookingBilledToCompany) {
                return;
            }

            let bookingId = indexedBookingsByCustomerId[departureItemDO.customerId];
            if (!this._thUtils.isUndefinedOrNull(bookingId)) {
                departureItemsByBookingId[bookingId].push(departureItemDO);
                departureItemsAttachedToBookings.push(departureItemDO);
            }
        });

        this._departureItemList = _.difference(this._departureItemList, departureItemsAttachedToBookings);

        this._indexedDepartures.departuresIndexedByBookings = departureItemsByBookingId;
    }

    private getIndexedBookingsByCustomerId(): { [customerId: string]: string } {
        let indexedBookingsByCustomerId: { [customerId: string]: string } = {};
        _.forEach(this._departureItemList, (departureItemDO: DepartureItemInfoDO) => {
            if (!this._thUtils.isUndefinedOrNull(departureItemDO.bookingId)) {
                let customerIdList = _.map(departureItemDO.guestCustomerInfoList,
                    (customerInfo: DepartureItemCustomerInfoDO) => {
                        return customerInfo.customerId;
                    });

                _.forEach(customerIdList, (customerId: string) => {
                    indexedBookingsByCustomerId[customerId] = departureItemDO.bookingId;
                });
            }
        });

        return indexedBookingsByCustomerId;
    }

    private indexDepartureItemsByCustomerId() {
        let departureItemsByCustomerId: { [customerId: string]: DepartureItemInfoDO[] } = {};

        _.forEach(this._departureItemList, (departureItemDO: DepartureItemInfoDO) => {
            if (this._thUtils.isUndefinedOrNull(departureItemsByCustomerId[departureItemDO.customerId])) {
                departureItemsByCustomerId[departureItemDO.customerId] = [];
            }
            departureItemsByCustomerId[departureItemDO.customerId].push(departureItemDO);
        });

        this._indexedDepartures.departuresIndexedByCustomers = departureItemsByCustomerId;
    }
}