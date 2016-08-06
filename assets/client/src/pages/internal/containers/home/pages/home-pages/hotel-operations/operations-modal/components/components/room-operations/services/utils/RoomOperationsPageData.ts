import {ThUtils} from '../../../../../../../../../../../../../common/utils/ThUtils';
import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomAttachedBookingResultVM} from '../../../../../../../../../../../services/hotel-operations/room/view-models/RoomAttachedBookingResultVM';
import {BedVM} from '../../../../../../../../../../../services/beds/view-models/BedVM';
import {RoomAmenitiesDO} from '../../../../../../../../../../../services/settings/data-objects/RoomAmenitiesDO';
import {RoomAttributesDO} from '../../../../../../../../../../../services/settings/data-objects/RoomAttributesDO';
import {InvoiceGroupDO} from '../../../../../../../../../../../services/invoices/data-objects/InvoiceGroupDO';
import {InvoiceDO} from '../../../../../../../../../../../services/invoices/data-objects/InvoiceDO';

export class RoomOperationsPageData {
    private _thUtils: ThUtils;

    private _roomVM: RoomVM;
    private _bedVMList: BedVM[];
    private _attachedBookingResultVM: RoomAttachedBookingResultVM;
    private _allRoomAmenities: RoomAmenitiesDO;
    private _allRoomAttributes: RoomAttributesDO;
    private _invoiceDO: InvoiceDO;
    private _invoiceGroupDO: InvoiceGroupDO;

    constructor(roomVM: RoomVM, bedVMList: BedVM[], attachedBookingResult: RoomAttachedBookingResultVM) {
        this._thUtils = new ThUtils();
        this._roomVM = roomVM;
        this._attachedBookingResultVM = attachedBookingResult;
        this._bedVMList = bedVMList;
    }

    public get roomVM(): RoomVM {
        return this._roomVM;
    }
    public set roomVM(roomVM: RoomVM) {
        this._roomVM = roomVM;
    }

    public get bedVMList(): BedVM[] {
        return this._bedVMList;
    }
    public set bedVMList(bedVMList: BedVM[]) {
        this._bedVMList = bedVMList;
    }

    public get attachedBookingResultVM(): RoomAttachedBookingResultVM {
        return this._attachedBookingResultVM;
    }
    public set attachedBookingResultVM(attachedBookingResult: RoomAttachedBookingResultVM) {
        this._attachedBookingResultVM = attachedBookingResult;
    }

    public get allRoomAmenities(): RoomAmenitiesDO {
        return this._allRoomAmenities;
    }
    public set allRoomAmenities(allRoomAmenities: RoomAmenitiesDO) {
        this._allRoomAmenities = allRoomAmenities;
    }

    public get allRoomAttributes(): RoomAttributesDO {
        return this._allRoomAttributes;
    }
    public set allRoomAttributes(allRoomAttributes: RoomAttributesDO) {
        this._allRoomAttributes = allRoomAttributes;
    }
    public get invoiceDO(): InvoiceDO {
        return this._invoiceDO;
    }
    public set invoiceDO(invoiceDO: InvoiceDO) {
        this._invoiceDO = invoiceDO;
    }
    public get invoiceGroupDO(): InvoiceGroupDO {
        return this._invoiceGroupDO;
    }
    public set invoiceGroupDO(invoiceGroupDO: InvoiceGroupDO) {
        this._invoiceGroupDO = invoiceGroupDO;
    }

    public hasUnpaidInvoice(): boolean {
        return this._attachedBookingResultVM.roomAttachedBookingResultDO.hasCheckedInBooking()
            && !this._thUtils.isUndefinedOrNull(this._invoiceDO)
            && !this._thUtils.isUndefinedOrNull(this._invoiceGroupDO)
            && !this._invoiceDO.isPaid;
    }
}