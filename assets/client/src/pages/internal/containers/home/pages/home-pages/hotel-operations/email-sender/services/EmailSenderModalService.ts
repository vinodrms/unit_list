import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {CustomerDO} from '../../../../../../../services/customers/data-objects/CustomerDO';
import {EmailConfirmationParams, EmailConfirmationType} from '../../../../../../../services/hotel-operations/common/utils/EmailConfirmationParams';
import {EmailSenderModalInput} from './utils/EmailSenderModalInput';
import {EmailSenderModalComponent} from '../EmailSenderModalComponent';
import {EmailSenderModalModule} from '../EmailSenderModalModule';

@Injectable()
export class EmailSenderModalService {
    constructor(private _appContext: AppContext) { }

    public sendBookingConfirmation(customerList: CustomerDO[], groupBookingId: string, bookingId: string): Promise<ModalDialogRef<boolean>> {
        var parameters = {
            groupBookingId: groupBookingId,
            bookingId: bookingId
        }
        return this.sendConfirmation(customerList, EmailConfirmationType.Booking, parameters);
    }

    public sendInvoiceConfirmation(customerList: CustomerDO[], invoiceGroupId: string, invoiceId: string, customerId: string, payerIndex: number) {
        var parameters = {
            invoiceGroupId: invoiceGroupId,
            invoiceId: invoiceId,
            customerId: customerId,
            payerIndex: payerIndex
        };
        return this.sendConfirmation(customerList, EmailConfirmationType.Invoice, parameters);
    }

    private sendConfirmation(customerList: CustomerDO[], type: EmailConfirmationType, parameters: Object): Promise<ModalDialogRef<boolean>> {
        var emailConfirmationParams = new EmailConfirmationParams();
        emailConfirmationParams.type = type;
        emailConfirmationParams.parameters = parameters;
        var emailSenderModalInput = new EmailSenderModalInput(customerList, emailConfirmationParams);
        return this._appContext.modalService.open<any>(EmailSenderModalModule, EmailSenderModalComponent, ReflectiveInjector.resolve([
            { provide: EmailSenderModalInput, useValue: emailSenderModalInput }
        ]));
    }
}