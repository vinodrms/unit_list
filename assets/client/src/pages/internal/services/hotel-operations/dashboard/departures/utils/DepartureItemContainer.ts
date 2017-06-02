import { DepartureItemInfoVM, DepartureItemInvoiceInfoVM } from "../view-models/DepartureItemInfoVM";
import { DepartureItemInfoDO } from "../data-objects/DepartureItemInfoDO";
import { AppContext } from "../../../../../../../common/utils/AppContext";
import { ThTranslation } from "../../../../../../../common/utils/localization/ThTranslation";
import { HotelAggregatedInfo } from "../../../../hotel/utils/HotelAggregatedInfo";
import { RoomCategoryStatsDO } from "../../../../room-categories/data-objects/RoomCategoryStatsDO";
import { RoomVM } from "../../../../rooms/view-models/RoomVM";
import { RoomItemsIndexer } from "../../utils/RoomItemsIndexer";
import { DepartureItemIndexer } from "./DepartureItemIndexer";

export class DepartureItemContainer {
    private _departureItemInfoVMList: DepartureItemInfoVM[];

    private _roomItemIndexer: RoomItemsIndexer;
    private _departureItemIndexer: DepartureItemIndexer;

    constructor(private _appContext: AppContext,
        private _thTranslation: ThTranslation,
        private _departureItemList: DepartureItemInfoDO[],
        private _hotelAggregatedInfo: HotelAggregatedInfo,
        private _roomCategStatsList: RoomCategoryStatsDO[],
        roomVMList: RoomVM[]) {

        this._departureItemInfoVMList = [];

        this._roomItemIndexer = new RoomItemsIndexer([], roomVMList);
        this._departureItemIndexer = new DepartureItemIndexer(this._departureItemList);
    }

    public get departureItemInfoVMList(): DepartureItemInfoVM[] {
        let indexedDepartures = this._departureItemIndexer.getIndexedDepartures();
        let bookingIdList = Object.keys(indexedDepartures.departuresIndexedByBookings);
        _.forEach(bookingIdList, (bookingId: string) => {
            this._departureItemInfoVMList.push(
                this.getDepartureItemInfoVMFromDepartureItemDO(indexedDepartures.departuresIndexedByBookings[bookingId])
            );
        });

        let customerIdList = Object.keys(indexedDepartures.departuresIndexedByCustomers);
        _.forEach(customerIdList, (customerId: string) => {
            this._departureItemInfoVMList.push(
                this.getDepartureItemInfoVMFromDepartureItemDO(indexedDepartures.departuresIndexedByCustomers[customerId])
            );
        });

        return this._departureItemInfoVMList;
    }

    private getDepartureItemInfoVMFromDepartureItemDO(departureItemDOList: DepartureItemInfoDO[]) {
        let departureItemVM = new DepartureItemInfoVM(this._thTranslation);
        departureItemVM.departureItemDOList = departureItemDOList;
        departureItemVM.bookingDepartureItem = _.find(departureItemVM.departureItemDOList, (departureItem: DepartureItemInfoDO) => {
            return !this._appContext.thUtils.isUndefinedOrNull(departureItem.bookingId)
                && !this._appContext.thUtils.isUndefinedOrNull(departureItem.groupBookingId);
        });

        let departureItemWithInvoice = _.find(departureItemVM.departureItemDOList, (departureItem: DepartureItemInfoDO) => {
            return !this._appContext.thUtils.isUndefinedOrNull(departureItem.invoiceGroupId);
        });

        departureItemVM.totalPrice = _.chain(departureItemVM.departureItemDOList).map((departureItem: DepartureItemInfoDO) => {
            return this._appContext.thUtils.isUndefinedOrNull(departureItem.invoiceGroupId) ? 0 : departureItem.invoicePrice;
        }).reduce((sum: number, price: number) => {
            return sum + price;
        }).value();

        departureItemVM.departureItemInvoiceInfoVMList = _.chain(departureItemVM.departureItemDOList).filter((departureItem: DepartureItemInfoDO) => {
            return !this._appContext.thUtils.isUndefinedOrNull(departureItem.invoiceGroupId);
        }).map((departureItem: DepartureItemInfoDO) => {
            let invoiceInfo = new DepartureItemInvoiceInfoVM();
            invoiceInfo.customerName = departureItem.customerName;
            invoiceInfo.price = departureItem.invoicePrice;
            invoiceInfo.invoiceGroupId = departureItem.invoiceGroupId;
            invoiceInfo.invoiceId = departureItem.invoiceId;

            return invoiceInfo;
        }).value();

        departureItemVM.hasInvoice = !this._appContext.thUtils.isUndefinedOrNull(departureItemWithInvoice);
        departureItemVM.hasBooking = !this._appContext.thUtils.isUndefinedOrNull(departureItemVM.bookingDepartureItem);

        if (departureItemVM.hasBooking) {
            var attachedRoomVM = this._roomItemIndexer.getRoomVMById(departureItemVM.bookingDepartureItem.roomId);
            if (!this._appContext.thUtils.isUndefinedOrNull(attachedRoomVM)) {
                departureItemVM.attachedRoomVM = attachedRoomVM;
                departureItemVM.hasAttachedRoom = true;
                departureItemVM.roomCategory = attachedRoomVM.category;
            }
            else {
                var roomCategStats: RoomCategoryStatsDO = _.find(this._roomCategStatsList, (stat: RoomCategoryStatsDO) => {
                    return stat.roomCategory.id === departureItemVM.bookingDepartureItem.roomCategoryId;
                });
                if (!this._appContext.thUtils.isUndefinedOrNull(roomCategStats)) {
                    departureItemVM.roomCategory = roomCategStats.roomCategory;
                }
            }
        }
        departureItemVM.currency = this._hotelAggregatedInfo.ccy;

        return departureItemVM;
    }
}