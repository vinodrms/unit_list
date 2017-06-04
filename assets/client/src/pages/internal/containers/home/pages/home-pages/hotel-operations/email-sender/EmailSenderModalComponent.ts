import {Component} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {CustomerDO} from '../../../../../../services/customers/data-objects/CustomerDO';
import {EmailSenderModalInput} from './services/utils/EmailSenderModalInput';
import { HotelOperationsCommonService } from '../../../../../../services/hotel-operations/common/HotelOperationsCommonService';
import { EmailDistributionDO } from "../../../utils/new-booking/services/data-objects/AddBookingItemsDO";

@Component({
    selector: 'email-sender-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/email-sender/template/email-sender-modal.html',
    providers: [HotelOperationsCommonService]
})
export class EmailSenderModalComponent extends BaseComponent implements ICustomModalComponent {
    isSending: boolean = false;

    emailList: string[] = [];

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<boolean>,
        private _modalInput: EmailSenderModalInput,
        private _hotelOperationsCommonService: HotelOperationsCommonService) {
        super();
    }

    public closeDialog() {
        this._modalDialogRef.closeForced();
    }
    public isBlocking(): boolean {
        return false;
    }
    public getSize(): ModalSize {
        return ModalSize.Medium;
    }

    public get customerList(): CustomerDO[] {
        return this._modalInput.customerList;
    }

    public didSelectEmailList(emailList: string[]) {
        this.emailList = emailList;
    }

    public canSendEmails(): boolean {
        return this.emailList.length > 0;
    }
    public sendEmails() {
        if (!this.canSendEmails() || this.isSending) { return; }

        this.isSending = true;
        this._modalInput.emailConfirmationParams.emailList = _.uniq(this.getEmailRecipientList(), false, (emailDistribution: EmailDistributionDO) => {
            return emailDistribution.email;
        });
        this._hotelOperationsCommonService.sendEmail(this._modalInput.emailConfirmationParams).subscribe((result: boolean) => {
            this.isSending = false;
            this._appContext.toaster.success(this._appContext.thTranslation.translate("Email(s) sent succesfully"));
            this._modalDialogRef.addResult(true);
            this.closeDialog();
        }, (error: ThError) => {
            this.isSending = false;
            this._appContext.toaster.error(error.message);
        });
    }

    public getEmailRecipientList(): EmailDistributionDO[] {
        var emailDistributionList: EmailDistributionDO[] = [];
        emailDistributionList =_.map(this.emailList, (emailRecipient: string) => {
            var customerWithThatEmail: CustomerDO = _.find(this.customerList, (customer: CustomerDO) => {
                return customer.emailString === emailRecipient;
            });
            return {email: emailRecipient, recipientName: customerWithThatEmail ? customerWithThatEmail.customerName : ""};
        });
        return emailDistributionList;
    }
}