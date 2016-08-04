import {DepartureItemInfoDO} from '../data-objects/DepartureItemInfoDO';
import {RoomVM} from '../../../../rooms/view-models/RoomVM';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';
import {CurrencyDO} from '../../../../common/data-objects/currency/CurrencyDO';

export class DepartureItemInfoVM {
    private _departureItemDO: DepartureItemInfoDO;
    private _hasInvoice: boolean;
    private _hasBooking: boolean;
    private _isStayingInRoom: boolean;
    private _stayingRoomVM: RoomVM;
    private _currency: CurrencyDO;

    constructor(private _thTranslation: ThTranslation) {
    }

    public get departureItemDO(): DepartureItemInfoDO {
        return this._departureItemDO;
    }
    public set departureItemDO(departureItemDO: DepartureItemInfoDO) {
        this._departureItemDO = departureItemDO;
    }
    public get hasInvoice(): boolean {
        return this._hasInvoice;
    }
    public set hasInvoice(hasInvoice: boolean) {
        this._hasInvoice = hasInvoice;
    }
    public get hasBooking(): boolean {
        return this._hasBooking;
    }
    public set hasBooking(hasBooking: boolean) {
        this._hasBooking = hasBooking;
    }
    public get isStayingInRoom(): boolean {
        return this._isStayingInRoom;
    }
    public set isStayingInRoom(isStayingInRoom: boolean) {
        this._isStayingInRoom = isStayingInRoom;
    }
    public get stayingRoomVM(): RoomVM {
        return this._stayingRoomVM;
    }
    public set stayingRoomVM(stayingRoomVM: RoomVM) {
        this._stayingRoomVM = stayingRoomVM;
    }
    public get currency(): CurrencyDO {
        return this._currency;
    }
    public set currency(currency: CurrencyDO) {
        this._currency = currency;
    }

    public get roomName(): string {
        return this._stayingRoomVM.room.name;
    }

    public get customerName(): string {
        return this._departureItemDO.customerName;
    }

    public get roomCategoryLabel(): string {
        return this._stayingRoomVM.category.displayName;
    }

    public get numberOfPeople(): number {
        return this.departureItemDO.bookingCapacity.noAdults + this.departureItemDO.bookingCapacity.noChildren;
    }

    public get numberOfNights(): number {
        return this.departureItemDO.bookingInterval.getNumberOfDays();
    }

    public get priceString(): string {
        return this._departureItemDO.invoicePrice + this.currency.nativeSymbol;
    }
}