import {Component, OnInit} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {CustomScroll} from '../../../../../../../../common/utils/directives/CustomScroll';
import {ThDataValidators} from '../../../../../../../../common/utils/form-utils/utils/ThDataValidators';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {EmailSenderModalInput} from './services/utils/EmailSenderModalInput';
import {HotelOperationsCommonService} from '../../../../../../services/hotel-operations/common/HotelOperationsCommonService';
import {EmailRecipientBuilder} from '../../../utils/new-booking/component/subcomponents/booking-email-config/utils/EmailRecipientBuilder';
import {EmailRecipientVM} from '../../../utils/new-booking/component/subcomponents/booking-email-config/utils/EmailRecipientVM';

@Component({
    selector: 'email-sender-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/email-sender/template/email-sender-modal.html',
    directives: [CustomScroll],
    providers: [HotelOperationsCommonService],
    pipes: [TranslationPipe]
})
export class EmailSenderModalComponent extends BaseComponent implements ICustomModalComponent, OnInit {
    private emailRecipientList: EmailRecipientVM[];

    private _selectAll: boolean;
    private _recipientId: number = 0;
    newEmail: string = "";
    isSending: boolean = false;

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

    public ngOnInit() {
        var emailRecipientBuilder = new EmailRecipientBuilder(this._modalInput.customerList);
        this.emailRecipientList = emailRecipientBuilder.getEmailRecipientList([]);
        this._selectAll = false;
    }

    public get selectAll(): boolean {
        return this._selectAll;
    }
    public set selectAll(selectAll: boolean) {
        this._selectAll = selectAll;
        if (selectAll) {
            this.selectAllValidEmailRecipients();
        }
    }
    private selectAllValidEmailRecipients() {
        _.forEach(this.emailRecipientList, (emailRecipient: EmailRecipientVM) => {
            if (emailRecipient.isValid) {
                emailRecipient.selected = true;
            }
        });
    }
    public get dirtyNewEmail(): boolean {
        return this.newEmail.length > 0;
    }
    public get validNewEmail(): boolean {
        return ThDataValidators.isValidEmail(this.newEmail);
    }
    public addNewEmail() {
        if (!this.validNewEmail) { return; };
        var emailRecipientVM = new EmailRecipientVM(this._recipientId + "", "", this.newEmail);
        emailRecipientVM.selected = true;
        this.emailRecipientList.push(emailRecipientVM);
        this._recipientId++;
        this.newEmail = "";
    }

    public canSendEmails(): boolean {
        return this.getSelectedEmailList().length > 0;
    }
    private getSelectedEmailList(): string[] {
        var emailList: string[] = [];
        _.forEach(this.emailRecipientList, (emailRecipient: EmailRecipientVM) => {
            if (emailRecipient.selected && emailRecipient.isValid) {
                emailList.push(emailRecipient.email);
            }
        });
        return emailList;
    }
    public sendEmails() {
        if (!this.canSendEmails() || this.isSending) { return; }

        this.isSending = true;
        this._modalInput.emailConfirmationParams.emailList = _.uniq(this.getSelectedEmailList());
        this._hotelOperationsCommonService.sendEmail(this._modalInput.emailConfirmationParams).subscribe((result: boolean) => {
            this.isSending = false;
            this._appContext.toaster.success(this._appContext.thTranslation.translate("Email(s) sent succesfully"));
            this.closeDialog();
        }, (error: ThError) => {
            this.isSending = false;
            this._appContext.toaster.error(error.message);
        });
    }
}