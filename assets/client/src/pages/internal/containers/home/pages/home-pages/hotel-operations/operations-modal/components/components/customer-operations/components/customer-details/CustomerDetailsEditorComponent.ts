import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {CustomerOperationsPageData} from '../../services/utils/CustomerOperationsPageData';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {FileAttachmentDO} from '../../../../../../../../../../../services/common/data-objects/file/FileAttachmentDO';
import {HotelOperationsCustomerService} from '../../../../../../../../../../../services/hotel-operations/customer/HotelOperationsCustomerService';

@Component({
    selector: 'customer-details-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/customer-operations/components/customer-details/template/customer-details-editor.html'
})
export class CustomerDetailsEditorComponent implements OnInit {
    @Output() onCustomerDetailsChanged = new EventEmitter<CustomerDO>();
    public triggerOnCustomerDetailsChanged(updatedCustomer: CustomerDO) {
        this.onCustomerDetailsChanged.next(updatedCustomer);
    }

    private _customerOperationsPageData: CustomerOperationsPageData;
    public get customerOperationsPageData(): CustomerOperationsPageData {
        return this._customerOperationsPageData;
    }
    @Input()
    public set customerOperationsPageData(customerOperationsPageData: CustomerOperationsPageData) {
        this._customerOperationsPageData = customerOperationsPageData;
        this.loadDependentData();
    }

    private _didInit: boolean = false;
    readonly: boolean = true;
    isSaving: boolean = false;

    private _notesCopy: string;
    private _fileAttachmentListCopy: FileAttachmentDO[];

    constructor(private _appContext: AppContext,
        private _hotelOperationsCustomerService: HotelOperationsCustomerService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._customerOperationsPageData)) { return; }
        this.readonly = true;
        this.isSaving = false;
    }
    public get customerDO(): CustomerDO {
        return this._customerOperationsPageData.customerVM.customer;
    }
    public get notesAreEmpty(): boolean {
        return this._appContext.thUtils.isUndefinedOrNull(this.customerDO.notes) || this.customerDO.notes.length == 0;
    }
    public get fileAttachmentsListIsEmpty(): boolean {
        return this.customerDO.fileAttachmentList.length == 0;
    }

    public startEdit() {
        this.readonly = false;
        this._notesCopy = this.customerDO.notes;
        this._fileAttachmentListCopy = _.map(this.customerDO.fileAttachmentList, (attachment: FileAttachmentDO) => { return attachment });
    }
    public didChangeFileAttachmentList(fileAttachmentList: FileAttachmentDO[]) {
        this.customerDO.fileAttachmentList = fileAttachmentList;
    }
    public endEdit() {
        this.readonly = true;
        this.customerDO.notes = this._notesCopy;
        this.customerDO.fileAttachmentList = this._fileAttachmentListCopy;
    }
    public saveCustomerDetails() {
        this.isSaving = true;
        this._hotelOperationsCustomerService.changeDetails(this.customerDO).subscribe((updatedCustomer: CustomerDO) => {
            this._appContext.analytics.logEvent("customer", "change-details", "Changed the details for a customer");
            this.readonly = true;
            this.isSaving = false;
            this.triggerOnCustomerDetailsChanged(updatedCustomer);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }
}